import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationContext } from '../../context/NotificationContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 28px',
        background: 'rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Link
        to="/dashboard"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.3rem',
          background: 'linear-gradient(120deg, var(--accent-1), var(--accent-2))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        TeamUp
      </Link>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <Link to="/teams/search">Search Teams</Link>
        <Link to="/teams/create">Create Team</Link>
        <Link to="/notifications">
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </Link>
        <Link to="/profile">{user?.name || 'Profile'}</Link>
        <span style={{ cursor: 'pointer', color: 'var(--color-danger)' }} onClick={handleLogout}>
          Logout
        </span>
      </div>
    </nav>
  );
}
