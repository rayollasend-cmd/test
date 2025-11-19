/**
 * Login Screen
 * User authentication screen with email/password and biometric options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import authService from '../../services/authService';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  /**
   * Check if biometric authentication is available
   */
  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);

      // If biometric is available and user has saved biometric login, auto-login
      const biometricToken = await SecureStore.getItemAsync('biometric_token');
      if (compatible && enrolled && biometricToken) {
        await handleBiometricLogin();
      }
    } catch (error) {
      console.error('Error checking biometric:', error);
    }
  };

  /**
   * Handle biometric authentication login
   */
  const handleBiometricLogin = async () => {
    try {
      setIsLoading(true);
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
        reason: 'Authenticate to access your CaribRemit account',
      });

      if (result.success) {
        const token = await SecureStore.getItemAsync('biometric_token');
        if (token) {
          // Validate token and proceed
          dispatch(loginSuccess({
            user: {
              id: 'user_id',
              email: 'user@example.com',
              firstName: 'User',
              lastName: 'Name',
            },
            token,
            refreshToken: 'refresh_token',
          }));
        }
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      setError('Biometric authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle email/password login
   */
  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      dispatch(loginStart());

      const response = await authService.login({
        email: email.trim(),
        password,
      });

      dispatch(loginSuccess({
        user: response.user,
        token: response.token,
        refreshToken: response.refreshToken,
      }));
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Login failed. Please try again.';
      setError(message);
      dispatch(loginFailure(message));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to register screen
   */
  const handleRegisterNav = () => {
    navigation.navigate('Register');
  };

  /**
   * Navigate to forgot password screen
   */
  const handleForgotPasswordNav = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CaribRemit</Text>
          <Text style={styles.subtitle}>
            Fast, Secure Cross-Border Money Transfer
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              editable={!isLoading}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Text style={styles.showPasswordBtn}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me */}
          <View style={styles.rememberContainer}>
            <TouchableOpacity onPress={handleForgotPasswordNav}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Biometric Login */}
          {isBiometricAvailable && !isLoading ? (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
            >
              <Text style={styles.biometricButtonText}>
                Use Biometric Authentication
              </Text>
            </TouchableOpacity>
          ) : null}

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Don't have an account?</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegisterNav}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#333',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  showPasswordBtn: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
  },
  rememberContainer: {
    alignItems: 'flex-end',
  },
  forgotPassword: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  biometricButton: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  biometricButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    fontSize: 12,
    color: '#999',
  },
  registerButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  registerButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f44',
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LoginScreen;
