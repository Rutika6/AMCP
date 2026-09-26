import api from './api';

export const requestService = {
  applyToTeam: (teamId, message) =>
    api.post(`/teams/${teamId}/requests`, { message }),
  getRequestsForTeam: (teamId) => api.get(`/teams/${teamId}/requests`),
  respondToRequest: (requestId, status) =>
    // status: 'ACCEPTED' | 'REJECTED'
    api.put(`/requests/${requestId}`, { status }),
  getMyApplications: () => api.get('/requests/mine'),
};
