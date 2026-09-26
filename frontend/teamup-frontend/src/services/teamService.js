import api from './api';

export const teamService = {
  createTeam: (data) => api.post('/teams', data),
  updateTeam: (teamId, data) => api.put(`/teams/${teamId}`, data),
  deleteTeam: (teamId) => api.delete(`/teams/${teamId}`),
  getTeamById: (teamId) => api.get(`/teams/${teamId}`),
  getMyTeams: () => api.get('/teams/mine'),
  searchTeams: (filters) => api.get('/teams/search', { params: filters }),
};
