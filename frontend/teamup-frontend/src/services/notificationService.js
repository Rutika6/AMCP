import api from './api';

export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};
