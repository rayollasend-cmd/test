/**
 * Redux Wallet Slice
 * Handles wallet and balance state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  availableBalance: number;
  ledgerBalance: number;
  createdAt: string;
  updatedAt: string;
}

interface WalletState {
  wallets: Wallet[];
  selectedWalletId: string | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
}

const initialState: WalletState = {
  wallets: [],
  selectedWalletId: null,
  isLoading: false,
  error: null,
  lastUpdated: 0,
};

const walletSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    fetchWalletsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchWalletsSuccess: (state, action: PayloadAction<Wallet[]>) => {
      state.wallets = action.payload;
      state.isLoading = false;
      state.lastUpdated = Date.now();
      // Select first wallet by default
      if (action.payload.length > 0 && !state.selectedWalletId) {
        state.selectedWalletId = action.payload[0].id;
      }
    },
    fetchWalletsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectWallet: (state, action: PayloadAction<string>) => {
      state.selectedWalletId = action.payload;
    },
    updateBalance: (
      state,
      action: PayloadAction<{
        walletId: string;
        balance: number;
        availableBalance: number;
      }>
    ) => {
      const wallet = state.wallets.find((w) => w.id === action.payload.walletId);
      if (wallet) {
        wallet.balance = action.payload.balance;
        wallet.availableBalance = action.payload.availableBalance;
        state.lastUpdated = Date.now();
      }
    },
    addWallet: (state, action: PayloadAction<Wallet>) => {
      state.wallets.push(action.payload);
    },
    removeWallet: (state, action: PayloadAction<string>) => {
      state.wallets = state.wallets.filter((w) => w.id !== action.payload);
      if (state.selectedWalletId === action.payload) {
        state.selectedWalletId =
          state.wallets.length > 0 ? state.wallets[0].id : null;
      }
    },
  },
});

export const {
  fetchWalletsStart,
  fetchWalletsSuccess,
  fetchWalletsFailure,
  selectWallet,
  updateBalance,
  addWallet,
  removeWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
