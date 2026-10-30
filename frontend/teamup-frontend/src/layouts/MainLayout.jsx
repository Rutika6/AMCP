import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

const primaryLinks = [
  { label: 'Home', to: '/dashboard' },
  { label: 'Discover', to: '/teams/search' },
  { label: 'My Teams', to: '/teams/mine' },
  { label: 'My Projects', to: '/projects' },
  { label: 'My Applications', to: '/teams/my-applications' },
  { label: 'Notifications', to: '/notifications' },
];

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useContext(NotificationContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const isActive = (to) => location.pathname === to || (to === '/teams/search' && /^\/teams\/[^/]+$/.test(location.pathname));

  return (
    <div className="app-shell">
      <div className={`nav-backdrop ${menuOpen ? 'open' : ''}`} onClick={closeMenu} />
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <Link className="brand" to="/dashboard" onClick={closeMenu}>
          <span className="brand-mark">T</span> TeamUp
        </Link>
        <div className="nav-label">Workspace</div>
        <nav className="side-nav" aria-label="Main navigation">
          {primaryLinks.map(({ label, to }) => (
            <Link key={to} to={to} onClick={closeMenu} className={isActive(to) ? 'active' : ''} aria-current={isActive(to) ? 'page' : undefined}>{label}{to === '/notifications' && unreadCount > 0 && <span className="badge" style={{ marginLeft: 7 }}>{unreadCount}</span>}</Link>
          ))}
        </nav>
        <div className="nav-label">Account</div>
        <nav className="side-nav" aria-label="Account navigation">
          <Link to="/profile" onClick={closeMenu} className={location.pathname.startsWith('/profile') ? 'active' : ''}>Profile</Link>
          <Link to="/settings" onClick={closeMenu} className={location.pathname === '/settings' ? 'active' : ''}>Settings</Link>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <span className="sidebar-user-name" title={user?.name}>{user?.name || 'Your account'}</span>
            <button type="button" onClick={() => { logout(); closeMenu(); navigate('/login'); }} aria-label="Log out">Log out</button>
          </div>
        </div>
      </aside>
      <div className="app-main">
        <div className="mobile-topbar">
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">☰</button>
          <Link className="brand" to="/dashboard" style={{ padding: 0 }}><span className="brand-mark">T</span> TeamUp</Link>
        </div>
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}
