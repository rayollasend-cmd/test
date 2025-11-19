// src/store/store.js - Redux store configuration

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import transactionReducer from './slices/transactionSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    user: userReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore dates and other non-serializable values
        ignoredActions: ['auth/loginSuccess', 'transactions/getQuoteSuccess'],
        ignoredPaths: ['transactions.currentTransaction.createdAt']
      }
    })
});

export default store;
