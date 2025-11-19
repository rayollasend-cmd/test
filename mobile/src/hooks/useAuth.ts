/**
 * Custom Hook: useAuth
 * Manages authentication state and operations
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout, restoreToken } from '../store/slices/authSlice';
import authService from '../services/authService';
import apiService from '../services/apiService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  /**
   * Login user
   */
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch(loginStart());
        const response = await authService.login({ email, password });
        dispatch(loginSuccess({
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        }));
        return response;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Login failed';
        dispatch(loginFailure(message));
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Register user
   */
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      try {
        dispatch(loginStart());
        const response = await authService.register({
          email,
          password,
          firstName,
          lastName,
        });
        dispatch(loginSuccess({
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        }));
        return response;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Registration failed';
        dispatch(loginFailure(message));
        throw err;
      }
    },
    [dispatch]
  );

  /**
   * Logout user
   */
  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (err) {
      console.error('Logout error:', err);
      // Still logout locally even if server request fails
      dispatch(logout());
    }
  }, [dispatch]);

  /**
   * Restore auth token from storage
   */
  const restoreAuthToken = useCallback(async () => {
    try {
      const token = await apiService.storeToken('', '');
      if (token) {
        const isValid = await authService.validateToken();
        if (isValid) {
          dispatch(restoreToken({
            token,
            user: {
              id: 'user_id',
              email: 'user@example.com',
              firstName: 'User',
              lastName: 'Name',
            },
          }));
        }
      }
    } catch (err) {
      console.error('Error restoring token:', err);
    }
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout: handleLogout,
    restoreAuthToken,
  };
};
