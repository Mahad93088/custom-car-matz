import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types/index.ts';
import { api } from '../lib/api.ts';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>, openDrawer?: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  appliedCoupon: { code: string; discountType: string; discountValue: number; discountAmount: number } | null;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  shippingMethod: 'standard' | 'express';
  setShippingMethod: (method: 'standard' | 'express') => void;
  shippingCost: number;
  total: number;
  freeShippingRemaining: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
}

const CART_STORAGE_KEY = 'custom_car_mats_cart';
const FREE_SHIPPING_THRESHOLD = 49.00;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null>(null);

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (itemData: Omit<CartItem, 'id'>, openDrawer: boolean = true) => {
    const id = 'cart_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newItem: CartItem = { ...itemData, id };
    setItems(prev => [newItem, ...prev]);
    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2));

  // Recalculate coupon discount if subtotal changes
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  // Shipping calculation:
  // Standard: Free if subtotal >= £49, else £3.99
  // Express: £6.99
  const isFreeStandard = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = items.length === 0 ? 0 : shippingMethod === 'express' ? 6.99 : isFreeStandard ? 0 : 3.99;

  const total = Math.max(0, Number((subtotal - discountAmount + shippingCost).toFixed(2)));
  const freeShippingRemaining = Math.max(0, Number((FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)));

  const applyCouponCode = async (code: string) => {
    try {
      const result = await api.validateCoupon(code, subtotal);
      setAppliedCoupon({
        code: result.code,
        discountType: result.discountType,
        discountValue: result.discountValue,
        discountAmount: result.discountAmount
      });
      return { success: true, message: `Coupon '${result.code}' applied successfully (-£${result.discountAmount.toFixed(2)})` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Invalid promotional code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discountAmount,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        shippingMethod,
        setShippingMethod,
        shippingCost,
        total,
        freeShippingRemaining,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        isCheckoutOpen,
        openCheckout: () => {
          setIsCartDrawerOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false)
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
