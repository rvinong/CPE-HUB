import React, { useEffect, useState } from 'react';
import apiClient, { setAuthToken, getOrders, updateOrderStatus } from '../api/apiClient';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      setAuthToken(token);
      const response = await getOrders();
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const confirmCancelOrder = (orderId) => {
    setOrderToCancel(orderId);
    setShowConfirm(true);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    setCancellingOrderId(orderToCancel);
    setShowConfirm(false);
    try {
      const token = localStorage.getItem('token');
      setAuthToken(token);
      await updateOrderStatus(orderToCancel, { status: 'Cancelled' });
      // Refresh orders after cancellation
      await fetchOrders();
    } catch (err) {
      alert('Failed to cancel order.');
    } finally {
      setCancellingOrderId(null);
      setOrderToCancel(null);
    }
  };

  const cancelCancelOrder = () => {
    setShowConfirm(false);
    setOrderToCancel(null);
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (orders.length === 0) return <div>No orders found.</div>;

  return (
    <div>
      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded shadow">
          <h3 className="font-semibold mb-2">Order ID: {order._id}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ₱{order.total.toFixed(2)}</p>
          <div className="mt-2">
            <h4 className="font-semibold">Items:</h4>
            <ul className="list-disc list-inside">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} - Qty: {item.qty} - Size: {item.size} - Price: ₱{item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
          {order.status !== 'Cancelled' && (
            <button
              onClick={() => confirmCancelOrder(order._id)}
              disabled={cancellingOrderId === order._id}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      ))}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <p className="mb-4">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelCancelOrder}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
