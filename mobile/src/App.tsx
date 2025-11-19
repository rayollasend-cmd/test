/**
 * CaribRemit Mobile App
 * Main application root component
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { configureStore } from '@reduxjs/toolkit';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';

// Store and slices
import authReducer from './store/slices/authSlice';
import transactionReducer from './store/slices/transactionSlice';
import userReducer from './store/slices/userSlice';
import walletReducer from './store/slices/walletSlice';
import uiReducer from './store/slices/uiSlice';

// Navigation
import RootNavigator from './navigation/RootNavigator';
import { linking } from './navigation/linking';

// Services
import { notificationService } from './services/notificationService';
import { analyticsService } from './services/analyticsService';
import { useAuth } from './hooks/useAuth';

// Theme
import { config } from '@gluestack-ui/config';
import theme from './theme';

// Configure Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    user: userReducer,
    wallets: walletReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['ui/showToast'],
        ignoredPaths: ['ui.toastData']
      }
    })
});

// App wrapper component for hooks
const AppContent: React.FC = () => {
  const { restoreAuthToken } = useAuth();
  const navigationRef = React.useRef(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Restore authentication token
    await restoreAuthToken();

    // Initialize push notifications
    await initializePushNotifications();

    // Initialize analytics
    await analyticsService.initialize();

    // Setup Firebase Cloud Messaging
    setupFCM();
  };

  const initializePushNotifications = async () => {
    try {
      const hasPermission = await notificationService.requestPermission();

      if (hasPermission) {
        const fcmToken = await notificationService.getFCMToken();
        console.log('FCM Token:', fcmToken);

        // Send token to backend
        // await userService.updateFCMToken(fcmToken);
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  };

  const setupFCM = () => {
    // Listen to foreground messages
    notificationService.onMessageReceived((remoteMessage) => {
      handleNotification(remoteMessage);
    });

    // Listen to notification opened while app is in background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage?.data?.link) {
        handleDeepLink(remoteMessage.data.link);
      }
    });

    // Listen to notification opened from quit
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage?.data?.link) {
          handleDeepLink(remoteMessage.data.link);
        }
      });
  };

  const handleNotification = (remoteMessage: any) => {
    console.log('Notification received:', remoteMessage);

    // Log notification event
    analyticsService.logEvent('notification_received', {
      title: remoteMessage.notification?.title,
      type: remoteMessage.data?.type
    });

    // Handle specific notification types
    const notificationType = remoteMessage.data?.type;

    switch (notificationType) {
      case 'transfer_completed':
        // Handle transfer completed
        break;
      case 'transfer_failed':
        // Handle transfer failed
        break;
      case 'payment_received':
        // Handle payment received
        break;
      case 'promo':
        // Handle promotional notification
        break;
      default:
        break;
    }
  };

  const handleDeepLink = (url: string) => {
    console.log('Deep link received:', url);

    if (navigationRef.current) {
      // Parse and handle deep link
      navigationRef.current.navigate(url);
    }
  };

  const navigationLog = React.useCallback(
    async (state) => {
      const route = state.routes[state.index];
      const routeName = route.name;

      // Log screen view
      await analytics().logScreenView({
        screen_name: routeName,
        screen_class: routeName
      });

      console.log(`Screen: ${routeName}`);
    },
    []
  );

  return (
    <SafeAreaProvider>
      <GluestackUIProvider config={config}>
        <NavigationContainer
          ref={navigationRef}
          linking={linking}
          onStateChange={navigationLog}
          fallback={<LoadingScreen />}
        >
          <RootNavigator />
        </NavigationContainer>

        {/* Status bar */}
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
};

/**
 * Loading screen shown while app initializes
 */
const LoadingScreen: React.FC = () => {
  return (
    <GluestackUIProvider config={config}>
      <Box flex={1} justifyContent="center" alignItems="center" bg="$white">
        <Spinner size="large" color="$primary500" />
      </Box>
    </GluestackUIProvider>
  );
};

/**
 * Root App component
 */
export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

// Required imports for components
import { Box, Spinner } from '@gluestack-ui/themed';
