// src/services/api.js - Axios API client

import axios from 'axios';
import store from '../store/store';
import { logout } from '../store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - logout user
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
