import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Modal, ScrollView, TextInput } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, FlashlightOff as FlashOff, Slash as FlashOn, RotateCcw, Search, Zap, Target, Scale, Plus, Minus } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface FoodResult {
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  servingWeight: number;
}

export default function FoodScanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [scanResult, setScanResult] = useState<FoodResult | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Mock food database for demonstration
  const mockFoodDatabase: { [key: string]: FoodResult } = {
    'apple': {
      name: 'Apple (Medium)',
      confidence: 0.95,
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fats: 0.3,
      fiber: 4,
      sugar: 19,
      sodium: 2,
      servingSize: '1 medium apple',
      servingWeight: 182
    },
    'banana': {
      name: 'Banana (Medium)',
      confidence: 0.92,
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fats: 0.4,
      fiber: 3,
      sugar: 14,
      sodium: 1,
      servingSize: '1 medium banana',
      servingWeight: 118
    },
    'chicken breast': {
      name: 'Chicken Breast (Grilled)',
      confidence: 0.88,
      calories: 165,
      protein: 31,
      carbs: 0,
      fats: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      servingSize: '100g',
      servingWeight: 100
    },
    'broccoli': {
      name: 'Broccoli (Cooked)',
      confidence: 0.91,
      calories: 35,
      protein: 3.7,
      carbs: 7,
      fats: 0.4,
      fiber: 3,
      sugar: 2,
      sodium: 33,
      servingSize: '1 cup chopped',
      servingWeight: 156
    }
  };

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Camera size={64} color="#6B46C1" />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need camera access to scan and identify food items for nutritional analysis.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(!flash);
  };

  const simulateAIRecognition = async () => {
    setIsScanning(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock recognition result (randomly pick a food item)
    const foodItems = Object.keys(mockFoodDatabase);
    const randomFood = foodItems[Math.floor(Math.random() * foodItems.length)];
    const result = mockFoodDatabase[randomFood];
    
    setScanResult(result);
    setIsScanning(false);
    setShowResults(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        await simulateAIRecognition();
      } catch (error) {
        Alert.alert('Error', 'Failed to analyze food. Please try again.');
        setIsScanning(false);
      }
    }
  };

  const searchFood = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a food name to search.');
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const result = mockFoodDatabase[query];
    
    if (result) {
      setScanResult(result);
      setShowManualSearch(false);
      setShowResults(true);
      setSearchQuery('');
    } else {
      Alert.alert('Not Found', 'Food item not found in database. Try a different search term.');
    }
  };

  const adjustPortion = (increment: boolean) => {
    const newMultiplier = increment 
      ? Math.min(portionMultiplier + 0.25, 5) 
      : Math.max(portionMultiplier - 0.25, 0.25);
    setPortionMultiplier(newMultiplier);
  };

  const calculateAdjustedNutrition = (value: number) => {
    return Math.round(value * portionMultiplier);
  };

  const saveToMealLog = () => {
    Alert.alert(
      'Saved!', 
      `${scanResult?.name} has been added to your meal log.`,
      [{ text: 'OK', onPress: () => setShowResults(false) }]
    );
  };

  const resetScanner = () => {
    setShowResults(false);
    setScanResult(null);
    setPortionMultiplier(1);
  };

  if (showResults && scanResult) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#6B46C1', '#8B5CF6']}
          style={styles.resultsHeader}
        >
          <Text style={styles.resultsTitle}>Food Analysis Results</Text>
          <View style={styles.confidenceContainer}>
            <Target size={16} color="#F59E0B" />
            <Text style={styles.confidenceText}>
              {Math.round(scanResult.confidence * 100)}% confidence
            </Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.resultsContent}>
          <View style={styles.foodCard}>
            <Text style={styles.foodName}>{scanResult.name}</Text>
            <Text style={styles.servingInfo}>Per {scanResult.servingSize}</Text>
            
            {/* Portion Adjuster */}
            <View style={styles.portionContainer}>
              <Text style={styles.portionLabel}>Portion Size:</Text>
              <View style={styles.portionControls}>
                <TouchableOpacity 
                  style={styles.portionButton}
                  onPress={() => adjustPortion(false)}
                >
                  <Minus size={16} color="white" />
                </TouchableOpacity>
                <Text style={styles.portionValue}>{portionMultiplier}x</Text>
                <TouchableOpacity 
                  style={styles.portionButton}
                  onPress={() => adjustPortion(true)}
                >
                  <Plus size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Calories */}
            <View style={styles.caloriesContainer}>
              <Zap size={24} color="#F59E0B" />
              <Text style={styles.caloriesValue}>
                {calculateAdjustedNutrition(scanResult.calories)} kcal
              </Text>
            </View>

            {/* Macronutrients */}
            <View style={styles.macrosContainer}>
              <Text style={styles.macrosTitle}>Macronutrients</Text>
              <View style={styles.macrosGrid}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>Protein</Text>
                  <Text style={styles.macroValue}>
                    {calculateAdjustedNutrition(scanResult.protein)}g
                  </Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>Carbs</Text>
                  <Text style={styles.macroValue}>
                    {calculateAdjustedNutrition(scanResult.carbs)}g
                  </Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroLabel}>Fats</Text>
                  <Text style={styles.macroValue}>
                    {calculateAdjustedNutrition(scanResult.fats)}g
                  </Text>
                </View>
              </View>
            </View>

            {/* Additional Nutrients */}
            <View style={styles.nutrientsContainer}>
              <Text style={styles.nutrientsTitle}>Additional Nutrients</Text>
              <View style={styles.nutrientsList}>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientLabel}>Fiber</Text>
                  <Text style={styles.nutrientValue}>
                    {calculateAdjustedNutrition(scanResult.fiber)}g
                  </Text>
                </View>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientLabel}>Sugar</Text>
                  <Text style={styles.nutrientValue}>
                    {calculateAdjustedNutrition(scanResult.sugar)}g
                  </Text>
                </View>
                <View style={styles.nutrientItem}>
                  <Text style={styles.nutrientLabel}>Sodium</Text>
                  <Text style={styles.nutrientValue}>
                    {calculateAdjustedNutrition(scanResult.sodium)}mg
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={saveToMealLog}>
              <Text style={styles.saveButtonText}>Add to Meal Log</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.rescanButton} onPress={resetScanner}>
              <RotateCcw size={20} color="#6B46C1" />
              <Text style={styles.rescanButtonText}>Scan Another Item</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash ? 'on' : 'off'}
      >
        {/* Header */}
        <View style={styles.cameraHeader}>
          <Text style={styles.cameraTitle}>Food Scanner</Text>
          <Text style={styles.cameraSubtitle}>Point camera at food to analyze</Text>
        </View>

        {/* Scanning Overlay */}
        <View style={styles.scanningOverlay}>
          <View style={styles.scanFrame}>
            {isScanning && (
              <View style={styles.scanningIndicator}>
                <Text style={styles.scanningText}>Analyzing...</Text>
                <View style={styles.scanningAnimation} />
              </View>
            )}
          </View>
        </View>

        {/* Camera Controls */}
        <View style={styles.cameraControls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            {flash ? <FlashOn size={24} color="white" /> : <FlashOff size={24} color="white" />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.captureButton, isScanning && styles.captureButtonDisabled]}
            onPress={takePicture}
            disabled={isScanning}
          >
            <Camera size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <RotateCcw size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Manual Search Button */}
        <TouchableOpacity 
          style={styles.manualSearchButton}
          onPress={() => setShowManualSearch(true)}
        >
          <Search size={20} color="white" />
          <Text style={styles.manualSearchText}>Manual Search</Text>
        </TouchableOpacity>
      </CameraView>

      {/* Manual Search Modal */}
      <Modal
        visible={showManualSearch}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search Food Database</Text>
            <Text style={styles.modalSubtitle}>
              Enter the name of the food item you want to analyze
            </Text>
            
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="e.g., apple, chicken breast, broccoli"
              placeholderTextColor="#6B7280"
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={searchFood}
              >
                <Text style={styles.modalButtonText}>Search</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setShowManualSearch(false);
                  setSearchQuery('');
                }}
              >
                <Text style={[styles.modalButtonText, styles.modalCancelText]}>Cancel</Text>
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  permissionText: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  cameraTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cameraSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  scanningOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.8,
    height: width * 0.8,
    borderWidth: 2,
    borderColor: '#F59E0B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningIndicator: {
    alignItems: 'center',
  },
  scanningText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  scanningAnimation: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderColor: '#F59E0B',
    borderTopColor: 'transparent',
    borderRadius: 20,
    // Animation would be handled by a library like react-native-reanimated
  },
  cameraControls: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: '#6B7280',
  },
  manualSearchButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  manualSearchText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsHeader: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  resultsTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  resultsContent: {
    flex: 1,
    padding: 20,
  },
  foodCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  foodName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  servingInfo: {
    color: '#94A3B8',
    fontSize: 16,
    marginBottom: 20,
  },
  portionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#374151',
    borderRadius: 12,
  },
  portionLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  portionControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  portionValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  caloriesValue: {
    color: '#F59E0B',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  macrosContainer: {
    marginBottom: 20,
  },
  macrosTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  macroValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nutrientsContainer: {
    marginBottom: 20,
  },
  nutrientsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  nutrientsList: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
  },
  nutrientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nutrientLabel: {
    color: '#94A3B8',
    fontSize: 14,
  },
  nutrientValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtons: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rescanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6B46C1',
    borderRadius: 16,
    padding: 16,
  },
  rescanButtonText: {
    color: '#6B46C1',
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
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#6B46C1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6B7280',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancelText: {
    color: '#6B7280',
  },
});