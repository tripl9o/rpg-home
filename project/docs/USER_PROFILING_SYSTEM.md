# Comprehensive User Profiling and Goal-Setting System

## System Overview

This document outlines the complete user profiling and goal-setting system for the gamified fitness RPG mobile application. The system captures user information, calculates personalized recommendations, and implements a comprehensive gamification framework.

## 1. User Information Capture

### Input Fields and Validation Rules

#### Age (18-80 years)
- **Input Type**: Numeric input
- **Validation**: 18 ≤ age ≤ 80
- **Error Handling**: Display "Age must be between 18 and 80" for invalid inputs
- **Edge Cases**: Default to 25 if no input provided

#### Weight (30-300 kg)
- **Input Type**: Decimal numeric input
- **Validation**: 30 ≤ weight ≤ 300
- **Units**: Supports kg (primary) and lbs (converted to kg: lbs ÷ 2.205)
- **Error Handling**: Display "Weight must be between 30 and 300 kg" for invalid inputs
- **Edge Cases**: Require input, no default value

#### Height (120-250 cm)
- **Input Type**: Numeric input
- **Validation**: 120 ≤ height ≤ 250
- **Units**: Supports cm (primary) and ft-in (converted to cm)
- **Error Handling**: Display "Height must be between 120 and 250 cm" for invalid inputs
- **Edge Cases**: Require input, no default value

#### Gender
- **Options**: Male, Female, Other
- **Default**: No default, user must select
- **Impact**: Affects BMR calculation using different formulas

#### Activity Level
- **Sedentary**: Little to no exercise (multiplier: 1.2)
- **Lightly Active**: Light exercise 1-3 days/week (multiplier: 1.375)
- **Moderately Active**: Moderate exercise 3-5 days/week (multiplier: 1.55)
- **Very Active**: Hard exercise 6-7 days/week (multiplier: 1.725)
- **Extremely Active**: Very hard exercise, physical job (multiplier: 1.9)

## 2. Goal Selection Framework

### Primary Goal Types

#### Weight Loss
- **Target**: 0.25-1.0 kg per week
- **Calorie Adjustment**: -500 kcal from maintenance
- **Macro Ratios**: 30% protein, 35% carbs, 35% fats
- **XP Multiplier**: 1.2x
- **Sub-goals**: 
  - Fat loss while preserving muscle
  - Improved cardiovascular health
  - Enhanced energy levels

#### Muscle Gain
- **Target**: 0.25-0.75 kg per week
- **Calorie Adjustment**: +300 kcal above maintenance
- **Macro Ratios**: 25% protein, 45% carbs, 30% fats
- **XP Multiplier**: 1.3x
- **Sub-goals**:
  - Strength increase
  - Muscle mass development
  - Performance improvement

#### Maintenance
- **Target**: Maintain current weight (±0.25 kg)
- **Calorie Adjustment**: 0 (maintenance calories)
- **Macro Ratios**: 25% protein, 40% carbs, 35% fats
- **XP Multiplier**: 1.0x
- **Sub-goals**:
  - Maintain current fitness level
  - Improve body composition
  - Develop healthy habits

## 3. Automated Calculation System

### BMR Calculation (Mifflin-St Jeor Equation)

#### For Males:
```
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
```

#### For Females:
```
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
```

#### For Other:
```
BMR = Average of male and female calculations
```

### Daily Calorie Calculation
```
Daily Calories = BMR × Activity Multiplier + Goal Adjustment
```

### Hydration Calculation
```
Base Water = weight(kg) × 0.035 L
Activity Adjustment = {
  sedentary: +0 L,
  lightly_active: +0.3 L,
  moderately_active: +0.5 L,
  very_active: +0.7 L,
  extremely_active: +1.0 L
}
Daily Water = Base Water + Activity Adjustment
```

### Macronutrient Distribution
```
Protein (g) = (Daily Calories × Protein %) ÷ 4
Carbs (g) = (Daily Calories × Carbs %) ÷ 4
Fats (g) = (Daily Calories × Fats %) ÷ 9
```

## 4. Progress Tracking Mechanism

### Key Metrics by Goal Type

#### Weight Loss Metrics
- Weekly weight change
- Body fat percentage (if available)
- Waist circumference
- Energy levels (subjective 1-10 scale)
- Workout performance

#### Muscle Gain Metrics
- Weekly weight change
- Strength progression (1RM increases)
- Muscle measurements
- Workout volume progression
- Recovery quality

#### Maintenance Metrics
- Weight stability (±2% range)
- Consistency in habits
- Performance maintenance
- Health markers

### Update Triggers
- **Weekly**: Recalculate based on weight changes
- **Monthly**: Comprehensive goal review and adjustment
- **Quarterly**: Complete profile reassessment

### Automatic Adjustments
- If weight loss stalls for 2 weeks: Reduce calories by 100-150
- If weight gain exceeds target: Reduce surplus by 100-200 calories
- If performance declines: Increase rest days or calories

## 5. Gamification Elements

### XP System

#### Daily Activities
- Complete workout: 50-100 XP (based on intensity)
- Meet calorie goal: 25 XP
- Meet water goal: 15 XP
- Meet sleep goal: 20 XP
- Log all meals: 30 XP

#### Weekly Bonuses
- Complete all workouts: 200 XP
- Meet all daily goals 7/7 days: 300 XP
- Maintain streak: 50 XP per day

#### Milestone Rewards
- First workout: 100 XP
- 7-day streak: 500 XP
- 30-day streak: 1500 XP
- Goal achievement: 1000-5000 XP

### Leveling Structure
```
Level = floor(sqrt(Total XP ÷ 100)) + 1
XP for Next Level = (Current Level)² × 100
```

#### Level Milestones
- **Level 1-5**: Beginner (0-2,500 XP)
- **Level 6-10**: Novice (2,500-10,000 XP)
- **Level 11-20**: Intermediate (10,000-40,000 XP)
- **Level 21-35**: Advanced (40,000-122,500 XP)
- **Level 36-50**: Expert (122,500-250,000 XP)
- **Level 51+**: Master (250,000+ XP)

### Achievement System

#### Categories and Criteria

##### Milestone Achievements
- **First Steps**: Complete first workout (50 XP)
- **Week Warrior**: 7-day workout streak (100 XP)
- **Month Master**: 30-day streak (500 XP)
- **Century Club**: 100 workouts completed (1000 XP)

##### Habit Achievements
- **Hydration Hero**: Meet water goal 30 days (200 XP)
- **Sleep Champion**: Meet sleep goal 30 days (200 XP)
- **Nutrition Ninja**: Log all meals 30 days (300 XP)

##### Strength Achievements
- **Strength Seeker**: Increase 1RM by 10kg (150 XP)
- **Power Lifter**: Increase 1RM by 25kg (300 XP)
- **Strength Beast**: Increase 1RM by 50kg (500 XP)

##### Cardio Achievements
- **Distance Destroyer**: Run 50km total (200 XP)
- **Endurance Elite**: Run 100km total (400 XP)
- **Marathon Master**: Run 200km total (800 XP)

##### Legendary Achievements
- **Perfect Month**: Meet all goals for 30 days (1000 XP)
- **Transformation**: Achieve primary goal (2000 XP)
- **Fitness Guru**: Reach level 50 (5000 XP)

## 6. Implementation Examples

### Example User Profile 1: Weight Loss
```
User: Sarah, 28, Female, 75kg, 165cm, Moderately Active
Goal: Lose 0.5kg/week (Weight Loss)

Calculations:
BMR = 10×75 + 6.25×165 - 5×28 - 161 = 1,470 kcal
Daily Calories = 1,470 × 1.55 - 500 = 1,779 kcal
Daily Water = 75 × 0.035 + 0.5 = 3.1 L
Macros: 133g protein, 156g carbs, 69g fats
```

### Example User Profile 2: Muscle Gain
```
User: Mike, 25, Male, 70kg, 180cm, Very Active
Goal: Gain 0.5kg/week (Muscle Gain)

Calculations:
BMR = 10×70 + 6.25×180 - 5×25 + 5 = 1,705 kcal
Daily Calories = 1,705 × 1.725 + 300 = 3,241 kcal
Daily Water = 70 × 0.035 + 0.7 = 3.15 L
Macros: 203g protein, 365g carbs, 108g fats
```

### Example User Profile 3: Maintenance
```
User: Alex, 35, Other, 68kg, 172cm, Lightly Active
Goal: Maintain current weight

Calculations:
BMR = Average of male/female = 1,515 kcal
Daily Calories = 1,515 × 1.375 + 0 = 2,083 kcal
Daily Water = 68 × 0.035 + 0.3 = 2.68 L
Macros: 130g protein, 208g carbs, 81g fats
```

## 7. Technical Implementation Guidelines

### Data Storage Structure
```typescript
interface UserProfile {
  // Basic Info
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: ActivityLevel;
  
  // Goals
  primaryGoal: GoalType;
  targetWeight?: number;
  weeklyChangeRate?: number;
  
  // Calculated Values
  bmr: number;
  dailyCalories: number;
  dailyWater: number;
  macros: MacroBreakdown;
  
  // Gamification
  level: number;
  currentXP: number;
  totalXP: number;
  achievements: string[];
  streak: number;
  
  // Tracking
  createdAt: Date;
  lastUpdated: Date;
  progressHistory: ProgressEntry[];
}
```

### Update Frequency
- **Real-time**: XP, achievements, daily progress
- **Daily**: Streak counters, goal completion
- **Weekly**: Weight-based recalculations
- **Monthly**: Comprehensive goal review

### Error Handling
- Validate all inputs before processing
- Provide clear error messages for invalid data
- Graceful degradation for missing optional data
- Backup calculations for edge cases

This comprehensive system ensures accurate, personalized recommendations while maintaining engaging gamification elements that motivate users to achieve their fitness goals.