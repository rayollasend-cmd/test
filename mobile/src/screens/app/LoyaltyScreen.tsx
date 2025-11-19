/**
 * Loyalty Rewards Screen
 * View and manage loyalty points and rewards
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

interface LoyaltyScreenProps {
  navigation: any;
}

const LoyaltyScreen: React.FC<LoyaltyScreenProps> = ({ navigation }) => {
  const [copied, setCopied] = useState(false);

  const loyalty = {
    tier: 'Gold',
    points: 2500,
    pointsToNextTier: 2500,
    referralCode: 'REMIT2024ABC',
    referrals: 12,
    rewards: [
      { id: '1', name: 'Cashback', value: '$50', points: 5000 },
      { id: '2', name: 'Free Transfer', value: 'Free', points: 3000 },
      { id: '3', name: 'Premium Support', value: 'Lifetime', points: 10000 },
    ],
  };

  const handleCopyReferralCode = async () => {
    await Clipboard.setStringAsync(loyalty.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return '#CD7F32';
      case 'Silver':
        return '#C0C0C0';
      case 'Gold':
        return '#FFD700';
      case 'Platinum':
        return '#E5E4E2';
      default:
        return '#FF6B6B';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Tier Badge */}
      <View style={styles.tierCard}>
        <View style={[styles.tierIcon, { backgroundColor: getTierColor(loyalty.tier) }]}>
          <Ionicons name="star" size={40} color="#fff" />
        </View>
        <Text style={styles.tierName}>{loyalty.tier} Member</Text>
        <Text style={styles.tierPoints}>{loyalty.points} Points</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(loyalty.points / (loyalty.points + loyalty.pointsToNextTier)) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {loyalty.pointsToNextTier} points to next tier
        </Text>
      </View>

      {/* Referral */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Referral Program</Text>
        <View style={styles.referralCard}>
          <View style={styles.referralInfo}>
            <Text style={styles.referralLabel}>Your Referral Code</Text>
            <Text style={styles.referralCode}>{loyalty.referralCode}</Text>
          </View>
          <TouchableOpacity
            style={styles.copyButton}
            onPress={handleCopyReferralCode}
          >
            <Ionicons
              name={copied ? 'checkmark' : 'copy'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{loyalty.referrals}</Text>
            <Text style={styles.statLabel}>Successful Referrals</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{loyalty.referrals * 100}</Text>
            <Text style={styles.statLabel}>Bonus Points Earned</Text>
          </View>
        </View>
      </View>

      {/* Rewards Marketplace */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Redeem Rewards</Text>
        <FlatList
          data={loyalty.rewards}
          renderItem={({ item }) => (
            <View style={styles.rewardItem}>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardName}>{item.name}</Text>
                <Text style={styles.rewardValue}>{item.value}</Text>
              </View>
              <View style={styles.rewardPoints}>
                <Text style={styles.rewardPointsValue}>{item.points}</Text>
                <Text style={styles.rewardPointsLabel}>Points</Text>
              </View>
              <TouchableOpacity style={styles.redeemButton}>
                <Text style={styles.redeemButtonText}>Redeem</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Member Benefits</Text>
        <View style={styles.benefitItem}>
          <Ionicons name="percent" size={24} color="#FF6B6B" />
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>Cashback</Text>
            <Text style={styles.benefitDesc}>Up to 2% on all transactions</Text>
          </View>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="flash" size={24} color="#FF6B6B" />
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>Faster Transfers</Text>
            <Text style={styles.benefitDesc}>Priority processing for members</Text>
          </View>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="headset" size={24} color="#FF6B6B" />
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>Priority Support</Text>
            <Text style={styles.benefitDesc}>24/7 dedicated support line</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tierCard: { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 30, marginBottom: 24 },
  tierIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  tierName: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 4 },
  tierPoints: { fontSize: 28, fontWeight: '700', color: '#FF6B6B', marginBottom: 16 },
  progressBar: { width: '80%', height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#FF6B6B', borderRadius: 4 },
  progressText: { fontSize: 12, color: '#999' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#999', marginBottom: 12, textTransform: 'uppercase' },
  referralCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 12, gap: 12 },
  referralInfo: { flex: 1 },
  referralLabel: { fontSize: 12, color: '#999', fontWeight: '500' },
  referralCode: { fontSize: 18, fontWeight: '700', color: '#FF6B6B', marginTop: 4 },
  copyButton: { width: 44, height: 44, backgroundColor: '#FF6B6B', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#FF6B6B' },
  statLabel: { fontSize: 12, color: '#999', marginTop: 4, textAlign: 'center' },
  rewardItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 8, gap: 12 },
  rewardInfo: { flex: 1 },
  rewardName: { fontSize: 14, fontWeight: '600', color: '#333' },
  rewardValue: { fontSize: 12, color: '#999', marginTop: 2 },
  rewardPoints: { alignItems: 'center' },
  rewardPointsValue: { fontSize: 16, fontWeight: '700', color: '#FF6B6B' },
  rewardPointsLabel: { fontSize: 10, color: '#999' },
  redeemButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#FF6B6B', borderRadius: 4 },
  redeemButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  benefitItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, gap: 12, alignItems: 'center' },
  benefitText: { flex: 1 },
  benefitTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  benefitDesc: { fontSize: 12, color: '#999', marginTop: 2 },
});

export default LoyaltyScreen;
