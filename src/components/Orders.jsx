import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../api/apiClient";
import { formatPrice } from "../data/merch";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load orders.");
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
      await updateOrderStatus(orderToCancel, { status: "Cancelled" });
      await fetchOrders();
    } catch (err) {
      setError("Failed to cancel order.");
    } finally {
      setCancellingOrderId(null);
      setOrderToCancel(null);
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (orders.length === 0) return <div>No orders found.</div>;

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-neutral-950/10 bg-white p-4">
          <h3 className="font-semibold">Order ID: {order.id}</h3>
          <p className="mt-1 text-sm text-neutral-600">Status: {order.status}</p>
          <p className="mt-1 text-sm font-semibold">Total: {formatPrice(order.total)}</p>
          <div className="mt-3">
            <h4 className="font-semibold">Items</h4>
            <ul className="mt-2 grid gap-1 text-sm text-neutral-600">
              {order.items.map((item, index) => (
                <li key={`${order.id}-${index}`}>
                  {item.name} - Qty: {item.qty}
                  {item.size ? ` - Size: ${item.size}` : ""} - {formatPrice(item.price)}
                </li>
              ))}
            </ul>
          </div>
          {order.status !== "Cancelled" && (
            <button
              type="button"
              onClick={() => confirmCancelOrder(order.id)}
              disabled={cancellingOrderId === order.id}
              className="mt-4 bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {cancellingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      ))}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm bg-white p-6 shadow-lg">
            <p className="mb-4">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="border px-4 py-2">
                No
              </button>
              <button type="button" onClick={handleCancelOrder} className="bg-red-600 px-4 py-2 text-white">
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
