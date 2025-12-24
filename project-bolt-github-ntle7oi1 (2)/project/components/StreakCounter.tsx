import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Calendar, Target } from 'lucide-react-native';

interface StreakCounterProps {
  currentStreak: number;
  bestStreak: number;
  streakType: 'workout' | 'nutrition' | 'hydration' | 'overall';
  isActive: boolean;
}

export default function StreakCounter({
  currentStreak,
  bestStreak,
  streakType,
  isActive,
}: StreakCounterProps) {
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [glowAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isActive && currentStreak > 0) {
      // Pulse animation for active streaks
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isActive, currentStreak]);

  const getStreakIcon = () => {
    switch (streakType) {
      case 'workout':
        return Target;
      case 'nutrition':
        return Calendar;
      case 'hydration':
        return Calendar;
      default:
        return Flame;
    }
  };

  const getStreakColor = () => {
    if (currentStreak === 0) return ['#374151', '#4B5563'];
    if (currentStreak < 7) return ['#F59E0B', '#EAB308'];
    if (currentStreak < 30) return ['#EF4444', '#F87171'];
    return ['#8B5CF6', '#A78BFA'];
  };

  const getStreakTitle = () => {
    switch (streakType) {
      case 'workout':
        return 'Workout Streak';
      case 'nutrition':
        return 'Nutrition Streak';
      case 'hydration':
        return 'Hydration Streak';
      default:
        return 'Daily Streak';
    }
  };

  const getStreakMessage = () => {
    if (currentStreak === 0) return 'Start your streak today!';
    if (currentStreak === 1) return 'Great start! Keep it up!';
    if (currentStreak < 7) return 'Building momentum!';
    if (currentStreak < 30) return 'You\'re on fire! 🔥';
    if (currentStreak < 100) return 'Legendary streak! 👑';
    return 'Streak Master! 🏆';
  };

  const StreakIcon = getStreakIcon();
  const streakColors = getStreakColor();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={streakColors}
        style={styles.streakCard}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: pulseAnimation }],
            },
          ]}
        >
          <StreakIcon size={24} color="white" />
          {isActive && currentStreak > 0 && (
            <Animated.View
              style={[
                styles.glow,
                {
                  opacity: glowAnimation,
                },
              ]}
            />
          )}
        </Animated.View>

        <View style={styles.streakInfo}>
          <Text style={styles.streakTitle}>{getStreakTitle()}</Text>
          <View style={styles.streakNumbers}>
            <Text style={styles.currentStreak}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>days</Text>
          </View>
          <Text style={styles.streakMessage}>{getStreakMessage()}</Text>
        </View>

        <View style={styles.bestStreakContainer}>
          <Text style={styles.bestStreakLabel}>Best</Text>
          <Text style={styles.bestStreak}>{bestStreak}</Text>
        </View>
      </LinearGradient>

      {/* Milestone Indicators */}
      <View style={styles.milestonesContainer}>
        {[7, 30, 100].map((milestone) => (
          <View
            key={milestone}
            style={[
              styles.milestone,
              currentStreak >= milestone && styles.milestoneAchieved,
            ]}
          >
            <Text
              style={[
                styles.milestoneText,
                currentStreak >= milestone && styles.milestoneTextAchieved,
              ]}
            >
              {milestone}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  glow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  streakNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  currentStreak: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  streakLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginLeft: 4,
  },
  streakMessage: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontStyle: 'italic',
  },
  bestStreakContainer: {
    alignItems: 'center',
  },
  bestStreakLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 2,
  },
  bestStreak: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  milestonesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 12,
  },
  milestone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneAchieved: {
    backgroundColor: '#F59E0B',
  },
  milestoneText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: 'bold',
  },
  milestoneTextAchieved: {
    color: 'white',
  },
});