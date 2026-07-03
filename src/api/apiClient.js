import { getFallbackProducts, normalizeMerch, normalizeMerchList } from "../data/merch";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const response = (data) => ({ data });

const toMerchRow = (product) => ({
  product_id: Number(product.productId),
  name: product.name,
  category: product.category,
  status: product.status,
  year: Number(product.year),
  description: product.description || "",
  price: Number(product.price || 0),
  sizes: product.sizes || [],
  image_url: product.image,
  images: product.images || [],
  quantity: Number(product.quantity || 0),
});

const fromMerchRow = (row) =>
  normalizeMerch({
    productId: row.product_id,
    name: row.name,
    category: row.category,
    status: row.status,
    year: row.year,
    description: row.description,
    price: row.price,
    sizes: row.sizes || [],
    image: row.image_url,
    images: row.images || [],
    quantity: row.quantity,
    createdAt: row.created_at,
  });

const fromProfileRow = (row) => ({
  _id: row.id,
  id: row.id,
  name: row.name,
  email: row.email,
  mobile: row.mobile,
  birthday: row.birthday,
  isAdmin: row.is_admin,
});

const fromOrderRow = (row) => ({
  _id: row.id,
  id: row.id,
  userId: row.profiles ? fromProfileRow(row.profiles) : row.user_id,
  total: Number(row.total || 0),
  status: row.status,
  createdAt: row.created_at,
  items: (row.order_items || []).map((item) => ({
    productId: item.product_id,
    name: item.name,
    price: Number(item.price || 0),
    size: item.size || "",
    qty: Number(item.qty || 0),
    image: item.image_url,
  })),
});

const requireSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured. Add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.");
  }
  return supabase;
};

export const getProducts = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return response(getFallbackProducts());
  }

  const { data, error } = await supabase
    .from("merch")
    .select("*")
    .order("year", { ascending: false })
    .order("product_id", { ascending: false });

  if (error) throw error;
  return response(normalizeMerchList((data || []).map(fromMerchRow)));
};

export const getProductById = async (productId) => {
  if (!isSupabaseConfigured || !supabase) {
    const product = getFallbackProducts().find((item) => item.productId === Number(productId));
    if (!product) throw new Error("Product not found");
    return response(product);
  }

  const { data, error } = await supabase
    .from("merch")
    .select("*")
    .eq("product_id", Number(productId))
    .single();

  if (error) throw error;
  return response(fromMerchRow(data));
};

export const createProduct = async (productData) => {
  const client = requireSupabase();
  const payload = toMerchRow(normalizeMerch(productData));
  const { data, error } = await client.from("merch").insert(payload).select("*").single();
  if (error) throw error;
  return response(fromMerchRow(data));
};

export const updateProductStock = async (productId, stockData) => {
  const client = requireSupabase();
  const payload = toMerchRow(normalizeMerch({ ...stockData, productId }));
  delete payload.product_id;
  const { data, error } = await client
    .from("merch")
    .update(payload)
    .eq("product_id", Number(productId))
    .select("*")
    .single();
  if (error) throw error;
  return response(fromMerchRow(data));
};

export const deleteProduct = async (productId) => {
  const client = requireSupabase();
  const { error } = await client.from("merch").delete().eq("product_id", Number(productId));
  if (error) throw error;
  return response({ message: "Product deleted" });
};

export const getUsers = async () => {
  const client = requireSupabase();
  const { data, error } = await client.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return response((data || []).map(fromProfileRow));
};

export const getOrders = async () => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("orders")
    .select("*, profiles(*), order_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return response((data || []).map(fromOrderRow));
};

export const createOrder = async ({ items, total }) => {
  const client = requireSupabase();
  const orderItems = items.map((item) => ({
    productId: Number(item.productId),
    name: item.name,
    price: Number(item.price || 0),
    size: item.size || "",
    qty: Number(item.qty || 0),
    image: item.image,
  }));

  const { data, error } = await client.rpc("place_order", {
    order_items: orderItems,
    order_total: Number(total || 0),
  });

  if (error) throw error;
  return response({ id: data });
};

export const updateOrderStatus = async (orderId, statusData) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("orders")
    .update({ status: statusData.status })
    .eq("id", orderId)
    .select("*, profiles(*), order_items(*)")
    .single();
  if (error) throw error;
  return response(fromOrderRow(data));
};

export const getAddresses = async () => {
  const client = requireSupabase();
  const { data, error } = await client.from("addresses").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return response(data || []);
};

export const createAddress = async (address) => {
  const client = requireSupabase();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await client
    .from("addresses")
    .insert({ ...address, user_id: userData.user.id })
    .select("*");
  if (error) throw error;
  return response(data || []);
};

export const updateAddress = async (id, address) => {
  const client = requireSupabase();
  const { data, error } = await client.from("addresses").update(address).eq("id", id).select("*").single();
  if (error) throw error;
  return response(data);
};

export const deleteAddress = async (id) => {
  const client = requireSupabase();
  const { error } = await client.from("addresses").delete().eq("id", id);
  if (error) throw error;
  return response({ message: "Address deleted" });
};

export const uploadMerchImage = async (file, pathPrefix = "merch") => {
  const client = requireSupabase();
  const fileExt = file.name.split(".").pop();
  const filePath = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const { error } = await client.storage.from("merch-images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = client.storage.from("merch-images").getPublicUrl(filePath);
  return response({ path: filePath, publicUrl: data.publicUrl });
};

const apiClient = {
  getProducts,
  getProductById,
  createProduct,
  updateProductStock,
  deleteProduct,
  getOrders,
  createOrder,
  updateOrderStatus,
  getUsers,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  uploadMerchImage,
};

export default apiClient;
