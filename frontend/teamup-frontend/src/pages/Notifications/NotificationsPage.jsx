import React, { useContext } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';
import NotificationItem from '../../components/notifications/NotificationItem';
import { NotificationContext } from '../../context/NotificationContext';

export default function NotificationsPage() {
  const { notifications, markAsRead, refresh } = useContext(NotificationContext);

  return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Notifications</h1>
        <Button variant="secondary" onClick={refresh}>Refresh</Button>
      </div>
      {notifications.length ? (
        notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} onMarkRead={markAsRead} />
        ))
      ) : (
        <p style={{ color: 'var(--color-text-muted)' }}>No notifications yet.</p>
      )}
    </MainLayout>
  );
}
