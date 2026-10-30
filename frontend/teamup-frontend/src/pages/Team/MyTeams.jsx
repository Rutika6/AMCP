import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import TeamList from '../../components/team/TeamList';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { useFetch } from '../../hooks/useFetch';
import { teamService } from '../../services/teamService';

export default function MyTeams() {
  const { data, loading, error, refetch } = useFetch(() => teamService.getMyTeams(), []);
  return <MainLayout><div className="page-heading"><h1>My teams</h1><p>Teams you own or have joined.</p></div>{loading ? <Loader /> : error ? <ErrorState message="Unable to load your teams." onRetry={refetch} /> : data?.length ? <TeamList teams={data} /> : <EmptyState title="You’re not part of a team yet." action={<Link to="/teams/search">Explore teams</Link>}>Discover a team or create one to get started.</EmptyState>}</MainLayout>;
}
