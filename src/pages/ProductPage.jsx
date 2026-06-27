import React, { useState, useMemo, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../api/apiClient";

export default function ProductPage() {
  const { addToCart } = useCart();
  const { category } = useParams();
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("Best Selling");
  const [addedProductId, setAddedProductId] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const dropdownRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedCategory(category || "all");
  }, [category]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isButtonHovered || isDropdownHovered) {
      setShowDropdown(true);
    } else {
      const timeoutId = setTimeout(() => setShowDropdown(false), 150);
      return () => clearTimeout(timeoutId);
    }
  }, [isButtonHovered, isDropdownHovered]);

  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductsData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "lace") {
      return products.filter((p) => p.category === "hoodie");
    } else if (selectedCategory === "tshirt") {
      return products.filter((p) => p.category === "tshirt");
    } else if (selectedCategory === "essential") {
      return products.filter((p) => p.category === "essential");
    }
    return products;
  }, [selectedCategory, products]);

  const sortedProducts = useMemo(() => {
    let sorted = [...filteredProducts];
    if (sortOption === "Price: Low to High") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "Price: High to Low") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }, [sortOption, filteredProducts]);

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.productId];
    // If product sizes include "one size", allow add to cart without size selection
    if (
      product.sizes &&
      product.sizes.some((size) => size.toLowerCase() === "one size")
    ) {
      addToCart({ ...product, size: "one size", qty: 1 });
      setAddedProductId(product.productId);
      setTimeout(() => {
        setAddedProductId(null);
      }, 2000);
      return;
    }
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      setShowSizeWarning(true);
      setTimeout(() => setShowSizeWarning(false), 2000);
      return;
    }
    addToCart({ ...product, size: selectedSize || '', qty: 1 });
    setAddedProductId(product.productId);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
  };

  const handleCategoryClick = (cat) => {
    setShowDropdown(false);
    navigate(cat === "all" ? "/products" : `/products/${cat}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading products...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-6 mt-4 relative">
        <div
          className="relative"
          ref={dropdownRef}
        >
          <button
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className="text-sm font-medium text-black cursor-pointer flex items-center space-x-1"
          >
            <span className="text-black">
              {selectedCategory === "all"
                ? "All"
                : selectedCategory === "lace"
                ? "Lace"
                : selectedCategory === "tshirt"
                ? "T-shirts"
                : selectedCategory === "essential"
                ? "Essentials"
                : "All"}
            </span>
            <span aria-hidden="true" className="text-xs text-black">▼</span>
          </button>
          {showDropdown && (
            <div
              className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-md z-50 w-48"
              onMouseEnter={() => setIsDropdownHovered(true)}
              onMouseLeave={() => setIsDropdownHovered(false)}
            >
              <button
                onClick={() => handleCategoryClick("all")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                All
              </button>
              <button
                onClick={() => handleCategoryClick("lace")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Lace
              </button>
              <button
                onClick={() => handleCategoryClick("tshirt")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                T-shirts
              </button>
              <button
                onClick={() => handleCategoryClick("essential")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Essentials
              </button>
            </div>
          )}
        </div>
        <div className="text-sm">
          <label htmlFor="sort" className="font-semibold text-textPrimary mr-2">
            Sort By:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-secondary rounded px-2 py-1 text-textPrimary"
          >
            <option>Best Selling</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-center mx-auto max-w-7xl">
        {sortedProducts.map((product) => (
          <div
            key={product.productId}
            className="text-center animate-slideUp bg-white rounded-lg shadow-md p-4 relative"
          >
            <a href={`/products/detail/${product.productId}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover mb-4 rounded"
              />
              <h3 className="text-sm font-semibold text-textPrimary">{product.name}</h3>
              <p className="text-sm text-textSecondary mb-2">₱ {product.price}</p>
            </a>
            { product.sizes && product.sizes.length > 0 && !product.name.toLowerCase().includes("lace") && product.category !== "essential" && (
              <div className="mb-2">
                <div className="flex justify-center space-x-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(product.productId, size)}
                      className={`border rounded px-3 py-1 text-xs font-semibold transition ${
                        selectedSizes[product.productId] === size
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
          className="fixed bottom-8 bg-gray-800 text-white text-sm rounded px-4 py-2 shadow-lg animate-fadeInUp z-50"
          style={{ left: 'calc(50% - 45px)' }}
        >
          Added to cart
        </div>
      )}

      {showSizeWarning && (
        <div
          className="fixed bottom-8 bg-red-600 text-white text-sm rounded px-4 py-2 shadow-lg animate-fadeInUp z-50"
          style={{ left: 'calc(50% - 60px)' }}
        >
          Please select a size.
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
