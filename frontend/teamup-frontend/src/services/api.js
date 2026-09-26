import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('teamup_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('teamup_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
