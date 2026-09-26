import React from 'react';
import TeamCard from './TeamCard';

export default function TeamList({ teams }) {
  if (!teams || teams.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)' }}>No teams found.</p>;
  }

  return (
    <div>
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
