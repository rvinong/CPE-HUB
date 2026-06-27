import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set the JWT token for authenticated requests
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Products API
export const getProducts = () => apiClient.get('/products');
export const getProductById = (productId) => apiClient.get(`/products/${productId}`);
export const createProduct = (productData) => apiClient.post('/products', productData);
export const updateProductStock = (productId, stockData) => apiClient.put(`/stock/${productId}`, stockData);
export const deleteProduct = (productId) => apiClient.delete(`/products/${productId}`);

// Orders API
export const getOrders = () => apiClient.get('/orders');
export const createOrder = (orderData) => apiClient.post('/orders', orderData);
export const updateOrderStatus = (orderId, statusData) => apiClient.put(`/orders/${orderId}`, statusData);

// User Authentication API
export const signup = (userData) => apiClient.post('/signup', userData);
export const login = (credentials) => apiClient.post('/login', credentials);

// Cart API
export const getCart = () => apiClient.get('/cart');
export const updateCart = (cartData) => apiClient.put('/cart', cartData);

// Users API
export const getUsers = () => apiClient.get('/users');

export default apiClient;
