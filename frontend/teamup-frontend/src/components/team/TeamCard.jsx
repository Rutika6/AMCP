import React from 'react';
import { Link } from 'react-router-dom';

export default function TeamCard({ team }) {
  const memberCount = team.members?.length || 0;
  const pending = team.myApplicationStatus === 'PENDING';
  const rejected = team.myApplicationStatus === 'REJECTED';
  const isMember = team.isMember || team.currentUserRole;
  const isRecruiting = team.isRecruiting !== false;
  const open = isRecruiting && memberCount < team.maxMembers;
  const skills = team.skillsNeeded || [];

  return (
    <article className="card team-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>
          <h3><Link to={`/teams/${team.id}`}>{team.name}</Link></h3>
          {team.ownerName && <div className="muted small">Organized by {team.ownerName}</div>}
        </div>
        <span className={`badge ${open ? 'badge-success' : ''}`}>{open ? 'Recruiting' : isRecruiting ? 'At capacity' : 'Closed'}</span>
      </div>
      <p className="muted">{team.description}</p>
      <div className="small">{memberCount} / {team.maxMembers} members{team.currentUserRole && <> · {team.currentUserRole}</>}</div>
      {skills.length > 0 && <div className="skill-list" aria-label="Skills needed">{skills.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}</div>}
      <div className="team-card-footer">
        <div>
          {isMember ? <span className="badge">{team.currentUserRole || 'Member'}</span> : pending ? <span className="badge badge-warning">Application pending</span> : rejected ? <span className="badge badge-danger">Previously declined</span> : <span className="muted small">{team.ownerName ? `Owner: ${team.ownerName}` : 'Team profile'}</span>}
        </div>
        <Link className="btn btn-secondary" to={`/teams/${team.id}`}>View team</Link>
      </div>
    </article>
  );
}
