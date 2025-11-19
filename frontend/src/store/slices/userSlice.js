// src/store/slices/userSlice.js - User Redux slice

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  wallets: [],
  recipients: [],
  addresses: [],
  bankAccounts: [],
  isLoading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Fetch profile
    fetchProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action) => {
      state.profile = action.payload;
      state.isLoading = false;
    },
    fetchProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update profile
    updateProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      state.isLoading = false;
    },
    updateProfileFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch wallets
    fetchWalletsStart: (state) => {
      state.isLoading = true;
    },
    fetchWalletsSuccess: (state, action) => {
      state.wallets = action.payload;
      state.isLoading = false;
    },
    fetchWalletsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch recipients
    fetchRecipientsStart: (state) => {
      state.isLoading = true;
    },
    fetchRecipientsSuccess: (state, action) => {
      state.recipients = action.payload;
      state.isLoading = false;
    },
    fetchRecipientsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Add recipient
    addRecipientStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addRecipientSuccess: (state, action) => {
      state.recipients.push(action.payload);
      state.isLoading = false;
    },
    addRecipientFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch addresses
    fetchAddressesStart: (state) => {
      state.isLoading = true;
    },
    fetchAddressesSuccess: (state, action) => {
      state.addresses = action.payload;
      state.isLoading = false;
    },
    fetchAddressesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Fetch bank accounts
    fetchBankAccountsStart: (state) => {
      state.isLoading = true;
    },
    fetchBankAccountsSuccess: (state, action) => {
      state.bankAccounts = action.payload;
      state.isLoading = false;
    },
    fetchBankAccountsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  fetchWalletsStart,
  fetchWalletsSuccess,
  fetchWalletsFailure,
  fetchRecipientsStart,
  fetchRecipientsSuccess,
  fetchRecipientsFailure,
  addRecipientStart,
  addRecipientSuccess,
  addRecipientFailure,
  fetchAddressesStart,
  fetchAddressesSuccess,
  fetchAddressesFailure,
  fetchBankAccountsStart,
  fetchBankAccountsSuccess,
  fetchBankAccountsFailure
} = userSlice.actions;

export default userSlice.reducer;
