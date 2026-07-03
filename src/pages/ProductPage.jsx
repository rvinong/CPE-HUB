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

  return (
    <article className="group">
      <Link to={`/products/detail/${product.productId}`} className="block">
        <div className="product-media aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4 text-sm">
          <div>
            <h2 className="font-semibold uppercase tracking-[0.12em] text-neutral-950">{product.name}</h2>
            <p className="mt-1 text-neutral-500">{product.year} Drop</p>
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
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-950/20 bg-white text-neutral-900 hover:border-neutral-950"
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
        className="mt-4 w-full bg-neutral-950 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-700"
      >
        Add to Cart
      </button>
    </article>
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
      <div className="mt-3 flex items-start justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">{product.name}</h2>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">{product.year}</p>
      </div>
    </Link>
  );
}

export default function ProductPage() {
  const { addToCart } = useCart();
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

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const handleAddToCart = (product) => {
    const oneSize = product.sizes.some((size) => size.toLowerCase() === "one size");
    const selectedSize = oneSize ? "One Size" : selectedSizes[product.productId];

    if (!selectedSize && product.sizes.length > 0) {
      showToast("Select a size first.");
      return;
    }

    addToCart({ ...product, qty: 1, size: selectedSize || "" });
    showToast("Added to cart.");
  };

  return (
    <div className="bg-[#f7f4ef]">
      <section className="border-b border-neutral-950 bg-white py-12">
        <div className="page-shell">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">CPE Merch</p>
          <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-black uppercase leading-none sm:text-6xl">
                {archiveOnly ? "Archive" : "Shop"}
              </h1>
              <p className="mt-4 max-w-2xl text-neutral-600">
                {archiveOnly
                  ? "Past releases are preserved as a lookbook with photo, name, and year only."
                  : "Current merch is available for checkout. Past drops live below as a separate archive."}
              </p>
            </div>
            {!archiveOnly && (
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value)}
                className="h-11 border border-neutral-950/20 bg-[#f7f4ef] px-3 text-sm font-medium outline-none"
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
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((filter) => (
                <Link
                  key={filter.value}
                  to={filter.path}
                  className={`border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition ${
                    normalizedCategory === filter.value
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-950/20 bg-white text-neutral-900 hover:border-neutral-950"
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
            <div className="min-h-[320px] animate-pulse bg-white" />
          ) : availableProducts.length === 0 ? (
            <div className="border border-neutral-950/10 bg-white p-8 text-neutral-600">
              No current merch found for this category.
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

      <section id="archive" className={`${archiveOnly ? "page-shell py-12 sm:py-16" : "border-t border-neutral-950 bg-white py-12 sm:py-16"}`}>
        <div className={archiveOnly ? "" : "page-shell"}>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">Photo, Name, Year</p>
              <h2 className="mt-2 text-3xl font-black uppercase sm:text-5xl">Archive</h2>
            </div>
            {archiveOnly && (
              <Link to="/products" className="text-xs font-bold uppercase tracking-[0.22em] underline underline-offset-4">
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
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-neutral-950 px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
