import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { useFetch } from '../../hooks/useFetch';
import { teamService } from '../../services/teamService';

export default function ManageTeamMembers() {
  const { teamId } = useParams();
  const { data: members, loading, error, refetch } = useFetch(
    () => teamService.getTeamMembers(teamId),
    [teamId]
  );
  const [actionError, setActionError] = useState('');
  const [removingId, setRemovingId] = useState('');

  const removeMember = async (member) => {
    if (!window.confirm(`Remove ${member.name} from this team?`)) return;
    setActionError('');
    setRemovingId(member.id);
    try {
      await teamService.removeTeamMember(teamId, member.id);
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to remove this member.');
    } finally {
      setRemovingId('');
    }
  };

  return (
    <MainLayout>
      <h1>Manage Team Members</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>Remove a member to open a vacancy on the team.</p>
      {actionError && <p className="error-text">{actionError}</p>}
      {loading ? <Loader /> : error ? (
        <ErrorState message={error.response?.status === 403 ? 'Only the team owner can manage members.' : 'Unable to load team members.'} onRetry={refetch} />
      ) : members?.length ? members.map((member) => (
        <div key={member.id} className="card" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{member.name}{member.isOwner ? ' (Owner)' : ''}</strong>
            <div style={{ color: 'var(--color-text-muted)' }}>{member.email}</div>
            {member.skills?.length > 0 && <div style={{ color: 'var(--color-text-muted)' }}>{member.skills.join(', ')}</div>}
          </div>
          {!member.isOwner && <Button variant="secondary" disabled={removingId === member.id} onClick={() => removeMember(member)}>
            {removingId === member.id ? 'Removing...' : 'Remove'}
          </Button>}
        </div>
      )) : <p style={{ color: 'var(--color-text-muted)' }}>No members found.</p>}
      <Link to={`/teams/${teamId}`}>Back to team details</Link>
    </MainLayout>
  );
}
