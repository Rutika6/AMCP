import React, { useContext, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import NotificationItem from '../../components/notifications/NotificationItem';
import { NotificationContext } from '../../context/NotificationContext';

export default function NotificationsPage() {
  const { notifications, unreadCount, refresh, markAsRead, markAllAsRead, error: loadError, loading } = useContext(NotificationContext);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const unread = notifications.filter((notification) => !notification.read);
  const earlier = notifications.filter((notification) => notification.read);
  const run = async (callback) => {
    setError(''); setSaving(true);
    try { await callback(); } catch { setError('Unable to update notifications. Please try again.'); }
    finally { setSaving(false); }
  };

  return <MainLayout>
    <div className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}><div><h1>Notifications</h1><p>Updates about your teams and applications.</p></div><div style={{ display: 'flex', gap: 8 }}><Button variant="secondary" onClick={() => run(refresh)} disabled={saving}>Refresh</Button>{unreadCount > 0 && <Button onClick={() => run(markAllAsRead)} disabled={saving}>Mark all as read</Button>}</div></div>
    {error && <p className="error-text" role="alert">{error}</p>}
    {loading ? <Loader /> : loadError ? <div className="empty-state"><p className="error-text">Unable to load notifications.</p><Button variant="secondary" onClick={() => run(refresh)}>Try again</Button></div> : notifications.length ? <>
      {unread.length > 0 && <section className="card section" style={{ padding: 0 }}><h2 style={{ padding: '16px 16px 0' }}>Unread</h2>{unread.map((item) => <NotificationItem key={item.id} notification={item} onMarkRead={(id) => run(() => markAsRead(id))} />)}</section>}
      {earlier.length > 0 && <section className="card section" style={{ padding: 0 }}><h2 style={{ padding: '16px 16px 0' }}>Earlier</h2>{earlier.map((item) => <NotificationItem key={item.id} notification={item} onMarkRead={markAsRead} />)}</section>}
    </> : <EmptyState title="You’re all caught up.">Team updates and application decisions will appear here.</EmptyState>}
  </MainLayout>;
}
