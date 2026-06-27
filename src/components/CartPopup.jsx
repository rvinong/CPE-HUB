import React from "react";
import { useNavigate } from "react-router-dom";

function CartPopup({ cartItems, onClose, onRemove, onUpdateQty }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Redirect to checkout page
    navigate('/checkout');
  };

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 z-50 overflow-auto flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Your Cart</h3>
        <button className="text-red-600 text-lg font-bold" onClick={onClose}>×</button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 flex-grow flex items-center justify-center">No items in cart.</p>
      ) : (
        <>
          <div className="flex-grow overflow-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center mb-4 border-b pb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain rounded mr-4"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                  {item.size && (
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                  )}
                  <p className="text-gray-600">₱ {item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2 gap-2">
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="text-sm">{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-sm text-red-600 hover:underline ml-4"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total:</span>
              <span>₱ {total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-3 rounded hover:bg-accent transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPopup;
