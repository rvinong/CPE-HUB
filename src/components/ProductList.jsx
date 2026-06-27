import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/apiClient';
import { useCart } from '../context/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, []);

  const hasSizes = (product) => {
    if (!product.sizes || !Array.isArray(product.sizes)) return false;
    // Check if sizes array has at least one non-empty string
    return product.sizes.some(size => typeof size === 'string' && size.trim().length > 0);
  };

  const isSpecialProduct = (product) => {
    const name = product.name.toLowerCase();
    const category = product.category ? product.category.toLowerCase() : '';
    return name.includes('lace') || category.includes('essentials') || name.includes('essentials');
  };

  const handleAddToCart = (product) => {
    if (isSpecialProduct(product) || !hasSizes(product)) {
      // Special product or no valid sizes, add immediately with qty 1 and no size
      addToCart({ id: product.productId, name: product.name, price: product.price, qty: 1, size: '', image: product.image });
    } else {
      // Sizes exist, prompt user to select size (not implemented)
      alert('Please select a size before adding to cart.');
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Product List</h2>
      <ul>
        {products.map(product => (
          <li key={product.productId} className="mb-2 flex items-center justify-between">
            <div>
              <strong>{product.name}</strong> - ${product.price.toFixed(2)}
            </div>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
