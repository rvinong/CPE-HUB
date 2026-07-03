import React, { createContext, useContext, useEffect, useState } from "react";
import { MERCH_STATUS, normalizeMerch } from "../data/merch";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CART_STORAGE_KEY = "cartItems";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const normalizedProduct = normalizeMerch({
      ...product,
      qty: Number(product.qty || 1),
    });

    if (normalizedProduct.status === MERCH_STATUS.ARCHIVED) {
      return;
    }

    setCartItems((prevItems) => {
      const id = `${normalizedProduct.productId}-${normalizedProduct.size || "default"}`;
      const existingItem = prevItems.find((item) => item.id === id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === id ? { ...item, qty: Number(item.qty || 0) + normalizedProduct.qty } : item
        );
      }
      return [...prevItems, { ...normalizedProduct, id }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const toggleCart = () => {
    setIsCartOpen((open) => !open);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, isCartOpen, toggleCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
