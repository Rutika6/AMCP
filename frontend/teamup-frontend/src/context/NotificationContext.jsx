import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { notificationService } from '../services/notificationService';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  const refresh = useCallback(() => {
    if (!user) return;
    notificationService
      .getNotifications()
      .then((res) => setNotifications(res.data))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, refresh, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
