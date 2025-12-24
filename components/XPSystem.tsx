import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, Star, Trophy } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface XPGainProps {
  amount: number;
  reason: string;
  visible: boolean;
  onComplete: () => void;
}

interface XPSystemProps {
  currentXP: number;
  maxXP: number;
  level: number;
  recentGains?: XPGainProps[];
}

export default function XPSystem({ currentXP, maxXP, level, recentGains = [] }: XPSystemProps) {
  const [animatedXP] = useState(new Animated.Value(currentXP));
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpAnimation] = useState(new Animated.Value(0));

  const xpPercentage = (currentXP / maxXP) * 100;

  useEffect(() => {
    Animated.timing(animatedXP, {
      toValue: currentXP,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [currentXP]);

  const triggerLevelUp = () => {
    setShowLevelUp(true);
    Animated.sequence([
      Animated.timing(levelUpAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(levelUpAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setShowLevelUp(false));
  };

  return (
    <View style={styles.container}>
      {/* XP Bar */}
      <View style={styles.xpBarContainer}>
        <View style={styles.xpBarBackground}>
          <LinearGradient
            colors={['#F59E0B', '#EAB308']}
            style={[styles.xpBarFill, { width: `${xpPercentage}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={styles.xpBarGlow} />
        </View>
        <Text style={styles.xpText}>
          {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
        </Text>
      </View>

      {/* Level Badge */}
      <View style={styles.levelBadge}>
        <LinearGradient
          colors={['#6B46C1', '#8B5CF6']}
          style={styles.levelBadgeGradient}
        >
          <Text style={styles.levelText}>{level}</Text>
        </LinearGradient>
      </View>

      {/* XP Gain Notifications */}
      {recentGains.map((gain, index) => (
        <XPGainNotification
          key={index}
          amount={gain.amount}
          reason={gain.reason}
          visible={gain.visible}
          onComplete={gain.onComplete}
        />
      ))}

      {/* Level Up Animation */}
      {showLevelUp && (
        <Animated.View
          style={[
            styles.levelUpOverlay,
            {
              opacity: levelUpAnimation,
              transform: [
                {
                  scale: levelUpAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#F59E0B', '#EAB308']}
            style={styles.levelUpContainer}
          >
            <Trophy size={48} color="white" />
            <Text style={styles.levelUpText}>LEVEL UP!</Text>
            <Text style={styles.levelUpNumber}>Level {level}</Text>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
}

function XPGainNotification({ amount, reason, visible, onComplete }: XPGainProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(onComplete);
      }, 2000);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.xpGainNotification,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Zap size={16} color="#F59E0B" />
      <Text style={styles.xpGainText}>+{amount} XP</Text>
      <Text style={styles.xpGainReason}>{reason}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  xpBarContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  xpBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  xpBarGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 6,
  },
  xpText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  levelBadge: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  levelBadgeGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  xpGainNotification: {
    position: 'absolute',
    top: -30,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1000,
  },
  xpGainText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
    marginRight: 8,
  },
  xpGainReason: {
    color: 'white',
    fontSize: 12,
  },
  levelUpOverlay: {
    position: 'absolute',
    top: -100,
    left: -50,
    right: -50,
    bottom: -50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  levelUpContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  levelUpText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  levelUpNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
});