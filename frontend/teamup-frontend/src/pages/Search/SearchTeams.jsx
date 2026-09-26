import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import TeamList from '../../components/team/TeamList';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { useFetch } from '../../hooks/useFetch';
import { teamService } from '../../services/teamService';

export default function SearchTeams() {
  const [keyword, setKeyword] = useState('');
  const [skill, setSkill] = useState('');
  const [filters, setFilters] = useState({});

  const { data: teams, loading, refetch } = useFetch(
    () => teamService.searchTeams(filters),
    [filters]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ keyword: keyword.trim(), skill: skill.trim() });
  };

  return (
    <MainLayout>
      <h1>Search Teams</h1>
      <form onSubmit={handleSearch} className="card" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search by team name..."
          style={{ flex: 1, padding: 10, borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}
        />
        <input
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Filter by skill e.g. React"
          style={{ flex: 1, padding: 10, borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}
        />
        <Button type="submit">Search</Button>
      </form>

      {loading ? <Loader /> : <TeamList teams={teams} />}
    </MainLayout>
  );
}
