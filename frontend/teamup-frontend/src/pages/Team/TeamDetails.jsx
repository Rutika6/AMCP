import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { useFetch } from '../../hooks/useFetch';
import { teamService } from '../../services/teamService';
import { requestService } from '../../services/requestService';
import { useAuth } from '../../hooks/useAuth';

const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || '?';

export default function TeamDetails() {
  const { teamId } = useParams();
  const { user } = useAuth();
  const { data: team, loading, error, refetch } = useFetch(() => teamService.getTeamById(teamId), [teamId]);
  const [showApply, setShowApply] = useState(false);
  const [message, setMessage] = useState('');
  const [applied, setApplied] = useState(false);
  const [sending, setSending] = useState(false);
  const [actionError, setActionError] = useState('');
  const [recentRequests, setRecentRequests] = useState(null);
  const [requestsError, setRequestsError] = useState(false);
  const isOwner = team && String(team.ownerId) === String(user?.id);

  useEffect(() => {
    if (!isOwner || !teamId) return;
    requestService.getRequestsForTeam(teamId)
      .then((response) => setRecentRequests(response.data.slice(0, 3)))
      .catch(() => setRequestsError(true));
  }, [isOwner, teamId]);

  if (loading) return <MainLayout><Loader /></MainLayout>;
  if (error || !team) return <MainLayout><ErrorState message="Unable to load this team." onRetry={refetch} /></MainLayout>;

  const isMember = team.isMember || isOwner;
  const pending = applied || team.myApplicationStatus === 'PENDING';
  const isFull = (team.members?.length || 0) >= team.maxMembers;
  const isRecruiting = team.isRecruiting !== false;

  const handleApply = async () => {
    setActionError('');
    setSending(true);
    try {
      await requestService.applyToTeam(teamId, message);
      setApplied(true);
      setShowApply(false);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to send your application. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <MainLayout>
      <div className="page-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div><h1>{team.name}</h1><p>{team.description}</p></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className={`badge ${isRecruiting && !isFull ? 'badge-success' : ''}`}>{isRecruiting ? (isFull ? 'At capacity' : 'Recruiting') : 'Applications closed'}</span>
            <span className="badge">{team.members?.length || 0} / {team.maxMembers} members</span>
          </div>
        </div>
      </div>
      {actionError && <p className="error-text" role="alert">{actionError}</p>}
      <section className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div>{isOwner ? <span className="badge">You own this team</span> : isMember ? <span className="badge">You’re a member</span> : pending ? <span className="badge badge-warning">Application pending</span> : team.myApplicationStatus === 'REJECTED' ? <span className="badge badge-danger">Previous application declined</span> : <span className="muted">Interested in collaborating?</span>}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {!isOwner && !isMember && !pending && <Button onClick={() => setShowApply(true)} disabled={isFull || !isRecruiting}>{!isRecruiting ? 'Applications closed' : isFull ? 'Team at capacity' : 'Apply to join'}</Button>}
          {isOwner && <>
            <Link className="btn btn-secondary" to={`/teams/${teamId}/edit`}>Edit team</Link>
            <Link className="btn btn-secondary" to={`/teams/${teamId}/members`}>Manage members</Link>
            <Link className="btn btn-secondary" to={`/teams/${teamId}/vacancies`}>Recruitment</Link>
            <Link className="btn btn-primary" to={`/teams/${teamId}/requests`}>Review requests</Link>
          </>}
        </div>
      </section>

      <div className="grid-2 section">
        <section className="card">
          <h2>About</h2><p>{team.description}</p>
          <h3 style={{ marginTop: 22 }}>Skills needed</h3>
          {team.skillsNeeded?.length ? <div className="skill-list">{team.skillsNeeded.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}</div> : <p className="muted">No specific skills listed.</p>}
        </section>
        <section className="card">
          <h2>Team information</h2>
          <div className="data-list">
            <div className="data-row"><span className="muted">Owner</span><div>{team.ownerName || (isOwner ? user?.name : 'Team owner')}</div></div>
            <div className="data-row"><span className="muted">Created</span><div>{team.createdAt ? new Date(team.createdAt).toLocaleDateString() : '—'}</div></div>
            <div className="data-row"><span className="muted">Capacity</span><div>{Math.max(0, team.maxMembers - (team.members?.length || 0))} open places · maximum {team.maxMembers}</div></div>
            <div className="data-row"><span className="muted">Recruitment</span><div>{isRecruiting ? 'Accepting applications' : 'Closed'}</div></div>
          </div>
        </section>
      </div>

      <section className="section card">
        <div className="section-heading"><h2>Members</h2><span className="muted">{team.members?.length || 0}</span></div>
        {team.members?.length ? team.members.map((member) => <div className="member-row" key={member.id || member._id}><span className="avatar" aria-hidden="true">{initials(member.name)}</span><div><strong>{member.name}{String(member.id || member._id) === String(team.ownerId) ? ' · Owner' : ''}</strong><div className="muted small">{member.skills?.length ? member.skills.join(' · ') : 'Team member'}</div></div></div>) : <p className="muted">No members listed.</p>}
      </section>

      {isOwner && <section className="section card">
        <div className="section-heading"><h2>Recent requests</h2><Link to={`/teams/${teamId}/requests`}>Review all</Link></div>
        {requestsError ? <p className="muted">Unable to load recent requests. <Link to={`/teams/${teamId}/requests`}>Open requests</Link></p> : recentRequests === null ? <p className="muted">Loading requests…</p> : recentRequests.length ? recentRequests.map((request) => <div className="data-row" key={request.id}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}><strong>{request.applicantName}</strong><span className={`badge ${request.status === 'PENDING' ? 'badge-warning' : ''}`}>{request.status.toLowerCase()}</span></div><p className="muted small" style={{ marginBottom: 0 }}>{request.message || 'No message provided'}</p></div>) : <p className="muted">No applications yet.</p>}
      </section>}

      <Modal isOpen={showApply} onClose={() => !sending && setShowApply(false)} title="Apply to join">
        <div className="form-group"><label htmlFor="application-message">Message to the team owner</label><textarea id="application-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Share what you’d like to contribute." rows={4} /></div>
        {actionError && <p className="error-text">{actionError}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}><Button variant="secondary" onClick={() => setShowApply(false)} disabled={sending}>Cancel</Button><Button onClick={handleApply} disabled={sending}>{sending ? 'Sending…' : 'Send application'}</Button></div>
      </Modal>
    </MainLayout>
  );
}
