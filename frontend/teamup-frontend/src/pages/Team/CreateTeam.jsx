import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import TeamForm from '../../components/team/TeamForm';
import { teamService } from '../../services/teamService';

export default function CreateTeam() {
  const navigate = useNavigate();

  const handleCreate = async (teamData) => {
    const res = await teamService.createTeam(teamData);
    navigate(`/teams/${res.data.id}`);
  };

  return (
    <MainLayout>
      <h1>Create a Team</h1>
      <div className="card">
        <TeamForm onSubmit={handleCreate} submitLabel="Create Team" />
      </div>
    </MainLayout>
  );
}
