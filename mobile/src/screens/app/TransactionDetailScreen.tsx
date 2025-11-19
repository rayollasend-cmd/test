/**
 * Transaction Detail Screen
 * View details of a specific transaction
 */

import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TransactionDetailScreenProps {
  navigation: any;
  route: any;
}

const TransactionDetailScreen: React.FC<TransactionDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const transaction = {
    id: route.params?.id || '1',
    type: 'transfer',
    status: 'completed',
    amount: 500,
    currency: 'USD',
    recipientName: 'John Doe',
    recipientCountry: 'Jamaica',
    exchangeRate: 150.25,
    fee: 10,
    description: 'Family support',
    createdAt: '2024-12-15T10:30:00Z',
    transactionId: 'TRX-2024-12-15-001',
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.statusCard}>
        <View
          style={[
            styles.statusIcon,
            transaction.status === 'completed' && styles.completedIcon,
          ]}
        >
          <Ionicons
            name={
              transaction.status === 'completed' ? 'checkmark-circle' : 'time'
            }
            size={48}
            color="#fff"
          />
        </View>
        <Text style={styles.statusText}>
          {transaction.status === 'completed' ? 'Completed' : 'Processing'}
        </Text>
        <Text style={styles.amount}>
          ${transaction.amount.toFixed(2)}
        </Text>
      </View>

      {/* Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction Details</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction ID</Text>
          <Text style={styles.detailValue}>{transaction.transactionId}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>
            {new Date(transaction.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Recipient</Text>
          <Text style={styles.detailValue}>{transaction.recipientName}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Country</Text>
          <Text style={styles.detailValue}>{transaction.recipientCountry}</Text>
        </View>
      </View>

      {/* Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amount Breakdown</Text>

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Amount Sent</Text>
          <Text style={styles.breakdownValue}>
            ${transaction.amount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Fee</Text>
          <Text style={styles.breakdownValue}>
            ${transaction.fee.toFixed(2)}
          </Text>
        </View>

        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Exchange Rate</Text>
          <Text style={styles.breakdownValue}>
            1 USD = {transaction.exchangeRate} JMD
          </Text>
        </View>

        <View style={[styles.breakdownRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Amount Received</Text>
          <Text style={styles.totalValue}>
            ${(transaction.amount - transaction.fee).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="download" size={20} color="#fff" />
          <Text style={styles.buttonText}>Download Receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Ionicons name="share-social" size={20} color="#FF6B6B" />
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  statusCard: { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 40, marginBottom: 24 },
  statusIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  completedIcon: { backgroundColor: '#4CAF50' },
  statusText: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  amount: { fontSize: 32, fontWeight: '700', color: '#FF6B6B' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#999', marginBottom: 12, textTransform: 'uppercase' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'right' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  breakdownLabel: { fontSize: 14, color: '#666' },
  breakdownValue: { fontSize: 14, fontWeight: '500', color: '#333' },
  totalRow: { borderTopWidth: 2, borderTopColor: '#FF6B6B' },
  totalLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  totalValue: { fontSize: 14, fontWeight: '700', color: '#FF6B6B' },
  button: { flexDirection: 'row', backgroundColor: '#FF6B6B', paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#FF6B6B' },
  secondaryButtonText: { color: '#FF6B6B' },
});

export default TransactionDetailScreen;
