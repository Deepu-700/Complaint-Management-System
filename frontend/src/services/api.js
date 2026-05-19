// services/api.js
// Centralized API service using Axios

import axios from 'axios';

// Base URL
// Uses environment variable in production
// Falls back to Render backend URL if env variable is missing

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://complaint-management-system-4bhi.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================
// Request Interceptor
// Automatically attach JWT token
// ==============================

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

// ==============================
// Response Interceptor
// Handle unauthorized errors
// ==============================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ==============================
// Auth APIs
// ==============================

export const authAPI = {
  register: (data) => api.post('/auth/register', data),

  login: (data) => api.post('/auth/login', data),

  getMe: () => api.get('/auth/me'),
};

// ==============================
// Complaint APIs
// ==============================

export const complaintAPI = {
  create: (data) => api.post('/complaints', data),

  getAll: (params) => api.get('/complaints', { params }),

  getById: (id) => api.get(`/complaints/${id}`),

  update: (id, data) =>
    api.put(`/complaints/${id}`, data),

  delete: (id) => api.delete(`/complaints/${id}`),

  getStats: () => api.get('/complaints/stats'),
};

// ==============================
// AI APIs
// ==============================

export const aiAPI = {
  analyze: (complaintId) =>
    api.post('/ai/analyze', { complaintId }),

  quickAnalyze: (data) =>
    api.post('/ai/quick-analyze', data),
};

export default api;