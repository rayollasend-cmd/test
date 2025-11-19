/**
 * Redux User Slice
 * Handles user profile and settings
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  profilePicture?: string;
  country: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  preferredCurrency: string;
  language: string;
  notificationsEnabled: boolean;
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.isLoading = false;
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    updatePreferences: (
      state,
      action: PayloadAction<{
        notificationsEnabled?: boolean;
        biometricEnabled?: boolean;
        twoFactorEnabled?: boolean;
        language?: string;
        preferredCurrency?: string;
      }>
    ) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfile,
  updatePreferences,
  clearProfile,
} = userSlice.actions;

export default userSlice.reducer;
