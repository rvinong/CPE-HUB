import React from "react";
import { Link } from "react-router-dom";
import heroBackground from "../assets/images/hero-background.jpg";
import { MERCH_STATUS, formatPrice, getFallbackProducts } from "../data/merch";

const products = getFallbackProducts();
const availableProducts = products.filter((product) => product.status === MERCH_STATUS.AVAILABLE);
const archiveProducts = products.filter((product) => product.status === MERCH_STATUS.ARCHIVED);
const currentDropYear = Math.max(...availableProducts.map((product) => product.year));
const archiveYears = [...new Set(archiveProducts.map((product) => product.year))].sort((a, b) => b - a);

const categoryTiles = [
  { label: "Shirts", value: "tshirt", path: "/products/tshirt", image: "/images/product3.png" },
  { label: "Laces", value: "lace", path: "/products/lace", image: "/images/product6.png" },
  { label: "Essentials", value: "essential", path: "/products/essential", image: "/images/product8.png" },
];

function ProductCard({ product }) {
  const stockLabel = product.quantity <= 10 ? `${product.quantity} left` : "In stock";

  return (
    <Link to={`/products/detail/${product.productId}`} className="product-card interactive-card group block">
      <div className="product-media relative aspect-[4/5] overflow-hidden">
        <span className={`status-pill absolute left-4 top-4 z-10 ${product.quantity <= 10 ? "status-pill-warning" : "status-pill-stock"}`}>
          {stockLabel}
        </span>
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-7 transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="product-card-meta flex items-start justify-between gap-4 text-sm">
        <div className="min-w-0">
          <p className="section-kicker">{product.year} Drop</p>
          <h3 className="mt-2 font-semibold uppercase tracking-[0.12em] text-neutral-950">{product.name}</h3>
          <p className="mt-3 text-action inline-flex">View details</p>
        </div>
        <p className="whitespace-nowrap font-semibold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}

function ArchiveCard({ product }) {
  return (
    <Link to={`/products/detail/${product.productId}`} className="product-card interactive-card group block">
      <div className="archive-media aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-7 grayscale transition duration-500 group-hover:grayscale-0"
        />
      </div>
      <div className="product-card-meta">
        <span className="status-pill status-pill-muted">{product.year}</span>
        <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em]">{product.name}</h3>
        <p className="mt-3 text-action inline-flex">View record</p>
      </div>
    </Link>
  );
}

function HomePage() {
  return (
    <div className="app-canvas">
      <section className="hero-section relative min-h-[calc(100svh-132px)] overflow-hidden">
        <img src={heroBackground} alt="" aria-hidden="true" className="hero-image absolute inset-0 h-full w-full object-cover" />
        <div className="hero-scrim absolute inset-0" />
        <div className="page-shell flex min-h-[calc(100svh-132px)] items-end pb-12 pt-24">
          <div className="relative z-10 max-w-3xl">
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
                className="ui-button-secondary px-6 py-3"
              >
                Shop Current Drop
              </Link>
              <Link
                to="/products?view=archive"
                className="ui-button-primary px-6 py-3"
              >
                View Archive
              </Link>
            </div>
            <div className="metric-strip mt-10 grid max-w-2xl grid-cols-3 text-white">
              <div className="metric-tile border-r py-4 pr-4">
                <p className="text-2xl font-black">{currentDropYear}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/60">Current Drop</p>
              </div>
              <div className="metric-tile border-r px-4 py-4">
                <p className="text-2xl font-black">{availableProducts.length}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/60">Shop Items</p>
              </div>
              <div className="py-4 pl-4">
                <p className="text-2xl font-black">{archiveYears.length}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/60">Archive Years</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="dark-band border-y py-3">
        <div className="page-shell flex flex-wrap items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.24em]">
          <span>Latest yearly drop</span>
          <span>Limited availability</span>
          <span>Archive preserved by year</span>
        </div>
      </div>

      <section className="page-shell py-16 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">Available Now</p>
            <h2 className="section-title mt-2">Current Drop</h2>
          </div>
          <Link to="/products" className="text-action">
            View all merch
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {availableProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      <section className="dark-band grid grid-cols-1 border-y md:grid-cols-3">
        {categoryTiles.map((tile) => (
          <Link
            key={tile.label}
            to={tile.path}
            className="interactive-card category-tile group relative min-h-[360px] overflow-hidden md:border-r last:md:border-r-0"
          >
            <img
              src={tile.image}
              alt={tile.label}
              className="absolute inset-0 h-full w-full object-contain p-8 transition duration-500 group-hover:scale-105"
            />
            <div className="category-overlay absolute inset-0" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
                  {availableProducts.filter((product) => product.category === tile.value).length} current
                </p>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-normal">{tile.label}</h2>
              </div>
              <span className="text-action">Shop</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="page-shell py-16 sm:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">Past Releases</p>
            <h2 className="section-title mt-2">Archive</h2>
          </div>
          <Link to="/products?view=archive" className="text-action">
            Browse archive
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {archiveProducts.map((product) => (
            <ArchiveCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

      <section className="surface-band py-16">
        <div className="page-shell grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="section-kicker">Built For The Department</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight sm:text-5xl">
              One place for the newest CPE merch and the releases that came before it.
            </h2>
          </div>
          <p className="body-copy text-base">
            Each year gets its own drop. When a release ends, it moves into the archive as a visual record: photo,
            name, and year only.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
