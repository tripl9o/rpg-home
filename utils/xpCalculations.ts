// XP Calculation System for Fitness RPG

export interface XPActivity {
  type: 'workout' | 'nutrition' | 'hydration' | 'sleep' | 'milestone' | 'streak';
  baseXP: number;
  multipliers?: {
    intensity?: number;
    duration?: number;
    consistency?: number;
    difficulty?: number;
  };
}

export interface XPReward {
  amount: number;
  reason: string;
  category: string;
  timestamp: Date;
}

// Base XP values for different activities
export const XP_VALUES = {
  // Workout Activities
  WORKOUT_LIGHT: 25,        // Light exercise (15-30 min)
  WORKOUT_MODERATE: 50,     // Moderate exercise (30-45 min)
  WORKOUT_INTENSE: 75,      // Intense exercise (45-60 min)
  WORKOUT_EXTREME: 100,     // Extreme exercise (60+ min)
  
  // Nutrition Activities
  LOG_MEAL: 10,             // Log a single meal
  MEET_CALORIE_GOAL: 25,    // Meet daily calorie target
  MEET_MACRO_GOALS: 35,     // Meet all macro targets
  HEALTHY_CHOICE: 15,       // Choose healthy option over unhealthy
  
  // Hydration Activities
  WATER_GLASS: 5,           // Log a glass of water
  DAILY_HYDRATION: 20,      // Meet daily hydration goal
  HYDRATION_STREAK: 10,     // Bonus per day of hydration streak
  
  // Sleep Activities
  SLEEP_DURATION: 20,       // Meet sleep duration goal
  SLEEP_QUALITY: 15,        // Good sleep quality score
  SLEEP_CONSISTENCY: 25,    // Consistent sleep schedule
  
  // Milestone Rewards
  FIRST_WORKOUT: 100,       // Complete first workout
  WEEK_COMPLETE: 200,       // Complete all workouts in a week
  MONTH_COMPLETE: 500,      // Complete all goals for a month
  GOAL_ACHIEVED: 1000,      // Achieve primary fitness goal
  
  // Streak Bonuses
  STREAK_3_DAYS: 50,        // 3-day streak bonus
  STREAK_7_DAYS: 150,       // 7-day streak bonus
  STREAK_30_DAYS: 500,      // 30-day streak bonus
  STREAK_100_DAYS: 2000,    // 100-day streak bonus
};

// Multipliers for different factors
export const XP_MULTIPLIERS = {
  // Workout intensity multipliers
  INTENSITY: {
    LOW: 0.8,
    MODERATE: 1.0,
    HIGH: 1.3,
    EXTREME: 1.6,
  },
  
  // Duration multipliers
  DURATION: {
    SHORT: 0.8,      // < 30 min
    NORMAL: 1.0,     // 30-60 min
    LONG: 1.2,       // 60-90 min
    EXTENDED: 1.4,   // > 90 min
  },
  
  // Consistency multipliers
  CONSISTENCY: {
    SPORADIC: 0.9,   // < 3 days/week
    REGULAR: 1.0,    // 3-4 days/week
    CONSISTENT: 1.1, // 5-6 days/week
    DEDICATED: 1.2,  // 7 days/week
  },
  
  // Goal-based multipliers
  GOAL_TYPE: {
    WEIGHT_LOSS: 1.2,
    MUSCLE_GAIN: 1.3,
    MAINTENANCE: 1.0,
    ENDURANCE: 1.1,
  },
};

// Calculate XP for workout completion
export function calculateWorkoutXP(
  duration: number, // in minutes
  intensity: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME',
  workoutType: string,
  userGoal: 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'MAINTENANCE' | 'ENDURANCE'
): XPReward {
  let baseXP: number;
  
  // Determine base XP based on duration
  if (duration < 30) {
    baseXP = XP_VALUES.WORKOUT_LIGHT;
  } else if (duration < 45) {
    baseXP = XP_VALUES.WORKOUT_MODERATE;
  } else if (duration < 60) {
    baseXP = XP_VALUES.WORKOUT_INTENSE;
  } else {
    baseXP = XP_VALUES.WORKOUT_EXTREME;
  }
  
  // Apply multipliers
  const intensityMultiplier = XP_MULTIPLIERS.INTENSITY[intensity];
  const goalMultiplier = XP_MULTIPLIERS.GOAL_TYPE[userGoal];
  
  const finalXP = Math.round(baseXP * intensityMultiplier * goalMultiplier);
  
  return {
    amount: finalXP,
    reason: `${workoutType} workout completed`,
    category: 'workout',
    timestamp: new Date(),
  };
}

// Calculate XP for nutrition goals
export function calculateNutritionXP(
  mealsLogged: number,
  calorieGoalMet: boolean,
  macroGoalsMet: boolean,
  healthyChoices: number
): XPReward[] {
  const rewards: XPReward[] = [];
  
  // XP for logging meals
  if (mealsLogged > 0) {
    rewards.push({
      amount: mealsLogged * XP_VALUES.LOG_MEAL,
      reason: `Logged ${mealsLogged} meal${mealsLogged > 1 ? 's' : ''}`,
      category: 'nutrition',
      timestamp: new Date(),
    });
  }
  
  // XP for meeting calorie goal
  if (calorieGoalMet) {
    rewards.push({
      amount: XP_VALUES.MEET_CALORIE_GOAL,
      reason: 'Met daily calorie goal',
      category: 'nutrition',
      timestamp: new Date(),
    });
  }
  
  // XP for meeting macro goals
  if (macroGoalsMet) {
    rewards.push({
      amount: XP_VALUES.MEET_MACRO_GOALS,
      reason: 'Met all macro targets',
      category: 'nutrition',
      timestamp: new Date(),
    });
  }
  
  // XP for healthy choices
  if (healthyChoices > 0) {
    rewards.push({
      amount: healthyChoices * XP_VALUES.HEALTHY_CHOICE,
      reason: `Made ${healthyChoices} healthy choice${healthyChoices > 1 ? 's' : ''}`,
      category: 'nutrition',
      timestamp: new Date(),
    });
  }
  
  return rewards;
}

// Calculate XP for hydration
export function calculateHydrationXP(
  glassesLogged: number,
  dailyGoalMet: boolean,
  currentStreak: number
): XPReward[] {
  const rewards: XPReward[] = [];
  
  // XP for logging water
  if (glassesLogged > 0) {
    rewards.push({
      amount: glassesLogged * XP_VALUES.WATER_GLASS,
      reason: `Logged ${glassesLogged} glass${glassesLogged > 1 ? 'es' : ''} of water`,
      category: 'hydration',
      timestamp: new Date(),
    });
  }
  
  // XP for meeting daily goal
  if (dailyGoalMet) {
    rewards.push({
      amount: XP_VALUES.DAILY_HYDRATION,
      reason: 'Met daily hydration goal',
      category: 'hydration',
      timestamp: new Date(),
    });
  }
  
  // Streak bonus
  if (currentStreak > 0) {
    rewards.push({
      amount: currentStreak * XP_VALUES.HYDRATION_STREAK,
      reason: `${currentStreak}-day hydration streak`,
      category: 'hydration',
      timestamp: new Date(),
    });
  }
  
  return rewards;
}

// Calculate XP for sleep
export function calculateSleepXP(
  duration: number, // in hours
  quality: number, // 1-10 scale
  targetDuration: number,
  consistentSchedule: boolean
): XPReward[] {
  const rewards: XPReward[] = [];
  
  // XP for meeting sleep duration
  if (duration >= targetDuration) {
    rewards.push({
      amount: XP_VALUES.SLEEP_DURATION,
      reason: 'Met sleep duration goal',
      category: 'sleep',
      timestamp: new Date(),
    });
  }
  
  // XP for good sleep quality
  if (quality >= 7) {
    rewards.push({
      amount: XP_VALUES.SLEEP_QUALITY,
      reason: 'Good sleep quality',
      category: 'sleep',
      timestamp: new Date(),
    });
  }
  
  // XP for consistent schedule
  if (consistentSchedule) {
    rewards.push({
      amount: XP_VALUES.SLEEP_CONSISTENCY,
      reason: 'Consistent sleep schedule',
      category: 'sleep',
      timestamp: new Date(),
    });
  }
  
  return rewards;
}

// Calculate streak bonuses
export function calculateStreakBonus(
  streakLength: number,
  streakType: 'workout' | 'nutrition' | 'hydration' | 'overall'
): XPReward | null {
  let bonusXP = 0;
  let reason = '';
  
  if (streakLength === 3) {
    bonusXP = XP_VALUES.STREAK_3_DAYS;
    reason = `3-day ${streakType} streak bonus!`;
  } else if (streakLength === 7) {
    bonusXP = XP_VALUES.STREAK_7_DAYS;
    reason = `7-day ${streakType} streak bonus!`;
  } else if (streakLength === 30) {
    bonusXP = XP_VALUES.STREAK_30_DAYS;
    reason = `30-day ${streakType} streak bonus!`;
  } else if (streakLength === 100) {
    bonusXP = XP_VALUES.STREAK_100_DAYS;
    reason = `100-day ${streakType} streak bonus!`;
  }
  
  if (bonusXP > 0) {
    return {
      amount: bonusXP,
      reason,
      category: 'streak',
      timestamp: new Date(),
    };
  }
  
  return null;
}

// Calculate level from total XP
export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

// Calculate XP needed for next level
export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

// Calculate current level XP
export function getCurrentLevelXP(currentLevel: number): number {
  return Math.pow(currentLevel - 1, 2) * 100;
}

// Get level progress percentage
export function getLevelProgress(totalXP: number): {
  level: number;
  currentXP: number;
  maxXP: number;
  percentage: number;
} {
  const level = calculateLevel(totalXP);
  const currentLevelXP = getCurrentLevelXP(level);
  const nextLevelXP = getXPForNextLevel(level);
  const currentXP = totalXP - currentLevelXP;
  const maxXP = nextLevelXP - currentLevelXP;
  const percentage = (currentXP / maxXP) * 100;
  
  return {
    level,
    currentXP,
    maxXP,
    percentage,
  };
}

// Calculate daily XP potential
export function getDailyXPPotential(): number {
  return (
    XP_VALUES.WORKOUT_INTENSE + // One workout
    XP_VALUES.MEET_CALORIE_GOAL + // Nutrition goal
    XP_VALUES.MEET_MACRO_GOALS + // Macro goals
    XP_VALUES.DAILY_HYDRATION + // Hydration goal
    XP_VALUES.SLEEP_DURATION + // Sleep goal
    (4 * XP_VALUES.LOG_MEAL) // Log all meals
  );
}

// Calculate weekly XP potential
export function getWeeklyXPPotential(): number {
  return getDailyXPPotential() * 7 + XP_VALUES.WEEK_COMPLETE;
}