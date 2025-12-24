import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Award, Flame, Target, TrendingUp, Star, Crown, Shield } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: number;
  category: string;
}

interface Stat {
  label: string;
  current: number;
  previous: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export default function Progress() {
  const [selectedTab, setSelectedTab] = useState<'character' | 'achievements' | 'stats'>('character');

  const characterData = {
    level: 12,
    currentXP: 750,
    maxXP: 1000,
    class: 'Fitness Paladin',
    totalXP: 11750,
    rank: 'Warrior',
    nextRank: 'Champion',
    attributes: {
      strength: 78,
      endurance: 65,
      agility: 82,
      discipline: 71,
    },
  };

  const achievements: Achievement[] = [
    {
      id: 'first_workout',
      title: 'First Steps',
      description: 'Complete your first workout',
      icon: Target,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      reward: 50,
      category: 'milestone',
    },
    {
      id: 'week_streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day workout streak',
      icon: Flame,
      unlocked: true,
      progress: 7,
      maxProgress: 7,
      reward: 100,
      category: 'streak',
    },
    {
      id: 'water_master',
      title: 'Hydration Hero',
      description: 'Drink your daily water goal for 30 days',
      icon: Award,
      unlocked: false,
      progress: 18,
      maxProgress: 30,
      reward: 200,
      category: 'habit',
    },
    {
      id: 'strength_beast',
      title: 'Strength Beast',
      description: 'Increase your max lift by 50kg',
      icon: Trophy,
      unlocked: false,
      progress: 32,
      maxProgress: 50,
      reward: 300,
      category: 'strength',
    },
    {
      id: 'marathon_runner',
      title: 'Marathon Master',
      description: 'Run a total of 100km',
      icon: Star,
      unlocked: false,
      progress: 67,
      maxProgress: 100,
      reward: 500,
      category: 'cardio',
    },
    {
      id: 'perfect_month',
      title: 'Perfect Month',
      description: 'Complete all daily goals for 30 days',
      icon: Crown,
      unlocked: false,
      progress: 12,
      maxProgress: 30,
      reward: 1000,
      category: 'legendary',
    },
  ];

  const weeklyStats: Stat[] = [
    { label: 'Workouts', current: 5, previous: 3, unit: '', trend: 'up' },
    { label: 'Calories Burned', current: 2840, previous: 2100, unit: 'kcal', trend: 'up' },
    { label: 'Water Intake', current: 2.3, previous: 1.8, unit: 'L', trend: 'up' },
    { label: 'Sleep Average', current: 7.2, previous: 6.8, unit: 'hrs', trend: 'up' },
    { label: 'Steps', current: 9250, previous: 8100, unit: '', trend: 'up' },
    { label: 'Weight', current: 75.2, previous: 75.8, unit: 'kg', trend: 'down' },
  ];

  const renderCharacterTab = () => (
    <View>
      {/* Character Level Card */}
      <LinearGradient
        colors={['#6B46C1', '#8B5CF6']}
        style={styles.characterCard}
      >
        <View style={styles.characterHeader}>
          <Text style={styles.characterClass}>{characterData.class}</Text>
          <Text style={styles.characterLevel}>Level {characterData.level}</Text>
        </View>
        
        <View style={styles.xpContainer}>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${(characterData.currentXP / characterData.maxXP) * 100}%` }]} />
          </View>
          <Text style={styles.xpText}>
            {characterData.currentXP} / {characterData.maxXP} XP
          </Text>
        </View>

        <View style={styles.characterStats}>
          <Text style={styles.totalXP}>Total XP: {characterData.totalXP.toLocaleString()}</Text>
          <Text style={styles.rank}>Rank: {characterData.rank} → {characterData.nextRank}</Text>
        </View>
      </LinearGradient>

      {/* Attributes */}
      <View style={styles.attributesContainer}>
        <Text style={styles.sectionTitle}>Character Attributes</Text>
        {Object.entries(characterData.attributes).map(([attribute, value]) => (
          <View key={attribute} style={styles.attributeRow}>
            <Text style={styles.attributeLabel}>
              {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
            </Text>
            <View style={styles.attributeBar}>
              <View style={[styles.attributeFill, { width: `${value}%` }]} />
            </View>
            <Text style={styles.attributeValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAchievementsTab = () => (
    <View style={styles.achievementsContainer}>
      {achievements.map((achievement) => {
        const Icon = achievement.icon;
        const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
        
        return (
          <TouchableOpacity 
            key={achievement.id} 
            style={[
              styles.achievementCard,
              achievement.unlocked && styles.achievementUnlocked
            ]}
          >
            <View style={styles.achievementHeader}>
              <View style={[
                styles.achievementIcon,
                { backgroundColor: achievement.unlocked ? '#10B981' : '#374151' }
              ]}>
                <Icon size={24} color="white" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardText}>+{achievement.reward} XP</Text>
              </View>
            </View>
            
            {!achievement.unlocked && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {achievement.progress} / {achievement.maxProgress}
                </Text>
              </View>
            )}
            
            <View style={[styles.categoryBadge, getCategoryColor(achievement.category)]}>
              <Text style={styles.categoryText}>{achievement.category.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderStatsTab = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Weekly Progress</Text>
      {weeklyStats.map((stat, index) => (
        <View key={index} style={styles.statRow}>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <View style={styles.statValues}>
              <Text style={styles.statCurrent}>
                {stat.current.toLocaleString()} {stat.unit}
              </Text>
              <View style={styles.statChange}>
                <TrendingUp 
                  size={16} 
                  color={stat.trend === 'up' ? '#10B981' : stat.trend === 'down' ? '#EF4444' : '#94A3B8'} 
                />
                <Text style={[
                  styles.statChangeText,
                  { color: stat.trend === 'up' ? '#10B981' : stat.trend === 'down' ? '#EF4444' : '#94A3B8' }
                ]}>
                  {stat.trend === 'up' ? '+' : stat.trend === 'down' ? '' : ''}
                  {Math.abs(stat.current - stat.previous).toLocaleString()} {stat.unit}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: { backgroundColor: string } } = {
      milestone: { backgroundColor: '#F59E0B' },
      streak: { backgroundColor: '#EF4444' },
      habit: { backgroundColor: '#3B82F6' },
      strength: { backgroundColor: '#8B5CF6' },
      cardio: { backgroundColor: '#10B981' },
      legendary: { backgroundColor: '#EC4899' },
    };
    return colors[category] || { backgroundColor: '#6B7280' };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress Tracking</Text>
        <Text style={styles.headerSubtitle}>Level up your fitness journey</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'character', label: 'Character', icon: Shield },
          { key: 'achievements', label: 'Achievements', icon: Trophy },
          { key: 'stats', label: 'Stats', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
              onPress={() => setSelectedTab(tab.key as any)}
            >
              <Icon size={20} color={selectedTab === tab.key ? '#F59E0B' : '#94A3B8'} />
              <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {selectedTab === 'character' && renderCharacterTab()}
        {selectedTab === 'achievements' && renderAchievementsTab()}
        {selectedTab === 'stats' && renderStatsTab()}
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
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#1E293B',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#F59E0B15',
    borderBottomWidth: 2,
    borderBottomColor: '#F59E0B',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#F59E0B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  characterCard: {
    borderRadius: 18,
    padding: 22,
    marginBottom: 18,
  },
  characterHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  characterClass: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '500',
  },
  characterLevel: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  xpContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  xpBar: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 6,
  },
  xpText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  characterStats: {
    alignItems: 'center',
  },
  totalXP: {
    color: '#E5E7EB',
    fontSize: 16,
    marginBottom: 4,
  },
  rank: {
    color: '#E5E7EB',
    fontSize: 16,
  },
  attributesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  attributeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  attributeLabel: {
    color: 'white',
    fontSize: 16,
    width: 100,
    fontWeight: '600',
  },
  attributeBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  attributeFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  attributeValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  achievementsContainer: {
    paddingBottom: 20,
  },
  achievementCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#374151',
  },
  achievementUnlocked: {
    borderColor: '#10B981',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    color: '#94A3B8',
    fontSize: 14,
  },
  rewardContainer: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressText: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'right',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    paddingBottom: 20,
  },
  statRow: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  statInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statValues: {
    alignItems: 'flex-end',
  },
  statCurrent: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statChangeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});