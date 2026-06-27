import React, { useState, useRef } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartPopup from "./CartPopup";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About", path: "/about" },
];

function Header() {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQty } = useCart();
  const { isAdmin, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
    setSearchOpen(false);
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const toggleSearch = () => setSearchOpen(!searchOpen);

  return (
    <>
      <header className="p-4 sticky top-0 z-50 bg-white transition-colors duration-300 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-[minmax(100px,1fr)_auto_minmax(100px,1fr)] items-center relative px-2 sm:px-4 md:px-6">
          <nav className="hidden md:flex space-x-6 font-semibold text-gray-700 relative justify-start text-sm sm:text-base">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `transition-colors cursor-pointer focus:outline-none focus:ring-0 ${
                      isActive ? "text-primary" : "hover:text-primary text-gray-700"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </div>
            ))}
          </nav>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center justify-start">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="text-gray-700 hover:text-primary focus:outline-none focus:ring-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          {mobileMenuOpen && (
            <nav className="md:hidden bg-white shadow-md py-4 px-6 space-y-4 absolute top-full left-0 w-full z-50">
              {navItems.map((item, index) => (
                <div key={index}>
                  <Link
                    to={item.path}
                    className="block font-semibold text-gray-700 hover:text-primary transition-colors focus:outline-none focus:ring-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          )}

          <div className="relative flex justify-center items-center" style={{ width: "350px" }}>
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 minimal-font absolute left-1/2 transform -translate-x-1/2 z-10"
            >
              CPE HUB
            </Link>
            {isAdmin && isAuthenticated && (
              <div className="absolute left-[70%] top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-primary transition-colors opacity-70 hover:opacity-100 font-semibold cursor-pointer"
                  style={{ backgroundColor: "transparent" }}
                >
                  Admin Dashboard
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 justify-end relative">
            <div className="relative flex items-center">
              {!searchOpen && (
                <button
                  onClick={toggleSearch}
                  aria-label="Open search"
                  className="text-gray-700 hover:text-primary transition-colors focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                    />
                  </svg>
                </button>
              )}

              {searchOpen && (
                <>
                  <form
                    onSubmit={handleSearchSubmit}
                    className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 flex items-center bg-white p-2 rounded"
                    style={{ width: "250px" }}
                  >
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="border border-gray-300 rounded px-3 py-1 w-full bg-transparent focus:outline-none focus:ring-0"
                    />
                  </form>
                  <button
                    onClick={toggleSearch}
                    aria-label="Close search"
                    className="ml-2 text-gray-700 hover:text-primary transition-colors focus:outline-none"
                    style={{ position: "relative", left: "0", top: "0" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            <Link
              to="/account"
              className="text-gray-700 hover:text-primary transition-colors"
              aria-label="User Account"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A9 9 0 1118.88 6.196M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Link>
            <button
              onClick={toggleCart}
              className="relative text-gray-700 hover:text-primary transition-colors"
              aria-label="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 1.293a1 1 0 000 1.414L7 17m10-4v6a2 2 0 11-4 0v-6m4 0H7"
                />
              </svg>
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden bg-white shadow-md py-4 px-6 space-y-4">
            {navItems.map((item, index) => (
              <div key={index}>
                <Link
                  to={item.path}
                  className="block font-semibold text-gray-700 hover:text-primary transition-colors focus:outline-none focus:ring-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>
        )}
      </header>
      {isCartOpen && (
        <CartPopup
          cartItems={cartItems}
          onClose={toggleCart}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
        />
      )}
    </>
  );
}

export default Header;
