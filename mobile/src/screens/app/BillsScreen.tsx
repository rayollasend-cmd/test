/**
 * Bills Payment Screen
 * Pay bills through the app
 */

import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BillsScreenProps {
  navigation: any;
}

const BillsScreen: React.FC<BillsScreenProps> = ({ navigation }) => {
  const bills = [
    { id: '1', provider: 'Electric Company', amount: 120, dueDate: '2024-12-15' },
    { id: '2', provider: 'Internet Provider', amount: 45, dueDate: '2024-12-20' },
    { id: '3', provider: 'Water Utility', amount: 35, dueDate: '2024-12-25' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pay Bills</Text>
        <Text style={styles.subtitle}>Manage your payments</Text>
      </View>

      <FlatList
        data={bills}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.billCard}>
            <View style={styles.billIcon}>
              <Ionicons name="document" size={24} color="#fff" />
            </View>
            <View style={styles.billInfo}>
              <Text style={styles.billName}>{item.provider}</Text>
              <Text style={styles.billDate}>Due: {item.dueDate}</Text>
            </View>
            <View style={styles.billAmount}>
              <Text style={styles.amount}>${item.amount}</Text>
              <TouchableOpacity style={styles.payBtn}>
                <Text style={styles.payBtnText}>Pay</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.billsList}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  billsList: { paddingHorizontal: 20, gap: 12 },
  billCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 8 },
  billIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  billInfo: { flex: 1 },
  billName: { fontSize: 14, fontWeight: '600', color: '#333' },
  billDate: { fontSize: 12, color: '#999', marginTop: 2 },
  billAmount: { alignItems: 'flex-end', gap: 8 },
  amount: { fontSize: 14, fontWeight: '600', color: '#FF6B6B' },
  payBtn: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#FF6B6B', borderRadius: 4 },
  payBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});

export default BillsScreen;
