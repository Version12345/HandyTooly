'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import MedicalDisclaimer from '@/components/disclaimers/medicalDisclaimer';

interface WeightData {
  startingWeight: number;
  currentWeight: number;
  goalWeight: number;
  height: number;
  isMetric: boolean;
  gender: 'male' | 'female';
  timePeriod: number;
  activityLevel: string;
  age: number;
}

interface CalculationResult {
  weightLossPercentage: number;
  totalWeightLost: number;
  bmiReduction: number;
  startingBMI: number;
  currentBMI: number;
  goalBMI: number;
  healthCategory: string;
  startingHealthCategory: string;
  achievements: string[];
  recommendations: string[];
}

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
  { value: 'light', label: 'Lightly Active (light exercise 1-3 days/week)' },
  { value: 'moderate', label: 'Moderately Active (regular exercise 3-5x/week)' },
  { value: 'very', label: 'Very Active (hard exercise 6-7 days/week)' },
  { value: 'extreme', label: 'Extremely Active (very hard exercise, physical job)' }
];

export function WeightLossCalculator() {
  const [weightData, setWeightData] = useState<WeightData>({
    startingWeight: 175,
    currentWeight: 165,
    goalWeight: 150,
    height: 68, // inches
    isMetric: false,
    gender: 'male',
    timePeriod: 12,
    activityLevel: 'moderate',
    age: 25
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateBMI = useCallback((weight: number, height: number, isMetric: boolean): number => {
    if (isMetric) {
      // weight in kg, height in cm
      const heightInM = height / 100;
      return weight / (heightInM * heightInM);
    } else {
      // weight in lbs, height in inches
      return (weight / (height * height)) * 703;
    }
  }, []);

  const getBMICategory = useCallback((bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Obesity Class I';
    if (bmi < 40) return 'Obesity Class II';
    return 'Obesity Class III';
  }, []);

  const getAchievements = useCallback((weightLossPercentage: number, startingBMI: number, currentBMI: number): string[] => {
    const achievements: string[] = [];
    
    if (weightLossPercentage >= 3) achievements.push('Health Improver - 3% weight loss achieved!');
    if (weightLossPercentage >= 5) achievements.push('Clinical Milestone - 5% weight loss reached!');
    if (weightLossPercentage >= 10) achievements.push('Major Transformation - 10% weight loss completed!');
    if (weightLossPercentage >= 15) achievements.push('Exceptional Achievement - 15% weight loss accomplished!');
    
    const startingCategory = getBMICategory(startingBMI);
    const currentCategory = getBMICategory(currentBMI);
    
    if (startingCategory === 'Obesity Class III' && currentCategory !== 'Obesity Class III') {
      achievements.push('BMI Category Improvement - Moved out of Class III Obesity!');
    }
    if (startingCategory === 'Obesity Class II' && currentCategory !== 'Obesity Class II' && currentCategory !== 'Obesity Class III') {
      achievements.push('BMI Category Improvement - Moved out of Class II Obesity!');
    }
    if (startingCategory === 'Obesity Class I' && !currentCategory.includes('Obesity')) {
      achievements.push('BMI Category Improvement - Moved out of Obesity range!');
    }
    if (startingCategory === 'Overweight' && currentCategory === 'Normal weight') {
      achievements.push('BMI Category Improvement - Overweight to Normal weight!');
    }
    
    return achievements;
  }, [getBMICategory]);

  const getRecommendations = useCallback((currentBMI: number, goalBMI: number, weightLossPercentage: number): string[] => {
    const recommendations: string[] = [];
    
    if (currentBMI >= 25 && goalBMI < 25) {
      recommendations.push('You\'ve reached a healthy BMI range - consider maintenance strategies');
    }
    
    if (weightLossPercentage >= 10) {
      recommendations.push('Excellent progress! Focus on sustainable habits for long-term success');
    }
    
    if (currentBMI < 18.5) {
      recommendations.push('Consult healthcare provider - BMI indicates underweight status');
    }
    
    if (weightLossPercentage < 5) {
      recommendations.push('Consider adjusting diet and exercise plan for better results');
    }
    
    return recommendations;
  }, []);

  const calculateMaintenanceCalories = useCallback((weight: number, height: number, age: number, gender: 'male' | 'female', activityLevel: string, isMetric: boolean): number => {
    // Convert to metric if needed for calculation
    const weightKg = isMetric ? weight : weight * 0.453592;
    const heightCm = isMetric ? height : height * 2.54;
    
    // Mifflin-St Jeor Equation for BMR
    let bmr: number;
    if (gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
    
    // Activity multipliers
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extreme: 1.9
    };
    
    const multiplier = activityMultipliers[activityLevel] || 1.55;
    
    return Math.round(bmr * multiplier);
  }, []);

  const performCalculation = useCallback(() => {
    const { startingWeight, currentWeight, goalWeight, height, isMetric } = weightData;
    
    if (!startingWeight || !currentWeight || !height) return;

    const weightLoss = startingWeight - currentWeight;
    const weightLossPercentage = (weightLoss / startingWeight) * 100;
    
    const startingBMI = calculateBMI(startingWeight, height, isMetric);
    const currentBMI = calculateBMI(currentWeight, height, isMetric);
    const goalBMI = goalWeight ? calculateBMI(goalWeight, height, isMetric) : currentBMI;
    
    const bmiReduction = startingBMI - currentBMI;
    
    const healthCategory = getBMICategory(currentBMI);
    const startingHealthCategory = getBMICategory(startingBMI);
    
    const achievements = getAchievements(weightLossPercentage, startingBMI, currentBMI);
    const recommendations = getRecommendations(currentBMI, goalBMI, weightLossPercentage);

    setResult({
      weightLossPercentage,
      totalWeightLost: weightLoss,
      bmiReduction,
      startingBMI,
      currentBMI,
      goalBMI,
      healthCategory,
      startingHealthCategory,
      achievements,
      recommendations
    });
  }, [weightData, calculateBMI, getBMICategory, getAchievements, getRecommendations]);

  useEffect(() => {
    const timeoutId = setTimeout(performCalculation, 300);
    return () => clearTimeout(timeoutId);
  }, [performCalculation]);

  const handleInputChange = (field: keyof WeightData, value: string | number) => {
    setWeightData(prev => ({ ...prev, [field]: value }));
  };

  const convertWeight = (weight: number, toMetric: boolean): number => {
    if (toMetric) {
      // lbs to kg
      return Math.round((weight * 0.453592) * 10) / 10;
    } else {
      // kg to lbs
      return Math.round((weight * 2.20462) * 10) / 10;
    }
  };

  const convertHeight = (height: number, toMetric: boolean): number => {
    if (toMetric) {
      // inches to cm
      return Math.round(height * 2.54);
    } else {
      // cm to inches
      return Math.round((height / 2.54) * 10) / 10;
    }
  };

  const handleUnitToggle = () => {
    const newIsMetric = !weightData.isMetric;
    setWeightData(prev => ({
      ...prev,
      isMetric: newIsMetric,
      startingWeight: convertWeight(prev.startingWeight, newIsMetric),
      currentWeight: convertWeight(prev.currentWeight, newIsMetric),
      goalWeight: prev.goalWeight ? convertWeight(prev.goalWeight, newIsMetric) : 0,
      height: convertHeight(prev.height, newIsMetric)
    }));
  };

  return (
    <ToolLayout 
      pageTitle="Weight Loss Percentage Calculator"
      disclaimer={<MedicalDisclaimer />}
    >
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Calculate your weight loss percentage, track BMI changes, and get personalized insights on your weight loss journey. 
          Monitor progress with healthy timelines and evidence-based recommendations for sustainable results.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weight Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weight Information</h2>
            
            {/* Units Toggle */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
              <div className="flex gap-2">
                <button
                  onClick={handleUnitToggle}
                  className={`px-4 py-2 rounded-md text-sm ${!weightData.isMetric 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Imperial (ft/in, lbs)
                </button>
                <button
                  onClick={handleUnitToggle}
                  className={`px-4 py-2 rounded-md text-sm ${weightData.isMetric 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Metric (cm, kg)
                </button>
              </div>
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleInputChange('gender', 'male')}
                  className={`px-4 py-2 rounded-md text-sm ${weightData.gender === 'male' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Male
                </button>
                <button
                  onClick={() => handleInputChange('gender', 'female')}
                  className={`px-4 py-2 rounded-md text-sm ${weightData.gender === 'female' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Age */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <div className="relative">
                <input
                  type="number"
                  value={weightData.age}
                  onChange={(e) => {
                    handleInputChange('age', e.target.value);
                  }}
                  className="w-full shadow-sm px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="30 years"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  years
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Required for accurate calorie calculations</p>
            </div>

            {/* Height */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height
              </label>
              {weightData.isMetric ? (
                <div className="relative">
                    <input
                        type="number"
                        value={weightData.height}
                        onChange={(e) => {
                            handleInputChange('height', e.target.value);
                        }}
                        className="w-full shadow-sm px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="170 cm"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        cm
                    </span>
                </div>
              ) : (
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                              type="number"
                              value={`${Math.floor(weightData.height / 12)}`}
                              onChange={(e) => {
                                const feet = parseInt(e.target.value) || 0;
                                const inches = weightData.height % 12;
                                const totalInches = feet * 12 + inches;
                                handleInputChange('height', totalInches);
                              }}
                              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500"
                              placeholder="5 ft"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">ft</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="relative">
                            <input
                              type="number"
                              value={`${Math.round(weightData.height % 12)}`}
                              onChange={(e) => {
                                const inches = parseInt(e.target.value) || 0;
                                const feet = Math.floor(weightData.height / 12);
                                const totalInches = feet * 12 + Math.min(inches, 11); // Cap inches at 11
                                handleInputChange('height', totalInches);
                              }}
                              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-2"
                              placeholder="8 in"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">in</span>
                        </div>
                    </div>
                </div>
              )}
            </div>

            {/* Starting Weight */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Starting Weight</label>
              <div className="relative">
                <input
                  type="number"
                  value={weightData.startingWeight}
                  onChange={(e) => {
                    handleInputChange('startingWeight', e.target.value);
                  }}
                  className="w-full shadow-sm px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={weightData.isMetric ? "80 kg" : "175 lbs"}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {weightData.isMetric ? 'kg' : 'lbs'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Your weight when you started your journey</p>
            </div>

            {/* Current Weight */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight</label>
              <div className="relative">
                <input
                  type="number"
                  value={weightData.currentWeight}
                  onChange={(e) => {
                    handleInputChange('currentWeight', e.target.value);
                  }}
                  className="w-full shadow-sm px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={weightData.isMetric ? "75 kg" : "165 lbs"}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {weightData.isMetric ? 'kg' : 'lbs'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Your weight today, or target weight</p>
            </div>
            {/* Time Period */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (Optional)</label>
              <div className="relative">
                <input
                  type="number"
                  value={`${weightData.timePeriod}`}
                  onChange={(e) => {
                    handleInputChange('timePeriod', e.target.value);
                  }}
                  className="w-full shadow-sm px-3 py-2 pr-13 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="12 weeks"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    weeks
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Weeks between starting and current weight (for rate analysis)</p>
            </div>

            {/* Goal Weight */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal Weight (Optional)</label>
              <div className="relative">
                <input
                  type="number"
                  value={weightData.goalWeight ? weightData.goalWeight : ''}
                  onChange={(e) => {
                    handleInputChange('goalWeight', e.target.value);
                  }}
                  className="w-full shadow-sm px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={weightData.isMetric ? "70 kg" : "150 lbs"}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {weightData.isMetric ? 'kg' : 'lbs'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Your ultimate weight loss target</p>
            </div>

            {/* Activity Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Activity Level</label>
              <select
                value={weightData.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current BMI Display */}
            {result && (
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <h3 className="font-medium text-blue-800 mb-1">Current BMI:</h3>
                <div className="text-2xl font-bold text-blue-600">
                  {result.currentBMI.toFixed(1)}
                </div>
                <div className="text-sm text-blue-700">
                  {result.healthCategory}
                </div>
              </div>
            )}
          </div>

          {/* Weight Loss Results */}
          <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
            {!result && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center text-gray-500 py-8">
                  <p>Enter your weight information to see analysis</p>
                </div>
              </div>
            )}

            {result && (
              <>
                {/* Goal BMI */}
                <div className={`rounded-lg p-4 ${result.goalBMI < 25 ? 'bg-green-50' : result.goalBMI < 30 ? 'bg-yellow-50' : 'bg-red-50'}`}>
                  <h3 className={`text-sm font-medium mb-1`}>
                    Goal BMI
                  </h3>
                  <div className={`text-2xl font-bold mb-1 ${result.goalBMI < 25 ? 'text-green-800' : result.goalBMI < 30 ? 'text-yellow-800' : 'text-red-800'}`}>
                    {result.goalBMI.toFixed(1)}
                  </div>
                  <div className={`text-sm ${result.goalBMI < 25 ? 'text-green-600' : result.goalBMI < 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {result.goalBMI < 25 ? 'Normal weight' : result.goalBMI < 30 ? 'Overweight' : 'Obesity'}
                  </div>
                </div>

                {/* Weight to Lose */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-700 mb-1">Weight to Lose</h3>
                  <div className="text-2xl font-bold text-blue-800 mb-1">
                    {Math.max(0, (weightData.currentWeight - (weightData.goalWeight || weightData.currentWeight))).toFixed(1)} {weightData.isMetric ? 'kg' : 'lbs'}
                  </div>
                  <div className="text-sm text-blue-600">
                    At {weightData.isMetric ? '0.5 kg' : '1.0 lbs'} per week
                  </div>
                </div>

                {/* Estimated Timeline */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-purple-700 mb-1">Estimated Timeline</h3>
                  <div className="text-2xl font-bold text-purple-800 mb-1">
                    {Math.ceil(Math.max(0, (weightData.currentWeight - (weightData.goalWeight || weightData.currentWeight))) / (weightData.isMetric ? 0.5 : 1.0))} weeks
                  </div>
                  <div className="text-sm text-purple-600">
                    Goal date: {new Date(Date.now() + Math.ceil(Math.max(0, (weightData.currentWeight - (weightData.goalWeight || weightData.currentWeight))) / (weightData.isMetric ? 0.5 : 1.0)) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                {/* Daily Calories */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-orange-700 mb-1">Daily Calories</h3>
                  <div className="text-sm text-orange-600 mb-2">
                    Maintenance: {calculateMaintenanceCalories(weightData.currentWeight, weightData.height, weightData.age, weightData.gender, weightData.activityLevel, weightData.isMetric)} cal/day
                  </div>
                  <div className="text-2xl font-bold text-orange-800 mb-1">
                    {calculateMaintenanceCalories(weightData.currentWeight, weightData.height, weightData.age, weightData.gender, weightData.activityLevel, weightData.isMetric) - 500} cal/day
                  </div>
                  <div className="text-sm text-orange-600">
                    Deficit: 500 cal/day
                  </div>
                </div>
              </>
            )}

            {/* Weekly Breakdown */}
            {result && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Weekly Breakdown</h3>
                <div className="space-y-1 text-sm">
                  <div className="text-yellow-700">
                    <span className="font-medium">Weekly deficit needed:</span> 3500 calories
                  </div>
                  <div className="text-yellow-700">
                    <span className="font-medium">Daily deficit:</span> 500 calories
                  </div>
                  <div className="text-yellow-700">
                    <span className="font-medium">Through diet:</span> Reduce 350 cal/day
                  </div>
                  <div className="text-yellow-700">
                    <span className="font-medium">Through exercise:</span> Burn 150 cal/day
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">

            {/* Weekly Progress Timeline */}
            {result && weightData.goalWeight && weightData.goalWeight < weightData.currentWeight && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Weekly Progress Timeline</h3>
                <div className="space-y-2">
                  {Array.from({ length: Math.min(5, Math.ceil((weightData.currentWeight - weightData.goalWeight) / (weightData.isMetric ? 0.5 : 1.0))) }, (_, i) => {
                    const weekNumber = (i + 1) * 5;
                    const projectedWeight = weightData.currentWeight - (i + 1) * (weightData.isMetric ? 2.5 : 5.0);
                    const projectedBMI = weightData.isMetric 
                      ? projectedWeight / Math.pow(weightData.height / 100, 2)
                      : (projectedWeight / Math.pow(weightData.height, 2)) * 703;
                    const date = new Date(Date.now() + weekNumber * 7 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <div className="font-medium text-gray-900">Week {weekNumber}</div>
                          <div className="text-xs text-gray-500">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {projectedWeight.toFixed(1)} {weightData.isMetric ? 'kg' : 'lbs'}
                          </div>
                          <div className="text-xs text-gray-500">
                            BMI: {projectedBMI.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Achievements and Recommendations */}
            {result && (
            <div>
                {/* Achievements Unlocked */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements Unlocked</h3>
                    {result.achievements.length === 0 ? (
                        <p className="text-gray-500">Keep going! Your first achievement is just around the corner.</p>
                    ) : (
                        <div className="space-y-3">
                        {result.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                            <span className="text-yellow-600 text-lg">🏆</span>
                            <div className="text-sm text-yellow-800">{achievement}</div>
                            </div>
                        ))}
                        </div>
                    )}
                </div>

                {/* Personalized Recommendations */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
                    {result.recommendations.length === 0 ? (
                            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <span className="text-green-600 text-lg">✓</span>
                        <div className="text-sm text-green-800 ml-2">
                            You&apos;ve reached a healthy BMI range - consider maintenance strategies
                        </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                        {result.recommendations.map((recommendation, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <span className="text-green-600 text-lg">💡</span>
                            <div className="text-sm text-green-800">{recommendation}</div>
                            </div>
                        ))}
                        </div>
                    )}
                </div>
            </div>
            )}
          </div>
        </div>

        {/* Usage Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use This Calculator</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Metrics</h4>
              <ul className="space-y-1">
                <li>• <strong>Weight Loss %:</strong> Percentage of body weight lost from starting point</li>
                <li>• <strong>BMI Reduction:</strong> Change in Body Mass Index score</li>
                <li>• <strong>Health Category:</strong> BMI-based health classification changes</li>
                <li>• <strong>Achievements:</strong> Milestone recognition for health improvements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Health Guidelines</h4>
              <ul className="space-y-1">
                <li>• 3-5% weight loss shows health benefits</li>
                <li>• 5-10% loss significantly improves health markers</li>
                <li>• Sustainable rate: 1-2 lbs per week</li>
                <li>• Always consult healthcare providers for personalized advice</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}