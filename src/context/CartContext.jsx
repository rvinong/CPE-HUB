import React, { createContext, useContext, useEffect, useState } from "react";
import { MERCH_STATUS, normalizeMerch } from "../data/merch";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CART_STORAGE_KEY = "cartItems";
const capCartQty = (qty, stock) => {
  const requestedQty = Number(qty || 1);
  const availableStock = Number(stock || 0);
  return availableStock > 0 ? Math.min(availableStock, requestedQty) : requestedQty;
};

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
          item.id === id
            ? {
                ...item,
                qty: capCartQty(Number(item.qty || 0) + normalizedProduct.qty, normalizedProduct.quantity),
              }
            : item
        );
      }
      return [...prevItems, { ...normalizedProduct, qty: capCartQty(normalizedProduct.qty, normalizedProduct.quantity), id }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, qty: capCartQty(qty, item.quantity) } : item
      )
    );
  };

  const toggleCart = () => {
    setIsCartOpen((open) => !open);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty, isCartOpen, toggleCart, closeCart, openCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
