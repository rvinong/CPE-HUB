import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-neutral-950 bg-neutral-950 text-white">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-[0.14em]">CPE HUB</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
            Yearly computer engineering merch drops, with a clean archive of past releases.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">Navigate</h3>
          <div className="mt-4 grid gap-3 text-sm font-semibold">
            <Link to="/products" className="hover:text-white/60">Shop</Link>
            <Link to="/products?view=archive" className="hover:text-white/60">Archive</Link>
            <Link to="/about" className="hover:text-white/60">About</Link>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-white/50">Orders</h3>
          <div className="mt-4 grid gap-3 text-sm font-semibold">
            <Link to="/account" className="hover:text-white/60">Account</Link>
            <Link to="/checkout" className="hover:text-white/60">Checkout</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 py-5">
        <div className="page-shell flex flex-col justify-between gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45 sm:flex-row">
          <span>Copyright {new Date().getFullYear()} CPE HUB</span>
          <span>Computer Engineering Merch</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
