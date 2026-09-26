import React from 'react';
import { Link } from 'react-router-dom';

export default function TeamCard({ team }) {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <h3 style={{ margin: '0 0 6px' }}>{team.name}</h3>
      <p style={{ color: 'var(--color-text-muted)', margin: '0 0 8px' }}>
        {team.description}
      </p>
      <div style={{ fontSize: '0.85rem', marginBottom: 10 }}>
        {team.members?.length || 0} / {team.maxMembers} members
        {team.skillsNeeded?.length > 0 && (
          <> • Needs: {team.skillsNeeded.join(', ')}</>
        )}
      </div>
      <Link to={`/teams/${team.id}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
        View Team →
      </Link>
    </div>
  );
}
