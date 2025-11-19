// src/services/transactionService.js - Transaction API service

import api from './api';

const transactionService = {
  /**
   * Get transfer quote
   */
  getQuote: async (recipientId, amount, sendCurrency, receiveCurrency) => {
    const response = await api.post('/transactions/quote', {
      recipientId,
      amount,
      sendCurrency,
      receiveCurrency
    });
    return response.data.quote;
  },

  /**
   * Initiate transfer
   */
  initiateTransfer: async (recipientId, amount, paymentMethod) => {
    const response = await api.post('/transactions/initiate', {
      recipientId,
      amount,
      paymentMethod
    });
    return response.data;
  },

  /**
   * Get all transactions
   */
  getTransactions: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/transactions?${params.toString()}`);
    return response.data;
  },

  /**
   * Get transaction details
   */
  getTransaction: async (transactionId) => {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data.transaction;
  },

  /**
   * Cancel transaction
   */
  cancelTransaction: async (transactionId, reason = '') => {
    const response = await api.post(`/transactions/${transactionId}/cancel`, { reason });
    return response.data;
  },

  /**
   * Track transfer
   */
  trackTransfer: async (transactionId) => {
    const response = await api.get(`/transactions/${transactionId}/track`);
    return response.data;
  }
};

export default transactionService;
