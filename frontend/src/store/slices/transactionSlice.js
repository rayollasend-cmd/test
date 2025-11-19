// src/store/slices/transactionSlice.js - Transaction Redux slice

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  currentTransaction: null,
  quote: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    dateRange: '30days'
  }
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Fetch transactions
    fetchTransactionsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action) => {
      state.transactions = action.payload;
      state.isLoading = false;
    },
    fetchTransactionsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get quote
    getQuoteStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getQuoteSuccess: (state, action) => {
      state.quote = action.payload;
      state.isLoading = false;
    },
    getQuoteFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Initiate transfer
    initiateTransferStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    initiateTransferSuccess: (state, action) => {
      state.currentTransaction = action.payload;
      state.transactions.unshift(action.payload);
      state.isLoading = false;
    },
    initiateTransferFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get transaction details
    fetchTransactionStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTransactionSuccess: (state, action) => {
      state.currentTransaction = action.payload;
      state.isLoading = false;
    },
    fetchTransactionFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear quote
    clearQuote: (state) => {
      state.quote = null;
    }
  }
});

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  getQuoteStart,
  getQuoteSuccess,
  getQuoteFailure,
  initiateTransferStart,
  initiateTransferSuccess,
  initiateTransferFailure,
  fetchTransactionStart,
  fetchTransactionSuccess,
  fetchTransactionFailure,
  setFilters,
  clearQuote
} = transactionSlice.actions;

export default transactionSlice.reducer;
