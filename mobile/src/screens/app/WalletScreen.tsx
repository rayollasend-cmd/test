/**
 * Wallet Screen
 * Manage wallets and view balances
 */

import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WalletScreenProps {
  navigation: any;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation }) => {
  const wallets = [
    { id: '1', currency: 'USD', balance: 5230.50 },
    { id: '2', currency: 'JMD', balance: 150250 },
  ];

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wallets</Text>
      </View>

      <View style={styles.walletsList}>
        {wallets.map((wallet) => (
          <TouchableOpacity key={wallet.id} style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <Text style={styles.walletCurrency}>{wallet.currency}</Text>
              <Ionicons name="wallet" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.walletBalance}>
              {formatCurrency(wallet.balance, wallet.currency)}
            </Text>
            <View style={styles.walletActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Add Money</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Withdraw</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  walletsList: { paddingHorizontal: 20, gap: 16 },
  walletCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8 },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  walletCurrency: { fontSize: 18, fontWeight: '600', color: '#333' },
  walletBalance: { fontSize: 28, fontWeight: '700', color: '#FF6B6B', marginBottom: 16 },
  walletActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#FF6B6B', alignItems: 'center' },
  actionBtnText: { color: '#FF6B6B', fontSize: 12, fontWeight: '600' },
});

export default WalletScreen;
