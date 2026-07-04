import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/apiClient";
import { MERCH_STATUS, formatPrice, normalizeMerch } from "../data/merch";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { isAuthenticated, isSupabaseConfigured } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const checkoutItems = useMemo(
    () =>
      cartItems
        .map((item) => normalizeMerch(item))
        .filter((item) => item.status !== MERCH_STATUS.ARCHIVED),
    [cartItems]
  );

  const total = checkoutItems.reduce((sum, item) => sum + item.price * Number(item.qty || 0), 0);

  const handleCheckout = async () => {
    if (checkoutItems.length === 0) return;
    setLoading(true);
    setMessage("");

    if (!isAuthenticated) {
      setMessage(isSupabaseConfigured ? "Please log in to proceed with checkout." : "Add Supabase env keys before checkout.");
      setLoading(false);
      return;
    }

    try {
      await createOrder({ items: checkoutItems, total });
      setMessage("Order placed successfully. Redirecting to your account.");
      clearCart();
      setTimeout(() => {
        navigate("/account?tab=orders");
      }, 1600);
    } catch (error) {
      setMessage(`Error placing order: ${error.message || "Please try again later."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-canvas min-h-screen">
      <header className="surface-band strong-divider border-b">
        <div className="page-shell flex min-h-[72px] items-center justify-between">
          <Link to="/" className="text-xl font-black uppercase tracking-[0.18em]">
            CPE HUB
          </Link>
          <Link to="/products" className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-600">
            Continue Shopping
          </Link>
        </div>
      </header>

      <main className="page-shell grid gap-8 py-10 lg:grid-cols-[1fr_420px]">
        <section className="surface-panel p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-neutral-500">Checkout</p>
          <h1 className="mt-2 text-4xl font-black uppercase">Order Details</h1>

          <div className="mt-8 grid gap-8">
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.18em]">Contact</h2>
              <div className="mt-4 grid gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="ui-input h-12 px-3"
                  required
                />
                <label className="flex items-center gap-3 text-sm text-neutral-600">
                  <input type="checkbox" className="h-4 w-4" defaultChecked />
                  Email me with updates about this merch release
                </label>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.18em]">Delivery</h2>
              <div className="mt-4 grid gap-4">
                <select className="ui-select h-12 px-3" defaultValue="Philippines">
                  <option>Philippines</option>
                </select>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input type="text" placeholder="First name" className="ui-input h-12 px-3" required />
                  <input type="text" placeholder="Last name" className="ui-input h-12 px-3" required />
                </div>
                <input type="text" placeholder="Full address" className="ui-input h-12 px-3" required />
                <input type="text" placeholder="Barangay / apartment / suite" className="ui-input h-12 px-3" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <input type="text" placeholder="City" className="ui-input h-12 px-3" required />
                  <input type="text" placeholder="Province" className="ui-input h-12 px-3" required />
                  <input type="text" placeholder="Zip code" className="ui-input h-12 px-3" required />
                </div>
                <input type="tel" placeholder="Phone" className="ui-input h-12 px-3" required />
              </div>
            </section>
          </div>
        </section>

        <aside className="dark-panel h-fit p-6 lg:sticky lg:top-8">
          <h2 className="text-sm font-black uppercase tracking-[0.18em]">Order Summary</h2>
          {checkoutItems.length === 0 ? (
            <p className="mt-8 text-sm text-white/65">Your cart is empty.</p>
          ) : (
            <div className="mt-6 divide-y divide-white/15">
              {checkoutItems.map((item) => (
                <div key={item.id || `${item.productId}-${item.size || ""}`} className="flex gap-4 py-4">
                  <img src={item.image} alt={item.name} className="surface-panel-plain h-16 w-16 object-contain p-1" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold uppercase tracking-[0.12em]">{item.name}</p>
                    <p className="mt-1 text-xs text-white/60">
                      {item.size ? `Size: ${item.size} / ` : ""}Qty: {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
          )}

          <div className="dark-divider mt-6 border-t pt-5">
            <div className="flex justify-between text-lg font-black uppercase">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutItems.length === 0 || loading}
              className="ui-button-secondary mt-6 w-full px-5 py-4 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Processing" : "Place Order"}
            </button>
            {message && <p className="mt-4 text-sm text-white/75">{message}</p>}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default CheckoutPage;
