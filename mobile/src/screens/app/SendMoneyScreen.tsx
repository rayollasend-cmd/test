/**
 * Send Money Screen
 * Cross-border money transfer screen
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SendMoneyScreenProps {
  navigation: any;
}

const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Send Money</Text>
        <Text style={styles.subtitle}>Fast & Secure Transfers</Text>
      </View>

      {step === 1 ? (
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient</Text>
            <TextInput
              style={styles.input}
              placeholder="Search or select recipient"
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount (USD)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.quoteBox}>
            <View style={styles.quoteRow}>
              <Text style={styles.quoteLabel}>Exchange Rate</Text>
              <Text style={styles.quoteValue}>1 USD = 150.25 JMD</Text>
            </View>
            <View style={styles.quoteRow}>
              <Text style={styles.quoteLabel}>Fee</Text>
              <Text style={styles.quoteValue}>$10.00</Text>
            </View>
            <View style={[styles.quoteRow, styles.quoteBorder]}>
              <Text style={styles.quoteLabel}>You Send</Text>
              <Text style={styles.quoteValue}>${amount || '0.00'}</Text>
            </View>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={() => setStep(1)}>
              <Text style={[styles.buttonText, styles.outlineButtonText]}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
              <Text style={styles.buttonText}>Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 30 },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  form: { paddingHorizontal: 20, gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#333' },
  input: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#e0e0e0', fontSize: 16 },
  quoteBox: { backgroundColor: '#fff', borderRadius: 8, padding: 16, gap: 12 },
  quoteRow: { flexDirection: 'row', justifyContent: 'space-between' },
  quoteBorder: { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 12 },
  quoteLabel: { fontSize: 14, color: '#666' },
  quoteValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  button: { backgroundColor: '#FF6B6B', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonGroup: { flexDirection: 'row', gap: 12 },
  outlineButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#FF6B6B' },
  outlineButtonText: { color: '#FF6B6B' },
});

export default SendMoneyScreen;
