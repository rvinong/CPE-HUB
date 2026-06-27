import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please log in to proceed with checkout.');
      setLoading(false);
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    try {
      console.log('Sending order request to backend...');
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ items: cartItems, total }),
      });

      if (response.ok) {
        setMessage('Order placed successfully! Redirecting to your account...');
        clearCart();
        setTimeout(() => {
          navigate('/account?tab=orders');
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to place order: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage(`Error placing order: ${error.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
        {/* Contact Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox" defaultChecked />
              <span className="ml-2">Email me with news and offers</span>
            </label>
          </form>
        </section>

        {/* Delivery Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Delivery</h2>
          <form className="space-y-4">
            <select className="w-full border border-gray-300 rounded px-3 py-2" defaultValue="Philippines">
              <option>Philippines</option>
              {/* Add other countries as needed */}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First name"
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Last name"
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <input
              type="text"
              placeholder="IMPORTANT: Please input FULL Address (Block and Lot#)"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Barangay / Apartment, Suite, etc."
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="City"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Province"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Zip code"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </form>
        </section>

        {/* Order Summary Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartItems.length === 0 ? (
            <p className="text-gray-700">Your cart is empty.</p>
          ) : (
            <>
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.productId + (item.size || '')} className="py-2 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                      <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                    </div>
                  </div>
                  <div className="font-semibold">₱{(item.price * item.qty).toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right font-bold text-lg">
              Total: ₱{cartItems.reduce((total, item) => total + item.price * item.qty, 0).toFixed(2)}
            </div>
            </>
          )}
          <div className="mt-6 text-center">
            <button
              onClick={handleCheckout}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
              disabled={cartItems.length === 0 || loading}
            >
              {loading ? 'Processing...' : 'Place the Order'}
            </button>
          </div>
          {message && (
            <p className="mt-4 text-center text-sm text-red-600">{message}</p>
          )}
        </section>

        {/* Back to site link */}
        <div className="mt-8 text-center">
          <a href="/" className="text-primary hover:underline">
            &larr; Back to CPE HUB
          </a>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
