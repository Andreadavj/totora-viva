// frontend/src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], subtotal: 0, itemCount: 0 });
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (err) {
      console.error('Error al cargar carrito:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (item) => {
    const { data } = await api.post('/cart/items', item);
    await fetchCart();
    return data;
  };

  const updateItem = async (itemId, quantity) => {
    await api.put(`/cart/items/${itemId}`, { quantity });
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/items/${itemId}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart');
    setCart({ items: [], subtotal: 0, itemCount: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateItem, removeItem, clearCart, refetch: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
