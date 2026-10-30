import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { notificationService } from '../services/notificationService';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!user) { setLoading(false); return Promise.resolve(); }
    setLoading(true);
    return notificationService
      .getNotifications()
      .then((res) => { setNotifications(res.data); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setError(false);
      setLoading(false);
      return undefined;
    }
    refresh();
    // simple polling every 30s; swap for websockets later if needed
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const markAsRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, refresh, markAsRead, markAllAsRead, error, loading }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
