import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const products = [
  {
    id: 1,
    name: "ICPEP ORG SHIRT – 2022",
    price: 500,
    image: "/images/product1.png",
  },
  {
    id: 2,
    name: "ICPEP ORG SHIRT – 2023",
    price: 500,
    image: "/images/product2.png",
  },
  {
    id: 3,
    name: "ICPEP ORG SHIRT – 2024",
    price: 500,
    image: "/images/product3.png",
  },
  {
    id: 4,
    name: "RELAXED PRINTED TEE – BLACK",
    price: 250,
    image: "/images/product4.png",
  },
  {
    id: 5,
    name: "ID LACE 2023",
    price: 75,
    image: "/images/product5.png",
  },
  {
    id: 6,
    name: "ID LACE 2024",
    price: 75,
    image: "/images/product6.png",
  },
  {
    id: 7,
    name: "TOTE BAGS",
    price: 250,
    image: "/images/product7.png",
  },
  {
    id: 8,
    name: "STICKERS",
    price: 100,
    image: "/images/product8.png",
  },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResultsPage() {
  const { addToCart } = useCart();
  const [addedProductId, setAddedProductId] = useState(null);
  const query = useQuery();
  const searchTerm = query.get("q") || "";

  const filteredProducts = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(lowerSearchTerm)
    );
  }, [searchTerm]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 py-8 relative">
      <h2 className="text-2xl font-semibold mb-6">
        Search Results for "{searchTerm}"
      </h2>
      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="text-center animate-slideUp bg-white rounded-lg shadow-md p-4 relative"
            >
              <a href={`/products/detail/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-cover mb-4 rounded"
                />
                <h3 className="text-sm font-semibold text-textPrimary">
                  {product.name}
                </h3>
                <p className="text-sm text-textSecondary mb-2">₱ {product.price}</p>
              </a>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-2 bg-white text-black border border-black text-sm px-4 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors relative"
              >
                Add to Cart
              </button>
            </div>
            ))}
          </div>
          {addedProductId && (
            <div
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded px-4 py-2 shadow-lg animate-fadeInUp z-50"
              style={{ animationDuration: '0.3s' }}
            >
              Added to cart
            </div>
          )}
        </>
      )}
    </div>
  );
}
