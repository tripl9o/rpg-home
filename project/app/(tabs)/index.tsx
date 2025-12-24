import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, Droplets, Moon, Target, TrendingUp, Award, Play, Calendar, Clock, ChevronRight } from 'lucide-react-native';
import XPSystem from '@/components/XPSystem';
import CharacterAvatar from '@/components/CharacterAvatar';
import HealthBars from '@/components/HealthBars';
import StreakCounter from '@/components/StreakCounter';

const { width } = Dimensions.get('window');

interface UserStats {
  level: number;
  currentXP: number;
  maxXP: number;
  streak: number;
  totalWorkouts: number;
  caloriesBurned: number;
  waterIntake: number;
  sleepHours: number;
  achievements: number;
}

export default function Dashboard() {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 12,
    currentXP: 750,
    maxXP: 1000,
    streak: 7,
    totalWorkouts: 48,
    caloriesBurned: 12450,
    waterIntake: 2.1,
    sleepHours: 7.5,
    achievements: 15,
  });

  // Mock health data for RPG bars
  const [healthData] = useState({
    health: { current: 85, max: 100 },
    energy: { current: 72, max: 100 },
    stamina: { current: 90, max: 100 },
    hydration: { current: 68, max: 100 },
  });

  // Mock character data
  const [characterData] = useState({
    level: userStats.level,
    className: 'Fitness Paladin',
    rank: 'Warrior',
    attributes: {
      strength: 78,
      endurance: 65,
      agility: 82,
      discipline: 71,
    },
  });

  const xpPercentage = (userStats.currentXP / userStats.maxXP) * 100;

  const todayWorkout = {
    name: "Upper Body Strength",
    duration: "45 min",
    exercises: 8,
    difficulty: "Intermediate",
    completed: false
  };

  const todayMeals = {
    breakfast: { name: "Protein Oatmeal", calories: 320, completed: true },
    lunch: { name: "Grilled Chicken Salad", calories: 450, completed: false },
    dinner: { name: "Salmon & Vegetables", calories: 520, completed: false },
    snacks: { name: "Greek Yogurt", calories: 150, completed: false }
  };

  const recentAchievements = [
    { id: 1, title: "Week Warrior", icon: "🔥", unlocked: true },
    { id: 2, title: "Hydration Hero", icon: "💧", unlocked: true },
    { id: 3, title: "Early Bird", icon: "🌅", unlocked: false },
  ];

 const dailyGoals = [
    { icon: Droplets, label: 'Water', current: 2.1, target: 2.5, unit: 'L', color: '#3B82F6' },
    { icon: Zap, label: 'Calories', current: 1850, target: 2000, unit: 'kcal', color: '#F59E0B' },
    { icon: Moon, label: 'Sleep', current: 7.5, target: 8, unit: 'hrs', color: '#8B5CF6' },
    { icon: Target, label: 'Steps', current: 8250, target: 10000, unit: '', color: '#10B981' },
  ];
const addWater = () => {
  setDailyGoals(prev =>
    prev.map(goal =>
      goal.id === 'water'
        ? {
            ...goal,
            current: Math.min(
              +(goal.current + 0.25).toFixed(2),
              goal.target
            ),
          }
        : goal
    )
  );
};


  return (
    <ScrollView style={styles.container}>
      {/* Hero Section with User Avatar and Level */}
      <LinearGradient
        colors={['#6B46C1', '#8B5CF6', '#A78BFA']}
        style={styles.heroSection}
      >
        <View style={styles.welcomeHeader}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.userName}>Alex Johnson</Text>
        </View>
        
        {/* XP System */}
        <XPSystem
          currentXP={userStats.currentXP}
          maxXP={userStats.maxXP}
          level={userStats.level}
        />
      </LinearGradient>

      {/* Character Avatar */}
      <View style={styles.section}>
        <CharacterAvatar
          level={characterData.level}
          className={characterData.className}
          rank={characterData.rank}
          attributes={characterData.attributes}
        />
      </View>

      {/* Health Bars */}
      <View style={styles.section}>
        <HealthBars
          health={healthData.health}
          energy={healthData.energy}
          stamina={healthData.stamina}
          hydration={healthData.hydration}
        />
      </View>

      {/* Streak Counter */}
      <View style={styles.section}>
        <StreakCounter
          currentStreak={userStats.streak}
          bestStreak={15}
          streakType="overall"
          isActive={true}
        />
      </View>

      {/* Achievement Badges Carousel */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsCarousel}>
          {recentAchievements.map((achievement) => (
            <TouchableOpacity key={achievement.id} style={[
              styles.achievementBadge,
              achievement.unlocked && styles.achievementUnlocked
            ]}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Today's Workout Preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Workout</Text>
        <TouchableOpacity style={styles.workoutCard}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.workoutGradient}
          >
            <View style={styles.workoutHeader}>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutName}>{todayWorkout.name}</Text>
                <View style={styles.workoutMeta}>
                  <Clock size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.workoutDuration}>{todayWorkout.duration}</Text>
                  <Text style={styles.workoutSeparator}>•</Text>
                  <Text style={styles.workoutExercises}>{todayWorkout.exercises} exercises</Text>
                </View>
                <Text style={styles.workoutDifficulty}>{todayWorkout.difficulty}</Text>
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Play size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Meal Plan Summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <TouchableOpacity>
            <ChevronRight size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
        <View style={styles.mealsContainer}>
          {Object.entries(todayMeals).map(([mealType, meal]) => (
            <TouchableOpacity key={mealType} style={styles.mealItem}>
              <View style={[
                styles.mealStatus,
                { backgroundColor: meal.completed ? '#10B981' : '#374151' }
              ]} />
              <View style={styles.mealInfo}>
                <Text style={styles.mealType}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</Text>
                <Text style={styles.mealName}>{meal.name}</Text>
              </View>
              <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Daily Goals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Goals Progress</Text>
        <View style={styles.goalsGrid}>
          {dailyGoals.map((goal, index) => {
            const Icon = goal.icon;
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            
            return (
              <View key={index} style={styles.goalCard}>
                <Icon size={24} color={goal.color} />
                <Text style={styles.goalLabel}>{goal.label}</Text>
                <View style={styles.goalProgress}>
                  <View style={[styles.goalProgressBar, { backgroundColor: `${goal.color}20` }]}>
                    <View 
                      style={[
                        styles.goalProgressFill, 
                        { 
                          width: `${progress}%`,
                          backgroundColor: goal.color
                        }
                      ]} 
                    />
                  </View>
                </View>
                <Text style={styles.goalValue}>
                  {goal.current}{goal.unit} / {goal.target}{goal.unit}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Battle Statistics</Text>
        <View style={styles.statsGrid}>
          <TouchableOpacity style={styles.statCard}>
            <TrendingUp size={24} color="#F59E0B" />
            <Text style={styles.statValue}>{userStats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard}>
            <Target size={24} color="#10B981" />
            <Text style={styles.statValue}>{userStats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard}>
            <Zap size={24} color="#EF4444" />
            <Text style={styles.statValue}>{userStats.caloriesBurned.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Calories Burned</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.statCard}>
            <Award size={24} color="#8B5CF6" />
            <Text style={styles.statValue}>{userStats.achievements}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#10B98120' }]}>
            <Text style={styles.actionEmoji}>🏋️</Text>
            <Text style={styles.actionText}>Start Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#F59E0B20' }]}>
            <Text style={styles.actionEmoji}>🍎</Text>
            <Text style={styles.actionText}>Log Food</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#3B82F620' }]}>
            <Text style={styles.actionEmoji}>💧</Text>
            <Text style={styles.actionText}>Add Water</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#8B5CF620' }]}>
            <Text style={styles.actionEmoji}>📸</Text>
            <Text style={styles.actionText}>Scan Food</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#EF444420' }]}>
            <Text style={styles.actionEmoji}>📊</Text>
            <Text style={styles.actionText}>View Stats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#6366F120' }]}>
            <Text style={styles.actionEmoji}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  heroSection: {
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  welcomeHeader: {
    marginBottom: 16,
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  achievementsCarousel: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  achievementBadge: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#374151',
    minWidth: 80,
  },
  achievementUnlocked: {
    backgroundColor: '#F59E0B20',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  workoutCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  workoutGradient: {
    padding: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  workoutDuration: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginLeft: 4,
  },
  workoutSeparator: {
    color: 'rgba(255,255,255,0.6)',
    marginHorizontal: 8,
  },
  workoutExercises: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  workoutDifficulty: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealsContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 4,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  mealStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    color: '#94A3B8',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  mealName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  mealCalories: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    width: (width - 60) / 2,
    marginBottom: 16,
    alignItems: 'center',
  },
  goalLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  goalProgress: {
    width: '100%',
    marginBottom: 8,
  },
  goalProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalValue: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    width: (width - 60) / 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    borderRadius: 16,
    padding: 20,
    width: (width - 60) / 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});