// src/tests/authService.test.js - Auth service tests

import authService from '../services/authService';

describe('AuthService', () => {
  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890'
      };

      const result = await authService.register(userData);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(userData.email);
      expect(result.firstName).toBe(userData.firstName);
      expect(result.kycStatus).toBe('pending');
    });

    it('should fail if email is missing', async () => {
      const userData = {
        password: 'password123',
        firstName: 'John'
      };

      expect(() => authService.register(userData)).rejects.toThrow('Email and password are required');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await authService.login(credentials);

      expect(result).toHaveProperty('token');
      expect(result.user).toBeDefined();
    });

    it('should fail with invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      expect(() => authService.login(credentials)).rejects.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should refresh JWT token', async () => {
      const refreshToken = 'valid_refresh_token';

      const result = await authService.refreshToken(refreshToken);

      expect(result).toHaveProperty('token');
    });

    it('should fail with invalid refresh token', async () => {
      const refreshToken = 'invalid_token';

      expect(() => authService.refreshToken(refreshToken)).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      const result = await authService.logout(userId);

      expect(result.success).toBe(true);
    });
  });
});
