"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("reloop_cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("reloop_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product, customPrice = null) => {
    const finalPrice = customPrice !== null ? customPrice : product.price;
    const isNegotiated = customPrice !== null && customPrice !== product.price;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.price === finalPrice);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.price === finalPrice ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, price: finalPrice, isNegotiated, qty: 1 }];
    });
  };

  const updateQty = (id, delta, price) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.price === price ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id, price) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.price === price)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        cartCount: cartItems.reduce((acc, item) => acc + item.qty, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
