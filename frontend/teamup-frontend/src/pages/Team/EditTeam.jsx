import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import TeamForm from '../../components/team/TeamForm';
import Loader from '../../components/common/Loader';
import { teamService } from '../../services/teamService';
import { useAuth } from '../../hooks/useAuth';

export default function EditTeam() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    teamService
      .getTeamById(teamId)
      .then((res) => setTeam(res.data))
      .catch((err) => setLoadError(err.response?.data?.message || 'Unable to load this team.'));
  }, [teamId]);

  const handleUpdate = async (teamData) => {
    setSaveError('');
    setSaving(true);
    try {
      await teamService.updateTeam(teamId, teamData);
      navigate(`/teams/${teamId}`);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Unable to save team changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return (
    <MainLayout>
      <h1>Edit Team</h1>
      <p className="error-text">{loadError}</p>
    </MainLayout>
  );

  if (!team) return (
    <MainLayout>
      <Loader />
    </MainLayout>
  );

  if (team.ownerId !== user?.id) return (
    <MainLayout>
      <h1>Edit Team</h1>
      <p className="error-text">Only the team owner can edit this team.</p>
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
            isRecruiting: team.isRecruiting !== false,
          }}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
          submitting={saving}
          onCancel={() => navigate(`/teams/${teamId}`)}
        />
        {saveError && <p className="error-text">{saveError}</p>}
      </div>
    </MainLayout>
  );
}
