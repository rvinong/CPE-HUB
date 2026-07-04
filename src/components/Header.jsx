import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartPopup from "./CartPopup";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Shop", path: "/products" },
  { label: "Archive", path: "/products?view=archive" },
  { label: "About", path: "/about" },
];

const IconButton = ({ children, label, onClick, as: Component = "button", to }) => {
  const className = "focus-ring icon-button grid h-10 w-10 place-items-center";

  if (Component === Link) {
    return (
      <Link to={to} aria-label={label} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} onClick={onClick} className={className}>
      {children}
    </button>
  );
};

function Header() {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, updateQty } = useCart();
  const { isAdmin, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const totalQty = cartItems.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const isCurrentPath = (path) => {
    if (path.includes("view=archive")) {
      return location.pathname === "/products" && location.search.includes("view=archive");
    }
    return location.pathname === path;
  };

  return (
    <>
      <header className="site-header sticky top-0 z-50 border-b backdrop-blur">
        <div className="page-shell grid min-h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-4">
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`text-xs font-semibold uppercase tracking-[0.22em] transition hover:text-neutral-500 ${
                  isCurrentPath(item.path) ? "text-neutral-950" : "text-neutral-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && isAuthenticated && (
              <Link
                to="/admin"
                className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-600 transition hover:text-neutral-950"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center md:hidden">
            <IconButton label="Toggle menu" onClick={() => setMobileMenuOpen((open) => !open)}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </IconButton>
          </div>

          <Link to="/" className="text-center text-2xl font-black uppercase tracking-[0.18em]">
            CPE HUB
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <form
              onSubmit={handleSearchSubmit}
              className={`ui-input hidden items-center md:flex ${
                searchOpen ? "w-64" : "w-10"
              } transition-all`}
            >
              {searchOpen && (
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search merch"
                  className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                  autoFocus
                />
              )}
              <button
                type={searchOpen ? "submit" : "button"}
                onClick={() => {
                  if (!searchOpen) setSearchOpen(true);
                }}
                className="focus-ring icon-button grid h-10 w-10 place-items-center"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m21 21-4.35-4.35M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />
                </svg>
              </button>
            </form>

            <IconButton Component={Link} as={Link} to="/account" label="Account">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 21a8 8 0 1 0-16 0M15.5 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
              </svg>
            </IconButton>

            <button
              type="button"
              onClick={toggleCart}
              className="focus-ring icon-button relative grid h-10 w-10 place-items-center"
              aria-label="Cart"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6.5 8.5h11l-1 11h-9l-1-11ZM9 8.5a3 3 0 1 1 6 0" />
              </svg>
              {totalQty > 0 && (
                <span className="cart-count absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center px-1 text-[10px] font-bold">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu-panel border-t md:hidden">
            <div className="page-shell py-5">
              <form onSubmit={handleSearchSubmit} className="ui-input mb-5 flex">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search merch"
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                />
                <button type="submit" className="h-11 px-4 text-xs font-bold uppercase tracking-[0.18em]">
                  Go
                </button>
              </form>
              <nav className="grid gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-900"
                  >
                    {item.label}
                  </Link>
                ))}
                {isAdmin && isAuthenticated && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-900"
                  >
                    Admin
                  </Link>
                )}
              </nav>
            </div>
          </div>
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
