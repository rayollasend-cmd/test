/**
 * Authentication Service
 * Handles user authentication operations
 */

import apiService from './apiService';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  token: string;
  refreshToken: string;
}

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        '/auth/login',
        credentials
      );
      // Store tokens
      await apiService.storeToken(response.token, response.refreshToken);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        '/auth/register',
        data
      );
      // Store tokens
      await apiService.storeToken(response.token, response.refreshToken);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
      await apiService.clearTokens();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear tokens anyway
      await apiService.clearTokens();
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await apiService.post('/auth/verify-email', { token });
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiService.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await apiService.post('/auth/reset-password', { token, password });
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Validate token
   */
  async validateToken(): Promise<boolean> {
    try {
      await apiService.get('/auth/validate');
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;
