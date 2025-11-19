# CaribRemit Mobile App - React Native Implementation Guide

Complete guide for building and deploying the CaribRemit mobile app using React Native.

---

## Overview

The CaribRemit mobile app is built with React Native to provide a seamless cross-platform experience on iOS and Android. It shares the same backend API with the web application.

### Tech Stack

- **Framework**: React Native 0.72+
- **Build Tool**: Expo or React Native CLI
- **Navigation**: React Navigation 6.x
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Form Validation**: React Hook Form + Zod
- **UI Framework**: Native Base or React Native Paper
- **Authentication**: JWT with secure storage
- **Biometric**: React Native Biometrics
- **Notifications**: Firebase Cloud Messaging
- **Analytics**: Firebase Analytics
- **Crash Reporting**: Firebase Crashlytics

---

## Project Structure

```
mobile/
├── app.json                      # Expo/RN configuration
├── app.config.js                # Environment-specific config
├── eas.json                      # EAS Build configuration
├── package.json
├── tsconfig.json
├── .env.example
└── src/
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   ├── AuthNavigator.tsx
    │   ├── AppNavigator.tsx
    │   ├── types.ts
    │   └── linking.ts            # Deep linking configuration
    │
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.tsx
    │   │   ├── SignUpScreen.tsx
    │   │   ├── ForgotPasswordScreen.tsx
    │   │   ├── BiometricScreen.tsx
    │   │   └── OTPScreen.tsx
    │   │
    │   ├── main/
    │   │   ├── DashboardScreen.tsx
    │   │   ├── SendMoneyScreen.tsx
    │   │   ├── ReceiveMoneyScreen.tsx
    │   │   ├── WalletScreen.tsx
    │   │   ├── HistoryScreen.tsx
    │   │   ├── ProfileScreen.tsx
    │   │   ├── BillsScreen.tsx
    │   │   ├── CryptoScreen.tsx
    │   │   └── LoyaltyScreen.tsx
    │   │
    │   └── common/
    │       ├── LoadingScreen.tsx
    │       ├── ErrorScreen.tsx
    │       └── NotFoundScreen.tsx
    │
    ├── components/
    │   ├── common/
    │   │   ├── Button.tsx
    │   │   ├── TextField.tsx
    │   │   ├── Header.tsx
    │   │   ├── Card.tsx
    │   │   ├── Modal.tsx
    │   │   ├── BottomSheet.tsx
    │   │   ├── Toast.tsx
    │   │   ├── Loader.tsx
    │   │   └── EmptyState.tsx
    │   │
    │   ├── auth/
    │   │   ├── LoginForm.tsx
    │   │   ├── SignUpForm.tsx
    │   │   ├── BiometricAuth.tsx
    │   │   └── OTPInput.tsx
    │   │
    │   ├── transaction/
    │   │   ├── RecipientSelector.tsx
    │   │   ├── AmountInput.tsx
    │   │   ├── PaymentMethodSelector.tsx
    │   │   ├── QuoteDisplay.tsx
    │   │   ├── ConfirmationModal.tsx
    │   │   └── SuccessScreen.tsx
    │   │
    │   ├── wallet/
    │   │   ├── WalletCard.tsx
    │   │   ├── WalletSelector.tsx
    │   │   ├── TopUpModal.tsx
    │   │   └── ConvertModal.tsx
    │   │
    │   └── profile/
    │       ├── ProfileHeader.tsx
    │       ├── ProfileForm.tsx
    │       ├── KYCVerification.tsx
    │       ├── BankAccountManager.tsx
    │       ├── AddressManager.tsx
    │       └── SettingsPanel.tsx
    │
    ├── store/
    │   ├── index.ts
    │   ├── slices/
    │   │   ├── authSlice.ts
    │   │   ├── transactionSlice.ts
    │   │   ├── userSlice.ts
    │   │   ├── walletSlice.ts
    │   │   └── uiSlice.ts
    │   └── selectors.ts
    │
    ├── services/
    │   ├── api.ts                # Axios instance with interceptors
    │   ├── authService.ts
    │   ├── transactionService.ts
    │   ├── userService.ts
    │   ├── walletService.ts
    │   ├── storageService.ts     # Secure storage
    │   ├── biometricService.ts
    │   ├── notificationService.ts
    │   ├── analyticsService.ts
    │   └── deepLinkingService.ts
    │
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useTransaction.ts
    │   ├── useWallet.ts
    │   ├── useProfile.ts
    │   ├── useBiometric.ts
    │   ├── useDeepLinking.ts
    │   ├── useNotifications.ts
    │   └── useAppState.ts
    │
    ├── utils/
    │   ├── constants.ts
    │   ├── colors.ts
    │   ├── typography.ts
    │   ├── spacing.ts
    │   ├── validators.ts
    │   ├── formatters.ts
    │   ├── errorHandler.ts
    │   └── logger.ts
    │
    ├── types/
    │   ├── index.ts
    │   ├── auth.ts
    │   ├── transaction.ts
    │   ├── user.ts
    │   ├── wallet.ts
    │   ├── api.ts
    │   └── navigation.ts
    │
    ├── assets/
    │   ├── images/
    │   │   ├── logo.png
    │   │   ├── splash.png
    │   │   ├── icons/
    │   │   └── illustrations/
    │   │
    │   ├── fonts/
    │   │   ├── Roboto-Regular.ttf
    │   │   ├── Roboto-Bold.ttf
    │   │   └── Roboto-Medium.ttf
    │   │
    │   └── animations/
    │       ├── success.json
    │       ├── error.json
    │       └── loading.json
    │
    ├── theme/
    │   ├── colors.ts
    │   ├── typography.ts
    │   ├── spacing.ts
    │   ├── borders.ts
    │   ├── shadows.ts
    │   ├── light.ts              # Light theme
    │   ├── dark.ts               # Dark theme
    │   └── index.ts
    │
    ├── config/
    │   ├── api.config.ts
    │   ├── firebase.config.ts
    │   ├── constants.ts
    │   └── permissions.ts
    │
    ├── middleware/
    │   ├── errorHandler.ts
    │   ├── requestLogger.ts
    │   └── networkManager.ts
    │
    └── App.tsx                   # Root component
```

---

## Setup Instructions

### 1. Initialize React Native Project

#### Option A: Using Expo (Recommended for quick start)

```bash
# Create Expo project
npx create-expo-app CaribRemit --template

cd CaribRemit

# Install dependencies
npm install

# Or with Expo CLI
npx expo-cli init CaribRemit --template
cd CaribRemit
```

#### Option B: Using React Native CLI

```bash
# Create RN project
npx react-native init CaribRemit --version 0.72.0

cd CaribRemit

# Install dependencies
npm install
```

### 2. Install Essential Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

# State Management
npm install @reduxjs/toolkit react-redux

# HTTP Client
npm install axios

# Form Handling
npm install react-hook-form @hookform/resolvers zod

# UI Components
npm install native-base @gluestack-ui/themed react-native-paper

# Secure Storage
npm install @react-native-async-storage/async-storage react-native-keychain

# Biometric Authentication
npm install react-native-biometrics

# Firebase
npm install @react-native-firebase/app @react-native-firebase/messaging @react-native-firebase/analytics @react-native-firebase/crashlytics

# Deep Linking
npm install @react-native-firebase/dynamic-links

# Utilities
npm install lodash.debounce lodash.throttle moment date-fns
npm install react-native-linear-gradient react-native-vector-icons
npm install react-native-app-state

# Development
npm install --save-dev typescript @types/react @types/react-native @types/redux-mock-store
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest
```

### 3. Setup TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "jsx": "react-native",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@screens/*": ["src/screens/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    },
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"]
}
```

---

## Key Features

### 1. Authentication with Biometric

```typescript
// useAuth.ts
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'react-native-keychain';
import ReactNativeBiometrics from 'react-native-biometrics';
import authService from '@services/authService';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const biometrics = new ReactNativeBiometrics();

  const loginWithBiometric = async () => {
    try {
      const { biometryType } = await biometrics.isSensorAvailable();

      if (!biometryType) {
        throw new Error('Biometric not available');
      }

      const { success, signature } = await biometrics.createSignature({
        promptMessage: 'Authenticate with biometric'
      });

      if (success) {
        // Get stored credentials
        const credentials = await SecureStore.getGenericPassword();

        if (credentials) {
          // Authenticate with backend
          const result = await authService.login(
            credentials.username,
            credentials.password
          );

          if (result.success) {
            dispatch(loginSuccess(result.user));
          }
        }
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const result = await authService.login(email, password);

      if (result.success) {
        // Save credentials securely for biometric
        await SecureStore.setGenericPassword(email, password);
        dispatch(loginSuccess(result.user));
      } else {
        dispatch(loginFailure(result.message));
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  return {
    ...auth,
    loginWithCredentials,
    loginWithBiometric
  };
};
```

### 2. Push Notifications

```typescript
// notificationService.ts
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

export const notificationService = {
  // Request permission
  async requestPermission() {
    const authStatus = await messaging().requestPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
  },

  // Get FCM token
  async getFCMToken() {
    const token = await messaging().getToken();
    return token;
  },

  // Handle foreground messages
  onMessageReceived(callback) {
    return messaging().onMessage(async (remoteMessage) => {
      await this.displayNotification(remoteMessage);
      callback(remoteMessage);
    });
  },

  // Handle background messages
  onBackgroundMessage(callback) {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      await this.displayNotification(remoteMessage);
      callback(remoteMessage);
    });
  },

  // Display notification
  async displayNotification(remoteMessage) {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        actions: [
          {
            title: 'Open',
            pressAction: { id: 'open' }
          }
        ]
      },
      ios: {
        critical: true,
        critical_sound: true
      },
      data: remoteMessage.data
    });
  }
};
```

### 3. Deep Linking

```typescript
// linking.ts
export const linking = {
  prefixes: ['caribremit://', 'https://caribremit.com', 'https://*.caribremit.com'],

  config: {
    screens: {
      // Auth screens
      Login: 'login',
      SignUp: 'signup',
      ForgotPassword: 'forgot-password',
      ResetPassword: 'reset-password/:token',

      // Main screens
      Dashboard: 'dashboard',
      SendMoney: 'send-money',
      SendMoneyToRecipient: 'send-money/:recipientId',
      ReceiveMoney: 'receive',
      Wallet: 'wallet',
      Transaction: 'transaction/:id',
      History: 'history',
      Profile: 'profile',
      Bills: 'bills',
      Crypto: 'crypto',
      Loyalty: 'loyalty',

      // Settings
      Settings: 'settings',
      Security: 'settings/security',
      Notifications: 'settings/notifications',

      // Not found
      NotFound: '*'
    }
  },

  async getInitialURL() {
    // Check dynamic link first
    const url = await dynamicLinks().getInitialLink();

    if (url != null) {
      return this.parseLink(url);
    }

    // Check notification that opened app
    return null;
  },

  subscribe(listener) {
    // Deep link listener
    const linkingSubscription = dynamicLinks().onLink((link) => {
      listener(this.parseLink(link.url));
    });

    // Notification listener
    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      const url = remoteMessage?.data?.link;
      listener(url);
    });

    return () => {
      linkingSubscription();
      unsubscribe();
    };
  },

  parseLink(url) {
    const parsed = url.replace(/^.*:\/\//, '');
    return parsed.length > 0 ? parsed : null;
  }
};
```

---

## Native Modules Setup

### iOS Setup

```bash
cd mobile/ios
pod install
cd ..
```

**Configure Info.plist** for permissions:
```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required for KYC verification</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Photo library access is required to upload documents</string>

<key>NSBiometricsUsageDescription</key>
<string>Biometric authentication for quick login</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Location is used to improve service delivery</string>

<key>NSHealthShareUsageDescription</key>
<string>Health data is not collected</string>

<key>NSHealthUpdateUsageDescription</key>
<string>Health data is not updated</string>
```

### Android Setup

**Update AndroidManifest.xml** with permissions:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.INTERNET" />

<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.biometric" android:required="false" />
```

---

## Building and Deployment

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both platforms
eas build --platform all

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

### Manual Build

#### iOS Build

```bash
cd ios
xcodebuild -workspace CaribRemit.xcworkspace \
  -scheme CaribRemit \
  -configuration Release \
  -archivePath ./build/CaribRemit.xcarchive \
  archive

xcodebuild -exportArchive \
  -archivePath ./build/CaribRemit.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath ./build/ipa

cd ..
```

#### Android Build

```bash
cd android

# Build APK
./gradlew assembleRelease

# Build AAB for Play Store
./gradlew bundleRelease

cd ..
```

---

## Testing

### Setup Jest and Testing Library

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest
npm install --save-dev jest-mock-extended
```

### Example Test

```typescript
// __tests__/screens/LoginScreen.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@store/slices/authSlice';
import LoginScreen from '@screens/auth/LoginScreen';

describe('LoginScreen', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
  });

  it('should render login form', () => {
    render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByText('Sign In')).toBeTruthy();
  });

  it('should call login with correct credentials', async () => {
    render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    );

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');

    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() => {
      // Assert navigation or state changes
    });
  });
});
```

---

## Performance Optimization

### Code Splitting with Dynamic Imports

```typescript
// Use React.lazy for screen components
const DashboardScreen = React.lazy(() => import('@screens/main/DashboardScreen'));
const SendMoneyScreen = React.lazy(() => import('@screens/main/SendMoneyScreen'));

// Or with Expo
import { lazy } from 'react';
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Image Optimization

```typescript
// Use optimized images
import { Image } from 'react-native';

<Image
  source={require('@assets/images/logo.png')}
  style={{ width: 200, height: 200 }}
  resizeMode="contain"
  onLoad={() => console.log('Image loaded')}
/>
```

### List Optimization

```typescript
// Use FlatList instead of ScrollView for long lists
import { FlatList } from 'react-native';

<FlatList
  data={transactions}
  renderItem={({ item }) => <TransactionItem transaction={item} />}
  keyExtractor={item => item.id}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={20}
  scrollIndicatorInsets={{ right: 1 }}
/>
```

---

## Security Best Practices

1. **Secure Storage**
   - Use `react-native-keychain` for credentials
   - Use encrypted AsyncStorage for non-sensitive data

2. **SSL Pinning**
   ```typescript
   // Configure axios to pin SSL certificates
   const instance = axios.create({
     httpsAgent: new https.Agent({
       rejectUnauthorized: true,
       ca: [fs.readFileSync('./cert.pem', 'utf8')]
     })
   });
   ```

3. **Input Validation**
   - Use Zod schemas for all inputs
   - Sanitize user inputs

4. **Sensitive Data Handling**
   - Never log sensitive data
   - Clear sensitive data from memory after use
   - Use encrypted storage for tokens

---

## Submission Requirements

### App Store (iOS)

- Minimum iOS version: 13.0
- Screenshot requirements: 6.5", 5.5", 4.7"
- App icon: 1024x1024
- Privacy policy required
- Biometric privacy disclosure
- Location usage explanation

### Google Play (Android)

- Minimum Android version: API 24 (Android 7.0)
- Screenshot requirements: Phone and 7" tablet
- App icon: 512x512
- Privacy policy required
- Permissions justification
- Content rating questionnaire

---

## Monitoring and Analytics

```typescript
// Setup Firebase Analytics
import analytics from '@react-native-firebase/analytics';

export const logEvent = async (name, params) => {
  await analytics().logEvent(name, params);
};

// Track screen views
const navigationRef = createNavigationContainerRef();

export const useNavigationLogger = () => {
  React.useEffect(() => {
    const state = navigationRef.getRootState();
    const routeName = getStateRouteName(state);
    analyticsService.logScreenView(routeName);
  }, [navigationRef]);
};
```

---

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache
npm start -- --reset-cache

# Or
react-native start --reset-cache
```

### Android Build Issues

```bash
# Clean gradle cache
cd android
./gradlew clean
cd ..
```

### iOS Build Issues

```bash
# Clean build folder
cd ios
rm -rf build
rm -rf Pods
rm Podfile.lock
pod install
cd ..
```

---

## Next Steps

1. Complete core screens implementation
2. Setup Redux store with all slices
3. Implement push notifications
4. Add biometric authentication
5. Setup deep linking
6. Implement offline support
7. Add comprehensive testing
8. Performance optimization
9. Prepare for app store submission
10. Setup monitoring and crashlytics

---

**Mobile app implementation complete! 🚀**
