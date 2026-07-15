import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE = '/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  points?: number;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  rating: number;
  prepTime: number;
}

interface OrderItem {
  dish: Dish;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  timestamp: number;
  deliveryAddress: string;
  trackingStage: number;
  latitude?: number;
  longitude?: number;
  rating?: number;
  feedback?: string;
  pointsEarned?: number;
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'customer') => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'admin' | 'customer') => Promise<boolean>;
  logout: () => void;
  dishes: Dish[];
  addDish: (dish: Omit<Dish, 'id'>) => Promise<void>;
  updateDish: (id: string, dish: Partial<Dish>) => Promise<void>;
  deleteDish: (id: string) => Promise<void>;
  orders: Order[];
  placeOrder: (items: OrderItem[], deliveryAddress: string, latitude?: number, longitude?: number) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateOrderFeedback: (orderId: string, rating: number, feedback: string) => Promise<void>;
  getIncomeStats: () => { today: number; month: number; year: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to normalize MongoDB _id to id
function normalizeId(obj: any) {
  if (!obj) return obj;
  return { ...obj, id: obj._id || obj.id };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load initial data
  useEffect(() => {
    // Restore user from sessionStorage
    const storedUser = sessionStorage.getItem('feastHubUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load dishes from API
    fetch(`${API_BASE}/dishes`)
      .then(r => r.json())
      .then(data => setDishes(data.map(normalizeId)))
      .catch(err => console.error('Failed to load dishes:', err));

    // Load orders from API
    fetch(`${API_BASE}/orders`)
      .then(r => r.json())
      .then(data => setOrders(data.map(normalizeId)))
      .catch(err => console.error('Failed to load orders:', err));
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'customer'): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) return false;
      const userData = await res.json();
      const normalizedUser = normalizeId(userData);
      setUser(normalizedUser);
      sessionStorage.setItem('feastHubUser', JSON.stringify(normalizedUser));
      return true;
    } catch {
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: 'admin' | 'customer'): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });
      if (!res.ok) return false;
      const userData = await res.json();
      const normalizedUser = normalizeId(userData);
      setUser(normalizedUser);
      sessionStorage.setItem('feastHubUser', JSON.stringify(normalizedUser));
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('feastHubUser');
  };

  const addDish = async (dish: Omit<Dish, 'id'>) => {
    const res = await fetch(`${API_BASE}/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dish),
    });
    const newDish = normalizeId(await res.json());
    setDishes(prev => [...prev, newDish]);
  };

  const updateDish = async (id: string, dishUpdate: Partial<Dish>) => {
    const res = await fetch(`${API_BASE}/dishes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dishUpdate),
    });
    const updated = normalizeId(await res.json());
    setDishes(prev => prev.map(d => d.id === id ? updated : d));
  };

  const deleteDish = async (id: string) => {
    await fetch(`${API_BASE}/dishes/${id}`, { method: 'DELETE' });
    setDishes(prev => prev.filter(d => d.id !== id));
  };

  const placeOrder = async (items: OrderItem[], deliveryAddress: string, latitude?: number, longitude?: number): Promise<string> => {
    const total = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
    const pointsEarned = Math.round(total / 10);

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: user?.id || 'guest',
        customerName: user?.name || 'Guest',
        items,
        total,
        status: 'pending',
        timestamp: Date.now(),
        deliveryAddress,
        trackingStage: 0,
        latitude,
        longitude,
        pointsEarned,
      }),
    });
    const newOrder = normalizeId(await res.json());
    setOrders(prev => [newOrder, ...prev]);
    return newOrder.id;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    let trackingStage = 0;
    if (status === 'preparing') trackingStage = 1;
    if (status === 'ready') trackingStage = 2;
    if (status === 'delivering') trackingStage = 3;
    if (status === 'completed') trackingStage = 4;

    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingStage }),
    });
    const updated = normalizeId(await res.json());
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));

    // Award points when order completes
    if (status === 'completed' && user && updated.customerId === user.id && updated.pointsEarned) {
      const newPoints = (user.points || 0) + updated.pointsEarned;
      const updatedUser = { ...user, points: newPoints };
      setUser(updatedUser);
      sessionStorage.setItem('feastHubUser', JSON.stringify(updatedUser));
      if (user.id !== 'admin1') {
        fetch(`${API_BASE}/auth/users/${user.id}/points`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ points: newPoints }),
        }).catch(console.error);
      }
    }
  };

  const updateOrderFeedback = async (orderId: string, rating: number, feedback: string) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}/feedback`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, feedback }),
    });
    const updated = normalizeId(await res.json());
    setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
  };

  const getIncomeStats = () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const yearStart = new Date(now.getFullYear(), 0, 1).getTime();

    const completedOrders = orders.filter(o => o.status === 'completed');
    const today = completedOrders.filter(o => o.timestamp >= todayStart).reduce((sum, o) => sum + o.total, 0);
    const month = completedOrders.filter(o => o.timestamp >= monthStart).reduce((sum, o) => sum + o.total, 0);
    const year = completedOrders.filter(o => o.timestamp >= yearStart).reduce((sum, o) => sum + o.total, 0);
    return { today, month, year };
  };

  return (
    <AppContext.Provider
      value={{
        user, login, register, logout,
        dishes, addDish, updateDish, deleteDish,
        orders, placeOrder, updateOrderStatus, updateOrderFeedback,
        getIncomeStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}