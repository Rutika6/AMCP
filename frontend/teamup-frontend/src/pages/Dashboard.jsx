import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import TeamList from '../components/team/TeamList';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { useFetch } from '../hooks/useFetch';
import { teamService } from '../services/teamService';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: myTeams, loading } = useFetch(() => teamService.getMyTeams(), []);

  return (
    <MainLayout>
      <h1>Welcome back, {user?.name}</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 10px' }}>
        <h2 style={{ margin: 0 }}>My Teams</h2>
        <Link to="/teams/create"><Button>+ Create Team</Button></Link>
      </div>

      {loading ? <Loader /> : <TeamList teams={myTeams} />}

      <div style={{ marginTop: 20 }}>
        <Link to="/teams/search">Browse all teams →</Link>
      </div>
    </MainLayout>
  );
}
