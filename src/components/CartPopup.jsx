import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../data/merch";

function CartPopup({ cartItems, onClose, onRemove, onUpdateQty }) {
  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/35"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f7f4ef] shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-950 px-6 py-5">
          <h2 className="text-2xl font-black uppercase tracking-normal">Cart</h2>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center text-2xl leading-none transition hover:bg-neutral-950 hover:text-white"
            onClick={onClose}
            aria-label="Close cart"
          >
            x
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">No items yet</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 bg-neutral-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto px-6 py-5">
              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-[88px_1fr_auto] gap-4 border-b border-neutral-950/10 py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 bg-white object-contain p-2"
                  />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.12em]">{item.name}</h3>
                    {item.size && <p className="mt-1 text-sm text-neutral-500">Size: {item.size}</p>}
                    <p className="mt-1 text-sm font-semibold">{formatPrice(item.price)}</p>
                    <div className="mt-3 flex h-9 w-28 border border-neutral-950/20 bg-white">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, Number(item.qty || 1) - 1)}
                        disabled={Number(item.qty || 1) <= 1}
                        className="grid w-9 place-items-center disabled:opacity-30"
                      >
                        -
                      </button>
                      <span className="grid flex-1 place-items-center text-xs font-bold">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, Number(item.qty || 1) + 1)}
                        className="grid w-9 place-items-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="self-start text-xs font-bold uppercase tracking-[0.16em] text-neutral-500 hover:text-neutral-950"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-950 bg-white px-6 py-5">
              <div className="mb-5 flex items-center justify-between text-lg font-black uppercase">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full bg-neutral-950 px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-700"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CartPopup;
