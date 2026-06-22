'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string | number;
  name: string;
  price: number; // numeric price in ₹
  image: string;
  qty: number;
  stock?: number;
}

export interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  stock?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  removeFromCart: (id: string | number) => void;
  updateQty: (id: string | number, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  subtotal: number;
  
  // Wishlist addition
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string | number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('rhst_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart items', e);
      }
    }

    const savedWishlist = localStorage.getItem('rhst_wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to parse wishlist items', e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('rhst_cart', JSON.stringify(items));
  };

  // Save wishlist to localStorage on change
  const saveWishlist = (items: WishlistItem[]) => {
    setWishlistItems(items);
    localStorage.setItem('rhst_wishlist', JSON.stringify(items));
  };

  const addToCart = (newItem: Omit<CartItem, 'qty'>) => {
    // Restrict checkout/cart to logged in users only
    const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
    if (!isLoggedIn) {
      // Open the login overlay modal directly without alerts
      const accountBtn = document.querySelector('[aria-label="Account"]') as HTMLElement;
      if (accountBtn) {
        accountBtn.click();
      }
      return;
    }

    const existingIndex = cartItems.findIndex((item) => item.id === newItem.id);
    const maxStock = newItem.stock !== undefined ? newItem.stock : 999;

    if (existingIndex > -1) {
      const updated = [...cartItems];
      if (updated[existingIndex].qty < maxStock) {
        updated[existingIndex].qty += 1;
        saveCart(updated);
      } else {
        alert(`Cannot add more. Only ${maxStock} units available in stock.`);
      }
    } else {
      if (maxStock >= 1) {
        saveCart([...cartItems, { ...newItem, qty: 1 }]);
      } else {
        alert('This product is out of stock.');
        return;
      }
    }
    // Automatically open the cart drawer when item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string | number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const updateQty = (id: string | number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const maxStock = item.stock !== undefined ? item.stock : 999;
        const validQty = Math.min(maxStock, qty);
        if (qty > maxStock) {
          alert(`Only ${maxStock} units of "${item.name}" are available in stock.`);
        }
        return { ...item, qty: validQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const addToWishlist = (item: WishlistItem) => {
    if (!wishlistItems.some((i) => i.id === item.id)) {
      saveWishlist([...wishlistItems, item]);
    }
  };

  const removeFromWishlist = (id: string | number) => {
    saveWishlist(wishlistItems.filter((i) => i.id !== id));
  };

  const toggleWishlist = (item: WishlistItem) => {
    if (wishlistItems.some((i) => i.id === item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  const isInWishlist = (id: string | number) => {
    return wishlistItems.some((i) => i.id === id);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        subtotal,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
