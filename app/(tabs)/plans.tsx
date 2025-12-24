import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Target, Dumbbell, Utensils, Droplets, Moon, Sun, ChevronDown, Play, RefreshCw, Calendar } from 'lucide-react-native';
import XPSystem from '@/components/XPSystem';
import CharacterAvatar from '@/components/CharacterAvatar';
import StreakCounter from '@/components/StreakCounter';

const { width } = Dimensions.get('window');

interface UserPreferences {
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  workoutTime: number; // minutes
  dietaryRestrictions: string[];
  targetCalories?: number;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  instructions: string[];
  modifications: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
}

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string[];
  alternatives: string[];
  prepTime: number;
}

interface DailyPlan {
  workout: {
    warmup: Exercise[];
    main: Exercise[];
    cooldown: Exercise[];
    totalTime: number;
  };
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snack1: Meal;
    snack2: Meal;
  };
  timeline: TimelineItem[];
  totalCalories: number;
  totalMacros: { protein: number; carbs: number; fats: number };
}

interface TimelineItem {
  time: string;
  activity: string;
  details: string;
  type: 'meal' | 'workout' | 'hydration' | 'rest';
  calories?: number;
}

export default function PlansPage() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    fitnessGoal: 'muscle_gain',
    fitnessLevel: 'intermediate',
    workoutTime: 45,
    dietaryRestrictions: [],
    targetCalories: 2500,
  });
  const [currentPlan, setCurrentPlan] = useState<DailyPlan | null>(null);
  const [selectedTab, setSelectedTab] = useState<'timeline' | 'workout' | 'meals'>('timeline');

  // Mock user data for gamification
  const [userGameData] = useState({
    level: 12,
    currentXP: 750,
    maxXP: 1000,
    className: 'Fitness Paladin',
    rank: 'Warrior',
    attributes: {
      strength: 78,
      endurance: 65,
      agility: 82,
      discipline: 71,
    },
    streaks: {
      workout: { current: 7, best: 15, active: true },
      nutrition: { current: 5, best: 12, active: true },
      hydration: { current: 10, best: 18, active: true },
    }
  });

  const fitnessGoals = {
    weight_loss: { label: 'Weight Loss', icon: '📉', calorieAdjustment: -500 },
    muscle_gain: { label: 'Muscle Gain', icon: '💪', calorieAdjustment: 300 },
    maintenance: { label: 'Maintenance', icon: '⚖️', calorieAdjustment: 0 },
    endurance: { label: 'Endurance', icon: '🏃', calorieAdjustment: 200 },
  };

  const fitnessLevels = {
    beginner: { label: 'Beginner', icon: '🌱' },
    intermediate: { label: 'Intermediate', icon: '🔥' },
    advanced: { label: 'Advanced', icon: '⚡' },
  };

  const generateWorkoutPlan = (prefs: UserPreferences) => {
    const workoutPlans = {
      weight_loss: {
        warmup: [
          {
            name: 'Dynamic Warm-up',
            sets: 1,
            reps: '5-10 minutes',
            restTime: 0,
            instructions: [
              'Arm circles (30 seconds each direction)',
              'Leg swings (30 seconds each leg)',
              'Hip circles (30 seconds each direction)',
              'Light cardio (marching in place, jumping jacks)',
            ],
            modifications: {
              beginner: 'Take breaks as needed, focus on form',
              intermediate: 'Maintain steady pace throughout',
              advanced: 'Add dynamic stretches and mobility work',
            },
          },
        ],
        main: [
          {
            name: 'Burpees',
            sets: prefs.fitnessLevel === 'beginner' ? 3 : prefs.fitnessLevel === 'intermediate' ? 4 : 5,
            reps: prefs.fitnessLevel === 'beginner' ? '5-8' : prefs.fitnessLevel === 'intermediate' ? '8-12' : '12-15',
            restTime: 60,
            instructions: [
              'Start standing, squat down and place hands on floor',
              'Jump feet back into plank position',
              'Perform push-up (optional for beginners)',
              'Jump feet back to squat, then jump up with arms overhead',
            ],
            modifications: {
              beginner: 'Step back instead of jumping, skip push-up',
              intermediate: 'Include push-up, maintain good form',
              advanced: 'Add tuck jump at the top',
            },
          },
          {
            name: 'Mountain Climbers',
            sets: prefs.fitnessLevel === 'beginner' ? 3 : 4,
            reps: prefs.fitnessLevel === 'beginner' ? '20 seconds' : prefs.fitnessLevel === 'intermediate' ? '30 seconds' : '45 seconds',
            restTime: 45,
            instructions: [
              'Start in plank position',
              'Alternate bringing knees to chest rapidly',
              'Keep core tight and hips level',
              'Maintain steady breathing',
            ],
            modifications: {
              beginner: 'Slow pace, focus on form',
              intermediate: 'Moderate pace, maintain plank',
              advanced: 'Fast pace, add cross-body movement',
            },
          },
          {
            name: 'Jump Squats',
            sets: prefs.fitnessLevel === 'beginner' ? 3 : 4,
            reps: prefs.fitnessLevel === 'beginner' ? '8-10' : prefs.fitnessLevel === 'intermediate' ? '12-15' : '15-20',
            restTime: 60,
            instructions: [
              'Stand with feet shoulder-width apart',
              'Squat down keeping chest up',
              'Explode up into a jump',
              'Land softly and immediately go into next rep',
            ],
            modifications: {
              beginner: 'Regular squats without jump',
              intermediate: 'Small jump, focus on landing',
              advanced: 'High jump, add arm movement',
            },
          },
          {
            name: 'High-Intensity Intervals',
            sets: prefs.fitnessLevel === 'beginner' ? 4 : prefs.fitnessLevel === 'intermediate' ? 6 : 8,
            reps: '30 sec work / 30 sec rest',
            restTime: 30,
            instructions: [
              'Choose: jumping jacks, high knees, or butt kicks',
              'Work at maximum effort for 30 seconds',
              'Rest for 30 seconds',
              'Repeat for specified sets',
            ],
            modifications: {
              beginner: '20 sec work / 40 sec rest',
              intermediate: '30 sec work / 30 sec rest',
              advanced: '40 sec work / 20 sec rest',
            },
          },
        ],
        cooldown: [
          {
            name: 'Cool-down Stretches',
            sets: 1,
            reps: '5-10 minutes',
            restTime: 0,
            instructions: [
              'Forward fold (30 seconds)',
              'Quad stretch (30 seconds each leg)',
              'Calf stretch (30 seconds each leg)',
              'Shoulder stretch (30 seconds each arm)',
              'Deep breathing (2 minutes)',
            ],
            modifications: {
              beginner: 'Hold stretches gently, don\'t force',
              intermediate: 'Hold stretches with slight tension',
              advanced: 'Add deeper stretches and yoga poses',
            },
          },
        ],
      },
      muscle_gain: {
        warmup: [
          {
            name: 'Dynamic Warm-up',
            sets: 1,
            reps: '8-10 minutes',
            restTime: 0,
            instructions: [
              'Arm swings and circles (2 minutes)',
              'Bodyweight squats (1 minute)',
              'Push-up to downward dog (1 minute)',
              'Leg swings and hip circles (2 minutes)',
              'Light resistance band work (2 minutes)',
            ],
            modifications: {
              beginner: 'Focus on mobility and activation',
              intermediate: 'Add light resistance movements',
              advanced: 'Include compound movement patterns',
            },
          },
        ],
        main: [
          {
            name: 'Push-ups (Chest Focus)',
            sets: prefs.fitnessLevel === 'beginner' ? 3 : prefs.fitnessLevel === 'intermediate' ? 4 : 5,
            reps: prefs.fitnessLevel === 'beginner' ? '8-12' : prefs.fitnessLevel === 'intermediate' ? '12-15' : '15-20',
            restTime: 90,
            instructions: [
              'Start in plank position, hands slightly wider than shoulders',
              'Lower chest to floor with control',
              'Push back up maintaining straight line',
              'Focus on chest contraction at top',
            ],
            modifications: {
              beginner: 'Knee push-ups or incline push-ups',
              intermediate: 'Standard push-ups, focus on form',
              advanced: 'Decline push-ups or weighted vest',
            },
          },
          {
            name: 'Bodyweight Squats',
            sets: prefs.fitnessLevel === 'beginner' ? 3 : 4,
            reps: prefs.fitnessLevel === 'beginner' ? '12-15' : prefs.fitnessLevel === 'intermediate' ? '15-20' : '20-25',
            restTime: 75,
            instructions: [
              'Stand with feet shoulder-width apart',
              'Lower down as if sitting in chair',
              'Keep chest up and knees behind toes',
              'Drive through heels to stand',
            ],
            modifications: {
              beginner: 'Use chair for support if needed',
              intermediate: 'Full range of motion squats',
              advanced: 'Jump squats or single-leg squats',
            },
          },
          {
            name: 'Pike Push-ups (Shoulders)',
            sets: prefs.fitnessLevel === 'beginner' ? 3 : 4,
            reps: prefs.fitnessLevel === 'beginner' ? '6-10' : prefs.fitnessLevel === 'intermediate' ? '10-12' : '12-15',
            restTime: 90,
            instructions: [
              'Start in downward dog position',
              'Lower head toward floor between hands',
              'Push back up to starting position',
              'Keep legs as straight as possible',
            ],
            modifications: {
              beginner: 'Elevate feet on low surface',
              intermediate: 'Standard pike push-ups',
              advanced: 'Feet elevated on high surface',
            },
          },
          {
            name: 'Tricep Dips',
            sets: prefs.fitnessLevel === 'beginner' ? 3 : 4,
            reps: prefs.fitnessLevel === 'beginner' ? '8-12' : prefs.fitnessLevel === 'intermediate' ? '12-15' : '15-20',
            restTime: 75,
            instructions: [
              'Sit on edge of chair or bench',
              'Place hands beside hips, slide forward',
              'Lower body by bending elbows',
              'Push back up focusing on triceps',
            ],
            modifications: {
              beginner: 'Feet flat on floor, shallow dips',
              intermediate: 'Legs extended, full range',
              advanced: 'Feet elevated, add weight',
            },
          },
          {
            name: 'Plank to Push-up',
            sets: prefs.fitnessLevel === 'beginner' ? 3 : 4,
            reps: prefs.fitnessLevel === 'beginner' ? '5-8' : prefs.fitnessLevel === 'intermediate' ? '8-12' : '12-15',
            restTime: 90,
            instructions: [
              'Start in forearm plank position',
              'Push up to high plank one arm at a time',
              'Lower back to forearm plank',
              'Alternate leading arm each rep',
            ],
            modifications: {
              beginner: 'From knees, focus on control',
              intermediate: 'Full plank, steady pace',
              advanced: 'Add push-up at top position',
            },
          },
        ],
        cooldown: [
          {
            name: 'Muscle Recovery Stretches',
            sets: 1,
            reps: '8-10 minutes',
            restTime: 0,
            instructions: [
              'Chest doorway stretch (1 minute)',
              'Overhead tricep stretch (1 minute each arm)',
              'Hip flexor stretch (1 minute each leg)',
              'Hamstring stretch (1 minute each leg)',
              'Spinal twist (1 minute each side)',
              'Child\'s pose (2 minutes)',
            ],
            modifications: {
              beginner: 'Gentle stretches, hold comfortably',
              intermediate: 'Moderate stretch with breathing',
              advanced: 'Deep stretches, add PNF techniques',
            },
          },
        ],
      },
    };

    const selectedPlan = workoutPlans[prefs.fitnessGoal] || workoutPlans.muscle_gain;
    const totalTime = 10 + (selectedPlan.main.length * 3) + 8; // Rough estimate

    return {
      warmup: selectedPlan.warmup,
      main: selectedPlan.main,
      cooldown: selectedPlan.cooldown,
      totalTime: Math.min(totalTime, prefs.workoutTime),
    };
  };

  const generateMealPlan = (prefs: UserPreferences) => {
    const baseCalories = prefs.targetCalories || 2000;
    const goalAdjustment = fitnessGoals[prefs.fitnessGoal].calorieAdjustment;
    const targetCalories = baseCalories + goalAdjustment;

    const mealPlans = {
      weight_loss: {
        breakfast: {
          name: 'Protein Power Bowl',
          calories: Math.round(targetCalories * 0.25),
          protein: 25,
          carbs: 30,
          fats: 12,
          ingredients: [
            '2 eggs (scrambled or poached)',
            '1/2 cup oatmeal',
            '1/2 cup berries',
            '1 tbsp almond butter',
            '1 cup spinach',
            '1/4 avocado',
          ],
          instructions: [
            'Cook oatmeal according to package directions',
            'Scramble eggs with spinach',
            'Top oatmeal with berries and almond butter',
            'Serve with eggs and avocado slices',
          ],
          alternatives: [
            'Greek yogurt parfait with granola and fruit',
            'Vegetable omelet with whole grain toast',
            'Smoothie bowl with protein powder and toppings',
          ],
          prepTime: 15,
        },
        lunch: {
          name: 'Mediterranean Salad Bowl',
          calories: Math.round(targetCalories * 0.30),
          protein: 30,
          carbs: 25,
          fats: 15,
          ingredients: [
            '4 oz grilled chicken breast',
            '2 cups mixed greens',
            '1/2 cup quinoa',
            '1/4 cup chickpeas',
            '1/4 cup cucumber',
            '2 tbsp feta cheese',
            '1 tbsp olive oil vinaigrette',
          ],
          instructions: [
            'Cook quinoa and let cool',
            'Grill chicken breast with herbs',
            'Combine greens, quinoa, and vegetables',
            'Top with chicken, feta, and dressing',
          ],
          alternatives: [
            'Turkey and hummus wrap with vegetables',
            'Lentil soup with side salad',
            'Grilled fish with roasted vegetables',
          ],
          prepTime: 20,
        },
        dinner: {
          name: 'Lean Protein & Vegetables',
          calories: Math.round(targetCalories * 0.35),
          protein: 35,
          carbs: 20,
          fats: 18,
          ingredients: [
            '5 oz white fish or chicken',
            '2 cups steamed broccoli',
            '1/2 cup brown rice',
            '1 tbsp olive oil',
            'Herbs and spices',
            '1 cup mixed vegetables',
          ],
          instructions: [
            'Season and bake protein at 375°F for 20-25 minutes',
            'Steam vegetables until tender-crisp',
            'Cook brown rice according to package',
            'Drizzle with olive oil and season',
          ],
          alternatives: [
            'Grilled salmon with asparagus and sweet potato',
            'Turkey meatballs with zucchini noodles',
            'Tofu stir-fry with brown rice',
          ],
          prepTime: 25,
        },
        snack1: {
          name: 'Apple & Almond Butter',
          calories: Math.round(targetCalories * 0.05),
          protein: 4,
          carbs: 15,
          fats: 8,
          ingredients: ['1 medium apple', '1 tbsp almond butter'],
          instructions: ['Slice apple', 'Serve with almond butter for dipping'],
          alternatives: ['Celery with peanut butter', 'Greek yogurt with berries', 'Handful of nuts'],
          prepTime: 2,
        },
        snack2: {
          name: 'Protein Smoothie',
          calories: Math.round(targetCalories * 0.05),
          protein: 20,
          carbs: 10,
          fats: 3,
          ingredients: ['1 scoop protein powder', '1 cup unsweetened almond milk', '1/2 banana', 'Ice'],
          instructions: ['Blend all ingredients until smooth', 'Serve immediately'],
          alternatives: ['Hard-boiled egg with vegetables', 'Cottage cheese with fruit', 'Protein bar'],
          prepTime: 3,
        },
      },
      muscle_gain: {
        breakfast: {
          name: 'Muscle Building Breakfast',
          calories: Math.round(targetCalories * 0.25),
          protein: 35,
          carbs: 45,
          fats: 20,
          ingredients: [
            '3 whole eggs + 2 egg whites',
            '1 cup oatmeal',
            '1 banana',
            '2 tbsp peanut butter',
            '1 cup whole milk',
            '1/4 cup blueberries',
          ],
          instructions: [
            'Cook oatmeal with milk',
            'Scramble eggs with minimal oil',
            'Top oatmeal with banana, berries, and peanut butter',
            'Serve with eggs on the side',
          ],
          alternatives: [
            'Protein pancakes with Greek yogurt',
            'Breakfast burrito with eggs and beans',
            'Overnight oats with protein powder',
          ],
          prepTime: 12,
        },
        lunch: {
          name: 'Power Lunch Bowl',
          calories: Math.round(targetCalories * 0.30),
          protein: 40,
          carbs: 50,
          fats: 22,
          ingredients: [
            '6 oz lean ground turkey',
            '1 cup brown rice',
            '1/2 cup black beans',
            '1/4 avocado',
            '1/4 cup shredded cheese',
            'Mixed vegetables',
            '2 tbsp olive oil',
          ],
          instructions: [
            'Cook ground turkey with spices',
            'Prepare brown rice',
            'Warm black beans',
            'Combine in bowl with vegetables',
            'Top with avocado and cheese',
          ],
          alternatives: [
            'Chicken and quinoa power bowl',
            'Tuna sandwich with sweet potato',
            'Beef and rice stir-fry',
          ],
          prepTime: 18,
        },
        dinner: {
          name: 'Anabolic Dinner',
          calories: Math.round(targetCalories * 0.35),
          protein: 45,
          carbs: 40,
          fats: 25,
          ingredients: [
            '7 oz salmon or lean beef',
            '1.5 cups sweet potato',
            '2 cups mixed vegetables',
            '2 tbsp olive oil',
            '1/4 cup nuts',
            'Herbs and seasonings',
          ],
          instructions: [
            'Bake sweet potato at 400°F for 45 minutes',
            'Grill or bake protein with seasonings',
            'Sauté vegetables in olive oil',
            'Serve together with nuts as garnish',
          ],
          alternatives: [
            'Chicken thighs with pasta and vegetables',
            'Lean steak with quinoa and asparagus',
            'Pork tenderloin with rice and broccoli',
          ],
          prepTime: 30,
        },
        snack1: {
          name: 'Post-Workout Shake',
          calories: Math.round(targetCalories * 0.05),
          protein: 25,
          carbs: 20,
          fats: 5,
          ingredients: ['1 scoop whey protein', '1 cup whole milk', '1/2 banana', '1 tbsp honey'],
          instructions: ['Blend all ingredients', 'Consume within 30 minutes post-workout'],
          alternatives: ['Chocolate milk and banana', 'Greek yogurt with granola', 'Protein bar with fruit'],
          prepTime: 2,
        },
        snack2: {
          name: 'Muscle Building Snack',
          calories: Math.round(targetCalories * 0.05),
          protein: 15,
          carbs: 25,
          fats: 12,
          ingredients: ['1/4 cup mixed nuts', '1 large apple', '1 string cheese'],
          instructions: ['Slice apple', 'Serve with nuts and cheese'],
          alternatives: ['Trail mix with dried fruit', 'Whole grain crackers with hummus', 'Cottage cheese with fruit'],
          prepTime: 3,
        },
      },
    };

    return mealPlans[prefs.fitnessGoal] || mealPlans.muscle_gain;
  };

  const generateTimeline = (workout: any, meals: any): TimelineItem[] => [
    { time: '6:00 AM', activity: 'Wake Up & Hydration', details: 'Drink 16-20 oz water', type: 'hydration' },
    { time: '7:00 AM', activity: 'Breakfast', details: meals.breakfast.name, type: 'meal', calories: meals.breakfast.calories },
    { time: '9:00 AM', activity: 'Workout', details: `${workout.totalTime} min ${preferences.fitnessGoal.replace('_', ' ')} workout`, type: 'workout' },
    { time: '10:30 AM', activity: 'Post-Workout', details: meals.snack1.name, type: 'meal', calories: meals.snack1.calories },
    { time: '11:00 AM', activity: 'Hydration', details: 'Drink 12-16 oz water', type: 'hydration' },
    { time: '1:00 PM', activity: 'Lunch', details: meals.lunch.name, type: 'meal', calories: meals.lunch.calories },
    { time: '3:00 PM', activity: 'Hydration', details: 'Drink 12-16 oz water', type: 'hydration' },
    { time: '4:00 PM', activity: 'Afternoon Snack', details: meals.snack2.name, type: 'meal', calories: meals.snack2.calories },
    { time: '6:30 PM', activity: 'Dinner', details: meals.dinner.name, type: 'meal', calories: meals.dinner.calories },
    { time: '8:00 PM', activity: 'Evening Hydration', details: 'Drink 8-12 oz water', type: 'hydration' },
    { time: '10:00 PM', activity: 'Wind Down', details: 'Prepare for sleep, light stretching', type: 'rest' },
    { time: '10:30 PM', activity: 'Sleep', details: '7-9 hours of quality sleep', type: 'rest' },
  ];

  const generatePlan = () => {
    const workout = generateWorkoutPlan(preferences);
    const meals = generateMealPlan(preferences);
    const timeline = generateTimeline(workout, meals);
    
    const totalCalories = Object.values(meals).reduce((sum, meal) => sum + meal.calories, 0);
    const totalMacros = Object.values(meals).reduce(
      (totals, meal) => ({
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fats: totals.fats + meal.fats,
      }),
      { protein: 0, carbs: 0, fats: 0 }
    );

    setCurrentPlan({
      workout,
      meals,
      timeline,
      totalCalories,
      totalMacros,
    });
  };

  const renderTimeline = () => (
    <ScrollView style={styles.timelineContainer}>
      {currentPlan?.timeline.map((item, index) => (
        <View key={index} style={styles.timelineItem}>
          <View style={styles.timelineTime}>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <View style={[styles.timelineDot, { backgroundColor: getActivityColor(item.type) }]} />
          <View style={styles.timelineContent}>
            <Text style={styles.activityTitle}>{item.activity}</Text>
            <Text style={styles.activityDetails}>{item.details}</Text>
            {item.calories && (
              <Text style={styles.calorieInfo}>{item.calories} kcal</Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderWorkout = () => (
    <ScrollView style={styles.workoutContainer}>
      {/* Warm-up */}
      <View style={styles.workoutSection}>
        <Text style={styles.sectionTitle}>🔥 Warm-up (5-10 min)</Text>
        {currentPlan?.workout.warmup.map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseReps}>{exercise.reps}</Text>
            <Text style={styles.exerciseInstructions}>
              {exercise.instructions.join(' • ')}
            </Text>
            <Text style={styles.exerciseModification}>
              {preferences.fitnessLevel}: {exercise.modifications[preferences.fitnessLevel]}
            </Text>
          </View>
        ))}
      </View>

      {/* Main Workout */}
      <View style={styles.workoutSection}>
        <Text style={styles.sectionTitle}>💪 Main Workout</Text>
        {currentPlan?.workout.main.map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseSets}>{exercise.sets} sets</Text>
            </View>
            <Text style={styles.exerciseReps}>{exercise.reps} reps • {exercise.restTime}s rest</Text>
            <Text style={styles.exerciseInstructions}>
              {exercise.instructions.join(' • ')}
            </Text>
            <Text style={styles.exerciseModification}>
              {preferences.fitnessLevel}: {exercise.modifications[preferences.fitnessLevel]}
            </Text>
          </View>
        ))}
      </View>

      {/* Cool-down */}
      <View style={styles.workoutSection}>
        <Text style={styles.sectionTitle}>🧘 Cool-down (5-10 min)</Text>
        {currentPlan?.workout.cooldown.map((exercise, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.exerciseReps}>{exercise.reps}</Text>
            <Text style={styles.exerciseInstructions}>
              {exercise.instructions.join(' • ')}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderMeals = () => (
    <ScrollView style={styles.mealsContainer}>
      <View style={styles.macroSummary}>
        <Text style={styles.macroTitle}>Daily Nutrition Summary</Text>
        <Text style={styles.totalCalories}>{currentPlan?.totalCalories} kcal</Text>
        <View style={styles.macroBreakdown}>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{currentPlan?.totalMacros.protein}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{currentPlan?.totalMacros.carbs}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Fats</Text>
            <Text style={styles.macroValue}>{currentPlan?.totalMacros.fats}g</Text>
          </View>
        </View>
      </View>

      {currentPlan && Object.entries(currentPlan.meals).map(([mealType, meal]) => (
        <View key={mealType} style={styles.mealCard}>
          <Text style={styles.mealType}>{mealType.toUpperCase()}</Text>
          <Text style={styles.mealName}>{meal.name}</Text>
          <Text style={styles.mealCalories}>{meal.calories} kcal • Prep: {meal.prepTime} min</Text>
          
          <View style={styles.mealMacros}>
            <Text style={styles.mealMacro}>P: {meal.protein}g</Text>
            <Text style={styles.mealMacro}>C: {meal.carbs}g</Text>
            <Text style={styles.mealMacro}>F: {meal.fats}g</Text>
          </View>

          <Text style={styles.ingredientsTitle}>Ingredients:</Text>
          {meal.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
          ))}

          <Text style={styles.instructionsTitle}>Instructions:</Text>
          {meal.instructions.map((instruction, index) => (
            <Text key={index} style={styles.instruction}>{index + 1}. {instruction}</Text>
          ))}

          <Text style={styles.alternativesTitle}>Alternatives:</Text>
          {meal.alternatives.map((alternative, index) => (
            <Text key={index} style={styles.alternative}>• {alternative}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'meal': return '#10B981';
      case 'workout': return '#F59E0B';
      case 'hydration': return '#3B82F6';
      case 'rest': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6B46C1', '#8B5CF6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Daily Plans</Text>
        <Text style={styles.headerSubtitle}>Personalized workout & nutrition</Text>
        
        {/* XP System */}
        <XPSystem
          currentXP={userGameData.currentXP}
          maxXP={userGameData.maxXP}
          level={userGameData.level}
        />
        
        <TouchableOpacity 
          style={styles.preferencesButton}
          onPress={() => setShowPreferences(true)}
        >
          <Target size={20} color="white" />
          <Text style={styles.preferencesText}>Set Preferences</Text>
        </TouchableOpacity>
      </LinearGradient>

      {!currentPlan ? (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Create Your Personalized Plan</Text>
          
          {/* Character Avatar */}
          <CharacterAvatar
            level={userGameData.level}
            className={userGameData.className}
            rank={userGameData.rank}
            attributes={userGameData.attributes}
          />
          <Text style={styles.welcomeText}>
            Set your preferences to generate a complete daily workout and nutrition plan tailored to your goals.
          </Text>
          <TouchableOpacity style={styles.generateButton} onPress={() => setShowPreferences(true)}>
            <Play size={20} color="white" />
            <Text style={styles.generateButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {[
              { key: 'timeline', label: 'Timeline', icon: Calendar },
              { key: 'workout', label: 'Workout', icon: Dumbbell },
              { key: 'meals', label: 'Meals', icon: Utensils },
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
          <View style={styles.content}>
            {selectedTab === 'timeline' && renderTimeline()}
            {selectedTab === 'workout' && renderWorkout()}
            {selectedTab === 'meals' && renderMeals()}
          </View>

          {/* Regenerate Button */}
          <TouchableOpacity style={styles.regenerateButton} onPress={generatePlan}>
            <RefreshCw size={20} color="white" />
            <Text style={styles.regenerateText}>Generate New Plan</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Preferences Modal */}
      <Modal visible={showPreferences} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Your Preferences</Text>
            
            {/* Fitness Goal */}
            <Text style={styles.preferenceLabel}>Fitness Goal</Text>
            <View style={styles.optionsGrid}>
              {Object.entries(fitnessGoals).map(([key, goal]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionButton,
                    preferences.fitnessGoal === key && styles.optionButtonActive
                  ]}
                  onPress={() => setPreferences({ ...preferences, fitnessGoal: key as any })}
                >
                  <Text style={styles.optionEmoji}>{goal.icon}</Text>
                  <Text style={styles.optionText}>{goal.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Fitness Level */}
            <Text style={styles.preferenceLabel}>Fitness Level</Text>
            <View style={styles.optionsGrid}>
              {Object.entries(fitnessLevels).map(([key, level]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionButton,
                    preferences.fitnessLevel === key && styles.optionButtonActive
                  ]}
                  onPress={() => setPreferences({ ...preferences, fitnessLevel: key as any })}
                >
                  <Text style={styles.optionEmoji}>{level.icon}</Text>
                  <Text style={styles.optionText}>{level.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Workout Time */}
            <Text style={styles.preferenceLabel}>Available Workout Time</Text>
            <View style={styles.timeOptions}>
              {[15, 30, 45, 60, 90].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    preferences.workoutTime === time && styles.timeButtonActive
                  ]}
                  onPress={() => setPreferences({ ...preferences, workoutTime: time })}
                >
                  <Text style={[
                    styles.timeButtonText,
                    preferences.workoutTime === time && styles.timeButtonTextActive
                  ]}>
                    {time} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.generatePlanButton}
                onPress={() => {
                  generatePlan();
                  setShowPreferences(false);
                }}
              >
                <Text style={styles.generatePlanText}>Generate Plan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPreferences(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    marginBottom: 16,
  },
  preferencesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  preferencesText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  streaksContainer: {
    width: '100%',
    marginVertical: 18,
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: '#94A3B8',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 28,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B46C1',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
    paddingBottom: 16,
  },
  timelineContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timelineTime: {
    width: 70,
    alignItems: 'flex-end',
    paddingRight: 12,
  },
  timeText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginHorizontal: 8,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
  },
  activityTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activityDetails: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  calorieInfo: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
  },
  workoutContainer: {
    paddingHorizontal: 20,
  },
  workoutSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseSets: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
  },
  exerciseReps: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 8,
  },
  exerciseInstructions: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  exerciseModification: {
    color: '#10B981',
    fontSize: 12,
    fontStyle: 'italic',
  },
  mealsContainer: {
    paddingHorizontal: 20,
  },
  macroSummary: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  macroTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  totalCalories: {
    color: '#F59E0B',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  macroBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  macroValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  mealType: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mealCalories: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 8,
  },
  mealMacros: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  mealMacro: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  ingredientsTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ingredient: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  instructionsTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  instruction: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  alternativesTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  alternative: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B46C1',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 14,
  },
  regenerateText: {
    color: 'white',
    fontSize: 15,
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
    borderRadius: 18,
    padding: 22,
    margin: 20,
    width: width - 40,
    maxHeight: '85%',
  },
  modalTitle: {
    color: 'white',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  preferenceLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#374151',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: (width - 115) / 3,
  },
  optionButtonActive: {
    backgroundColor: '#6B46C1',
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
  },
  optionEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  optionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  timeButton: {
    backgroundColor: '#374151',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  timeButtonActive: {
    backgroundColor: '#6B46C1',
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
  },
  timeButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  timeButtonTextActive: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  generatePlanButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  generatePlanText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});