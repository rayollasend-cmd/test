// src/hooks/useAuth.js - Custom hook for authentication

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  restoreToken
} from '../store/slices/authSlice';
import { selectIsAuthenticated, selectUser, selectAuthLoading } from '../store/selectors/authSelectors';

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);

  const login = async (email, password) => {
    dispatch(loginStart());
    try {
      const result = await authService.login({ email, password });
      dispatch(loginSuccess(result));
      navigate('/dashboard');
      return result;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(message));
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch(registerStart());
    try {
      const result = await authService.register(userData);
      dispatch(registerSuccess(result));
      navigate('/login');
      return result;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch(registerFailure(message));
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(logout());
      navigate('/');
    }
  };

  const restoreAuthToken = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch(restoreToken({ token, user: JSON.parse(user) }));
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout: handleLogout,
    restoreAuthToken
  };
}

export default useAuth;
