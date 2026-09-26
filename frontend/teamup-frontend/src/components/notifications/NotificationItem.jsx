import React from 'react';

export default function NotificationItem({ notification, onMarkRead }) {
  return (
    <div
      className="card"
      style={{
        marginBottom: 8,
        background: notification.read ? 'var(--glass-bg)' : 'var(--glass-bg-strong)',
        borderLeft: notification.read ? undefined : '3px solid var(--accent-2)',
        cursor: notification.read ? 'default' : 'pointer',
      }}
      onClick={() => !notification.read && onMarkRead(notification.id)}
    >
      <p style={{ margin: 0 }}>{notification.message}</p>
      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        {new Date(notification.createdAt).toLocaleString()}
      </span>
    </div>
  );
}
