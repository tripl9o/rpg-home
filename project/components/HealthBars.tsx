import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Zap, Shield, Droplets } from 'lucide-react-native';

interface HealthBarProps {
  type: 'health' | 'energy' | 'stamina' | 'hydration';
  current: number;
  max: number;
  label?: string;
}

interface HealthBarsProps {
  health: { current: number; max: number };
  energy: { current: number; max: number };
  stamina: { current: number; max: number };
  hydration: { current: number; max: number };
}

function HealthBar({ type, current, max, label }: HealthBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  
  const getBarConfig = () => {
    switch (type) {
      case 'health':
        return {
          icon: Heart,
          colors: ['#EF4444', '#F87171'],
          bgColor: 'rgba(239, 68, 68, 0.2)',
          iconColor: '#EF4444',
        };
      case 'energy':
        return {
          icon: Zap,
          colors: ['#F59E0B', '#FCD34D'],
          bgColor: 'rgba(245, 158, 11, 0.2)',
          iconColor: '#F59E0B',
        };
      case 'stamina':
        return {
          icon: Shield,
          colors: ['#10B981', '#34D399'],
          bgColor: 'rgba(16, 185, 129, 0.2)',
          iconColor: '#10B981',
        };
      case 'hydration':
        return {
          icon: Droplets,
          colors: ['#3B82F6', '#60A5FA'],
          bgColor: 'rgba(59, 130, 246, 0.2)',
          iconColor: '#3B82F6',
        };
      default:
        return {
          icon: Heart,
          colors: ['#6B7280', '#9CA3AF'],
          bgColor: 'rgba(107, 114, 128, 0.2)',
          iconColor: '#6B7280',
        };
    }
  };

  const config = getBarConfig();
  const Icon = config.icon;

  return (
    <View style={styles.healthBarContainer}>
      <View style={styles.healthBarHeader}>
        <Icon size={16} color={config.iconColor} />
        <Text style={styles.healthBarLabel}>
          {label || type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
        <Text style={styles.healthBarValue}>
          {current}/{max}
        </Text>
      </View>
      
      <View style={[styles.healthBarBackground, { backgroundColor: config.bgColor }]}>
        <LinearGradient
          colors={config.colors}
          style={[styles.healthBarFill, { width: `${percentage}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        
        {/* Animated shine effect */}
        <View style={styles.healthBarShine} />
      </View>
    </View>
  );
}

export default function HealthBars({ health, energy, stamina, hydration }: HealthBarsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vital Stats</Text>
      
      <View style={styles.barsContainer}>
        <HealthBar
          type="health"
          current={health.current}
          max={health.max}
          label="Health"
        />
        
        <HealthBar
          type="energy"
          current={energy.current}
          max={energy.max}
          label="Energy"
        />
        
        <HealthBar
          type="stamina"
          current={stamina.current}
          max={stamina.max}
          label="Stamina"
        />
        
        <HealthBar
          type="hydration"
          current={hydration.current}
          max={hydration.max}
          label="Hydration"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  barsContainer: {
    gap: 12,
  },
  healthBarContainer: {
    marginBottom: 4,
  },
  healthBarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  healthBarLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  healthBarValue: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  healthBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  healthBarShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
});