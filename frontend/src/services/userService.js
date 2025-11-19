// src/services/userService.js - User API service

import api from './api';

const userService = {
  /**
   * Get user profile
   */
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data.user;
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data.user;
  },

  /**
   * Add address
   */
  addAddress: async (addressData) => {
    const response = await api.post('/users/addresses', addressData);
    return response.data.address;
  },

  /**
   * Get addresses
   */
  getAddresses: async () => {
    const response = await api.get('/users/addresses');
    return response.data.addresses;
  },

  /**
   * Update address
   */
  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/users/addresses/${addressId}`, addressData);
    return response.data;
  },

  /**
   * Delete address
   */
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/users/addresses/${addressId}`);
    return response.data;
  },

  /**
   * Add bank account
   */
  addBankAccount: async (bankData) => {
    const response = await api.post('/users/bank-accounts', bankData);
    return response.data.account;
  },

  /**
   * Get bank accounts
   */
  getBankAccounts: async () => {
    const response = await api.get('/users/bank-accounts');
    return response.data.accounts;
  },

  /**
   * Delete bank account
   */
  deleteBankAccount: async (accountId) => {
    const response = await api.delete(`/users/bank-accounts/${accountId}`);
    return response.data;
  }
};

export default userService;
