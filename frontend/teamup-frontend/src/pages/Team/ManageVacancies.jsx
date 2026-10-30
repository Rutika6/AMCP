import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { useFetch } from '../../hooks/useFetch';
import { teamService } from '../../services/teamService';

export default function ManageVacancies() {
  const { teamId } = useParams();
  const { data: team, loading, error, refetch } = useFetch(() => teamService.getTeamById(teamId), [teamId]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const setRecruiting = async (isRecruiting) => {
    setSaveError('');
    setSaving(true);
    try {
      await teamService.updateTeam(teamId, { isRecruiting });
      refetch();
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Unable to update vacancies.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <MainLayout><Loader /></MainLayout>;
  if (error || !team) return <MainLayout><ErrorState message="Unable to load this team." onRetry={refetch} /></MainLayout>;

  const vacancies = Math.max(0, team.maxMembers - (team.members?.length || 0));
  const recruiting = team.isRecruiting !== false;

  return (
    <MainLayout>
      <h1>Manage Team Vacancies</h1>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{team.name}</h2>
        <p><strong>Open vacancies:</strong> {vacancies}</p>
        <p><strong>Applications:</strong> {recruiting ? 'Open' : 'Closed'}</p>
        {saveError && <p className="error-text">{saveError}</p>}
        <Button disabled={saving} onClick={() => setRecruiting(!recruiting)}>
          {saving ? 'Saving...' : recruiting ? 'Close Applications' : 'Open Applications'}
        </Button>
        <div style={{ marginTop: 14 }}>
          <Link to={`/teams/${teamId}/edit`}>Edit capacity and required skills</Link>
        </div>
      </div>
      <Link to={`/teams/${teamId}`}>Back to team details</Link>
    </MainLayout>
  );
}
