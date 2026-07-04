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
  if (error) return <div className="error-text">{error}</div>;
  if (orders.length === 0) return <div>No orders found.</div>;

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <div key={order.id} className="surface-panel p-4">
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
              className="ui-button-danger mt-4 px-4 py-2 disabled:opacity-50"
            >
              {cancellingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      ))}

      {showConfirm && (
        <div className="backdrop-scrim fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="modal-panel w-full max-w-sm p-6">
            <p className="mb-4">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="ui-button-secondary px-4 py-2">
                No
              </button>
              <button type="button" onClick={handleCancelOrder} className="ui-button-danger px-4 py-2">
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
