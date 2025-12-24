import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, RotateCcw, CircleCheck as CheckCircle, Clock, Target, Dumbbell, ChevronLeft, ChevronRight, Trophy } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Exercise {
  id: string;
  name: string;
  targetMuscles: string[];
  sets: number;
  reps: string;
  weight?: string;
  restTime: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string[];
  completed: boolean;
}

interface Workout {
  id: string;
  name: string;
  duration: string;
  difficulty: string;
  exercises: Exercise[];
  totalExercises: number;
  completedExercises: number;
}

export default function WorkoutPage() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [workout, setWorkout] = useState<Workout>({
    id: '1',
    name: 'Upper Body Strength',
    duration: '45 min',
    difficulty: 'Intermediate',
    totalExercises: 6,
    completedExercises: 0,
    exercises: [
      {
        id: '1',
        name: 'Push-ups',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
        sets: 3,
        reps: '12-15',
        restTime: 60,
        difficulty: 'Intermediate',
        instructions: [
          'Start in a plank position with hands slightly wider than shoulders',
          'Lower your body until chest nearly touches the floor',
          'Push back up to starting position',
          'Keep your core tight throughout the movement'
        ],
        completed: false
      },
      {
        id: '2',
        name: 'Dumbbell Rows',
        targetMuscles: ['Back', 'Biceps'],
        sets: 3,
        reps: '10-12',
        weight: '15-20 lbs',
        restTime: 90,
        difficulty: 'Intermediate',
        instructions: [
          'Hold dumbbells with palms facing your body',
          'Hinge at hips, keeping back straight',
          'Pull dumbbells to your ribs, squeezing shoulder blades',
          'Lower with control'
        ],
        completed: false
      },
      {
        id: '3',
        name: 'Shoulder Press',
        targetMuscles: ['Shoulders', 'Triceps'],
        sets: 3,
        reps: '8-10',
        weight: '12-15 lbs',
        restTime: 75,
        difficulty: 'Intermediate',
        instructions: [
          'Hold dumbbells at shoulder height',
          'Press weights overhead until arms are fully extended',
          'Lower with control to starting position',
          'Keep core engaged throughout'
        ],
        completed: false
      },
      {
        id: '4',
        name: 'Tricep Dips',
        targetMuscles: ['Triceps', 'Shoulders'],
        sets: 3,
        reps: '8-12',
        restTime: 60,
        difficulty: 'Intermediate',
        instructions: [
          'Sit on edge of chair or bench',
          'Place hands beside hips, fingers forward',
          'Lower body by bending elbows',
          'Push back up to starting position'
        ],
        completed: false
      },
      {
        id: '5',
        name: 'Bicep Curls',
        targetMuscles: ['Biceps'],
        sets: 3,
        reps: '12-15',
        weight: '10-15 lbs',
        restTime: 45,
        difficulty: 'Beginner',
        instructions: [
          'Hold dumbbells with palms facing forward',
          'Keep elbows close to your sides',
          'Curl weights up to shoulders',
          'Lower with control'
        ],
        completed: false
      },
      {
        id: '6',
        name: 'Plank Hold',
        targetMuscles: ['Core', 'Shoulders'],
        sets: 3,
        reps: '30-60 sec',
        restTime: 60,
        difficulty: 'Intermediate',
        instructions: [
          'Start in push-up position',
          'Lower to forearms, keeping body straight',
          'Hold position, engaging core',
          'Breathe steadily throughout'
        ],
        completed: false
      }
    ]
  });

  const currentExercise = workout.exercises[currentExerciseIndex];
  const progressPercentage = (workout.completedExercises / workout.totalExercises) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const startRestTimer = () => {
    setTimeRemaining(currentExercise.restTime);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimeRemaining(currentExercise.restTime);
    setIsTimerRunning(false);
  };

  const completeExercise = () => {
    const updatedWorkout = { ...workout };
    updatedWorkout.exercises[currentExerciseIndex].completed = true;
    updatedWorkout.completedExercises += 1;
    setWorkout(updatedWorkout);

    if (updatedWorkout.completedExercises === updatedWorkout.totalExercises) {
      setShowCompletionModal(true);
    } else if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      startRestTimer();
    }
  };

  const goToPreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setIsTimerRunning(false);
      setTimeRemaining(0);
    }
  };

  const goToNextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setIsTimerRunning(false);
      setTimeRemaining(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
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
        <View style={styles.headerContent}>
          <Text style={styles.workoutTitle}>{workout.name}</Text>
          <Text style={styles.workoutMeta}>{workout.duration} • {workout.difficulty}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {workout.completedExercises} / {workout.totalExercises} exercises
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Current Exercise Card */}
        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{currentExercise.name}</Text>
              <View style={styles.exerciseMeta}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(currentExercise.difficulty) }]}>
                  <Text style={styles.difficultyText}>{currentExercise.difficulty}</Text>
                </View>
                <Text style={styles.exerciseNumber}>
                  Exercise {currentExerciseIndex + 1} of {workout.totalExercises}
                </Text>
              </View>
            </View>
            {currentExercise.completed && (
              <CheckCircle size={24} color="#10B981" />
            )}
          </View>

          {/* Target Muscles */}
          <View style={styles.muscleContainer}>
            <Target size={16} color="#94A3B8" />
            <Text style={styles.muscleText}>
              {currentExercise.targetMuscles.join(', ')}
            </Text>
          </View>

          {/* Sets and Reps */}
          <View style={styles.setsContainer}>
            <View style={styles.setInfo}>
              <Dumbbell size={16} color="#F59E0B" />
              <Text style={styles.setLabel}>Sets: </Text>
              <Text style={styles.setValue}>{currentExercise.sets}</Text>
            </View>
            <View style={styles.setInfo}>
              <Text style={styles.setLabel}>Reps: </Text>
              <Text style={styles.setValue}>{currentExercise.reps}</Text>
            </View>
            {currentExercise.weight && (
              <View style={styles.setInfo}>
                <Text style={styles.setLabel}>Weight: </Text>
                <Text style={styles.setValue}>{currentExercise.weight}</Text>
              </View>
            )}
          </View>

          {/* Exercise Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            {currentExercise.instructions.map((instruction, index) => (
              <Text key={index} style={styles.instructionText}>
                {index + 1}. {instruction}
              </Text>
            ))}
          </View>
        </View>

        {/* Rest Timer */}
        <View style={styles.timerCard}>
          <Text style={styles.timerTitle}>Rest Timer</Text>
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>
              {timeRemaining > 0 ? formatTime(timeRemaining) : formatTime(currentExercise.restTime)}
            </Text>
          </View>
          <View style={styles.timerControls}>
            <TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
              {isTimerRunning ? <Pause size={20} color="white" /> : <Play size={20} color="white" />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.timerButton} onPress={resetTimer}>
              <RotateCcw size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Controls */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={[styles.navButton, currentExerciseIndex === 0 && styles.navButtonDisabled]}
            onPress={goToPreviousExercise}
            disabled={currentExerciseIndex === 0}
          >
            <ChevronLeft size={20} color={currentExerciseIndex === 0 ? '#6B7280' : 'white'} />
            <Text style={[styles.navButtonText, currentExerciseIndex === 0 && styles.navButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.completeButton}
            onPress={completeExercise}
            disabled={currentExercise.completed}
          >
            <CheckCircle size={20} color="white" />
            <Text style={styles.completeButtonText}>
              {currentExercise.completed ? 'Completed' : 'Complete Set'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navButton, currentExerciseIndex === workout.exercises.length - 1 && styles.navButtonDisabled]}
            onPress={goToNextExercise}
            disabled={currentExerciseIndex === workout.exercises.length - 1}
          >
            <Text style={[styles.navButtonText, currentExerciseIndex === workout.exercises.length - 1 && styles.navButtonTextDisabled]}>
              Next
            </Text>
            <ChevronRight size={20} color={currentExerciseIndex === workout.exercises.length - 1 ? '#6B7280' : 'white'} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Workout Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Trophy size={48} color="#F59E0B" />
            <Text style={styles.modalTitle}>Workout Complete!</Text>
            <Text style={styles.modalText}>
              Great job! You've completed your {workout.name} workout.
            </Text>
            <Text style={styles.modalStats}>
              +150 XP • +1 Workout Streak
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowCompletionModal(false)}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
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
    alignItems: 'center',
  },
  workoutTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutMeta: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  exerciseCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  exerciseNumber: {
    color: '#94A3B8',
    fontSize: 14,
  },
  muscleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  muscleText: {
    color: '#94A3B8',
    fontSize: 14,
    marginLeft: 8,
  },
  setsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  setInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setLabel: {
    color: '#94A3B8',
    fontSize: 14,
    marginLeft: 4,
  },
  setValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    marginTop: 16,
  },
  instructionsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instructionText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  timerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timerDisplay: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    color: '#F59E0B',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  timerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#1F2937',
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: '#6B7280',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 2,
    justifyContent: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
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
    padding: 32,
    alignItems: 'center',
    margin: 20,
    maxWidth: 300,
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  modalText: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalStats: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});