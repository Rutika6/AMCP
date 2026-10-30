import React from 'react';
import TeamCard from './TeamCard';

export default function TeamList({ teams }) {
  if (!teams || teams.length === 0) return null;
  return <div className="grid-2">{teams.map((team) => <TeamCard key={team.id} team={team} />)}</div>;
}
