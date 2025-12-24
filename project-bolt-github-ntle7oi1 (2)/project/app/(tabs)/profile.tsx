import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Target, Calculator, Trophy, TrendingUp, CreditCard as Edit, Save, X, ChevronDown, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface UserProfile {
  // Basic Information
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  
  // Goals
  primaryGoal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  targetWeight?: number;
  weeklyWeightChangeRate?: number; // kg per week
  
  // Calculated Values
  bmr: number;
  dailyCalories: number;
  dailyWater: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  
  // Gamification
  level: number;
  currentXP: number;
  totalXP: number;
  achievements: string[];
  streak: number;
}

interface ValidationRules {
  age: { min: number; max: number };
  weight: { min: number; max: number };
  height: { min: number; max: number };
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    age: 28,
    weight: 70,
    height: 175,
    gender: 'male',
    activityLevel: 'moderately_active',
    primaryGoal: 'muscle_gain',
    targetWeight: 75,
    weeklyWeightChangeRate: 0.5,
    bmr: 1750,
    dailyCalories: 2713,
    dailyWater: 2.8,
    macros: {
      protein: 140,
      carbs: 340,
      fats: 90,
    },
    level: 12,
    currentXP: 750,
    totalXP: 11750,
    achievements: ['first_workout', 'week_warrior', 'hydration_hero'],
    streak: 7,
  });

  const [editForm, setEditForm] = useState({ ...profile });

  // Validation Rules
  const validationRules: ValidationRules = {
    age: { min: 18, max: 80 },
    weight: { min: 30, max: 300 },
    height: { min: 120, max: 250 },
  };

  // Activity Level Definitions
  const activityLevels = {
    sedentary: { 
      label: 'Sedentary', 
      description: 'Little to no exercise',
      multiplier: 1.2,
      icon: '🛋️'
    },
    lightly_active: { 
      label: 'Lightly Active', 
      description: 'Light exercise 1-3 days/week',
      multiplier: 1.375,
      icon: '🚶'
    },
    moderately_active: { 
      label: 'Moderately Active', 
      description: 'Moderate exercise 3-5 days/week',
      multiplier: 1.55,
      icon: '🏃'
    },
    very_active: { 
      label: 'Very Active', 
      description: 'Hard exercise 6-7 days/week',
      multiplier: 1.725,
      icon: '🏋️'
    },
    extremely_active: { 
      label: 'Extremely Active', 
      description: 'Very hard exercise, physical job',
      multiplier: 1.9,
      icon: '💪'
    },
  };

  // Goal Definitions
  const goalTypes = {
    weight_loss: {
      label: 'Weight Loss',
      description: 'Lose fat while preserving muscle',
      icon: '📉',
      calorieAdjustment: -500, // deficit
      macroRatios: { protein: 0.30, carbs: 0.35, fats: 0.35 },
      weeklyRateRange: { min: 0.25, max: 1.0 },
      xpMultiplier: 1.2,
    },
    muscle_gain: {
      label: 'Muscle Gain',
      description: 'Build muscle and strength',
      icon: '💪',
      calorieAdjustment: 300, // surplus
      macroRatios: { protein: 0.25, carbs: 0.45, fats: 0.30 },
      weeklyRateRange: { min: 0.25, max: 0.75 },
      xpMultiplier: 1.3,
    },
    maintenance: {
      label: 'Maintenance',
      description: 'Maintain current weight and fitness',
      icon: '⚖️',
      calorieAdjustment: 0,
      macroRatios: { protein: 0.25, carbs: 0.40, fats: 0.35 },
      weeklyRateRange: { min: 0, max: 0 },
      xpMultiplier: 1.0,
    },
  };

  // Calculation Functions
  const calculateBMR = (age: number, weight: number, height: number, gender: string): number => {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const calculateDailyCalories = (bmr: number, activityLevel: string, goal: string): number => {
    const activityMultiplier = activityLevels[activityLevel as keyof typeof activityLevels].multiplier;
    const baseCalories = bmr * activityMultiplier;
    const goalAdjustment = goalTypes[goal as keyof typeof goalTypes].calorieAdjustment;
    return Math.round(baseCalories + goalAdjustment);
  };

  const calculateHydration = (weight: number, activityLevel: string): number => {
    let baseWater = weight * 0.035; // 35ml per kg base
    
    // Activity adjustment
    const activityAdjustments = {
      sedentary: 0,
      lightly_active: 0.3,
      moderately_active: 0.5,
      very_active: 0.7,
      extremely_active: 1.0,
    };
    
    const adjustment = activityAdjustments[activityLevel as keyof typeof activityAdjustments];
    return Math.round((baseWater + adjustment) * 10) / 10;
  };

  const calculateMacros = (calories: number, goal: string): { protein: number; carbs: number; fats: number } => {
    const ratios = goalTypes[goal as keyof typeof goalTypes].macroRatios;
    
    return {
      protein: Math.round((calories * ratios.protein) / 4), // 4 cal per gram
      carbs: Math.round((calories * ratios.carbs) / 4), // 4 cal per gram
      fats: Math.round((calories * ratios.fats) / 9), // 9 cal per gram
    };
  };

  // XP and Leveling System
  const calculateLevel = (totalXP: number): number => {
    // Level formula: level = floor(sqrt(totalXP / 100))
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
  };

  const getXPForNextLevel = (currentLevel: number): number => {
    return Math.pow(currentLevel, 2) * 100;
  };

  const getCurrentLevelXP = (currentLevel: number): number => {
    return Math.pow(currentLevel - 1, 2) * 100;
  };

  // Validation Functions
  const validateInput = (field: keyof ValidationRules, value: number): boolean => {
    const rules = validationRules[field];
    return value >= rules.min && value <= rules.max;
  };

  const validateForm = (): boolean => {
    if (!validateInput('age', editForm.age)) {
      Alert.alert('Invalid Age', `Age must be between ${validationRules.age.min} and ${validationRules.age.max}`);
      return false;
    }
    if (!validateInput('weight', editForm.weight)) {
      Alert.alert('Invalid Weight', `Weight must be between ${validationRules.weight.min} and ${validationRules.weight.max} kg`);
      return false;
    }
    if (!validateInput('height', editForm.height)) {
      Alert.alert('Invalid Height', `Height must be between ${validationRules.height.min} and ${validationRules.height.max} cm`);
      return false;
    }
    return true;
  };

  // Update calculations when profile changes
  const updateCalculations = (newProfile: UserProfile): UserProfile => {
    const bmr = calculateBMR(newProfile.age, newProfile.weight, newProfile.height, newProfile.gender);
    const dailyCalories = calculateDailyCalories(bmr, newProfile.activityLevel, newProfile.primaryGoal);
    const dailyWater = calculateHydration(newProfile.weight, newProfile.activityLevel);
    const macros = calculateMacros(dailyCalories, newProfile.primaryGoal);
    const level = calculateLevel(newProfile.totalXP);
    const currentLevelXP = getCurrentLevelXP(level);
    const currentXP = newProfile.totalXP - currentLevelXP;

    return {
      ...newProfile,
      bmr,
      dailyCalories,
      dailyWater,
      macros,
      level,
      currentXP,
    };
  };

  const saveProfile = () => {
    if (!validateForm()) return;

    const updatedProfile = updateCalculations(editForm);
    setProfile(updatedProfile);
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your profile has been successfully updated!');
  };

  const cancelEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const renderBasicInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Age</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editForm.age.toString()}
              onChangeText={(text) => setEditForm({ ...editForm, age: parseInt(text) || 0 })}
              keyboardType="numeric"
              placeholder="Age"
            />
          ) : (
            <Text style={styles.infoValue}>{profile.age} years</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Weight</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editForm.weight.toString()}
              onChangeText={(text) => setEditForm({ ...editForm, weight: parseFloat(text) || 0 })}
              keyboardType="numeric"
              placeholder="Weight (kg)"
            />
          ) : (
            <Text style={styles.infoValue}>{profile.weight} kg</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Height</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editForm.height.toString()}
              onChangeText={(text) => setEditForm({ ...editForm, height: parseInt(text) || 0 })}
              keyboardType="numeric"
              placeholder="Height (cm)"
            />
          ) : (
            <Text style={styles.infoValue}>{profile.height} cm</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Gender</Text>
          {isEditing ? (
            <View style={styles.genderContainer}>
              {['male', 'female', 'other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderButton,
                    editForm.gender === gender && styles.genderButtonActive
                  ]}
                  onPress={() => setEditForm({ ...editForm, gender: gender as any })}
                >
                  <Text style={[
                    styles.genderText,
                    editForm.gender === gender && styles.genderTextActive
                  ]}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.infoValue}>
              {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderActivityLevel = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Activity Level</Text>
      <TouchableOpacity 
        style={styles.activityCard}
        onPress={() => isEditing && setShowActivityModal(true)}
        disabled={!isEditing}
      >
        <Text style={styles.activityIcon}>
          {activityLevels[profile.activityLevel].icon}
        </Text>
        <View style={styles.activityInfo}>
          <Text style={styles.activityLabel}>
            {activityLevels[profile.activityLevel].label}
          </Text>
          <Text style={styles.activityDescription}>
            {activityLevels[profile.activityLevel].description}
          </Text>
        </View>
        {isEditing && <ChevronRight size={20} color="#94A3B8" />}
      </TouchableOpacity>
    </View>
  );

  const renderGoals = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fitness Goals</Text>
      <TouchableOpacity 
        style={styles.goalCard}
        onPress={() => isEditing && setShowGoalModal(true)}
        disabled={!isEditing}
      >
        <Text style={styles.goalIcon}>
          {goalTypes[profile.primaryGoal].icon}
        </Text>
        <View style={styles.goalInfo}>
          <Text style={styles.goalLabel}>
            {goalTypes[profile.primaryGoal].label}
          </Text>
          <Text style={styles.goalDescription}>
            {goalTypes[profile.primaryGoal].description}
          </Text>
          {profile.targetWeight && (
            <Text style={styles.goalTarget}>
              Target: {profile.targetWeight} kg ({profile.weeklyWeightChangeRate} kg/week)
            </Text>
          )}
        </View>
        {isEditing && <ChevronRight size={20} color="#94A3B8" />}
      </TouchableOpacity>
    </View>
  );

  const renderCalculatedValues = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Calculated Recommendations</Text>
      <View style={styles.calculatedGrid}>
        <View style={styles.calculatedItem}>
          <Text style={styles.calculatedLabel}>BMR</Text>
          <Text style={styles.calculatedValue}>{profile.bmr}</Text>
          <Text style={styles.calculatedUnit}>kcal/day</Text>
        </View>
        
        <View style={styles.calculatedItem}>
          <Text style={styles.calculatedLabel}>Daily Calories</Text>
          <Text style={styles.calculatedValue}>{profile.dailyCalories}</Text>
          <Text style={styles.calculatedUnit}>kcal</Text>
        </View>
        
        <View style={styles.calculatedItem}>
          <Text style={styles.calculatedLabel}>Water Intake</Text>
          <Text style={styles.calculatedValue}>{profile.dailyWater}</Text>
          <Text style={styles.calculatedUnit}>liters</Text>
        </View>
        
        <View style={styles.calculatedItem}>
          <Text style={styles.calculatedLabel}>Protein</Text>
          <Text style={styles.calculatedValue}>{profile.macros.protein}</Text>
          <Text style={styles.calculatedUnit}>grams</Text>
        </View>
        
        <View style={styles.calculatedItem}>
          <Text style={styles.calculatedLabel}>Carbs</Text>
          <Text style={styles.calculatedValue}>{profile.macros.carbs}</Text>
          <Text style={styles.calculatedUnit}>grams</Text>
        </View>
        
        <View style={styles.calculatedItem}>
          <Text style={styles.calculatedLabel}>Fats</Text>
          <Text style={styles.calculatedValue}>{profile.macros.fats}</Text>
          <Text style={styles.calculatedUnit}>grams</Text>
        </View>
      </View>
    </View>
  );

  const renderRPGStats = () => {
    const nextLevelXP = getXPForNextLevel(profile.level);
    const currentLevelXP = getCurrentLevelXP(profile.level);
    const xpProgress = ((profile.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RPG Progress</Text>
        <View style={styles.rpgCard}>
          <View style={styles.rpgHeader}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{profile.level}</Text>
            </View>
            <View style={styles.rpgInfo}>
              <Text style={styles.rpgTitle}>Fitness Warrior</Text>
              <Text style={styles.rpgSubtitle}>
                {profile.currentXP} / {nextLevelXP - currentLevelXP} XP to next level
              </Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {profile.streak}</Text>
            </View>
          </View>
          
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${xpProgress}%` }]} />
          </View>
          
          <View style={styles.rpgStats}>
            <Text style={styles.rpgStat}>Total XP: {profile.totalXP.toLocaleString()}</Text>
            <Text style={styles.rpgStat}>Achievements: {profile.achievements.length}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6B46C1', '#8B5CF6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <User size={32} color="white" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Your Profile</Text>
              <Text style={styles.headerSubtitle}>Fitness Journey Dashboard</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => isEditing ? saveProfile() : setIsEditing(true)}
          >
            {isEditing ? <Save size={20} color="white" /> : <Edit size={20} color="white" />}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {renderRPGStats()}
        {renderBasicInfo()}
        {renderActivityLevel()}
        {renderGoals()}
        {renderCalculatedValues()}

        {isEditing && (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
              <X size={20} color="#EF4444" />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Save size={20} color="white" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Activity Level Modal */}
      <Modal visible={showActivityModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Activity Level</Text>
            {Object.entries(activityLevels).map(([key, activity]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.modalOption,
                  editForm.activityLevel === key && styles.modalOptionActive
                ]}
                onPress={() => {
                  setEditForm({ ...editForm, activityLevel: key as any });
                  setShowActivityModal(false);
                }}
              >
                <Text style={styles.modalOptionIcon}>{activity.icon}</Text>
                <View style={styles.modalOptionInfo}>
                  <Text style={styles.modalOptionLabel}>{activity.label}</Text>
                  <Text style={styles.modalOptionDescription}>{activity.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowActivityModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Goal Selection Modal */}
      <Modal visible={showGoalModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Your Goal</Text>
            {Object.entries(goalTypes).map(([key, goal]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.modalOption,
                  editForm.primaryGoal === key && styles.modalOptionActive
                ]}
                onPress={() => {
                  setEditForm({ ...editForm, primaryGoal: key as any });
                  setShowGoalModal(false);
                }}
              >
                <Text style={styles.modalOptionIcon}>{goal.icon}</Text>
                <View style={styles.modalOptionInfo}>
                  <Text style={styles.modalOptionLabel}>{goal.label}</Text>
                  <Text style={styles.modalOptionDescription}>{goal.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowGoalModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoGrid: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 16,
  },
  infoValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 8,
    color: 'white',
    fontSize: 16,
    minWidth: 80,
    textAlign: 'right',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  genderButtonActive: {
    backgroundColor: '#6B46C1',
  },
  genderText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  genderTextActive: {
    color: 'white',
  },
  activityCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityDescription: {
    color: '#94A3B8',
    fontSize: 14,
  },
  goalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  goalDescription: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  goalTarget: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
  },
  calculatedGrid: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calculatedItem: {
    width: (width - 72) / 3,
    alignItems: 'center',
    marginBottom: 16,
  },
  calculatedLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  calculatedValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  calculatedUnit: {
    color: '#6B7280',
    fontSize: 10,
  },
  rpgCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
  },
  rpgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  levelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rpgInfo: {
    flex: 1,
  },
  rpgTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  rpgSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
  },
  streakBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  streakText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  xpBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginBottom: 12,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  rpgStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rpgStat: {
    color: '#94A3B8',
    fontSize: 14,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 16,
    padding: 16,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: width - 40,
    maxHeight: '80%',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#374151',
  },
  modalOptionActive: {
    backgroundColor: '#6B46C1',
  },
  modalOptionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  modalOptionInfo: {
    flex: 1,
  },
  modalOptionLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalOptionDescription: {
    color: '#94A3B8',
    fontSize: 14,
  },
  modalCloseButton: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});