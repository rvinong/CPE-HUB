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
  const { addToCart } = useCart();
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

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const handleAddToCart = () => {
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
  };

  return (
    <div className="bg-[#f7f4ef] py-8 sm:py-12">
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
            <div className="bg-neutral-200">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="aspect-[4/5] w-full object-contain p-8 grayscale"
              />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase leading-none sm:text-6xl">{product.name}</h1>
              <p className="mt-4 text-lg font-semibold uppercase tracking-[0.2em] text-neutral-500">{product.year}</p>
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
                      className={`h-20 w-20 border bg-white p-1 ${
                        selectedImageIndex === index ? "border-neutral-950" : "border-neutral-950/15"
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
              <p className="mt-5 text-xl font-semibold">{formatPrice(product.price)}</p>
              {product.description && <p className="mt-5 max-w-xl leading-7 text-neutral-600">{product.description}</p>}

              {!oneSize && product.sizes.length > 0 && (
                <div className="mt-8">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em]">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`h-11 min-w-12 border px-4 text-sm font-bold uppercase transition ${
                          selectedSize === size
                            ? "border-neutral-950 bg-neutral-950 text-white"
                            : "border-neutral-950/20 bg-white text-neutral-900 hover:border-neutral-950"
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
                <div className="flex h-12 w-36 border border-neutral-950/20 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="grid w-12 place-items-center text-xl"
                  >
                    -
                  </button>
                  <span className="grid flex-1 place-items-center text-sm font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((value) => value + 1)}
                    className="grid w-12 place-items-center text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="mt-8 w-full bg-neutral-950 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-700"
              >
                Add to Cart
              </button>
            </div>
          </section>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-neutral-950 px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}
