export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
  CREATE_TEAM: '/teams/create',
  TEAM_DETAILS: '/teams/:teamId',
  SEARCH_TEAMS: '/teams/search',
  MANAGE_REQUESTS: '/teams/:teamId/requests',
  NOTIFICATIONS: '/notifications',
};
