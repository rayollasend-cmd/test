/**
 * Forgot Password Screen
 * Password reset request screen
 */

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.resetButton, isLoading && styles.disabledButton]}
          disabled={isLoading}
        >
          <Text style={styles.resetButtonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 30 },
  backButton: { color: '#FF6B6B', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  form: { paddingHorizontal: 20, gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#333' },
  input: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#e0e0e0', fontSize: 16 },
  resetButton: { backgroundColor: '#FF6B6B', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  disabledButton: { opacity: 0.6 },
  resetButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default ForgotPasswordScreen;
