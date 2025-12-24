import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bell, Shield, Palette, Globe, Scale, Circle as HelpCircle, MessageSquare, Star, LogOut, ChevronRight, Settings as SettingsIcon } from 'lucide-react-native';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  const accountSettings: SettingItem[] = [
    {
      id: 'profile',
      title: 'Edit Profile',
      subtitle: 'Update personal information',
      icon: User,
      type: 'navigation',
      onPress: () => Alert.alert('Profile', 'Profile editing coming soon!')
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Manage account security',
      icon: Shield,
      type: 'navigation',
      onPress: () => Alert.alert('Privacy', 'Privacy settings coming soon!')
    }
  ];

  const appSettings: SettingItem[] = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      subtitle: 'Workout reminders and updates',
      icon: Bell,
      type: 'toggle',
      value: notifications,
      onToggle: setNotifications
    },
    {
      id: 'darkMode',
      title: 'Dark Mode',
      subtitle: 'Use dark theme',
      icon: Palette,
      type: 'toggle',
      value: darkMode,
      onToggle: setDarkMode
    },
    {
      id: 'autoSync',
      title: 'Auto Sync',
      subtitle: 'Sync data automatically',
      icon: Globe,
      type: 'toggle',
      value: autoSync,
      onToggle: setAutoSync
    },
    {
      id: 'biometrics',
      title: 'Biometric Login',
      subtitle: 'Use fingerprint or face ID',
      icon: Shield,
      type: 'toggle',
      value: biometrics,
      onToggle: setBiometrics
    }
  ];

  const dataSettings: SettingItem[] = [
    {
      id: 'units',
      title: 'Units of Measurement',
      subtitle: 'Metric or Imperial',
      icon: Scale,
      type: 'navigation',
      onPress: () => Alert.alert('Units', 'Unit selection coming soon!')
    },
    {
      id: 'analytics',
      title: 'Usage Analytics',
      subtitle: 'Help improve the app',
      icon: SettingsIcon,
      type: 'toggle',
      value: analytics,
      onToggle: setAnalytics
    }
  ];

  const supportSettings: SettingItem[] = [
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'FAQs and contact support',
      icon: HelpCircle,
      type: 'navigation',
      onPress: () => Alert.alert('Help', 'Support page coming soon!')
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      subtitle: 'Share your thoughts',
      icon: MessageSquare,
      type: 'navigation',
      onPress: () => Alert.alert('Feedback', 'Feedback form coming soon!')
    },
    {
      id: 'rate',
      title: 'Rate the App',
      subtitle: 'Leave a review',
      icon: Star,
      type: 'navigation',
      onPress: () => Alert.alert('Rate', 'App Store rating coming soon!')
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: () => Alert.alert('Logged Out', 'You have been successfully logged out.')
        }
      ]
    );
  };

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity 
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
    >
      <View style={styles.settingIcon}>
        <item.icon size={24} color="#94A3B8" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>
      <View style={styles.settingAction}>
        {item.type === 'toggle' && item.onToggle ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#374151', true: '#6B46C1' }}
            thumbColor={item.value ? '#F59E0B' : '#9CA3AF'}
          />
        ) : (
          <ChevronRight size={20} color="#6B7280" />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSettingSection = (title: string, items: SettingItem[]) => (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6B46C1', '#8B5CF6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>AJ</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Alex Johnson</Text>
            <Text style={styles.userEmail}>alex.johnson@email.com</Text>
            <View style={styles.userStats}>
              <Text style={styles.userLevel}>Level 12 • Fitness Paladin</Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {renderSettingSection('Account', accountSettings)}
        {renderSettingSection('App Preferences', appSettings)}
        {renderSettingSection('Data & Privacy', dataSettings)}
        {renderSettingSection('Support', supportSettings)}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>FitRPG v1.0.0</Text>
          <Text style={styles.appDescription}>
            Built with ❤️ for fitness warriors
          </Text>
          <Text style={styles.copyright}>
            © 2024 FitRPG. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userAvatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLevel: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
  },
  settingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
  },
  settingAction: {
    marginLeft: 12,
  },
  logoutSection: {
    marginTop: 12,
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersion: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  appDescription: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 8,
  },
  copyright: {
    color: '#4B5563',
    fontSize: 10,
  },
});