import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calculator, Droplets, Moon, Target, Dumbbell, Heart, Scale, Zap, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CalculatorResult {
  value: number;
  unit: string;
  description: string;
  recommendations?: string[];
}

export default function CalculatorsPage() {
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<{ [key: string]: CalculatorResult }>({});

  const calculators = [
    {
      id: 'calories',
      title: 'Daily Calories',
      icon: Zap,
      description: 'Calculate your daily caloric needs',
      color: '#F59E0B',
      inputs: [
        { key: 'age', label: 'Age', type: 'number', placeholder: '25' },
        { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '70' },
        { key: 'height', label: 'Height (cm)', type: 'number', placeholder: '175' },
        { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
        { key: 'activity', label: 'Activity Level', type: 'select', options: ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'] }
      ]
    },
    {
      id: 'hydration',
      title: 'Water Intake',
      icon: Droplets,
      description: 'Calculate optimal daily water consumption',
      color: '#3B82F6',
      inputs: [
        { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '70' },
        { key: 'activity', label: 'Activity Level', type: 'select', options: ['Low', 'Moderate', 'High', 'Very High'] },
        { key: 'climate', label: 'Climate', type: 'select', options: ['Cool', 'Moderate', 'Hot', 'Very Hot'] }
      ]
    },
    {
      id: 'sleep',
      title: 'Sleep Needs',
      icon: Moon,
      description: 'Determine optimal sleep duration',
      color: '#8B5CF6',
      inputs: [
        { key: 'age', label: 'Age', type: 'number', placeholder: '25' },
        { key: 'activity', label: 'Activity Level', type: 'select', options: ['Low', 'Moderate', 'High', 'Very High'] },
        { key: 'stress', label: 'Stress Level', type: 'select', options: ['Low', 'Moderate', 'High'] }
      ]
    },
    {
      id: 'macros',
      title: 'Macronutrients',
      icon: Target,
      description: 'Calculate protein, carbs, and fat needs',
      color: '#10B981',
      inputs: [
        { key: 'calories', label: 'Daily Calories', type: 'number', placeholder: '2000' },
        { key: 'goal', label: 'Goal', type: 'select', options: ['Weight Loss', 'Muscle Gain', 'Maintenance'] },
        { key: 'activity', label: 'Activity Type', type: 'select', options: ['Cardio', 'Strength', 'Mixed'] }
      ]
    },
    {
      id: 'onerepmax',
      title: 'One Rep Max',
      icon: Dumbbell,
      description: 'Estimate your maximum lift capacity',
      color: '#EF4444',
      inputs: [
        { key: 'weight', label: 'Weight Lifted (kg)', type: 'number', placeholder: '80' },
        { key: 'reps', label: 'Repetitions', type: 'number', placeholder: '8' },
        { key: 'exercise', label: 'Exercise', type: 'select', options: ['Bench Press', 'Squat', 'Deadlift', 'Overhead Press'] }
      ]
    },
    {
      id: 'bmr',
      title: 'Basal Metabolic Rate',
      icon: Heart,
      description: 'Calculate your resting metabolic rate',
      color: '#EC4899',
      inputs: [
        { key: 'age', label: 'Age', type: 'number', placeholder: '25' },
        { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '70' },
        { key: 'height', label: 'Height (cm)', type: 'number', placeholder: '175' },
        { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] }
      ]
    },
    {
      id: 'bodyfat',
      title: 'Body Fat %',
      icon: Scale,
      description: 'Estimate body fat percentage',
      color: '#F97316',
      inputs: [
        { key: 'waist', label: 'Waist (cm)', type: 'number', placeholder: '80' },
        { key: 'neck', label: 'Neck (cm)', type: 'number', placeholder: '38' },
        { key: 'height', label: 'Height (cm)', type: 'number', placeholder: '175' },
        { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] }
      ]
    },
    {
      id: 'heartrate',
      title: 'Target Heart Rate',
      icon: Heart,
      description: 'Calculate training heart rate zones',
      color: '#DC2626',
      inputs: [
        { key: 'age', label: 'Age', type: 'number', placeholder: '25' },
        { key: 'resting', label: 'Resting HR', type: 'number', placeholder: '60' },
        { key: 'fitness', label: 'Fitness Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] }
      ]
    },
    {
      id: 'progress',
      title: 'Progress Tracker',
      icon: TrendingUp,
      description: 'Track your fitness progress over time',
      color: '#059669',
      inputs: [
        { key: 'current', label: 'Current Weight (kg)', type: 'number', placeholder: '70' },
        { key: 'target', label: 'Target Weight (kg)', type: 'number', placeholder: '65' },
        { key: 'timeline', label: 'Timeline (weeks)', type: 'number', placeholder: '12' }
      ]
    }
  ];

  const calculateResult = (calculatorId: string, inputValues: { [key: string]: string }) => {
    switch (calculatorId) {
      case 'calories':
        return calculateCalories(inputValues);
      case 'hydration':
        return calculateHydration(inputValues);
      case 'sleep':
        return calculateSleep(inputValues);
      case 'macros':
        return calculateMacros(inputValues);
      case 'onerepmax':
        return calculateOneRepMax(inputValues);
      case 'bmr':
        return calculateBMR(inputValues);
      case 'bodyfat':
        return calculateBodyFat(inputValues);
      case 'heartrate':
        return calculateHeartRate(inputValues);
      case 'progress':
        return calculateProgress(inputValues);
      default:
        return null;
    }
  };

  const calculateCalories = (inputs: { [key: string]: string }): CalculatorResult => {
    const age = parseInt(inputs.age) || 25;
    const weight = parseFloat(inputs.weight) || 70;
    const height = parseFloat(inputs.height) || 175;
    const gender = inputs.gender || 'Male';
    const activity = inputs.activity || 'Moderate';

    // BMR calculation (Mifflin-St Jeor)
    let bmr: number;
    if (gender === 'Male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const multipliers: { [key: string]: number } = {
      'Sedentary': 1.2,
      'Light': 1.375,
      'Moderate': 1.55,
      'Active': 1.725,
      'Very Active': 1.9
    };

    const calories = Math.round(bmr * multipliers[activity]);

    return {
      value: calories,
      unit: 'kcal/day',
      description: 'Daily caloric needs for maintenance',
      recommendations: [
        `For weight loss: ${Math.round(calories * 0.8)} kcal/day`,
        `For muscle gain: ${Math.round(calories * 1.1)} kcal/day`,
        `BMR: ${Math.round(bmr)} kcal/day`
      ]
    };
  };

  const calculateHydration = (inputs: { [key: string]: string }): CalculatorResult => {
    const weight = parseFloat(inputs.weight) || 70;
    const activity = inputs.activity || 'Moderate';
    const climate = inputs.climate || 'Moderate';

    let baseWater = weight * 0.035; // 35ml per kg

    // Activity adjustments
    const activityMultipliers: { [key: string]: number } = {
      'Low': 1.0,
      'Moderate': 1.2,
      'High': 1.4,
      'Very High': 1.6
    };

    // Climate adjustments
    const climateMultipliers: { [key: string]: number } = {
      'Cool': 1.0,
      'Moderate': 1.1,
      'Hot': 1.3,
      'Very Hot': 1.5
    };

    const totalWater = baseWater * activityMultipliers[activity] * climateMultipliers[climate];

    return {
      value: Math.round(totalWater * 10) / 10,
      unit: 'liters/day',
      description: 'Recommended daily water intake',
      recommendations: [
        `Minimum: ${Math.round(weight * 0.03 * 10) / 10} L/day`,
        `Glasses (250ml): ${Math.ceil(totalWater * 4)} glasses`,
        'Increase intake during exercise and hot weather'
      ]
    };
  };

  const calculateSleep = (inputs: { [key: string]: string }): CalculatorResult => {
    const age = parseInt(inputs.age) || 25;
    const activity = inputs.activity || 'Moderate';
    const stress = inputs.stress || 'Moderate';

    let baseSleep = 8; // Base 8 hours

    // Age adjustments
    if (age < 18) baseSleep = 9;
    else if (age > 65) baseSleep = 7.5;

    // Activity adjustments
    const activityAdjustments: { [key: string]: number } = {
      'Low': -0.5,
      'Moderate': 0,
      'High': 0.5,
      'Very High': 1
    };

    // Stress adjustments
    const stressAdjustments: { [key: string]: number } = {
      'Low': -0.25,
      'Moderate': 0,
      'High': 0.5
    };

    const totalSleep = baseSleep + activityAdjustments[activity] + stressAdjustments[stress];

    return {
      value: Math.round(totalSleep * 10) / 10,
      unit: 'hours/night',
      description: 'Recommended sleep duration',
      recommendations: [
        `Bedtime range: ${Math.floor(totalSleep)}-${Math.ceil(totalSleep)} hours`,
        'Maintain consistent sleep schedule',
        'Avoid screens 1 hour before bed'
      ]
    };
  };

  const calculateMacros = (inputs: { [key: string]: string }): CalculatorResult => {
    const calories = parseInt(inputs.calories) || 2000;
    const goal = inputs.goal || 'Maintenance';

    // Macro ratios based on goal
    const macroRatios: { [key: string]: { protein: number; carbs: number; fats: number } } = {
      'Weight Loss': { protein: 0.35, carbs: 0.30, fats: 0.35 },
      'Muscle Gain': { protein: 0.25, carbs: 0.45, fats: 0.30 },
      'Maintenance': { protein: 0.25, carbs: 0.40, fats: 0.35 }
    };

    const ratios = macroRatios[goal];
    const protein = Math.round((calories * ratios.protein) / 4);
    const carbs = Math.round((calories * ratios.carbs) / 4);
    const fats = Math.round((calories * ratios.fats) / 9);

    return {
      value: protein,
      unit: 'g protein',
      description: `Macronutrient breakdown for ${goal.toLowerCase()}`,
      recommendations: [
        `Protein: ${protein}g (${Math.round(ratios.protein * 100)}%)`,
        `Carbs: ${carbs}g (${Math.round(ratios.carbs * 100)}%)`,
        `Fats: ${fats}g (${Math.round(ratios.fats * 100)}%)`
      ]
    };
  };

  const calculateOneRepMax = (inputs: { [key: string]: string }): CalculatorResult => {
    const weight = parseFloat(inputs.weight) || 80;
    const reps = parseInt(inputs.reps) || 8;

    // Epley formula
    const oneRepMax = weight * (1 + reps / 30);

    return {
      value: Math.round(oneRepMax),
      unit: 'kg',
      description: 'Estimated one-rep maximum',
      recommendations: [
        `90%: ${Math.round(oneRepMax * 0.9)}kg (1-2 reps)`,
        `80%: ${Math.round(oneRepMax * 0.8)}kg (3-5 reps)`,
        `70%: ${Math.round(oneRepMax * 0.7)}kg (6-8 reps)`
      ]
    };
  };

  const calculateBMR = (inputs: { [key: string]: string }): CalculatorResult => {
    const age = parseInt(inputs.age) || 25;
    const weight = parseFloat(inputs.weight) || 70;
    const height = parseFloat(inputs.height) || 175;
    const gender = inputs.gender || 'Male';

    let bmr: number;
    if (gender === 'Male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    return {
      value: Math.round(bmr),
      unit: 'kcal/day',
      description: 'Basal Metabolic Rate (calories at rest)',
      recommendations: [
        'This is your minimum daily caloric need',
        'Add activity calories for total daily needs',
        'Never eat below BMR for extended periods'
      ]
    };
  };

  const calculateBodyFat = (inputs: { [key: string]: string }): CalculatorResult => {
    const waist = parseFloat(inputs.waist) || 80;
    const neck = parseFloat(inputs.neck) || 38;
    const height = parseFloat(inputs.height) || 175;
    const gender = inputs.gender || 'Male';

    let bodyFat: number;
    if (gender === 'Male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
      // For females, we'd need hip measurement, so this is simplified
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + 0 - neck) + 0.22100 * Math.log10(height)) - 450;
    }

    return {
      value: Math.round(bodyFat * 10) / 10,
      unit: '%',
      description: 'Estimated body fat percentage',
      recommendations: [
        gender === 'Male' ? 'Healthy range: 10-20%' : 'Healthy range: 16-24%',
        gender === 'Male' ? 'Athletic: 6-13%' : 'Athletic: 14-20%',
        'This is an estimate - DEXA scan for accuracy'
      ]
    };
  };

  const calculateHeartRate = (inputs: { [key: string]: string }): CalculatorResult => {
    const age = parseInt(inputs.age) || 25;
    const resting = parseInt(inputs.resting) || 60;

    const maxHR = 220 - age;
    const hrReserve = maxHR - resting;

    // Training zones
    const fatBurn = Math.round(resting + hrReserve * 0.6);
    const cardio = Math.round(resting + hrReserve * 0.7);
    const peak = Math.round(resting + hrReserve * 0.85);

    return {
      value: maxHR,
      unit: 'bpm',
      description: 'Maximum heart rate',
      recommendations: [
        `Fat burn zone: ${fatBurn} bpm (60-70%)`,
        `Cardio zone: ${cardio} bpm (70-80%)`,
        `Peak zone: ${peak} bpm (85-95%)`
      ]
    };
  };

  const calculateProgress = (inputs: { [key: string]: string }): CalculatorResult => {
    const current = parseFloat(inputs.current) || 70;
    const target = parseFloat(inputs.target) || 65;
    const timeline = parseInt(inputs.timeline) || 12;

    const totalChange = target - current;
    const weeklyChange = totalChange / timeline;
    const monthlyChange = weeklyChange * 4;

    return {
      value: Math.abs(Math.round(weeklyChange * 100) / 100),
      unit: 'kg/week',
      description: 'Required weekly progress',
      recommendations: [
        `Total change needed: ${Math.abs(totalChange)}kg`,
        `Monthly target: ${Math.abs(Math.round(monthlyChange * 100) / 100)}kg`,
        totalChange < 0 ? 'Focus on caloric deficit' : 'Focus on caloric surplus'
      ]
    };
  };

  const handleCalculate = (calculatorId: string) => {
    const calculator = calculators.find(c => c.id === calculatorId);
    if (!calculator) return;

    const inputValues: { [key: string]: string } = {};
    calculator.inputs.forEach(input => {
      inputValues[input.key] = inputs[`${calculatorId}_${input.key}`] || '';
    });

    const result = calculateResult(calculatorId, inputValues);
    if (result) {
      setResults({ ...results, [calculatorId]: result });
    }
  };

  const renderCalculatorCard = (calculator: any) => (
    <View key={calculator.id} style={styles.calculatorCard}>
      <TouchableOpacity
        onPress={() => setSelectedCalculator(
          selectedCalculator === calculator.id ? null : calculator.id
        )}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[calculator.color, `${calculator.color}CC`]}
          style={styles.calculatorGradient}
        >
          <calculator.icon size={32} color="white" />
          <Text style={styles.calculatorTitle}>{calculator.title}</Text>
          <Text style={styles.calculatorDescription}>{calculator.description}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {selectedCalculator === calculator.id && (
        <ScrollView
          style={styles.calculatorInputs}
          contentContainerStyle={styles.calculatorInputsContent}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
          {calculator.inputs.map((input: any) => (
            <View key={input.key} style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{input.label}</Text>
              {input.type === 'select' ? (
                <View style={styles.selectContainer}>
                  {input.options.map((option: string) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.selectOption,
                        inputs[`${calculator.id}_${input.key}`] === option && styles.selectOptionActive
                      ]}
                      onPress={() => setInputs({
                        ...inputs,
                        [`${calculator.id}_${input.key}`]: option
                      })}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.selectOptionText,
                        inputs[`${calculator.id}_${input.key}`] === option && styles.selectOptionTextActive
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TextInput
                  style={styles.textInput}
                  value={inputs[`${calculator.id}_${input.key}`] || ''}
                  onChangeText={(text) => setInputs({
                    ...inputs,
                    [`${calculator.id}_${input.key}`]: text
                  })}
                  placeholder={input.placeholder}
                  placeholderTextColor="#6B7280"
                  keyboardType={input.type === 'number' ? 'numeric' : 'default'}
                />
              )}
            </View>
          ))}

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={() => handleCalculate(calculator.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>

          {results[calculator.id] && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultValue}>
                {results[calculator.id].value} {results[calculator.id].unit}
              </Text>
              <Text style={styles.resultDescription}>
                {results[calculator.id].description}
              </Text>
              {results[calculator.id].recommendations && (
                <View style={styles.recommendationsContainer}>
                  {results[calculator.id].recommendations!.map((rec, index) => (
                    <Text key={index} style={styles.recommendation}>
                      • {rec}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#6B46C1', '#8B5CF6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Fitness Calculators</Text>
        <Text style={styles.headerSubtitle}>Essential tools for your fitness journey</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.calculatorsGrid}>
          {calculators.map(renderCalculatorCard)}
        </View>
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
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  calculatorsGrid: {
    gap: 16,
    paddingBottom: 40,
  },
  calculatorCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  calculatorGradient: {
    padding: 20,
    alignItems: 'center',
  },
  calculatorTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  calculatorDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  calculatorInputs: {
    padding: 20,
    maxHeight: 500,
  },
  calculatorInputsContent: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 12,
    color: 'white',
    fontSize: 16,
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectOptionActive: {
    backgroundColor: '#6B46C1',
  },
  selectOptionText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  selectOptionTextActive: {
    color: 'white',
  },
  calculateButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  resultValue: {
    color: '#F59E0B',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultDescription: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  recommendationsContainer: {
    gap: 4,
  },
  recommendation: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
  },
});