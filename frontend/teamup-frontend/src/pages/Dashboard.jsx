import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import TeamList from '../components/team/TeamList';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { teamService } from '../services/teamService';
import { requestService } from '../services/requestService';
import { useAuth } from '../hooks/useAuth';
import { NotificationContext } from '../context/NotificationContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { notifications, refresh: refreshNotifications, error: notificationsError, loading: notificationsLoading } = useContext(NotificationContext);
  const teams = useFetch(() => teamService.getMyTeams(), []);
  const discover = useFetch(() => teamService.searchTeams({ recruiting: true, hasCapacity: true, sort: 'newest' }), []);
  const applications = useFetch(() => requestService.getMyApplications(), []);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <MainLayout>
      <section className="hero">
        <h1>{greeting}, {user?.name?.split(' ')[0] || 'there'}</h1>
        <p>Find teammates, discover projects and manage your teams.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/teams/search">Discover teams</Link>
          <Link className="btn btn-secondary" to="/teams/create">Create a team</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading"><h2>My teams</h2><Link to="/teams/mine">View all</Link></div>
        {teams.loading ? <Loader /> : teams.error ? <ErrorState message="Unable to load your teams." onRetry={teams.refetch} /> : teams.data?.length ? <TeamList teams={teams.data.slice(0, 4)} /> : <EmptyState title="You’re not part of a team yet." action={<Link to="/teams/search">Explore teams</Link>}>Browse teams that are recruiting or start one of your own.</EmptyState>}
      </section>

      <div className="grid-2 section">
        <section>
          <div className="section-heading"><h2>Discover teams</h2><Link to="/teams/search">Browse all</Link></div>
          {discover.loading ? <Loader /> : discover.error ? <ErrorState message="Unable to load recruiting teams." onRetry={discover.refetch} /> : discover.data?.length ? <TeamList teams={discover.data.slice(0, 3)} /> : <EmptyState title="No open teams found">Check back later or create a team to bring people together.</EmptyState>}
        </section>
        <section>
          <div className="section-heading"><h2>My applications</h2><Link to="/teams/my-applications">View all</Link></div>
          {applications.loading ? <Loader /> : applications.error ? <ErrorState message="Unable to load your applications." onRetry={applications.refetch} /> : applications.data?.filter((item) => item.status === 'PENDING').length ? <div className="card data-list">{applications.data.filter((item) => item.status === 'PENDING').slice(0, 4).map((item) => <div className="data-row" key={item.id}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><Link to={`/teams/${item.teamId}`}><strong>{item.teamName || 'Team'}</strong></Link><span className="badge badge-warning">Pending</span></div><div className="muted small">Applied {new Date(item.createdAt).toLocaleDateString()}</div></div>)}</div> : <EmptyState title="No pending applications" action={<Link to="/teams/search">Find a team</Link>}>Your applications and decisions will appear here.</EmptyState>}
        </section>
      </div>

      <section className="section">
        <div className="section-heading"><h2>Recent updates</h2><Link to="/notifications">Open notifications</Link></div>
        {notificationsLoading ? <Loader /> : notificationsError ? <ErrorState message="Unable to load recent notifications." onRetry={refreshNotifications} /> : notifications.length ? <div className="card data-list">{notifications.slice(0, 4).map((item) => <div className="data-row" key={item.id}><div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}><span className={`badge ${item.read ? '' : 'badge-warning'}`}>{item.read ? 'Read' : 'Unread'}</span><span>{item.message}</span></div><div className="muted small">{new Date(item.createdAt).toLocaleString()}</div></div>)}</div> : <EmptyState title="You’re all caught up." action={<Link to="/notifications">View notifications</Link>}>Team application updates and other notifications will appear here.</EmptyState>}
      </section>
    </MainLayout>
  );
}
