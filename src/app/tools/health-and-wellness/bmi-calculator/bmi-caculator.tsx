"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import MedicalDisclaimer from '@/components/disclaimers/medicalDisclaimer';
import { ToolNameLists } from '@/constants/tools';

enum BMICategory {
  SEVERELY_UNDERWEIGHT = 'Severely underweight',
  UNDERWEIGHT = 'Underweight',
  NORMAL_WEIGHT = 'Normal weight',
  OVERWEIGHT = 'Overweight',
  OBESE_CLASS_I = 'Obese class I',
  OBESE_CLASS_II = 'Obese class II',
  OBESE_CLASS_III = 'Obese class III'
}

export default function BMICalculator() {
  const [height, setHeight] = useState('175');
  const [heightFeet, setHeightFeet] = useState('5');
  const [heightInches, setHeightInches] = useState('9');
  const [weight, setWeight] = useState('70');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState<'male' | 'female' | ''>('male');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    status: string;
    idealWeightRange: string;
    healthRisk: string;
    bodyFatPercentage: number | null;
  } | null>(null);

  const BMI_RANGES = useMemo(() => ({
    [BMICategory.SEVERELY_UNDERWEIGHT]: '<= 16.4',
    [BMICategory.UNDERWEIGHT]: '16.5 ~ 18.4',
    [BMICategory.NORMAL_WEIGHT]: '18.5 ~ 24.9',
    [BMICategory.OVERWEIGHT]: '25.0 ~ 29.9',
    [BMICategory.OBESE_CLASS_I]: '30.0 ~ 34.9',
    [BMICategory.OBESE_CLASS_II]: '35.0 ~ 39.0',
    [BMICategory.OBESE_CLASS_III]: '>= 40.0'
  }), []);

  const BMI_COLORS = useMemo(() => ({
    [BMICategory.SEVERELY_UNDERWEIGHT]: 'bg-blue-400 text-blue-800',
    [BMICategory.UNDERWEIGHT]: 'bg-blue-300 text-blue-700',
    [BMICategory.NORMAL_WEIGHT]: 'bg-green-300 text-green-800',
    [BMICategory.OVERWEIGHT]: 'bg-yellow-300 text-orange-700',
    [BMICategory.OBESE_CLASS_I]: 'bg-orange-300 text-orange-700',
    [BMICategory.OBESE_CLASS_II]: 'bg-red-400 text-orange-700',
    [BMICategory.OBESE_CLASS_III]: 'bg-red-500 text-orange-700'
  }), []);

  const BMI_CATEGORIES = useMemo(() => ({
    [BMICategory.SEVERELY_UNDERWEIGHT]: { 
      category: BMICategory.SEVERELY_UNDERWEIGHT, 
      range: BMI_RANGES[BMICategory.SEVERELY_UNDERWEIGHT], 
      color: BMI_COLORS[BMICategory.SEVERELY_UNDERWEIGHT],
      status: BMICategory.SEVERELY_UNDERWEIGHT,
      healthRisk: 'High risk of weight-related health problems',
      width: '16.25%'
    }, 
    [BMICategory.UNDERWEIGHT]: { 
      category: BMICategory.UNDERWEIGHT, 
      range: BMI_RANGES[BMICategory.UNDERWEIGHT], 
      color: BMI_COLORS[BMICategory.UNDERWEIGHT],
      status: BMICategory.UNDERWEIGHT,
      healthRisk: 'Possible risk of weight-related health problems',
      width: '6.25%'
    }, 
    [BMICategory.NORMAL_WEIGHT]: { 
      category: BMICategory.NORMAL_WEIGHT, 
      range: BMI_RANGES[BMICategory.NORMAL_WEIGHT], 
      color: BMI_COLORS[BMICategory.NORMAL_WEIGHT],
      status: BMICategory.NORMAL_WEIGHT,
      healthRisk: 'Lowest risk of weight-related health problems. Maintain current lifestyle',
      width: '16.25%'
    }, 
    [BMICategory.OVERWEIGHT]: { 
      category: BMICategory.OVERWEIGHT, 
      range: BMI_RANGES[BMICategory.OVERWEIGHT], 
      color: BMI_COLORS[BMICategory.OVERWEIGHT],
      status: BMICategory.OVERWEIGHT,
      healthRisk: 'Increased risk of weight-related health problems',
      width: '12.5%'
    }, 
    [BMICategory.OBESE_CLASS_I]: { 
      category: BMICategory.OBESE_CLASS_I, 
      range: BMI_RANGES[BMICategory.OBESE_CLASS_I], 
      color: BMI_COLORS[BMICategory.OBESE_CLASS_I],
      status: BMICategory.OBESE_CLASS_I,
      healthRisk: 'Moderate risk of weight-related health problems',
      width: '12.5%'
    }, 
    [BMICategory.OBESE_CLASS_II]: { 
      category: BMICategory.OBESE_CLASS_II, 
      range: BMI_RANGES[BMICategory.OBESE_CLASS_II],
      color: BMI_COLORS[BMICategory.OBESE_CLASS_II],
      status: BMICategory.OBESE_CLASS_II,
      healthRisk: 'High risk of weight-related health problems',
      width: '12.5%'
    }, 
    [BMICategory.OBESE_CLASS_III]: { 
      category: BMICategory.OBESE_CLASS_III, 
      range: BMI_RANGES[BMICategory.OBESE_CLASS_III], 
      color: BMI_COLORS[BMICategory.OBESE_CLASS_III],
      status: BMICategory.OBESE_CLASS_III,
      healthRisk: 'Very high risk of weight-related health problems and reduced life expectancy',
      width: '23.75%'
    },
  }), [BMI_COLORS, BMI_RANGES]);

  const getBMICategory = useCallback((bmi: number) => {
    if (bmi <= 16.4) {
      return BMI_CATEGORIES[BMICategory.SEVERELY_UNDERWEIGHT];
    }
    if (bmi <= 18.4) {
      return BMI_CATEGORIES[BMICategory.UNDERWEIGHT];
    }
    if (bmi <= 24.9) {
      return BMI_CATEGORIES[BMICategory.NORMAL_WEIGHT];
    }
    if (bmi <= 29.9) {
      return BMI_CATEGORIES[BMICategory.OVERWEIGHT];
    }
    if (bmi <= 34.9) {
      return BMI_CATEGORIES[BMICategory.OBESE_CLASS_I];
    }
    if (bmi <= 39.0) {
      return BMI_CATEGORIES[BMICategory.OBESE_CLASS_II];
    }

    return BMI_CATEGORIES[BMICategory.OBESE_CLASS_III];
  }, [BMI_CATEGORIES]);

  // Calculate BMI position on scale (0-100%)
  const getBMIPosition = (bmi: number) => {
    // Scale range from 10 to 50+ BMI
    const minScale = 10;
    const maxScale = 50;
    
    if (bmi <= minScale) return 0;
    if (bmi >= maxScale) return 100;
    
    return ((bmi - minScale) / (maxScale - minScale)) * 100;
  };

  // Weight conversion functions
  const kgToLbs = (kg: number) => Math.round(kg * 2.20462 * 10) / 10;
  const lbsToKg = (lbs: number) => Math.round(lbs / 2.20462 * 10) / 10;
  
  // Height conversion functions
  const cmToFeetInches = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };
  
  const feetInchesToCm = (feet: number, inches: number) => {
    const totalInches = feet * 12 + inches;
    return Math.round(totalInches * 2.54 * 10) / 10;
  };

  // Body fat calculation based on BMI, age, and gender
  const calculateBodyFat = (bmi: number, ageNum: number, genderValue: string) => {
    // Only calculate if age and gender are provided
    if (!ageNum || !genderValue || ageNum <= 0) {
      return null;
    }

    // Deurenberg formula for body fat percentage
    let bodyFat: number;
    const genderFactor = genderValue === 'male' ? 1 : 0;

    if (ageNum <= 15) {
      bodyFat = (1.51 * bmi) + (0.70 * ageNum) - (0.7 * genderFactor) + 1.4;
    } else {
      bodyFat = (1.20 * bmi) + (0.23 * ageNum) - (10.8 * genderFactor) - 5.4;
    }

    // Ensure reasonable bounds (body fat percentage should be between 3-50%)
    return Math.max(3, Math.min(50, Math.round(bodyFat * 10) / 10));
  };

  // Handle unit system change with conversion
  const handleUnitChange = useCallback((newUnit: 'metric' | 'imperial') => {
    if (newUnit === unit) return;
    
    const currentWeight = parseFloat(weight);
    if (currentWeight && currentWeight > 0) {
      if (newUnit === 'imperial') {
        // Convert kg to lbs
        setWeight(kgToLbs(currentWeight).toString());
      } else {
        // Convert lbs to kg
        setWeight(lbsToKg(currentWeight).toString());
      }
    }
    
    // Convert height
    if (newUnit === 'imperial') {
      // Convert cm to feet and inches
      const currentHeight = parseFloat(height);
      if (currentHeight && currentHeight > 0) {
        const { feet, inches } = cmToFeetInches(currentHeight);
        setHeightFeet(feet.toString());
        setHeightInches(inches.toString());
      }
    } else {
      // Convert feet and inches to cm
      const currentFeet = parseFloat(heightFeet);
      const currentInches = parseFloat(heightInches);
      if (currentFeet >= 0 && currentInches >= 0) {
        const cm = feetInchesToCm(currentFeet, currentInches);
        setHeight(cm.toString());
      }
    }
    
    setUnit(newUnit);
  }, [unit, weight, height, heightFeet, heightInches]);
  
  const resetCalculateBMI = () => {
    setHeight('175');
    setHeightFeet('5');
    setHeightInches('9');
    setWeight('70');
    setAge('25');
    setUnit('metric');
    setGender('male');
    setResult(null);

    calculateBMI();
  };

  const calculateBMI = useCallback(() => {
    const weightNum = parseFloat(weight);
    let heightNum: number;

    if (unit === 'imperial') {
      // Convert feet and inches to total inches
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      heightNum = (feet * 12) + inches;
    } else {
      heightNum = parseFloat(height);
    }

    // Validate inputs
    if (!weightNum || !heightNum || weightNum <= 0 || heightNum <= 0) {
      setResult(null);
      return;
    }

    let bmi: number;

    if (unit === 'imperial') {
      // Convert height from inches to meters and weight from pounds to kg
      const heightInMeters = heightNum * 0.0254;
      const weightInKg = weightNum * 0.453592;
      bmi = weightInKg / (heightInMeters * heightInMeters);
    } else {
      // Metric calculation (height in cm, weight in kg)
      const heightInMeters = heightNum / 100;
      bmi = weightNum / (heightInMeters * heightInMeters);
    }

    // Inline BMI category determination
    const categoryInfo = getBMICategory(bmi);
    
    // Calculate height in meters for ideal weight calculation
    let heightInMeters: number;
    if (unit === 'imperial') {
      heightInMeters = heightNum * 0.0254;
    } else {
      heightInMeters = parseFloat(height) / 100;
    }

    // Inline ideal weight calculation
    const minWeight = 18.5 * heightInMeters * heightInMeters;
    const maxWeight = 24.9 * heightInMeters * heightInMeters;
    
    let idealWeightRange: string;
    if (unit === 'imperial') {
      // Convert back to pounds
      const minWeightLbs = Math.round(minWeight / 0.453592);
      const maxWeightLbs = Math.round(maxWeight / 0.453592);
      idealWeightRange = `${minWeightLbs} - ${maxWeightLbs} lbs`;
    } else {
      idealWeightRange = `${Math.round(minWeight * 10) / 10} - ${Math.round(maxWeight * 10) / 10} kg`;
    }
    
    // Calculate body fat percentage
    const ageNum = parseFloat(age);
    const bodyFatPercentage = calculateBodyFat(bmi, ageNum, gender);

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category: categoryInfo.status,
      status: categoryInfo.status,
      idealWeightRange: idealWeightRange,
      healthRisk: categoryInfo.healthRisk,
      bodyFatPercentage: bodyFatPercentage,
    });
  }, [weight, unit, getBMICategory, age, gender, heightFeet, heightInches, height]);

  // Debounced BMI calculation effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateBMI();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [calculateBMI]);

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.BMICalculator}
      educationContent={educationContent}
      disclaimer={<MedicalDisclaimer />}
    >
      <div className="space-y-6">
        {/* Calculator Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Enhanced Input Form */}
          <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate Your BMI</h3>
            
            {/* Unit System */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit System
              </label>
              <div className="inline-flex rounded-lg bg-gray-100 p-1 w-full text-sm">
                <button
                  type="button"
                  onClick={() => handleUnitChange('metric')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                    unit === 'metric'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Metric
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitChange('imperial')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                    unit === 'imperial'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Imperial
                </button>
              </div>
            </div>

            {/* Weight Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {unit === 'metric' ? 'kg' : 'lbs'}
                </span>
              </div>
            </div>
            
            {/* Height Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height
              </label>
              {unit === 'metric' ? (
                <div className="relative">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 175"
                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
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
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value)}
                        placeholder="5"
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        ft
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="number"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value)}
                        placeholder="9"
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        in
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {unit === 'metric' && (
                <p className="text-xs text-gray-500 mt-1">Enter height in centimeters</p>
              )}
              {unit === 'imperial' && (
                <p className="text-xs text-gray-500 mt-1">Enter feet and inches separately</p>
              )}
            </div>

            {/* Age Input (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age (optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g., 30"
                  className="w-full px-3 py-2 pr-13 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  years
                </span>
              </div>
            </div>

            {/* Gender Selection (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender (optional)
              </label>
              <div className="inline-flex rounded-lg bg-gray-100 p-1 w-full text-sm">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                    gender === 'male'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                    gender === 'female'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetCalculateBMI}
              className="w-full font-medium py-3 px-6 rounded-md transition-colors bg-gray-400 hover:bg-gray-600 text-white"
            >
              Reset Calculator
            </button>
          </div>

          {/* Middle Column - BMI Scale */}
          <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">BMI Scale & Categories</h3>

            {/* Visual BMI Scale Bar */}
            <div className="relative mb-6">
              {/* Color-coded BMI scale bar */}
              <div className="h-8 rounded-lg overflow-hidden flex shadow-sm">
                {
                  Object.values(BMI_CATEGORIES).map((scale, index) => (
                    <div key={index} className={scale.color} style={{ width: scale.width }}></div>
                  ))
                }
              </div>
              
              {/* Scale labels */}
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50+</span>
              </div>
              
              {/* Current BMI Indicator */}
              {result && (
                <div 
                  className="absolute top-4 transform -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${getBMIPosition(result.bmi)}%` }}
                >
                  <div className="relative">
                    {/* Arrow pointing down */}
                    <div className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-black mx-auto"></div>
                    {/* BMI value label */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {result.bmi}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {Object.values(BMI_CATEGORIES).map((scale, index) => {
                const isCurrentCategory = result && getBMICategory(result.bmi).category === scale.category;
                return (
                  <div key={index} className={`flex items-center justify-between p-3 rounded border transition-all duration-200 ${
                    isCurrentCategory ? 'border-gray-300 bg-gray-100 shadow-sm' : 'border-gray-200'
                  }`}>
                    <div className={`w-4 h-4 rounded ${scale.color} ${isCurrentCategory ? 'shadow-sm' : ''}`}></div>
                    <span className={`text-sm flex-1 mx-3 ${isCurrentCategory ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {scale.category}
                    </span>
                    <span className={`text-sm ${isCurrentCategory ? 'text-gray-700 font-medium' : 'text-gray-600'}`}>
                      {scale.range}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Results</h3>
            
            {!result && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter your weight and height to calculate your BMI</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* BMI Value Display */}
                <div className="text-center p-6 bg-gray-100 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900">{result.bmi}</div>
                  <div className="text-lg text-gray-600 mt-1">BMI Score</div>
                </div>

                {/* Status */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Status</h4>
                  <p className="text-blue-800 text-sm mt-1">{result.status}</p>
                </div>

                {/* Health Risk */}
                <div className="p-4 bg-orange-100 rounded-lg">
                  <h4 className="font-medium text-orange-900">Health Assessment</h4>
                  <p className="text-orange-800 text-sm mt-1">{result.healthRisk}</p>
                </div>

                {/* Ideal Weight Range */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Ideal Weight Range</h4>
                  <p className="text-green-800 text-sm mt-1">{result.idealWeightRange}</p>
                </div>

                {/* Body Fat Estimate */}
                {result.bodyFatPercentage !== null && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Body Fat Estimate</h4>
                    <p className="text-purple-800 text-lg font-semibold mt-1">
                      {result.bodyFatPercentage.toFixed(1)}%
                    </p>
                    <p className="text-purple-700 text-xs mt-1">
                      Based on BMI, gender and age. BMI doesn&apos;t account for bone density, muscle mass or body composition
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3>
      What is BMI?
    </h3>
    <p className="text-md">
      Body Mass Index (BMI) is a simple calculation using a person&apos;s height and weight. The formula is BMI = kg/m², where kg is a person&apos;s weight in kilograms and m² is their height in meters squared.

      Body Mass Index (BMI) is a numerical value that helps estimate whether a person&apos;s weight is appropriate for their height. The formula is BMI = weight/height². BMI is commonly used as a quick screening tool to categorize individuals as underweight, normal weight, overweight, or obese. However, it does not measure body fat directly and may not accurately reflect health for everyone, especially athletes or people with higher muscle mass. It&apos;s best used alongside other health assessments and professional medical advice.
    </p>
  </div>
);