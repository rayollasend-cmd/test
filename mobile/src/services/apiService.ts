/**
 * API Service
 * Handles all HTTP requests to the backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

class APIService {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired - attempt refresh
          await this.refreshToken();
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get stored JWT token from secure storage
   */
  private async getStoredToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      return token;
    } catch (error) {
      console.error('Error retrieving token from secure storage:', error);
      return null;
    }
  }

  /**
   * Store JWT token in secure storage
   */
  async storeToken(token: string, refreshToken: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('refresh_token', refreshToken);
      this.token = token;
    } catch (error) {
      console.error('Error storing token in secure storage:', error);
    }
  }

  /**
   * Refresh authentication token
   */
  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (!refreshToken) {
        return false;
      }

      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });

      if (response.data.token) {
        await this.storeToken(response.data.token, response.data.refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  /**
   * Clear authentication tokens
   */
  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('refresh_token');
      this.token = null;
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || 'An error occurred';
      console.error('API Error:', {
        status: error.response?.status,
        message,
        data: error.response?.data,
      });
    } else {
      console.error('Unknown error:', error);
    }
  }
}

export const apiService = new APIService();
export default apiService;
