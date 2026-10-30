import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { useFetch } from '../../hooks/useFetch';
import { requestService } from '../../services/requestService';

const badgeClass = (status) => status === 'PENDING' ? 'badge-warning' : status === 'ACCEPTED' ? 'badge-success' : 'badge-danger';

export default function ApplyToTeam() {
  const { data: applications, loading, error, refetch } = useFetch(() => requestService.getMyApplications(), []);
  return <MainLayout>
    <div className="page-heading"><h1>My applications</h1><p>Track your requests to join teams.</p></div>
    {loading ? <Loader /> : error ? <ErrorState message="Unable to load your applications." onRetry={refetch} /> : applications?.length ? <div className="card data-list">{applications.map((application) => <article className="data-row" key={application.id}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}><Link to={`/teams/${application.teamId}`}><strong>{application.teamName || 'Team unavailable'}</strong></Link><span className={`badge ${badgeClass(application.status)}`}>{application.status?.toLowerCase()}</span></div>
      {application.message && <p style={{ margin: '8px 0' }}>{application.message}</p>}
      <div className="muted small">Applied {application.createdAt ? new Date(application.createdAt).toLocaleString() : 'date unavailable'}</div>
    </article>)}</div> : <EmptyState title="You haven’t applied to a team yet." action={<Link to="/teams/search">Explore teams</Link>}>Your applications and decisions will appear here.</EmptyState>}
  </MainLayout>;
}
