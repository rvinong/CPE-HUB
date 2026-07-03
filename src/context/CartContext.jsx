
import React, { createContext, useState, useContext, useEffect } from 'react';
import { MERCH_STATUS, normalizeMerch } from '../data/merch';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CART_STORAGE_KEY = 'cartItems';
const API_BASE_URL = "http://localhost:5000/api";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch cart from backend if logged in, else from localStorage
  useEffect(() => {
    console.log('CartContext: token changed, fetching cart');
    if (!token) {
      console.log('CartContext: no token, not clearing cartItems');
      // Do not clear cartItems here to keep persistence
      return;
    }
    const fetchCart = async () => {
      if (token) {
        try {
          const response = await fetch(API_BASE_URL + "/cart", {
            headers: {
              'Authorization': 'Bearer ' + token,
            },
          });
          if (response.ok) {
            const data = await response.json();
            // Add id field to each cart item for frontend usage
            const dataWithId = data.map(item => ({
              ...item,
              id: `${item.productId}-${item.size || 'default'}`
            }));
            console.log('CartContext: fetched cart items', dataWithId);
            setCartItems(dataWithId);
          } else {
            console.log('CartContext: fetch cart response not ok, not clearing cartItems');
            // Do not clear cartItems here to keep persistence
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          // Do not clear cartItems here to keep persistence
        }
      } else {
        try {
          const storedCart = localStorage.getItem(CART_STORAGE_KEY);
          console.log('CartContext: loaded cart from localStorage', storedCart);
          setCartItems(storedCart ? JSON.parse(storedCart) : []);
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          // Do not clear cartItems here to keep persistence
        }
      }
    };
    fetchCart();
  }, [token]);

  // Update cart in backend or localStorage on cartItems change
  useEffect(() => {
    console.log('CartContext: cartItems changed', cartItems);
    const updateCart = async () => {
      if (token) {
        try {
          await fetch(API_BASE_URL + "/cart", {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({ cart: cartItems }),
          });
          console.log('CartContext: updated cart on backend');
        } catch (error) {
          console.error('Error updating cart on backend:', error);
        }
      } else {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
          console.log('CartContext: updated cart in localStorage');
        } catch (error) {
          console.error('Error updating cart in localStorage:', error);
        }
      }
    };
    updateCart();
  }, [cartItems, token]);

  const addToCart = (product) => {
    const normalizedProduct = normalizeMerch({
      ...product,
      qty: Number(product.qty || 1),
    });
    if (normalizedProduct.status === MERCH_STATUS.ARCHIVED) {
      return;
    }
    console.log('CartContext: addToCart called with product', normalizedProduct);
    setCartItems((prevItems) => {
      const id = `${normalizedProduct.productId}-${normalizedProduct.size || 'default'}`;
      const existingItem = prevItems.find(item => item.id === id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === id ? { ...item, qty: Number(item.qty || 0) + normalizedProduct.qty } : item
        );
      } else {
        return [...prevItems, { ...normalizedProduct, id }];
      }
    });
  };

  const removeFromCart = (id) => {
    console.log('CartContext: removeFromCart called with id', id);
    setCartItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const updateQty = (id, qty) => {
    console.log('CartContext: updateQty called with id, qty', id, qty);
    if (qty < 1) return;
    setCartItems((prevItems) =>
      prevItems.map(item =>
        item.id === id ? { ...item, qty } : item
      )
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const clearCart = () => {
    console.log('CartContext: clearCart called');
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, isCartOpen, toggleCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
