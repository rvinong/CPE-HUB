import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../data/merch";

function CartPopup({ cartItems, onClose, onRemove, onUpdateQty }) {
  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
  const totalQty = cartItems.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const navigate = useNavigate();

  const handleBrowse = () => {
    onClose();
    navigate("/products");
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="drawer-scrim absolute inset-0"
      />
      <aside className="drawer-panel absolute right-0 top-0 flex h-full w-full max-w-md flex-col">
        <div className="strong-divider flex items-center justify-between border-b px-6 py-5">
          <div>
            <p className="section-kicker">Order Preview</p>
            <h2 className="mt-1 text-2xl font-black uppercase tracking-normal">Cart</h2>
          </div>
          <button
            type="button"
            className="icon-button grid h-10 w-10 place-items-center text-2xl leading-none"
            onClick={onClose}
            aria-label="Close cart"
          >
            x
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <p className="section-kicker">No items yet</p>
              <h3 className="mt-3 text-3xl font-black uppercase">Build your drop</h3>
              <p className="body-copy mt-3 max-w-xs">
                Add current merch to checkout. Archive pieces stay view-only.
              </p>
              <button
                type="button"
                onClick={handleBrowse}
                className="ui-button-primary mt-5 px-5 py-3"
              >
                Browse Merch
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto px-6 py-5">
              {cartItems.map((item) => (
                <div key={item.id} className="token-divider grid grid-cols-[88px_1fr_auto] gap-4 border-b py-4">
                  <img src={item.image} alt={item.name} className="surface-panel-plain h-20 w-20 object-contain p-2" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.12em]">{item.name}</h3>
                    {item.size && <p className="mt-1 text-sm text-neutral-500">Size: {item.size}</p>}
                    <p className="mt-1 text-sm font-semibold">{formatPrice(item.price)}</p>
                    <div className="ui-input mt-3 flex h-9 w-28">
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

            <div className="summary-panel border-t px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm font-bold uppercase tracking-[0.16em] text-neutral-500">
                <span>{totalQty} item{totalQty === 1 ? "" : "s"}</span>
                <span>Subtotal</span>
              </div>
              <div className="mb-5 flex items-center justify-between text-lg font-black uppercase">
                <span>Total due</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="ui-button-primary w-full px-5 py-4"
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
