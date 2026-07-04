import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductById } from "../api/apiClient";
import {
  MERCH_STATUS,
  formatPrice,
  getProductFromFallback,
  normalizeMerch,
} from "../data/merch";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState(getProductFromFallback(productId));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductById(productId);
        if (mounted && response.data) {
          setProduct(normalizeMerch(response.data));
        }
      } catch (error) {
        if (mounted) setProduct(getProductFromFallback(productId));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const images = useMemo(() => {
    if (!product) return [];
    return Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image || "/images/product1.png"];
  }, [product]);

  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedSize("");
    setQuantity(1);
  }, [product?.productId]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeoutId = window.setTimeout(() => setToast(""), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  if (loading && !product) {
    return (
      <div className="page-shell grid min-h-[60vh] place-items-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Loading merch</p>
      </div>
    );
  }

  if (!product || !Number.isFinite(product.productId)) {
    return (
      <div className="page-shell grid min-h-[60vh] place-items-center text-center">
        <div>
          <h1 className="text-3xl font-black uppercase">Merch not found</h1>
          <Link to="/products" className="mt-4 inline-block text-sm font-bold uppercase tracking-[0.18em] underline">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const isArchived = product.status === MERCH_STATUS.ARCHIVED;
  const oneSize = product.sizes.some((size) => size.toLowerCase() === "one size");
  const isLowStock = product.quantity > 0 && product.quantity <= 10;
  const isSoldOut = product.quantity <= 0;
  const stockLabel = isSoldOut ? "Sold out" : isLowStock ? `${product.quantity} left` : "In stock";

  const showToast = (message) => {
    setToast(message);
  };

  const handleAddToCart = () => {
    if (isSoldOut) {
      showToast("This item is sold out.");
      return;
    }

    const size = oneSize ? "One Size" : selectedSize;
    if (!size && product.sizes.length > 0) {
      showToast("Select a size first.");
      return;
    }

    addToCart({
      ...product,
      qty: quantity,
      size: size || "",
      image: images[selectedImageIndex] || product.image,
    });
    showToast("Added to cart.");
    openCart();
  };

  return (
    <div className="app-canvas py-8 sm:py-12">
      <div className="page-shell">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-neutral-600 transition hover:text-neutral-950"
        >
          Back
        </button>

        {isArchived ? (
          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="archive-media">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="aspect-[4/5] w-full object-contain p-8 grayscale"
              />
            </div>
            <div>
              <span className="status-pill status-pill-muted">Archive only</span>
              <h1 className="text-4xl font-black uppercase leading-none sm:text-6xl">{product.name}</h1>
              <p className="mt-4 text-lg font-semibold uppercase tracking-[0.2em] text-neutral-500">{product.year}</p>
              <div className="soft-panel mt-8 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em]">Past release record</p>
                <p className="body-copy mt-3 text-sm">
                  Archived merch is shown as photo, name, and year only. It is not available for checkout.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="product-media">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="aspect-[4/5] w-full object-contain p-8"
                />
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-20 w-20 border p-1 ${
                        selectedImageIndex === index ? "ui-chip-active" : "ui-chip"
                      }`}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:pt-10">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">{product.year} Drop</p>
              <h1 className="mt-3 text-4xl font-black uppercase leading-none sm:text-6xl">{product.name}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <p className="text-xl font-semibold">{formatPrice(product.price)}</p>
                <span className={`status-pill ${isLowStock || isSoldOut ? "status-pill-warning" : "status-pill-stock"}`}>
                  {stockLabel}
                </span>
              </div>
              {product.description && <p className="body-copy mt-5 max-w-xl">{product.description}</p>}

              {!oneSize && product.sizes.length > 0 && (
                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em]">Size</p>
                    {!selectedSize && <p className="text-xs font-semibold text-neutral-500">Select one</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 min-w-12 border px-4 text-sm font-bold uppercase transition ${
                          selectedSize === size
                            ? "ui-chip-active"
                            : "ui-chip"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em]">Quantity</p>
                <div className="ui-input flex h-12 w-36">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    disabled={quantity <= 1}
                    className="grid w-12 place-items-center text-xl"
                  >
                    -
                  </button>
                  <span className="grid flex-1 place-items-center text-sm font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.min(product.quantity, value + 1))}
                    disabled={quantity >= product.quantity}
                    className="grid w-12 place-items-center text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className="ui-button-primary mt-8 w-full px-6 py-4"
              >
                {isSoldOut ? "Unavailable" : "Add to Cart"}
              </button>

              <div className="soft-panel mt-6 grid gap-4 p-5 text-sm sm:grid-cols-3">
                <div>
                  <p className="font-black uppercase tracking-[0.14em]">Drop</p>
                  <p className="body-copy mt-1">{product.year}</p>
                </div>
                <div>
                  <p className="font-black uppercase tracking-[0.14em]">Type</p>
                  <p className="body-copy mt-1 capitalize">{product.category}</p>
                </div>
                <div>
                  <p className="font-black uppercase tracking-[0.14em]">Availability</p>
                  <p className="body-copy mt-1">{stockLabel}</p>
                </div>
              </div>
            </div>
          </section>
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
