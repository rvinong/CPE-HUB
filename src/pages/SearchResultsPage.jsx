import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProducts } from "../api/apiClient";
import { MERCH_STATUS, formatPrice, getFallbackProducts, normalizeMerchList } from "../data/merch";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResultsPage() {
  const { addToCart, openCart } = useCart();
  const [toast, setToast] = useState("");
  const [products, setProducts] = useState(getFallbackProducts());
  const query = useQuery();
  const searchTerm = query.get("q") || "";

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((response) => {
        if (mounted) {
          const nextProducts = Array.isArray(response.data) && response.data.length > 0
            ? normalizeMerchList(response.data)
            : getFallbackProducts();
          setProducts(nextProducts);
        }
      })
      .catch(() => {
        if (mounted) setProducts(getFallbackProducts());
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return products.filter((product) =>
      `${product.name} ${product.year} ${product.category}`.toLowerCase().includes(lowerSearchTerm)
    );
  }, [products, searchTerm]);

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
    if (!oneSize && product.sizes.length > 0) {
      showToast("Open the product to select a size.");
      return;
    }
    addToCart({ ...product, qty: 1, size: oneSize ? "One Size" : "" });
    showToast("Added to cart.");
    openCart();
  };

  return (
    <div className="app-canvas py-12">
      <div className="page-shell">
        <p className="section-kicker">Search</p>
        <h1 className="mt-2 text-4xl font-black uppercase sm:text-6xl">"{searchTerm}"</h1>
        <p className="body-copy mt-4">{filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"} found</p>

        {filteredProducts.length === 0 ? (
          <div className="empty-state surface-panel mt-10 p-8 text-neutral-600">
            <div>
              <h2 className="text-2xl font-black uppercase text-neutral-950">No merch found</h2>
              <p className="body-copy mt-3">Try a product name, year, or category.</p>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const isArchive = product.status === MERCH_STATUS.ARCHIVED;

              return (
                <article key={product.productId} className="product-card interactive-card group">
                  <Link to={`/products/detail/${product.productId}`} className="block">
                    <div className={`${isArchive ? "archive-media" : "product-media"} relative aspect-[4/5] overflow-hidden`}>
                      <span className={`status-pill absolute left-4 top-4 z-10 ${isArchive ? "status-pill-muted" : "status-pill-stock"}`}>
                        {isArchive ? "Archive" : "Current"}
                      </span>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`h-full w-full object-contain p-7 transition duration-500 group-hover:scale-105 ${
                          isArchive ? "grayscale" : ""
                        }`}
                      />
                    </div>
                    <div className="product-card-meta">
                      <h2 className="text-sm font-semibold uppercase tracking-[0.12em]">{product.name}</h2>
                      <p className="mt-1 text-sm text-neutral-500">{product.year}</p>
                      {!isArchive && <p className="mt-1 text-sm font-semibold">{formatPrice(product.price)}</p>}
                    </div>
                  </Link>
                  {!isArchive && (
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="ui-button-primary mt-4 w-full px-4 py-3"
                    >
                      Add to Cart
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {toast && (
        <div className="ui-toast fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-5 py-3 text-sm font-semibold">
          {toast}
        </div>
      )}
    </div>
  );
}
