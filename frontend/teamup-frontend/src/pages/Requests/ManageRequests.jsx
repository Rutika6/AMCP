import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useFetch } from '../../hooks/useFetch';
import { requestService } from '../../services/requestService';
import { REQUEST_STATUS } from '../../utils/constants';

export default function ManageRequests() {
  const { teamId } = useParams();
  const { data: requests, loading, refetch } = useFetch(
    () => requestService.getRequestsForTeam(teamId),
    [teamId]
  );

  const respond = async (requestId, status) => {
    await requestService.respondToRequest(requestId, status);
    refetch();
  };

  return (
    <MainLayout>
      <h1>Join Requests</h1>
      {loading ? (
        <Loader />
      ) : requests?.length ? (
        requests.map((req) => (
          <div key={req.id} className="card" style={{ marginBottom: 10 }}>
            <p style={{ fontWeight: 600, margin: 0 }}>{req.applicantName}</p>
            <p style={{ color: 'var(--color-text-muted)' }}>{req.message}</p>
            {req.status === REQUEST_STATUS.PENDING ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={() => respond(req.id, REQUEST_STATUS.ACCEPTED)}>Accept</Button>
                <Button variant="secondary" onClick={() => respond(req.id, REQUEST_STATUS.REJECTED)}>Reject</Button>
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
