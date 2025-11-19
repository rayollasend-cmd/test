/**
 * Dashboard Screen
 * Main app home screen showing wallets, transactions, and quick actions
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../../store';
import { fetchWalletsStart, fetchWalletsSuccess } from '../../store/slices/walletSlice';
import { fetchTransactionsStart, fetchTransactionsSuccess } from '../../store/slices/transactionSlice';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { wallets, isLoading: walletsLoading } = useSelector(
    (state: RootState) => state.wallets
  );
  const { transactions } = useSelector(
    (state: RootState) => state.transactions
  );
  const { user } = useSelector((state: RootState) => state.user);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Load wallets and transactions
   */
  const loadDashboardData = async () => {
    try {
      dispatch(fetchWalletsStart());
      // Mock data for demo
      dispatch(
        fetchWalletsSuccess([
          {
            id: '1',
            userId: user?.id || '1',
            currency: 'USD',
            balance: 5230.50,
            availableBalance: 5000,
            ledgerBalance: 230.50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            userId: user?.id || '1',
            currency: 'JMD',
            balance: 150250,
            availableBalance: 150000,
            ledgerBalance: 250,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
      );

      dispatch(fetchTransactionsStart());
      dispatch(
        fetchTransactionsSuccess({
          transactions: [
            {
              id: '1',
              userId: user?.id || '1',
              type: 'transfer',
              status: 'completed',
              amount: 500,
              currency: 'USD',
              recipientName: 'John Doe',
              recipientCountry: 'Jamaica',
              exchangeRate: 150.25,
              fee: 10,
              description: 'Family support',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              completedAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ],
          hasMore: false,
        })
      );
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  /**
   * Render wallet card
   */
  const renderWalletCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.walletCard}
      onPress={() => navigation.navigate('Wallet')}
    >
      <View style={styles.walletHeader}>
        <Text style={styles.walletCurrency}>{item.currency}</Text>
        <Ionicons name="wallet" size={24} color="#FF6B6B" />
      </View>
      <Text style={styles.walletBalance}>
        {formatCurrency(item.balance, item.currency)}
      </Text>
      <Text style={styles.walletLabel}>Available Balance</Text>
    </TouchableOpacity>
  );

  /**
   * Render transaction item
   */
  const renderTransactionItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => navigation.navigate('TransactionDetail', { id: item.id })}
    >
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            item.type === 'transfer' && styles.transferIcon,
          ]}
        >
          <Ionicons
            name={
              item.type === 'transfer'
                ? 'send'
                : item.type === 'topup'
                ? 'arrow-up'
                : 'document'
            }
            size={20}
            color="#fff"
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>
            {item.type === 'transfer'
              ? 'Send Money'
              : item.type === 'topup'
              ? 'Top Up'
              : 'Bill Payment'}
          </Text>
          <Text style={styles.transactionDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            item.status === 'completed' && styles.positiveAmount,
          ]}
        >
          -{formatCurrency(item.amount, item.currency)}
        </Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'completed' && styles.completedBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'completed' && styles.completedText,
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (walletsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.firstName || 'User'}! 👋
          </Text>
          <Text style={styles.headerSubtitle}>
            Welcome back to CaribRemit
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SendMoney')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="send" size={24} color="#fff" />
          </View>
          <Text style={styles.actionLabel}>Send Money</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Bills')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="document" size={24} color="#fff" />
          </View>
          <Text style={styles.actionLabel}>Pay Bills</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Crypto')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="trending-up" size={24} color="#fff" />
          </View>
          <Text style={styles.actionLabel}>Crypto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Loyalty')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="gift" size={24} color="#fff" />
          </View>
          <Text style={styles.actionLabel}>Rewards</Text>
        </TouchableOpacity>
      </View>

      {/* Wallets Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Wallets</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={wallets}
          renderItem={renderWalletCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.walletsList}
        />
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {transactions.length > 0 ? (
          <FlatList
            data={transactions.slice(0, 5)}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color="#ddd" />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  walletsList: {
    gap: 12,
  },
  walletCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletCurrency: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  walletBalance: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  walletLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transferIcon: {
    backgroundColor: '#FFE0E0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  positiveAmount: {
    color: '#FF6B6B',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#FEE',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F44',
  },
  completedText: {
    color: '#4CAF50',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
});

export default DashboardScreen;
