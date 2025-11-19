// src/store/slices/authSlice.js - Authentication Redux slice

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token')
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Register
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },

    // Update profile
    updateProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.isLoading = false;
    },
    updateProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Restore token
    restoreToken: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  restoreToken
} = authSlice.actions;

export default authSlice.reducer;
