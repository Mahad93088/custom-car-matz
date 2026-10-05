import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.tsx';
import { api } from '../lib/api.ts';

interface WishlistContextType {
  wishlist: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isLoading: boolean;
  feedbackMessage: string | null;
  clearFeedback: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_LOCAL_KEY = 'custom_car_mats_guest_wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_LOCAL_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Sync with server when user logs in
  useEffect(() => {
    if (user) {
      api.getWishlist()
        .then(res => {
          if (res?.wishlist) {
            setWishlist(res.wishlist);
          }
        })
        .catch(() => {
          // If server call fails, fallback to local storage
        });
    }
  }, [user]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(WISHLIST_LOCAL_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const clearFeedback = () => setFeedbackMessage(null);

  const isWishlisted = (productId: string) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    setIsLoading(true);

    if (user) {
      try {
        const res = await api.toggleWishlist(productId);
        setWishlist(res.wishlist || []);
        setFeedbackMessage(res.message);
        setTimeout(() => setFeedbackMessage(null), 3000);
        setIsLoading(false);
        return res.isWishlisted;
      } catch (err: any) {
        console.error('Failed to toggle wishlist on server:', err);
      }
    }

    // Local toggle for guest or fallback
    let updated: string[];
    let state = false;
    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId);
      state = false;
      setFeedbackMessage('Removed from your saved car mats');
    } else {
      updated = [...wishlist, productId];
      state = true;
      setFeedbackMessage('Saved to your car mats wishlist! (Log in to sync across devices)');
    }
    setWishlist(updated);
    setTimeout(() => setFeedbackMessage(null), 3000);
    setIsLoading(false);
    return state;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
        isLoading,
        feedbackMessage,
        clearFeedback
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
