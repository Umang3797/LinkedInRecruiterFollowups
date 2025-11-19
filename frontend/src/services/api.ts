import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Profile {
  id: number;
  linkedin_url: string;
  name: string | null;
  company: string | null;
  position: string | null;
  status: string;
  connection_request_sent: boolean;
  connection_accepted: boolean;
  connection_request_attempts: number;
  created_at: string;
  updated_at: string;
  last_message_sent: string | null;
}

export interface MessageTemplate {
  key: string;
  value: string;
}

export const profilesApi = {
  getAll: () => api.get<Profile[]>('/profiles'),
  getById: (id: number) => api.get<Profile>(`/profiles/${id}`),
  add: (profiles: string) => api.post('/profiles', { profiles }),
  update: (id: number, status: string) => api.patch(`/profiles/${id}`, { status }),
  delete: (id: number) => api.delete(`/profiles/${id}`),
};

export const messagesApi = {
  getTemplates: () => api.get<MessageTemplate[]>('/messages/templates'),
  updateTemplate: (key: string, value: string) => api.put(`/messages/templates/${key}`, { value }),
  getByProfile: (profileId: number) => api.get(`/messages/profile/${profileId}`),
};

export const automationApi = {
  getStatus: () => api.get<{ isLoggedIn: boolean }>('/automation/status'),
  login: (email?: string, password?: string) => api.post('/automation/login', { email, password }),
  logout: () => api.post('/automation/logout'),
  sendFollowUp: (profileId: number, messageType: string) => 
    api.post(`/automation/followup/${profileId}`, { messageType }),
};

export default api;

