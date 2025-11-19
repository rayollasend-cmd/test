// src/store/slices/uiSlice.js - UI Redux slice

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  notifications: [],
  modals: {
    sendMoney: false,
    addRecipient: false,
    topUp: false,
    confirmDelete: false
  },
  sidebarOpen: true,
  theme: 'light'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toggle dark mode
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', state.isDarkMode);
    },

    // Add notification
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: 'info',
        duration: 3000,
        ...action.payload
      };
      state.notifications.push(notification);
    },

    // Remove notification
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    // Clear notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Open modal
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },

    // Close modal
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },

    // Toggle sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Set theme
    setTheme: (state, action) => {
      state.theme = action.payload;
    }
  }
});

export const {
  toggleDarkMode,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  toggleSidebar,
  setTheme
} = uiSlice.actions;

export default uiSlice.reducer;
