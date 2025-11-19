/**
 * Crypto Trading Screen
 * Buy and sell cryptocurrency
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CryptoTradingScreenProps {
  navigation: any;
}

const CryptoTradingScreen: React.FC<CryptoTradingScreenProps> = ({ navigation }) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [amount, setAmount] = useState('');

  const cryptos = [
    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 43500, change24h: 2.5 },
    { id: '2', name: 'Ethereum', symbol: 'ETH', price: 2300, change24h: 1.8 },
    { id: '3', name: 'USDC', symbol: 'USDC', price: 1.0, change24h: 0.1 },
    { id: '4', name: 'Tether', symbol: 'USDT', price: 1.0, change24h: 0.05 },
  ];

  const selectedCryptoData = selectedCrypto || cryptos[0];

  const calculateTotal = () => {
    if (!amount) return '0.00';
    return (parseFloat(amount) * selectedCryptoData.price).toFixed(2);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Trade Type Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            tradeType === 'buy' && styles.toggleButtonActive,
          ]}
          onPress={() => setTradeType('buy')}
        >
          <Ionicons name="arrow-down" size={18} color="#fff" />
          <Text
            style={[
              styles.toggleButtonText,
              tradeType === 'buy' && styles.toggleButtonTextActive,
            ]}
          >
            Buy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            tradeType === 'sell' && styles.toggleButtonActive,
          ]}
          onPress={() => setTradeType('sell')}
        >
          <Ionicons name="arrow-up" size={18} color="#fff" />
          <Text
            style={[
              styles.toggleButtonText,
              tradeType === 'sell' && styles.toggleButtonTextActive,
            ]}
          >
            Sell
          </Text>
        </TouchableOpacity>
      </View>

      {/* Crypto List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Cryptocurrency</Text>
        <FlatList
          data={cryptos}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.cryptoItem,
                selectedCrypto?.id === item.id && styles.cryptoItemSelected,
              ]}
              onPress={() => setSelectedCrypto(item)}
            >
              <View style={styles.cryptoLeft}>
                <Text style={styles.cryptoSymbol}>{item.symbol}</Text>
                <View>
                  <Text style={styles.cryptoName}>{item.name}</Text>
                  <Text
                    style={[
                      styles.cryptoChange,
                      item.change24h >= 0
                        ? styles.changePositive
                        : styles.changeNegative,
                    ]}
                  >
                    {item.change24h >= 0 ? '+' : ''}{item.change24h}%
                  </Text>
                </View>
              </View>
              <Text style={styles.cryptoPrice}>${item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Trade Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trade Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount ({selectedCryptoData.symbol})</Text>
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
            <Text style={styles.quoteLabel}>Price per {selectedCryptoData.symbol}</Text>
            <Text style={styles.quoteValue}>${selectedCryptoData.price.toFixed(2)}</Text>
          </View>
          <View style={[styles.quoteRow, styles.quoteBorder]}>
            <Text style={styles.quoteLabel}>Total Cost</Text>
            <Text style={styles.quoteValue}>${calculateTotal()}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.tradeButton,
            tradeType === 'sell' && styles.tradeButtonSell,
          ]}
          disabled={!amount}
        >
          <Text style={styles.tradeButtonText}>
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCryptoData.symbol}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  toggleContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 20, gap: 12, marginBottom: 24 },
  toggleButton: { flex: 1, flexDirection: 'row', paddingVertical: 12, borderRadius: 8, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', gap: 6 },
  toggleButtonActive: { backgroundColor: '#FF6B6B' },
  toggleButtonText: { fontSize: 14, fontWeight: '600', color: '#999' },
  toggleButtonTextActive: { color: '#fff' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#999', marginBottom: 12, textTransform: 'uppercase' },
  cryptoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8, borderWidth: 2, borderColor: 'transparent' },
  cryptoItemSelected: { borderColor: '#FF6B6B' },
  cryptoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  cryptoSymbol: { fontSize: 16, fontWeight: '700', color: '#FF6B6B', minWidth: 40 },
  cryptoName: { fontSize: 14, fontWeight: '600', color: '#333' },
  cryptoChange: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  changePositive: { color: '#4CAF50' },
  changeNegative: { color: '#F44' },
  cryptoPrice: { fontSize: 14, fontWeight: '600', color: '#333' },
  inputGroup: { gap: 8, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333' },
  input: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#e0e0e0', fontSize: 16 },
  quoteBox: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 16 },
  quoteRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  quoteBorder: { borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 12 },
  quoteLabel: { fontSize: 14, color: '#666' },
  quoteValue: { fontSize: 14, fontWeight: '600', color: '#333' },
  tradeButton: { backgroundColor: '#4CAF50', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  tradeButtonSell: { backgroundColor: '#F44' },
  tradeButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default CryptoTradingScreen;
