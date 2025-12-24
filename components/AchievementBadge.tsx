import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trophy } from 'lucide-react-native';

interface AchievementBadgeProps {
  title: string;
  unlocked: boolean;
  icon?: any;
  size?: 'small' | 'medium' | 'large';
}

export default function AchievementBadge({
  title,
  unlocked,
  icon: IconComponent = Trophy,
  size = 'medium',
}: AchievementBadgeProps) {
  const sizeStyles = {
    small: { container: 40, icon: 16, text: 10 },
    medium: { container: 60, icon: 24, text: 12 },
    large: { container: 80, icon: 32, text: 14 },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={styles.container}>
      <View style={[
        styles.badge,
        {
          width: currentSize.container,
          height: currentSize.container,
          backgroundColor: unlocked ? '#F59E0B' : '#374151',
        }
      ]}>
        <IconComponent
          size={currentSize.icon}
          color={unlocked ? 'white' : '#6B7280'}
        />
      </View>
      <Text style={[styles.title, { fontSize: currentSize.text }]} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 8,
    width: 80,
  },
  badge: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
  },
});