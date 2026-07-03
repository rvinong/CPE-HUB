create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text not null default '',
  mobile text,
  birthday date,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.merch (
  product_id integer primary key,
  name text not null,
  category text not null default 'tshirt',
  status text not null default 'available' check (status in ('available', 'archived')),
  year integer not null,
  description text,
  price numeric(10, 2) not null default 0,
  sizes text[] not null default '{}',
  image_url text not null,
  images text[] not null default '{}',
  quantity integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  street text not null,
  city text not null,
  state text not null,
  zip text not null,
  country text not null default 'Philippines',
  phone text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  total numeric(10, 2) not null default 0,
  status text not null default 'Pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id integer references public.merch(product_id),
  name text not null,
  price numeric(10, 2) not null default 0,
  size text,
  qty integer not null check (qty > 0),
  image_url text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_merch_updated_at on public.merch;
create trigger set_merch_updated_at
before update on public.merch
for each row execute function public.set_updated_at();

drop trigger if exists set_addresses_updated_at on public.addresses;
create trigger set_addresses_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, mobile, birthday)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    nullif(new.raw_user_meta_data->>'mobile', ''),
    nullif(new.raw_user_meta_data->>'birthday', '')::date
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select profiles.is_admin from public.profiles where profiles.id = auth.uid()),
    false
  );
$$;

alter table public.profiles enable row level security;
alter table public.merch enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public profiles are readable by admins" on public.profiles;
create policy "Public profiles are readable by admins"
on public.profiles for select
using (public.is_admin() or id = auth.uid());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
with check (id = auth.uid());

drop policy if exists "Anyone can read merch" on public.merch;
create policy "Anyone can read merch"
on public.merch for select
using (true);

drop policy if exists "Admins can manage merch" on public.merch;
create policy "Admins can manage merch"
on public.merch for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can manage own addresses" on public.addresses;
create policy "Users can manage own addresses"
on public.addresses for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can read own orders and admins read all" on public.orders;
create policy "Users can read own orders and admins read all"
on public.orders for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can update own cancellable orders and admins update all" on public.orders;
create policy "Users can update own cancellable orders and admins update all"
on public.orders for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can read own order items and admins read all" on public.order_items;
create policy "Users can read own order items and admins read all"
on public.order_items for select
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and (orders.user_id = auth.uid() or public.is_admin())
  )
);

create or replace function public.place_order(order_items jsonb, order_total numeric)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_order_id uuid;
  item jsonb;
  current_merch public.merch%rowtype;
  item_product_id integer;
  item_qty integer;
begin
  if auth.uid() is null then
    raise exception 'You must be logged in to place an order.';
  end if;

  insert into public.orders (user_id, total, status)
  values (auth.uid(), order_total, 'Pending')
  returning id into new_order_id;

  for item in select * from jsonb_array_elements(order_items)
  loop
    item_product_id := (item->>'productId')::integer;
    item_qty := (item->>'qty')::integer;

    select * into current_merch
    from public.merch
    where product_id = item_product_id
    for update;

    if not found or current_merch.status <> 'available' or current_merch.quantity < item_qty then
      raise exception 'Insufficient stock for product %', item_product_id;
    end if;

    update public.merch
    set quantity = quantity - item_qty
    where product_id = item_product_id;

    insert into public.order_items (order_id, product_id, name, price, size, qty, image_url)
    values (
      new_order_id,
      item_product_id,
      item->>'name',
      (item->>'price')::numeric,
      nullif(item->>'size', ''),
      item_qty,
      item->>'image'
    );
  end loop;

  return new_order_id;
end;
$$;

grant execute on function public.place_order(jsonb, numeric) to authenticated;

insert into storage.buckets (id, name, public)
values ('merch-images', 'merch-images', true)
on conflict (id) do nothing;

drop policy if exists "Public merch images are readable" on storage.objects;
create policy "Public merch images are readable"
on storage.objects for select
using (bucket_id = 'merch-images');

drop policy if exists "Admins can upload merch images" on storage.objects;
create policy "Admins can upload merch images"
on storage.objects for insert
with check (bucket_id = 'merch-images' and public.is_admin());

drop policy if exists "Admins can update merch images" on storage.objects;
create policy "Admins can update merch images"
on storage.objects for update
using (bucket_id = 'merch-images' and public.is_admin())
with check (bucket_id = 'merch-images' and public.is_admin());

drop policy if exists "Admins can delete merch images" on storage.objects;
create policy "Admins can delete merch images"
on storage.objects for delete
using (bucket_id = 'merch-images' and public.is_admin());

insert into public.merch (product_id, name, category, status, year, description, price, sizes, image_url, quantity)
values
  (1, 'ICPEP Org Shirt 2022', 'tshirt', 'archived', 2022, 'Archived organization shirt from the 2022 release.', 0, '{}', '/images/product1.png', 0),
  (2, 'ICPEP Org Shirt 2023', 'tshirt', 'archived', 2023, 'Archived organization shirt from the 2023 release.', 0, '{}', '/images/product2.png', 0),
  (3, 'ICPEP Org Shirt 2024', 'tshirt', 'available', 2024, 'The latest official ICPEP organization shirt for the current merch drop.', 500, '{S,M,L,XL}', '/images/product3.png', 24),
  (4, 'Relaxed Printed Tee - Black', 'tshirt', 'available', 2024, 'A relaxed black tee for everyday CPE wear.', 250, '{S,M,L,XL}', '/images/product4.png', 18),
  (5, 'ID Lace 2023', 'lace', 'archived', 2023, 'Archived ID lace from the 2023 release.', 0, '{}', '/images/product5.png', 0),
  (6, 'ID Lace 2024', 'lace', 'available', 2024, 'Current drop ID lace for CPE students.', 75, '{"One Size"}', '/images/product6.png', 40),
  (7, 'CPE Tote Bag', 'essential', 'available', 2024, 'A daily tote for notes, gear, and campus essentials.', 250, '{"One Size"}', '/images/product7.png', 20),
  (8, 'Developer Sticker Pack', 'essential', 'available', 2024, 'A sticker pack for laptops, bottles, and code-covered spaces.', 100, '{"One Size"}', '/images/product8.png', 35)
on conflict (product_id) do update set
  name = excluded.name,
  category = excluded.category,
  status = excluded.status,
  year = excluded.year,
  description = excluded.description,
  price = excluded.price,
  sizes = excluded.sizes,
  image_url = excluded.image_url,
  quantity = excluded.quantity;
