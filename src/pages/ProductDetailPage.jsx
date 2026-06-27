import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { getProductById } from "../api/apiClient";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProductById(productId);
        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found.</p>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image || "/images/product1.png"];

  const handleAddToCart = () => {
    if (!product.sizes || product.sizes.length === 0) {
      addToCart({ ...product, qty: quantity, size: '', image: images[0] });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      return;
    }
    // If product sizes include "one size", allow add to cart without size selection
    if (
      product.sizes.some((size) => size.toLowerCase() === "one size")
    ) {
      addToCart({ ...product, qty: quantity, size: "one size", image: images[0] });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
      return;
    }
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }
    addToCart({ ...product, qty: quantity, size: selectedSize, image: images[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-6 bg-white rounded shadow mt-8 relative">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back
      </button>
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2">
          <div className="border rounded overflow-hidden">
            <motion.img
              key={images[selectedImageIndex]}
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-auto object-contain"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex mt-4 space-x-4">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`border rounded p-1 ${
                  selectedImageIndex === index ? "border-primary" : "border-gray-300"
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="w-16 h-16 object-contain"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-4">{product.name}</h1>
            <p className="text-2xl text-gray-800 mb-6">₱ {product.price}</p>
            <p className="mb-6 text-gray-700">{product.description}</p>
            {!product.name.toLowerCase().includes("lace") && product.category !== "essential" && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Size</h3>
                <div className="flex space-x-4">
                  {product.sizes
                    .filter((size) => !(product.category === "essential" && size.toLowerCase() === "one size"))
                    .map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`border rounded px-4 py-2 font-semibold transition ${
                          selectedSize === size
                            ? "border-primary bg-blue-900 text-white"
                            : "border-gray-400 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={decrementQty}
                className="border border-gray-400 px-4 py-2 rounded text-xl font-semibold hover:bg-gray-100 transition"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={incrementQty}
                className="border border-gray-400 px-4 py-2 rounded text-xl font-semibold hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-white text-black border border-black text-sm px-4 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors relative"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {added && (
        <div
          className="fixed bottom-8 bg-gray-800 text-white text-sm rounded px-4 py-2 shadow-lg animate-fadeInUp z-50"
          style={{ left: 'calc(50% - 45px)' }}
        >
          Added to cart
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
