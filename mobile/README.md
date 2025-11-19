# CaribRemit Mobile App

React Native mobile application for the CaribRemit cross-border money transfer platform.

## Features

- ✅ User authentication with biometric support
- ✅ Money transfers between accounts
- ✅ Wallet management and balance tracking
- ✅ Transaction history and filtering
- ✅ Bills payment
- ✅ Cryptocurrency trading
- ✅ Loyalty rewards program
- ✅ Push notifications
- ✅ Deep linking
- ✅ Offline support
- ✅ Dark mode support
- ✅ Multi-language support (coming soon)

## Tech Stack

- **Framework**: React Native 0.72+
- **Build Tool**: Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation 6.x
- **UI Components**: Gluestack UI / Native Base
- **Authentication**: JWT with Biometric
- **Backend**: Node.js/Express API
- **Database**: PostgreSQL (backend)

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 1.22.0
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode 14+ (for iOS development)
- Android: Android Studio (for Android development)

## Installation

### 1. Clone and Install Dependencies

```bash
cd mobile
npm install
# or
yarn install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_API_TIMEOUT=30000

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id

# App Configuration
REACT_APP_APP_NAME=CaribRemit
REACT_APP_ENVIRONMENT=development
```

### 3. Start Development Server

```bash
npm start
# or
expo start
```

Then select:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web preview

## Project Structure

```
src/
├── navigation/          # React Navigation setup
├── screens/            # Screen components
├── components/         # Reusable components
├── store/             # Redux store and slices
├── services/          # API and utility services
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── assets/            # Images, fonts, animations
├── theme/             # Theme configuration
├── config/            # App configuration
└── App.tsx            # Root component
```

## Key Flows

### Authentication Flow

1. User opens app
2. App checks for stored token
3. If valid token exists, restore session
4. If no token, show login screen
5. User can login with email/password or biometric
6. After successful login, store token securely
7. Redirect to dashboard

### Transaction Flow

1. User selects recipient
2. Enters amount and currency
3. System fetches exchange rate quote
4. User reviews fees and exchange rate
5. Selects payment method
6. Completes payment via Stripe/PayPal
7. Transaction is processed
8. User receives confirmation and receipt

### Push Notification Flow

1. App requests notification permission
2. System retrieves FCM token
3. Token is sent to backend
4. Backend triggers notification via Firebase Cloud Messaging
5. App receives notification (foreground or background)
6. Notification is displayed to user
7. User can tap to open related screen

## Building

### Development Build

```bash
# Using Expo
expo start

# Then press:
# i - for iOS simulator
# a - for Android emulator
# w - for web
```

### Production Build

#### iOS

```bash
eas build --platform ios

# Or with EAS Submit
eas submit --platform ios
```

#### Android

```bash
eas build --platform android

# Or with EAS Submit
eas submit --platform android
```

#### Both Platforms

```bash
eas build --platform all
```

## Testing

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
```

## Code Quality

### Lint Code

```bash
npm run lint
```

### Fix Linting Issues

```bash
npm run lint:fix
```

### Type Checking

```bash
npm run type-check
```

## Debugging

### Enable Redux DevTools

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: { /* reducers */ },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // Add Redux DevTools middleware
    )
});
```

### Enable React Native Debugger

```bash
# Install React Native Debugger
brew install react-native-debugger

# Start app in debug mode
npm start

# Press `d` to open debugger
```

### Console Logging

```typescript
// Use console for debugging
console.log('Debug message');
console.error('Error message');
console.warn('Warning message');

// Or use logger service
import logger from '@utils/logger';
logger.info('Info message');
logger.error('Error message');
```

## Performance Optimization

1. **Code Splitting**: Use dynamic imports for heavy screens
2. **Image Optimization**: Use optimized image formats (WebP)
3. **List Virtualization**: Use FlatList instead of ScrollView
4. **State Management**: Use Redux selectors to avoid unnecessary renders
5. **Memoization**: Use React.memo() for expensive components
6. **Bundle Size**: Monitor with `eas analytics`

## Security

- **Secure Storage**: Credentials stored in Keychain/Keystore
- **SSL Pinning**: Implemented for API requests
- **Biometric Auth**: Fingerprint/FaceID support
- **Token Management**: Automatic token refresh
- **Sensitive Data**: Cleared after logout
- **Encryption**: All network requests over HTTPS

## Troubleshooting

### Metro Bundler Issues

```bash
npm start -- --reset-cache
# or
watchman watch-del-all
npm start
```

### Android Emulator Issues

```bash
# Clear Android data
adb shell pm clear com.caribremit.app

# Restart emulator
adb shell cmd power syswrite
adb shell cmd power reboot
```

### iOS Simulator Issues

```bash
# Reset iOS simulator
xcrun simctl erase all

# Restart simulator
killall 'iPhone Simulator'
```

### Notification Issues

1. Check Firebase credentials
2. Ensure APK/IPA has correct bundle ID
3. Verify notification permissions granted
4. Check Firebase Cloud Messaging configuration

## Deployment

### App Store (iOS)

1. Update version in `app.json`
2. Build with EAS: `eas build --platform ios`
3. Submit: `eas submit --platform ios`
4. Complete review process
5. App goes live

### Google Play (Android)

1. Update version in `app.json`
2. Build with EAS: `eas build --platform android`
3. Submit: `eas submit --platform android`
4. Complete review process
5. App goes live

### Over-the-Air Updates

```bash
# Build and publish update
eas update

# Or target specific branch
eas update --branch production
```

## Documentation

See `/docs` directory for:
- [API Integration Guide](../API_INTEGRATION.md)
- [Payment Integration](../PAYMENT_INTEGRATION.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Architecture Overview](../DESIGN.md)

## Support

For issues and questions:
- GitHub Issues: [Create issue](https://github.com/your-repo/issues)
- Email: support@caribremit.com
- Documentation: https://docs.caribremit.com

## License

MIT License - See LICENSE file for details

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -am 'feat: add feature'`
3. Push to branch: `git push origin feature/name`
4. Submit pull request

---

**Ready to build the future of Caribbean remittances! 🚀**
