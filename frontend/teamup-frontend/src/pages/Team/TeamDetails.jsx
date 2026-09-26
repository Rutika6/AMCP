import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { useFetch } from '../../hooks/useFetch';
import { teamService } from '../../services/teamService';
import { requestService } from '../../services/requestService';
import { useAuth } from '../../hooks/useAuth';

export default function TeamDetails() {
  const { teamId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: team, loading, error } = useFetch(() => teamService.getTeamById(teamId), [teamId]);
  const [showApply, setShowApply] = useState(false);
  const [message, setMessage] = useState('');
  const [applied, setApplied] = useState(false);

  if (loading) return (
    <MainLayout>
      <Loader />
    </MainLayout>
  );

  if (error || !team) return (
    <MainLayout>
      <p>Team not found.</p>
    </MainLayout>
  );

  const isOwner = team.ownerId === user?.id;
  const isFull = (team.members?.length || 0) >= team.maxMembers;
  const isRecruiting = team.isRecruiting !== false;

  const handleApply = async () => {
    await requestService.applyToTeam(teamId, message);
    setApplied(true);
    setShowApply(false);
  };

  return (
    <MainLayout>
      <div className="card">
        <h1>{team.name}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>{team.description}</p>
        <p>{team.members?.length || 0} / {team.maxMembers} members</p>
        <p><strong>Vacancies:</strong> {Math.max(0, team.maxMembers - (team.members?.length || 0))} · {isRecruiting ? 'Applications open' : 'Applications closed'}</p>
        {team.skillsNeeded?.length > 0 && (
          <p><strong>Skills needed:</strong> {team.skillsNeeded.join(', ')}</p>
        )}

        {isOwner ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to={`/teams/${teamId}/edit`}><Button variant="secondary">Edit Team</Button></Link>
            <Link to={`/teams/${teamId}/members`}><Button variant="secondary">Manage Members</Button></Link>
            <Link to={`/teams/${teamId}/vacancies`}><Button variant="secondary">Manage Vacancies</Button></Link>
            <Link to={`/teams/${teamId}/requests`}><Button>Manage Requests</Button></Link>
          </div>
        ) : applied ? (
          <p style={{ color: 'var(--color-secondary)' }}>Application sent ✓</p>
        ) : (
          <Button onClick={() => setShowApply(true)} disabled={isFull || !isRecruiting}>
            {!isRecruiting ? 'Applications Closed' : isFull ? 'Team Full' : 'Apply to Join'}
          </Button>
        )}
      </div>

      <Modal isOpen={showApply} onClose={() => setShowApply(false)} title="Apply to Join">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Why do you want to join this team?"
          rows={4}
          style={{ width: '100%', padding: 8, borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}
        />
        <div style={{ marginTop: 12 }}>
          <Button onClick={handleApply}>Send Application</Button>
        </div>
      </Modal>
    </MainLayout>
  );
}
