import React, { useState, useEffect } from 'react';
import {
  getProducts,
  createProduct,
  updateProductStock,
  deleteProduct,
  getUsers,
  getOrders,
} from '../api/apiClient';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');

  // Product management state
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productId: '',
    name: '',
    category: '',
    price: '',
    sizes: '',
    image: '',
    quantity: '',
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductData, setEditingProductData] = useState({});

  // User management state
  const [users, setUsers] = useState([]);

  // Order management state
  const [orders, setOrders] = useState([]);
  const [userOrdersMap, setUserOrdersMap] = useState({});

  useEffect(() => {
    let intervalId;
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'orders') {
      fetchUsersAndOrders();
      intervalId = setInterval(fetchUsersAndOrders, 10000); // Poll every 10 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      console.log('Fetched users:', response.data);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchUsersAndOrders = async () => {
    try {
      const [usersResponse, ordersResponse] = await Promise.all([getUsers(), getOrders()]);
      let usersData = [];
      if (Array.isArray(usersResponse.data)) {
        usersData = usersResponse.data;
      } else if (usersResponse.data && Array.isArray(usersResponse.data.users)) {
        usersData = usersResponse.data.users;
      }
      setUsers(usersData);

      const ordersData = ordersResponse.data || [];
      setOrders(ordersData);

      // Map orders by userId

      const map = {};
      usersData.forEach(user => {
        map[user._id] = [];
      });
      ordersData.forEach(order => {
        const userId = order.userId?._id || order.userId;
        if (map[userId]) {
          map[userId].push(order);
        }
      });
      setUserOrdersMap(map);
    } catch (error) {
      console.error('Failed to fetch users and orders:', error);
    }
  };


  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const [addProductError, setAddProductError] = useState('');

  const handleAddProduct = async () => {
    try {
      const newProductId = Number(newProduct.productId);
      if (products.some((p) => p.productId === newProductId)) {
        setAddProductError('Product ID already exists. Please use a unique ID.');
        return;
      }
      const productData = {
        productId: newProductId,
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        sizes: newProduct.sizes.split(',').map((s) => s.trim()),
        image: newProduct.image,
        quantity: Number(newProduct.quantity),
      };
      await createProduct(productData);
      setNewProduct({
        productId: '',
        name: '',
        category: '',
        price: '',
        sizes: '',
        image: '',
        quantity: '',
      });
      setAddProductError('');
      fetchProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
      setAddProductError('Failed to add product. Please try again.');
    }
  };

  const startEditing = (product) => {
    setEditingProductId(product.productId);
    setEditingProductData({
      name: product.name,
      category: product.category,
      price: product.price,
      sizes: product.sizes.join(', '),
      image: product.image,
      quantity: product.quantity,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProductData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    try {
      const stockData = {
        name: editingProductData.name,
        category: editingProductData.category,
        price: Number(editingProductData.price),
        sizes: editingProductData.sizes.split(',').map((s) => s.trim()),
        image: editingProductData.image,
        quantity: Number(editingProductData.quantity),
      };
      await updateProductStock(editingProductId, stockData);
      setEditingProductId(null);
      fetchProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const cancelEdit = () => {
    setEditingProductId(null);
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-4 border-b border-gray-300">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Product Management
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Order Management
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'products' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Product Management</h2>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Add New Product</h3>
              <div className="grid grid-cols-2 gap-4 max-w-xl">
                <input
                  type="number"
                  name="productId"
                  placeholder="Product ID"
                  value={newProduct.productId}
                  onChange={handleNewProductChange}
                  className="border border-gray-300 rounded px-3 py-1"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newProduct.name}
                  onChange={handleNewProductChange}
                  className="border border-gray-300 rounded px-3 py-1"
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={handleNewProductChange}
                  className="border border-gray-300 rounded px-3 py-1"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={handleNewProductChange}
                  className="border border-gray-300 rounded px-3 py-1"
                />
                <input
                  type="text"
                  name="sizes"
                  placeholder="Sizes (comma separated)"
                  value={newProduct.sizes}
                  onChange={handleNewProductChange}
                  className="border border-gray-300 rounded px-3 py-1"
                />
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={handleNewProductChange}
                  className="border border-gray-300 rounded px-3 py-1"
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={handleNewProductChange}
                  className="border border-gray-300 rounded px-3 py-1"
                />
                <button
                  onClick={handleAddProduct}
                  className="bg-primary text-white rounded px-4 py-2 hover:bg-primary-dark"
                >
                  Add Product
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Existing Products</h3>
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1">ID</th>
                    <th className="border border-gray-300 px-2 py-1">Name</th>
                    <th className="border border-gray-300 px-2 py-1">Category</th>
                    <th className="border border-gray-300 px-2 py-1">Price</th>
                    <th className="border border-gray-300 px-2 py-1">Sizes</th>
                    <th className="border border-gray-300 px-2 py-1">Image</th>
                    <th className="border border-gray-300 px-2 py-1">Quantity</th>
                    <th className="border border-gray-300 px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) =>
                    editingProductId === product.productId ? (
                      <tr key={product.productId} className="align-middle">
                        <td className="border border-gray-300 px-2 py-1 align-middle">{product.productId}</td>
                        <td className="border border-gray-300 px-2 py-1 align-middle">
                          <input
                            type="text"
                            name="name"
                            value={editingProductData.name}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full box-border"
                            style={{ minWidth: '120px' }}
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1 align-middle">
                          <input
                            type="text"
                            name="category"
                            value={editingProductData.category}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full box-border"
                            style={{ minWidth: '100px' }}
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1 align-middle">
                          <input
                            type="number"
                            name="price"
                            value={editingProductData.price}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full box-border"
                            style={{ minWidth: '80px' }}
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1 align-middle">
                          <input
                            type="text"
                            name="sizes"
                            value={editingProductData.sizes}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full box-border"
                            style={{ minWidth: '120px' }}
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1 align-middle">
                          <input
                            type="text"
                            name="image"
                            value={editingProductData.image}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full box-border"
                            style={{ minWidth: '150px' }}
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1 align-middle">
                          <input
                            type="number"
                            name="quantity"
                            value={editingProductData.quantity}
                            onChange={handleEditChange}
                            className="border border-gray-300 rounded px-2 py-1 w-full box-border"
                            style={{ minWidth: '80px' }}
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-1 space-x-2 align-middle whitespace-nowrap">
                          <button
                            onClick={saveEdit}
                            className="bg-green-600 text-white rounded px-3 py-1 hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-400 text-white rounded px-3 py-1 hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={product.productId}>
                        <td className="border border-gray-300 px-2 py-1">{product.productId}</td>
                        <td className="border border-gray-300 px-2 py-1">{product.name}</td>
                        <td className="border border-gray-300 px-2 py-1">{product.category}</td>
                        <td className="border border-gray-300 px-2 py-1">{product.price}</td>
                        <td className="border border-gray-300 px-2 py-1">{product.sizes.join(', ')}</td>
                        <td className="border border-gray-300 px-2 py-1">
                          <img src={product.image} alt={product.name} className="h-10 w-10 object-cover" />
                        </td>
                        <td className="border border-gray-300 px-2 py-1">{product.quantity}</td>
                        <td className="border border-gray-300 px-2 py-1 space-x-2">
                          <button
                            onClick={() => startEditing(product)}
                            className="bg-blue-600 text-white rounded px-2 py-1 hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.productId)}
                            className="bg-red-600 text-white rounded px-2 py-1 hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1">Name</th>
                  <th className="border border-gray-300 px-2 py-1">Birthday</th>
                  <th className="border border-gray-300 px-2 py-1">Mobile Number</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="border border-gray-300 px-2 py-1">{user.name}</td>
                    <td className="border border-gray-300 px-2 py-1">
                      {user.birthday ? new Date(user.birthday).toLocaleDateString() : ''}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">{user.mobile || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Management</h2>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1">Order ID</th>
                  <th className="border border-gray-300 px-2 py-1">User ID</th>
                  <th className="border border-gray-300 px-2 py-1">Items</th>
                  <th className="border border-gray-300 px-2 py-1">Total</th>
                  <th className="border border-gray-300 px-2 py-1">Status</th>
                  <th className="border border-gray-300 px-2 py-1">Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="border border-gray-300 px-2 py-1">{order._id}</td>
                    <td className="border border-gray-300 px-2 py-1">{order.userId?.name || order.userId?.email || 'Unknown User'}</td>
                    <td className="border border-gray-300 px-2 py-1">
                      {order.items.map((item) => (
                        <div key={item.productId}>
                          {item.name} (Qty: {item.qty})
                        </div>
                      ))}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">₱{order.total.toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-1">{order.status}</td>
                    <td className="border border-gray-300 px-2 py-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {/* Accept Order button removed as per user request */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
