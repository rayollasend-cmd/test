/**
 * Deep linking configuration for React Navigation
 */

export const linking = {
  prefixes: ['caribremit://', 'https://caribremit.com'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      ForgotPassword: 'forgot-password',
      Dashboard: 'dashboard',
      SendMoney: 'send-money',
      TransactionDetail: 'transactions/:id',
      Wallet: 'wallet',
      Bills: 'bills',
      Crypto: 'crypto',
      Settings: 'settings',
      Profile: 'profile',
      Help: 'help',
      Loyalty: 'loyalty',
      NotFound: '*',
    },
  },
};
