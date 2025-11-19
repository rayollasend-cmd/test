/**
 * Root Navigation Navigator
 * Handles auth and main app navigation stacks
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Screens - Auth Stack
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Screens - App Stack (Bottom Tab)
import DashboardScreen from '../screens/app/DashboardScreen';
import SendMoneyScreen from '../screens/app/SendMoneyScreen';
import WalletScreen from '../screens/app/WalletScreen';
import BillsScreen from '../screens/app/BillsScreen';
import SettingsScreen from '../screens/app/SettingsScreen';

// Screens - Detail Screens
import TransactionDetailScreen from '../screens/app/TransactionDetailScreen';
import CryptoTradingScreen from '../screens/app/CryptoTradingScreen';
import LoyaltyScreen from '../screens/app/LoyaltyScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Authentication Stack
 * Shown when user is not authenticated
 */
const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

/**
 * Main App Stack with Bottom Tab Navigation
 * Shown when user is authenticated
 */
const AppStack: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SendMoney') {
            iconName = focused ? 'send' : 'send-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Bills') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="SendMoney"
        component={SendMoneyScreen}
        options={{ title: 'Send' }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ title: 'Wallet' }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsScreen}
        options={{ title: 'Bills' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

/**
 * Main Navigator
 * Routes between Auth and App stacks based on authentication state
 */
export const RootNavigator: React.FC = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: '#fff' },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Group screenOptions={{ animationEnabled: true }}>
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{ animationEnabled: false }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group screenOptions={{ animationEnabled: true }}>
          <Stack.Screen
            name="AppStack"
            component={AppStack}
            options={{ animationEnabled: false }}
          />
          {/* Modal screens */}
          <Stack.Group
            screenOptions={{
              presentation: 'modal',
              headerShown: true,
              headerBackTitleVisible: false,
            }}
          >
            <Stack.Screen
              name="TransactionDetail"
              component={TransactionDetailScreen}
              options={{ title: 'Transaction Details' }}
            />
            <Stack.Screen
              name="Crypto"
              component={CryptoTradingScreen}
              options={{ title: 'Cryptocurrency' }}
            />
            <Stack.Screen
              name="Loyalty"
              component={LoyaltyScreen}
              options={{ title: 'Loyalty Rewards' }}
            />
          </Stack.Group>
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
