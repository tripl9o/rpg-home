import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RPGProgressBarProps {
  current: number;
  max: number;
  label?: string;
  color?: string;
  height?: number;
  showNumbers?: boolean;
}

export default function RPGProgressBar({
  current,
  max,
  label,
  color = '#F59E0B',
  height = 12,
  showNumbers = true,
}: RPGProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.progressBar, { height }]}>
        <LinearGradient
          colors={[color, `${color}CC`]}
          style={[styles.progressFill, { width: `${percentage}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      {showNumbers && (
        <Text style={styles.numbers}>
          {current.toLocaleString()} / {max.toLocaleString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  numbers: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
  },
});