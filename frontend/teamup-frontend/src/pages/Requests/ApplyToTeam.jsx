import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Loader from '../../components/common/Loader';
import { useFetch } from '../../hooks/useFetch';
import { requestService } from '../../services/requestService';

export default function ApplyToTeam() {
  const { data: applications, loading } = useFetch(() => requestService.getMyApplications(), []);

  return (
    <MainLayout>
      <h1>My Applications</h1>
      {loading ? (
        <Loader />
      ) : applications?.length ? (
        applications.map((req) => (
          <div key={req.id} className="card" style={{ marginBottom: 10 }}>
            <Link to={`/teams/${req.teamId}`} style={{ fontWeight: 600 }}>{req.teamName}</Link>
            <p style={{ margin: '4px 0 0' }}>Status: {req.status}</p>
          </div>
        ))
      ) : (
        <p style={{ color: 'var(--color-text-muted)' }}>You haven't applied to any teams yet.</p>
      )}
    </MainLayout>
  );
}
