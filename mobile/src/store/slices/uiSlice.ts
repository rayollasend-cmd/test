/**
 * Redux UI Slice
 * Handles UI state (loading, toasts, modals)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface UIState {
  isDarkMode: boolean;
  isLoading: boolean;
  toasts: Toast[];
  activeModal: string | null;
}

const initialState: UIState = {
  isDarkMode: false,
  isLoading: false,
  toasts: [],
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action: PayloadAction<Toast>) => {
      const id = action.payload.id || Date.now().toString();
      state.toasts.push({ ...action.payload, id });

      // Auto-remove toast after duration
      if (action.payload.duration) {
        setTimeout(() => {
          state.toasts = state.toasts.filter((t) => t.id !== id);
        }, action.payload.duration);
      }
    },
    hideToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  setLoading,
  showToast,
  hideToast,
  clearToasts,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
