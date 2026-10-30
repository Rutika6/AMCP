import React from 'react';
import { Link } from 'react-router-dom';

export default function NotificationItem({ notification, onMarkRead }) {
  return <article className={`notification-item ${notification.read ? '' : 'unread'}`}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div><p>{notification.message}</p><span className="muted small">{new Date(notification.createdAt).toLocaleString()}</span>{notification.teamId && <div><Link className="small" to={`/teams/${notification.teamId}`}>View team</Link></div>}</div>
      {!notification.read && <button type="button" className="btn btn-secondary" onClick={() => onMarkRead(notification.id)}>Mark as read</button>}
    </div>
  </article>;
}
