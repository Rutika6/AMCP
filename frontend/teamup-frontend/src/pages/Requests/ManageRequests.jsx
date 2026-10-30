import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { useFetch } from '../../hooks/useFetch';
import { requestService } from '../../services/requestService';
import { REQUEST_STATUS } from '../../utils/constants';

export default function ManageRequests() {
  const { teamId } = useParams();
  const { data: requests, loading, error, refetch } = useFetch(
    () => requestService.getRequestsForTeam(teamId),
    [teamId]
  );
  const [actionError, setActionError] = useState('');
  const [respondingId, setRespondingId] = useState('');

  const respond = async (requestId, status) => {
    setActionError('');
    setRespondingId(requestId);
    try {
      await requestService.respondToRequest(requestId, status);
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to update this request.');
    } finally {
      setRespondingId('');
    }
  };

  return (
    <MainLayout>
      <h1>Join Requests</h1>
      {actionError && <p className="error-text">{actionError}</p>}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error.response?.status === 403 ? 'Only the team owner can review requests.' : 'Unable to load join requests.'} onRetry={refetch} />
      ) : requests?.length ? (
        requests.map((req) => (
          <div key={req.id} className="card" style={{ marginBottom: 10 }}>
            <p style={{ fontWeight: 600, margin: 0 }}>{req.applicantName}</p>
            <p style={{ color: 'var(--color-text-muted)' }}>{req.message}</p>
            {req.status === REQUEST_STATUS.PENDING ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button disabled={respondingId === req.id} onClick={() => respond(req.id, REQUEST_STATUS.ACCEPTED)}>
                  {respondingId === req.id ? 'Saving...' : 'Accept'}
                </Button>
                <Button variant="secondary" disabled={respondingId === req.id} onClick={() => respond(req.id, REQUEST_STATUS.REJECTED)}>
                  Reject
                </Button>
              </div>
            ) : (
              <p>Status: {req.status}</p>
            )}
          </div>
        ))
      ) : (
        <p style={{ color: 'var(--color-text-muted)' }}>No join requests yet.</p>
      )}
    </MainLayout>
  );
}
