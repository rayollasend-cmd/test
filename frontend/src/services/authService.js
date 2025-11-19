// src/services/authService.js - Authentication API service

import api from './api';

const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  },

  /**
   * Refresh JWT token
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return response.data;
  },

  /**
   * Verify email
   */
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password
   */
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }
};

export default authService;
