import React from "react";
import { Link } from "react-router-dom";
import heroBackground from "../assets/images/hero-background.jpg";
import { MERCH_STATUS, formatPrice, getFallbackProducts } from "../data/merch";

const products = getFallbackProducts();
const availableProducts = products.filter((product) => product.status === MERCH_STATUS.AVAILABLE);
const archiveProducts = products.filter((product) => product.status === MERCH_STATUS.ARCHIVED);

const categoryTiles = [
  { label: "Shirts", path: "/products/tshirt", image: "/images/product3.png" },
  { label: "Laces", path: "/products/lace", image: "/images/product6.png" },
  { label: "Essentials", path: "/products/essential", image: "/images/product8.png" },
];

function ProductCard({ product }) {
  return (
    <Link to={`/products/detail/${product.productId}`} className="group block">
      <div className="product-media aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 text-sm">
        <div>
          <h3 className="font-semibold uppercase tracking-[0.12em] text-neutral-950">{product.name}</h3>
          <p className="mt-1 text-neutral-500">{product.year} Drop</p>
        </div>
        <p className="whitespace-nowrap font-semibold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}

function ArchiveCard({ product }) {
  return (
    <Link to={`/products/detail/${product.productId}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-neutral-200">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-6 grayscale transition duration-500 group-hover:grayscale-0"
        />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em]">{product.name}</h3>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{product.year}</p>
      </div>
    </Link>
  );
}

function HomePage() {
  return (
    <div className="bg-[#f7f4ef]">
      <section
        className="relative min-h-[calc(100svh-132px)] overflow-hidden bg-neutral-950 text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.72), rgba(0,0,0,0.2)), url(${heroBackground})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="page-shell flex min-h-[calc(100svh-132px)] items-end pb-12 pt-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-white/70">Computer Engineering Merch</p>
            <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
              CPE HUB
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              The yearly merch drop for CPE students, with a clean archive of past releases.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-950 transition hover:bg-neutral-200"
              >
                Shop Current Drop
              </Link>
              <Link
                to="/products?view=archive"
                className="border border-white/70 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-neutral-950"
              >
                View Archive
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-neutral-950 bg-neutral-950 py-3 text-white">
        <div className="page-shell flex flex-wrap items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.24em]">
          <span>Latest yearly drop</span>
          <span>Limited availability</span>
          <span>Archive preserved by year</span>
        </div>
      </div>

      <section className="page-shell py-16 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">Available Now</p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-5xl">Current Drop</h2>
          </div>
          <Link to="/products" className="text-xs font-bold uppercase tracking-[0.22em] underline underline-offset-4">
            View all merch
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {availableProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 border-y border-neutral-950 md:grid-cols-3">
        {categoryTiles.map((tile) => (
          <Link
            key={tile.label}
            to={tile.path}
            className="group relative min-h-[360px] overflow-hidden border-neutral-950 md:border-r last:md:border-r-0"
          >
            <img
              src={tile.image}
              alt={tile.label}
              className="absolute inset-0 h-full w-full object-contain p-8 transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/75 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <h2 className="text-3xl font-black uppercase tracking-normal">{tile.label}</h2>
              <span className="text-xs font-bold uppercase tracking-[0.22em]">Shop</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="page-shell py-16 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">Past Releases</p>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-5xl">Archive</h2>
          </div>
          <Link to="/products?view=archive" className="text-xs font-bold uppercase tracking-[0.22em] underline underline-offset-4">
            Browse archive
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {archiveProducts.map((product) => (
            <ArchiveCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="page-shell grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">Built For The Department</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight sm:text-5xl">
              One place for the newest CPE merch and the releases that came before it.
            </h2>
          </div>
          <p className="text-base leading-7 text-neutral-600">
            Each year gets its own drop. When a release ends, it moves into the archive as a visual record: photo,
            name, and year only.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
