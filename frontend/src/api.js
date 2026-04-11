import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('verdict_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (name, pin) => api.post('/auth/login', { name, pin });
export const getMe = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');
export const getEntries = (params) => api.get('/entries', { params });
export const createEntry = (data) => api.post('/entries', data);
export const clearEntries = () => api.delete('/entries/clear');
export const getTodayStats = () => api.get('/stats/today');
export const getHaccpState = () => api.get('/haccp-state');
export const updateHaccpState = (state) => api.put('/haccp-state', { state });
export const getModuleProgress = () => api.get('/modules/progress');
export const completeModule = (id) => api.put(`/modules/${id}/complete`);
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);

export default api;
