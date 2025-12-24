import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Users, ChefHat, ShoppingCart, Plus, CircleCheck as CheckCircle, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Meal {
  id: string;
  name: string;
  image: string;
  prepTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string[];
  completed: boolean;
}

interface DailyPlan {
  date: string;
  totalCalories: number;
  targetCalories: number;
  totalProtein: number;
  targetProtein: number;
  totalCarbs: number;
  targetCarbs: number;
  totalFats: number;
  targetFats: number;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
  };
}

export default function DietPage() {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [dailyPlan] = useState<DailyPlan>({
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    totalCalories: 1420,
    targetCalories: 2000,
    totalProtein: 85,
    targetProtein: 150,
    totalCarbs: 180,
    targetCarbs: 250,
    totalFats: 45,
    targetFats: 67,
    meals: {
      breakfast: {
        id: 'breakfast',
        name: 'Protein Power Oatmeal',
        image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400',
        prepTime: 10,
        servings: 1,
        calories: 320,
        protein: 25,
        carbs: 45,
        fats: 8,
        ingredients: [
          '1/2 cup rolled oats',
          '1 scoop vanilla protein powder',
          '1 tbsp almond butter',
          '1/2 banana, sliced',
          '1 tbsp chia seeds',
          '1 cup almond milk'
        ],
        instructions: [
          'Cook oats with almond milk according to package directions',
          'Stir in protein powder while hot',
          'Top with almond butter, banana, and chia seeds',
          'Serve immediately'
        ],
        completed: true
      },
      lunch: {
        id: 'lunch',
        name: 'Mediterranean Chicken Bowl',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        prepTime: 25,
        servings: 1,
        calories: 450,
        protein: 35,
        carbs: 40,
        fats: 18,
        ingredients: [
          '4 oz grilled chicken breast',
          '1/2 cup quinoa, cooked',
          '1/4 cup chickpeas',
          '1/4 cup cucumber, diced',
          '1/4 cup cherry tomatoes',
          '2 tbsp feta cheese',
          '1 tbsp olive oil',
          '1 tbsp lemon juice'
        ],
        instructions: [
          'Season and grill chicken breast until cooked through',
          'Cook quinoa according to package directions',
          'Combine all vegetables in a bowl',
          'Slice chicken and add to bowl',
          'Drizzle with olive oil and lemon juice',
          'Top with feta cheese'
        ],
        completed: false
      },
      dinner: {
        id: 'dinner',
        name: 'Baked Salmon with Roasted Vegetables',
        image: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
        prepTime: 30,
        servings: 1,
        calories: 520,
        protein: 40,
        carbs: 25,
        fats: 28,
        ingredients: [
          '5 oz salmon fillet',
          '1 cup broccoli florets',
          '1/2 cup sweet potato, cubed',
          '1/4 cup bell peppers',
          '2 tbsp olive oil',
          '1 lemon, sliced',
          'Salt, pepper, garlic powder'
        ],
        instructions: [
          'Preheat oven to 400°F (200°C)',
          'Toss vegetables with 1 tbsp olive oil and seasonings',
          'Place on baking sheet and roast for 20 minutes',
          'Season salmon and place on another baking sheet',
          'Drizzle with remaining oil and top with lemon slices',
          'Bake salmon for 12-15 minutes until flaky'
        ],
        completed: false
      },
      snacks: [
        {
          id: 'snack1',
          name: 'Greek Yogurt with Berries',
          image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400',
          prepTime: 2,
          servings: 1,
          calories: 130,
          protein: 15,
          carbs: 18,
          fats: 2,
          ingredients: [
            '3/4 cup Greek yogurt',
            '1/2 cup mixed berries',
            '1 tsp honey'
          ],
          instructions: [
            'Add berries to yogurt',
            'Drizzle with honey',
            'Mix and enjoy'
          ],
          completed: false
        }
      ]
    }
  });

  const getMacroPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snacks': return '🍎';
      default: return '🍽️';
    }
  };

  const toggleMealCompletion = (mealId: string) => {
    // In a real app, this would update the meal completion status
    console.log(`Toggle completion for meal: ${mealId}`);
  };

  const renderMealCard = (meal: Meal, mealType: string) => (
    <TouchableOpacity 
      key={meal.id}
      style={styles.mealCard}
      onPress={() => setSelectedMeal(selectedMeal === meal.id ? null : meal.id)}
    >
      <View style={styles.mealHeader}>
        <Image source={{ uri: meal.image }} style={styles.mealImage} />
        <View style={styles.mealInfo}>
          <View style={styles.mealTitleRow}>
            <Text style={styles.mealIcon}>{getMealTypeIcon(mealType)}</Text>
            <Text style={styles.mealType}>{mealType.toUpperCase()}</Text>
            <TouchableOpacity 
              style={styles.completionButton}
              onPress={() => toggleMealCompletion(meal.id)}
            >
              <CheckCircle 
                size={20} 
                color={meal.completed ? '#10B981' : '#6B7280'} 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.mealName}>{meal.name}</Text>
          <View style={styles.mealMeta}>
            <View style={styles.metaItem}>
              <Clock size={14} color="#94A3B8" />
              <Text style={styles.metaText}>{meal.prepTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={14} color="#94A3B8" />
              <Text style={styles.metaText}>{meal.servings} serving</Text>
            </View>
            <View style={styles.metaItem}>
              <Target size={14} color="#F59E0B" />
              <Text style={styles.metaText}>{meal.calories} kcal</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Macro Breakdown */}
      <View style={styles.macroContainer}>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroValue}>{meal.protein}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroValue}>{meal.carbs}g</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroLabel}>Fats</Text>
          <Text style={styles.macroValue}>{meal.fats}g</Text>
        </View>
      </View>

      {/* Expanded Details */}
      {selectedMeal === meal.id && (
        <View style={styles.expandedContent}>
          <View style={styles.ingredientsSection}>
            <Text style={styles.sectionTitle}>Ingredients:</Text>
            {meal.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>• {ingredient}</Text>
            ))}
          </View>
          
          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>Instructions:</Text>
            {meal.instructions.map((instruction, index) => (
              <Text key={index} style={styles.instructionText}>
                {index + 1}. {instruction}
              </Text>
            ))}
          </View>

          <TouchableOpacity style={styles.addToShoppingButton}>
            <ShoppingCart size={16} color="white" />
            <Text style={styles.addToShoppingText}>Add to Shopping List</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Daily Meal Plan</Text>
        <Text style={styles.headerDate}>{dailyPlan.date}</Text>
        
        {/* Daily Progress */}
        <View style={styles.dailyProgress}>
          <View style={styles.calorieProgress}>
            <Text style={styles.calorieText}>
              {dailyPlan.totalCalories} / {dailyPlan.targetCalories} kcal
            </Text>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill, 
                { width: `${getMacroPercentage(dailyPlan.totalCalories, dailyPlan.targetCalories)}%` }
              ]} />
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Macro Summary */}
        <View style={styles.macroSummary}>
          <Text style={styles.summaryTitle}>Today's Macros</Text>
          <View style={styles.macroGrid}>
            <View style={styles.macroSummaryItem}>
              <Text style={styles.macroSummaryLabel}>Protein</Text>
              <Text style={styles.macroSummaryValue}>
                {dailyPlan.totalProtein}g / {dailyPlan.targetProtein}g
              </Text>
              <View style={styles.macroProgressBar}>
                <View style={[
                  styles.macroProgressFill,
                  { 
                    width: `${getMacroPercentage(dailyPlan.totalProtein, dailyPlan.targetProtein)}%`,
                    backgroundColor: '#EF4444'
                  }
                ]} />
              </View>
            </View>
            
            <View style={styles.macroSummaryItem}>
              <Text style={styles.macroSummaryLabel}>Carbs</Text>
              <Text style={styles.macroSummaryValue}>
                {dailyPlan.totalCarbs}g / {dailyPlan.targetCarbs}g
              </Text>
              <View style={styles.macroProgressBar}>
                <View style={[
                  styles.macroProgressFill,
                  { 
                    width: `${getMacroPercentage(dailyPlan.totalCarbs, dailyPlan.targetCarbs)}%`,
                    backgroundColor: '#3B82F6'
                  }
                ]} />
              </View>
            </View>
            
            <View style={styles.macroSummaryItem}>
              <Text style={styles.macroSummaryLabel}>Fats</Text>
              <Text style={styles.macroSummaryValue}>
                {dailyPlan.totalFats}g / {dailyPlan.targetFats}g
              </Text>
              <View style={styles.macroProgressBar}>
                <View style={[
                  styles.macroProgressFill,
                  { 
                    width: `${getMacroPercentage(dailyPlan.totalFats, dailyPlan.targetFats)}%`,
                    backgroundColor: '#F59E0B'
                  }
                ]} />
              </View>
            </View>
          </View>
        </View>

        {/* Meals */}
        <View style={styles.mealsSection}>
          {renderMealCard(dailyPlan.meals.breakfast, 'breakfast')}
          {renderMealCard(dailyPlan.meals.lunch, 'lunch')}
          {renderMealCard(dailyPlan.meals.dinner, 'dinner')}
          
          {/* Snacks */}
          <View style={styles.snacksContainer}>
            <Text style={styles.snacksTitle}>Snacks</Text>
            {dailyPlan.meals.snacks.map(snack => renderMealCard(snack, 'snacks'))}
            
            <TouchableOpacity style={styles.addSnackButton}>
              <Plus size={20} color="#6B46C1" />
              <Text style={styles.addSnackText}>Add Snack</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <ChefHat size={20} color="white" />
            <Text style={styles.actionButtonText}>Generate New Plan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <ShoppingCart size={20} color="#6B46C1" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              View Shopping List
            </Text>
          </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 20,
  },
  dailyProgress: {
    alignItems: 'center',
  },
  calorieProgress: {
    width: '100%',
    alignItems: 'center',
  },
  calorieText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  macroSummary: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroSummaryItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  macroSummaryLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  macroSummaryValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  macroProgressBar: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  macroProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  mealsSection: {
    marginBottom: 20,
  },
  mealCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  mealInfo: {
    flex: 1,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  mealType: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  completionButton: {
    padding: 4,
  },
  mealName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mealMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#94A3B8',
    fontSize: 12,
    marginLeft: 4,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 16,
  },
  ingredientsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ingredientText: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  instructionsSection: {
    marginBottom: 16,
  },
  instructionText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  addToShoppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B46C1',
    borderRadius: 12,
    padding: 12,
  },
  addToShoppingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  snacksContainer: {
    marginTop: 8,
  },
  snacksTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addSnackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(107, 70, 193, 0.1)',
    borderWidth: 2,
    borderColor: '#6B46C1',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
  },
  addSnackText: {
    color: '#6B46C1',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B46C1',
    borderRadius: 16,
    padding: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6B46C1',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#6B46C1',
  },
});