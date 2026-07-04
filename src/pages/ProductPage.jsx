import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProducts } from "../api/apiClient";
import {
  MERCH_STATUS,
  formatPrice,
  getFallbackProducts,
  normalizeCategory,
  normalizeMerchList,
} from "../data/merch";

const categoryFilters = [
  { label: "All", value: "all", path: "/products" },
  { label: "Shirts", value: "tshirt", path: "/products/tshirt" },
  { label: "Laces", value: "lace", path: "/products/lace" },
  { label: "Essentials", value: "essential", path: "/products/essential" },
];

function ProductCard({ product, selectedSize, onSelectSize, onAddToCart }) {
  const oneSize = product.sizes.some((size) => size.toLowerCase() === "one size");
  const isLowStock = product.quantity > 0 && product.quantity <= 10;
  const isSoldOut = product.quantity <= 0;
  const stockLabel = isSoldOut ? "Sold out" : isLowStock ? `${product.quantity} left` : "In stock";

  return (
    <article className="product-card interactive-card group">
      <Link to={`/products/detail/${product.productId}`} className="block">
        <div className="product-media relative aspect-[4/5] overflow-hidden">
          <span className={`status-pill absolute left-4 top-4 z-10 ${isLowStock || isSoldOut ? "status-pill-warning" : "status-pill-stock"}`}>
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
            <h2 className="mt-2 font-semibold uppercase tracking-[0.12em] text-neutral-950">{product.name}</h2>
            <p className="mt-3 text-action inline-flex">Details</p>
          </div>
          <p className="whitespace-nowrap font-semibold">{formatPrice(product.price)}</p>
        </div>
      </Link>

      {!oneSize && product.sizes.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(product.productId, size)}
              className={`h-9 min-w-10 border px-3 text-xs font-bold uppercase tracking-[0.12em] transition ${
                selectedSize === size
                  ? "ui-chip-active"
                  : "ui-chip"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => onAddToCart(product)}
        disabled={isSoldOut}
        className="ui-button-primary mt-1 w-full px-4 py-3"
      >
        {isSoldOut ? "Unavailable" : oneSize ? "Add to Cart" : "Add Selected Size"}
      </button>
    </article>
  );
}

function ArchiveCard({ product }) {
  return (
    <Link to={`/products/detail/${product.productId}`} className="interactive-card group block">
      <div className="archive-media aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-6 grayscale transition duration-500 group-hover:grayscale-0"
        />
      </div>
      <div className="product-card-meta mt-3 flex items-start justify-between gap-4">
        <div>
          <span className="status-pill status-pill-muted">{product.year}</span>
          <h2 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em]">{product.name}</h2>
        </div>
      </div>
    </Link>
  );
}

export default function ProductPage() {
  const { addToCart, openCart } = useCart();
  const { category } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState(getFallbackProducts());
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [toast, setToast] = useState("");

  const view = new URLSearchParams(location.search).get("view");
  const archiveOnly = view === "archive";
  const normalizedCategory = normalizeCategory(category || "all");

  useEffect(() => {
    let mounted = true;
    const fetchProductsData = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        if (mounted && Array.isArray(response.data) && response.data.length > 0) {
          setProducts(normalizeMerchList(response.data));
          setUsingFallback(false);
        }
      } catch (error) {
        if (mounted) {
          setProducts(getFallbackProducts());
          setUsingFallback(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProductsData();
    return () => {
      mounted = false;
    };
  }, []);

  const availableProducts = useMemo(() => {
    const filtered = products.filter((product) => product.status === MERCH_STATUS.AVAILABLE);
    const byCategory =
      normalizedCategory === "all"
        ? filtered
        : filtered.filter((product) => normalizeCategory(product.category) === normalizedCategory);

    return [...byCategory].sort((a, b) => {
      if (sortOption === "price-low") return a.price - b.price;
      if (sortOption === "price-high") return b.price - a.price;
      return b.year - a.year || b.productId - a.productId;
    });
  }, [products, normalizedCategory, sortOption]);

  const archiveProducts = useMemo(
    () =>
      products
        .filter((product) => product.status === MERCH_STATUS.ARCHIVED)
        .sort((a, b) => b.year - a.year || b.productId - a.productId),
    [products]
  );

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timeoutId = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const showToast = (message) => {
    setToast(message);
  };

  const handleAddToCart = (product) => {
    const oneSize = product.sizes.some((size) => size.toLowerCase() === "one size");
    const selectedSize = oneSize ? "One Size" : selectedSizes[product.productId];

    if (product.quantity <= 0) {
      showToast("This item is sold out.");
      return;
    }

    if (!selectedSize && product.sizes.length > 0) {
      showToast("Select a size first.");
      return;
    }

    addToCart({ ...product, qty: 1, size: selectedSize || "" });
    showToast("Added to cart.");
    openCart();
  };

  return (
    <div className="app-canvas">
      <section className="surface-band strong-divider border-b py-12">
        <div className="page-shell">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">CPE Merch</p>
          <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-black uppercase leading-none sm:text-6xl">
                {archiveOnly ? "Archive" : "Shop"}
              </h1>
              <p className="body-copy mt-4 max-w-2xl">
                {archiveOnly
                  ? "Past releases are preserved as a lookbook with photo, name, and year only."
                  : "Available now. Archive below."}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="status-pill status-pill-stock">{availableProducts.length} current</span>
                <span className="status-pill status-pill-muted">{archiveProducts.length} archived</span>
                {!archiveOnly && normalizedCategory !== "all" && (
                  <span className="status-pill status-pill-muted">{normalizedCategory}</span>
                )}
              </div>
            </div>
            {!archiveOnly && (
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="ui-select h-11 w-full px-3 text-sm font-medium sm:w-auto"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            )}
          </div>
        </div>
      </section>

      {!archiveOnly && (
        <section className="page-shell py-12 sm:py-16">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
              {categoryFilters.map((filter) => (
                <Link
                  key={filter.value}
                  to={filter.path}
                  className={`border px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] transition ${
                    normalizedCategory === filter.value
                      ? "ui-chip-active"
                      : "ui-chip"
                  }`}
                >
                  {filter.label}
                </Link>
              ))}
            </div>
            {usingFallback && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Showing local merch preview
              </p>
            )}
          </div>

          {loading ? (
            <div className="skeleton-block min-h-[320px] animate-pulse" />
          ) : availableProducts.length === 0 ? (
            <div className="empty-state surface-panel p-8 text-neutral-600">
              <div>
                <h2 className="text-2xl font-black uppercase text-neutral-950">Nothing in this rack</h2>
                <p className="body-copy mt-3">No current merch is available for this category yet.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {availableProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  selectedSize={selectedSizes[product.productId]}
                  onSelectSize={handleSizeSelect}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section id="archive" className={`${archiveOnly ? "page-shell py-12 sm:py-16" : "surface-band strong-divider border-t py-12 sm:py-16"}`}>
        <div className={archiveOnly ? "" : "page-shell"}>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="section-kicker">Photo, Name, Year</p>
              <h2 className="section-title mt-2">Archive</h2>
            </div>
            {archiveOnly && (
              <Link to="/products" className="text-action">
                Back to shop
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {archiveProducts.map((product) => (
              <ArchiveCard key={product.productId} product={product} />
            ))}
          </div>
        </div>
      </section>

      {toast && (
        <div className="ui-toast fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-5 py-3 text-sm font-semibold">
          {toast}
        </div>
      )}
    </div>
  );
}
