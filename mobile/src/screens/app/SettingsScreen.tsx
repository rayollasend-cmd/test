/**
 * Settings Screen
 * User settings and preferences
 */

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Switch } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../../store/slices/authSlice';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
  };

  const SettingItem: React.FC<{
    icon: string;
    label: string;
    subtitle?: string;
    toggle?: boolean;
    value?: boolean;
    onToggle?: (value: boolean) => void;
    onPress?: () => void;
  }> = ({ icon, label, subtitle, toggle, value, onToggle, onPress }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={toggle}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={20} color="#FF6B6B" />
        <View style={styles.settingText}>
          <Text style={styles.settingLabel}>{label}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {toggle ? (
        <Switch value={value} onValueChange={onToggle} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#ddd" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem icon="person" label="Profile" subtitle="Edit your information" />
        <SettingItem icon="lock" label="Security" subtitle="Password & 2FA" />
        <SettingItem icon="document" label="Verification" subtitle="KYC Status" />
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          icon="bell"
          label="Notifications"
          toggle
          value={notifications}
          onToggle={setNotifications}
        />
        <SettingItem
          icon="moon"
          label="Dark Mode"
          toggle
          value={darkMode}
          onToggle={setDarkMode}
        />
        <SettingItem
          icon="finger-print"
          label="Biometric Login"
          toggle
          value={biometric}
          onToggle={setBiometric}
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem icon="help-circle" label="Help & Support" />
        <SettingItem icon="information-circle" label="About" />
        <SettingItem icon="shield-checkmark" label="Privacy Policy" />
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#F44" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#999', marginBottom: 12, textTransform: 'uppercase' },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 16, borderRadius: 8, marginBottom: 8 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  settingText: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '500', color: '#333' },
  settingSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  logoutButton: { flexDirection: 'row', backgroundColor: '#FEE', paddingHorizontal: 12, paddingVertical: 16, borderRadius: 8, alignItems: 'center', gap: 12 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#F44' },
});

export default SettingsScreen;
