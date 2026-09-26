import api from './api';

export const profileService = {
  getMyProfile: () => api.get('/profile/me'),
  updateProfile: (data) => api.put('/profile/me', data),
  linkGithub: (githubUrl) => api.post('/profile/link-github', { githubUrl }),
  updateSkills: (skills) => api.put('/profile/skills', { skills }),
};
