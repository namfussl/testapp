import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email, password, fullName) =>
    apiClient.post('/auth/register', { email, password, full_name: fullName }),
  
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  
  getCurrentUser: () =>
    apiClient.get('/auth/me'),
};

export const inviteService = {
  verifyInvite: (inviteToken) =>
    apiClient.get(`/invites/invite/${inviteToken}`),
  
  sendInvite: (email, role) =>
    apiClient.post('/invites/send-invite', { email, role }),
};

export const homeService = {
  getClientHome: () =>
    apiClient.get('/client-home'),
  
  getFeeEarnerHome: () =>
    apiClient.get('/fee-earner-home'),
};

export default apiClient;
