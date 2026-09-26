import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import TeamForm from '../../components/team/TeamForm';
import Loader from '../../components/common/Loader';
import { teamService } from '../../services/teamService';

export default function EditTeam() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    teamService.getTeamById(teamId).then((res) => setTeam(res.data));
  }, [teamId]);

  const handleUpdate = async (teamData) => {
    await teamService.updateTeam(teamId, teamData);
    navigate(`/teams/${teamId}`);
  };

  if (!team) return (
    <MainLayout>
      <Loader />
    </MainLayout>
  );

  return (
    <MainLayout>
      <h1>Edit Team</h1>
      <div className="card">
        <TeamForm
          initialValues={{
            name: team.name,
            description: team.description,
            maxMembers: team.maxMembers,
            skillsNeeded: (team.skillsNeeded || []).join(', '),
          }}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
      </div>
    </MainLayout>
  );
}
