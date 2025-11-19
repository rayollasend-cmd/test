/**
 * Redux Transaction Slice
 * Handles transaction state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Transaction {
  id: string;
  userId: string;
  type: 'transfer' | 'topup' | 'bill' | 'crypto';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  currency: string;
  recipientName?: string;
  recipientCountry?: string;
  exchangeRate?: number;
  fee: number;
  description?: string;
  createdAt: string;
  completedAt?: string;
}

interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  isLoading: boolean;
  error: string | null;
  filter: 'all' | 'completed' | 'pending' | 'failed';
  page: number;
  limit: number;
  hasMore: boolean;
}

const initialState: TransactionState = {
  transactions: [],
  selectedTransaction: null,
  isLoading: false,
  error: null,
  filter: 'all',
  page: 1,
  limit: 20,
  hasMore: true,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (
      state,
      action: PayloadAction<{
        transactions: Transaction[];
        hasMore: boolean;
      }>
    ) => {
      if (state.page === 1) {
        state.transactions = action.payload.transactions;
      } else {
        state.transactions = [
          ...state.transactions,
          ...action.payload.transactions,
        ];
      }
      state.hasMore = action.payload.hasMore;
      state.isLoading = false;
    },
    fetchTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setFilter: (
      state,
      action: PayloadAction<'all' | 'completed' | 'pending' | 'failed'>
    ) => {
      state.filter = action.payload;
      state.page = 1;
    },
    selectTransaction: (state, action: PayloadAction<Transaction>) => {
      state.selectedTransaction = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    updateTransaction: (
      state,
      action: PayloadAction<{
        transactionId: string;
        status: Transaction['status'];
      }>
    ) => {
      const transaction = state.transactions.find(
        (t) => t.id === action.payload.transactionId
      );
      if (transaction) {
        transaction.status = action.payload.status;
      }
    },
    nextPage: (state) => {
      state.page += 1;
    },
    resetTransactions: (state) => {
      state.transactions = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
});

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  setFilter,
  selectTransaction,
  addTransaction,
  updateTransaction,
  nextPage,
  resetTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
