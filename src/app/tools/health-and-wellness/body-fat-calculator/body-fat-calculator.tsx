'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';
import MedicalDisclaimer from '@/components/disclaimers/medicalDisclaimer';

enum UNIT_SYSTEM {
  METRIC = 'Metric (cm, kg)',
  IMPERIAL = 'Imperial (ft/in, lbs)'
}

enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female'
}

enum ACTIVITY_LEVEL {
  SEDENTARY = 'Sedentary (little to no exercise)',
  LIGHT = 'Light Activity (exercise 1-3 days/week)',
  MODERATE = 'Moderate Activity (exercise 3-5 days/week)',
  VERY_ACTIVE = 'Very Active (exercise 6-7 days/week)',
  EXTREMELY_ACTIVE = 'Extremely Active (very heavy exercise, physical job)'
}

interface BodyFatResults {
  usNavyBodyFat: number;
  bmiBasedBodyFat: number;
  bmi: number;
  bodyComposition: {
    fatMass: number;
    leanBodyMass: number;
    muscleMass: number;
  };
  idealBodyFatRanges: {
    essential: string;
    athletes: string;
    fitness: string;
    average: string;
  };
  healthMetrics: {
    waistToHeightRatio: number;
    bodyFatGoal: string;
  };
}

const UNIT_SYSTEMS = [
  { value: UNIT_SYSTEM.METRIC, label: 'Metric (cm, kg)' },
  { value: UNIT_SYSTEM.IMPERIAL, label: 'Imperial (ft/in, lbs)' }
];

const GENDERS = [
  { value: GENDER.MALE, label: 'Male' },
  { value: GENDER.FEMALE, label: 'Female' }
];

const ACTIVITY_LEVELS = [
  { value: ACTIVITY_LEVEL.SEDENTARY, label: 'Sedentary (little to no exercise)' },
  { value: ACTIVITY_LEVEL.LIGHT, label: 'Light Activity (exercise 1-3 days/week)' },
  { value: ACTIVITY_LEVEL.MODERATE, label: 'Moderate Activity (exercise 3-5 days/week)' },
  { value: ACTIVITY_LEVEL.VERY_ACTIVE, label: 'Very Active (exercise 6-7 days/week)' },
  { value: ACTIVITY_LEVEL.EXTREMELY_ACTIVE, label: 'Extremely Active (very heavy exercise, physical job)' }
];

export function BodyFatCalculator() {
  const [unitSystem, setUnitSystem] = useState<UNIT_SYSTEM>(UNIT_SYSTEM.IMPERIAL);
  const [gender, setGender] = useState<GENDER>(GENDER.MALE);
  const [age, setAge] = useState('30');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('8');
  const [heightCm, setHeightCm] = useState('175');
  const [weightLbs, setWeightLbs] = useState('160');
  const [weightKg, setWeightKg] = useState('73');
  const [activityLevel, setActivityLevel] = useState<ACTIVITY_LEVEL>(ACTIVITY_LEVEL.MODERATE);
  
  // Body measurements (inches or cm based on unit system)
  const [neckCircumference, setNeckCircumference] = useState('15');
  const [waistCircumference, setWaistCircumference] = useState('32');
  const [hipCircumference, setHipCircumference] = useState(''); // Only for females
  
  const [results, setResults] = useState<BodyFatResults | null>(null);

  // Convert measurements to metric for calculations
  const convertToMetric = useCallback((
    unitSystemValue: UNIT_SYSTEM,
    heightFtValue: number,
    heightInValue: number,
    heightCmValue: number,
    weightLbsValue: number,
    weightKgValue: number,
    measurementValue: number // for circumferences
  ) => {
    let height = 0;
    let weight = 0;
    let measurement = measurementValue;

    if (unitSystemValue === UNIT_SYSTEM.IMPERIAL) {
      // Convert feet and inches to cm
      height = (heightFtValue * 12 + heightInValue) * 2.54;
      // Convert lbs to kg
      weight = weightLbsValue * 0.453592;
      // Convert inches to cm
      measurement = measurementValue * 2.54;
    } else {
      height = heightCmValue;
      weight = weightKgValue;
      measurement = measurementValue;
    }

    return { height, weight, measurement };
  }, []);

  // US Navy Method calculation
  const calculateUSNavyBodyFat = useCallback((
    genderValue: GENDER,
    heightValue: number, // in cm
    neckValue: number, // in cm
    waistValue: number, // in cm
    hipValue: number = 0 // in cm (for females only)
  ): number => {
    let bodyFat: number;
    
    if (genderValue === GENDER.MALE) {
      // US Navy formula for males
      bodyFat = 86.010 * Math.log10(waistValue - neckValue) - 70.041 * Math.log10(heightValue) + 36.76;
    } else {
      // US Navy formula for females (requires hip measurement)
      if (hipValue > 0) {
        bodyFat = 163.205 * Math.log10(waistValue + hipValue - neckValue) - 97.684 * Math.log10(heightValue) - 78.387;
      } else {
        // Fallback to male formula if hip measurement not provided
        bodyFat = 86.010 * Math.log10(waistValue - neckValue) - 70.041 * Math.log10(heightValue) + 36.76;
      }
    }
    
    return Math.max(2, Math.min(50, bodyFat));
  }, []);

  // BMI-based body fat estimation
  const calculateBMIBasedBodyFat = useCallback((
    heightValue: number, // in cm
    weightValue: number, // in kg
    ageValue: number,
    genderValue: GENDER
  ): number => {
    const bmi = weightValue / ((heightValue / 100) ** 2);
    const genderFactor = genderValue === GENDER.MALE ? 1 : 0;
    
    // Deurenberg formula
    let bodyFat: number;
    if (ageValue <= 15) {
      bodyFat = (1.51 * bmi) + (0.70 * ageValue) - (0.7 * genderFactor) + 1.4;
    } else {
      bodyFat = (1.20 * bmi) + (0.23 * ageValue) - (10.8 * genderFactor) - 5.4;
    }
    
    return Math.max(2, Math.min(50, bodyFat));
  }, []);

  // Calculate body composition
  const calculateBodyComposition = useCallback((
    weightValue: number, // in kg
    bodyFatPercentage: number
  ) => {
    const fatMass = weightValue * (bodyFatPercentage / 100);
    const leanBodyMass = weightValue - fatMass;
    const muscleMass = leanBodyMass * 0.45; // Approximate muscle mass (45% of lean body mass)
    
    return {
      fatMass,
      leanBodyMass,
      muscleMass
    };
  }, []);

  // Get ideal body fat ranges
  const getIdealBodyFatRanges = useCallback((genderValue: GENDER) => {
    if (genderValue === GENDER.MALE) {
      return {
        essential: '2-5%',
        athletes: '6-13%',
        fitness: '14-17%',
        average: '18-24%'
      };
    } else {
      return {
        essential: '10-13%',
        athletes: '14-20%',
        fitness: '21-24%',
        average: '25-31%'
      };
    }
  }, []);

  // Calculate waist-to-height ratio
  const calculateWaistToHeightRatio = useCallback((
    waistValue: number, // in cm
    heightValue: number // in cm
  ): number => {
    return waistValue / heightValue;
  }, []);

  const performCalculation = useCallback(() => {
    const ageNum = parseFloat(age);
    const heightFtNum = parseFloat(heightFt);
    const heightInNum = parseFloat(heightIn);
    const heightCmNum = parseFloat(heightCm);
    const weightLbsNum = parseFloat(weightLbs);
    const weightKgNum = parseFloat(weightKg);
    const neckNum = parseFloat(neckCircumference);
    const waistNum = parseFloat(waistCircumference);
    const hipNum = parseFloat(hipCircumference);

    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setResults(null);
      return;
    }

    if (isNaN(neckNum) || neckNum <= 0 || isNaN(waistNum) || waistNum <= 0) {
      setResults(null);
      return;
    }

    const { height, weight } = convertToMetric(
      unitSystem,
      heightFtNum,
      heightInNum,
      heightCmNum,
      weightLbsNum,
      weightKgNum,
      0
    );

    const { measurement: neckCm } = convertToMetric(unitSystem, 0, 0, 0, 0, 0, neckNum);
    const { measurement: waistCm } = convertToMetric(unitSystem, 0, 0, 0, 0, 0, waistNum);
    const { measurement: hipCm } = convertToMetric(unitSystem, 0, 0, 0, 0, 0, hipNum);

    if (height <= 0 || weight <= 0) {
      setResults(null);
      return;
    }

    // Calculate body fat using both methods
    const usNavyBodyFat = calculateUSNavyBodyFat(gender, height, neckCm, waistCm, hipCm);
    const bmiBasedBodyFat = calculateBMIBasedBodyFat(height, weight, ageNum, gender);
    
    // Calculate BMI
    const bmi = weight / ((height / 100) ** 2);
    
    // Calculate body composition using US Navy method (more accurate)
    const bodyComposition = calculateBodyComposition(weight, usNavyBodyFat);
    
    // Get ideal ranges
    const idealBodyFatRanges = getIdealBodyFatRanges(gender);
    
    // Calculate health metrics
    const waistToHeightRatio = calculateWaistToHeightRatio(waistCm, height);
    
    let bodyFatGoal = '';
    if (gender === GENDER.MALE) {
      if (usNavyBodyFat < 6) bodyFatGoal = 'Too low - health risks';
      else if (usNavyBodyFat <= 13) bodyFatGoal = 'Athletic range';
      else if (usNavyBodyFat <= 17) bodyFatGoal = 'Fitness range';
      else if (usNavyBodyFat <= 24) bodyFatGoal = 'Average range';
      else bodyFatGoal = 'Above average - consider reduction';
    } else {
      if (usNavyBodyFat < 10) bodyFatGoal = 'Too low - health risks';
      else if (usNavyBodyFat <= 20) bodyFatGoal = 'Athletic range';
      else if (usNavyBodyFat <= 24) bodyFatGoal = 'Fitness range';
      else if (usNavyBodyFat <= 31) bodyFatGoal = 'Average range';
      else bodyFatGoal = 'Above average - consider reduction';
    }

    setResults({
      usNavyBodyFat,
      bmiBasedBodyFat,
      bmi,
      bodyComposition,
      idealBodyFatRanges,
      healthMetrics: {
        waistToHeightRatio,
        bodyFatGoal
      }
    });
  }, [age, heightFt, heightIn, heightCm, weightLbs, weightKg, neckCircumference, waistCircumference, hipCircumference, 
      unitSystem, gender, convertToMetric, calculateUSNavyBodyFat, calculateBMIBasedBodyFat, calculateBodyComposition, 
      getIdealBodyFatRanges, calculateWaistToHeightRatio]);

  // Auto-calculate when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performCalculation();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [performCalculation]);

  const copyResults = () => {
    if (!results) return;
    
    const resultsText = `Body Fat Analysis Results:
    
US Navy Body Fat: ${results.usNavyBodyFat.toFixed(1)}%
BMI-Based Estimate: ${results.bmiBasedBodyFat.toFixed(1)}%
BMI: ${results.bmi.toFixed(1)}

Body Composition:
- Fat Mass: ${unitSystem === UNIT_SYSTEM.IMPERIAL ? (results.bodyComposition.fatMass * 2.20462).toFixed(1) + ' lbs' : results.bodyComposition.fatMass.toFixed(1) + ' kg'}
- Lean Body Mass: ${unitSystem === UNIT_SYSTEM.IMPERIAL ? (results.bodyComposition.leanBodyMass * 2.20462).toFixed(1) + ' lbs' : results.bodyComposition.leanBodyMass.toFixed(1) + ' kg'}
- Muscle Mass (est.): ${unitSystem === UNIT_SYSTEM.IMPERIAL ? (results.bodyComposition.muscleMass * 2.20462).toFixed(1) + ' lbs' : results.bodyComposition.muscleMass.toFixed(1) + ' kg'}

Waist-to-Height Ratio: ${results.healthMetrics.waistToHeightRatio.toFixed(2)}
Body Fat Goal: ${results.healthMetrics.bodyFatGoal}`;

    copyToClipboard(resultsText);
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.BodyFatCalculator}
      educationContent={educationContent}
      disclaimer={<MedicalDisclaimer />}
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
          
          {/* Units Toggle */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
            <div className="flex rounded-lg bg-gray-100 p-1">
              {UNIT_SYSTEMS.map((system) => (
                <button
                  key={system.value}
                  onClick={() => setUnitSystem(system.value)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    unitSystem === system.value
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {system.value === UNIT_SYSTEM.METRIC ? 'Metric (cm, kg)' : 'Imperial (ft/in, lbs)'}
                </button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="flex rounded-lg bg-gray-100 p-1">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGender(g.value)}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    gender === g.value
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="30"
              min="1"
              max="120"
            />
            <p className="text-xs text-gray-500 mt-1">Age in years (18-80)</p>
          </div>

          {/* Height */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
            {unitSystem === UNIT_SYSTEM.IMPERIAL ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                    min="1"
                    max="8"
                  />
                  <p className="text-xs text-gray-500 mt-1">Feet</p>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="8"
                    min="0"
                    max="11"
                  />
                  <p className="text-xs text-gray-500 mt-1">Inches</p>
                </div>
              </div>
            ) : (
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="175"
                min="100"
                max="250"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              {unitSystem === UNIT_SYSTEM.IMPERIAL ? 'Feet and Inches' : 'Centimeters'}
            </p>
          </div>

          {/* Weight */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
            <input
              type="number"
              value={unitSystem === UNIT_SYSTEM.IMPERIAL ? weightLbs : weightKg}
              onChange={(e) => unitSystem === UNIT_SYSTEM.IMPERIAL ? setWeightLbs(e.target.value) : setWeightKg(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={unitSystem === UNIT_SYSTEM.IMPERIAL ? "160" : "73"}
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              {unitSystem === UNIT_SYSTEM.IMPERIAL ? 'Pounds' : 'Kilograms'}
            </p>
          </div>

          {/* Activity Level */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ACTIVITY_LEVEL)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ACTIVITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Body Measurements Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Body Measurements</h2>
          
          {/* US Navy Method Info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h3>US Navy Method</h3>
            <p className="text-sm">Most accurate circumference-based method</p>
          </div>

          {/* Neck Circumference */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Neck Circumference</label>
            <div className="relative">
              <input
                type="number"
                value={neckCircumference}
                onChange={(e) => setNeckCircumference(e.target.value)}
                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="15"
                min="1"
                step="0.1"
              />
              <span className="absolute right-3 top-2.5 text-sm text-gray-500">
                {unitSystem === UNIT_SYSTEM.IMPERIAL ? 'in' : 'cm'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Measure at narrowest point</p>
          </div>

          {/* Waist Circumference */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Waist Circumference</label>
            <div className="relative">
              <input
                type="number"
                value={waistCircumference}
                onChange={(e) => setWaistCircumference(e.target.value)}
                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="32"
                min="1"
                step="0.1"
              />
              <span className="absolute right-3 top-2.5 text-sm text-gray-500">
                {unitSystem === UNIT_SYSTEM.IMPERIAL ? 'in' : 'cm'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">At navel level</p>
          </div>

          {/* Hip Circumference (Females only) */}
          {gender === GENDER.FEMALE && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Hip Circumference</label>
              <div className="relative">
                <input
                  type="number"
                  value={hipCircumference}
                  onChange={(e) => setHipCircumference(e.target.value)}
                  className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="38"
                  min="1"
                  step="0.1"
                />
                <span className="absolute right-3 top-2.5 text-sm text-gray-500">
                  {unitSystem === UNIT_SYSTEM.IMPERIAL ? 'in' : 'cm'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">At widest point</p>
            </div>
          )}

          {/* Measurement Tips */}
          <div className="bg-gray-50 rounded-lg p-3 mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Measurement Tips:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>Use a flexible tape measure, don&apos;t compress skin</li>
              <li>Measure in the morning</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Body Fat Analysis</h2>
            {results && (
              <button
                onClick={copyResults}
                className="bg-orange-300 hover:bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-md transition-colors"
              >
                Copy Results
              </button>
            )}
          </div>

          {results ? (
            <div className="space-y-4">
              {/* US Navy Body Fat */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-medium text-green-900">US Navy Body Fat %</h3>
                <p className="text-2xl font-bold text-green-800">{results.usNavyBodyFat.toFixed(1)}%</p>
                <p className="text-sm text-green-700">Athletes</p>
              </div>

              {/* Alternative Methods */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Alternative Methods</h3>
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <h4 className="font-medium text-blue-900">BMI-Based Estimate</h4>
                  <p className="text-xl font-semibold text-blue-800">{results.bmiBasedBodyFat.toFixed(1)}%</p>
                </div>
              </div>

              {/* Body Composition */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Body Composition</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fat Mass</span>
                    <span className="font-medium">
                      {unitSystem === UNIT_SYSTEM.IMPERIAL 
                        ? `${(results.bodyComposition.fatMass * 2.20462).toFixed(1)} lbs`
                        : `${results.bodyComposition.fatMass.toFixed(1)} kg`
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lean Body Mass</span>
                    <span className="font-medium">
                      {unitSystem === UNIT_SYSTEM.IMPERIAL 
                        ? `${(results.bodyComposition.leanBodyMass * 2.20462).toFixed(1)} lbs`
                        : `${results.bodyComposition.leanBodyMass.toFixed(1)} kg`
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Muscle Mass (est.)</span>
                    <span className="font-medium">
                      {unitSystem === UNIT_SYSTEM.IMPERIAL 
                        ? `${(results.bodyComposition.muscleMass * 2.20462).toFixed(1)} lbs`
                        : `${results.bodyComposition.muscleMass.toFixed(1)} kg`
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">BMI</span>
                    <span className="font-medium">
                      {results.bmi.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ideal Body Fat Ranges */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Ideal Body Fat Ranges</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Essential Fat:</span>
                    <span className="font-medium">{results.idealBodyFatRanges.essential}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Athletes:</span>
                    <span className="font-medium">{results.idealBodyFatRanges.athletes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fitness:</span>
                    <span className="font-medium">{results.idealBodyFatRanges.fitness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average:</span>
                    <span className="font-medium">{results.idealBodyFatRanges.average}</span>
                  </div>
                </div>
              </div>

              {/* Health Metrics */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Health Metrics</h3>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">Waist-to-Height Ratio</span>
                      <span className="font-semibold text-blue-900">{results.healthMetrics.waistToHeightRatio.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                      {results.healthMetrics.waistToHeightRatio < 0.5 ? 'Healthy' : 'Above recommended'}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="text-sm text-purple-800">Body Fat Goal for Health</div>
                    <p className="font-medium text-purple-900">{results.healthMetrics.bodyFatGoal}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Enter your measurements to see your body fat analysis</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3>Understanding Body Fat Percentage</h3>
    <p>
      <strong>Body Fat Percentage:</strong> The proportion of your body weight that consists of fat tissue. 
      This is a more accurate indicator of health and fitness than BMI alone, as it accounts for body composition.
    </p>
    
    <h3>Measurement Methods</h3>
    <p>
      <strong>US Navy Method:</strong> Uses circumference measurements (neck, waist, and hips for women) 
      to estimate body fat. This is one of the most accurate field methods available and is widely used 
      by military and fitness professionals.
    </p>
    <p>
      <strong>BMI-Based Estimation:</strong> Uses the Deurenberg formula which considers BMI, age, and gender. 
      Less accurate than the Navy method but useful as a secondary reference.
    </p>

    <h3>Why The Results between Different Methods May Vary</h3>
    <p>
      Different methods of estimating body fat can yield slightly different results due to the techniques and assumptions used. The US Navy method relies on circumference measurements, while the BMI-based estimation uses a formula considering BMI, age, and gender. It&apos;s normal to see some variation between these methods.
    </p>

    <h3>What is a healthy body fat percentage?</h3>
    <p>
      A healthy body fat percentage depends on sex and age, since bodies store fat differently. For adult men, a healthy range is usually about 14&ndash;24%, while women tend to fall into a higher healthy range of about 21&ndash;31%. Athletes often sit below these ranges, but essential fat is still necessary for basic body functions, hormone balance, and overall health.
    </p>
    <p>
      Age also plays a role in what is considered healthy. Men in their 20s and 30s often fall between about 8&ndash;19%, while those over 60 may be healthy closer to 13&ndash;24%. Women typically range from about 21&ndash;32% in early adulthood, gradually increasing to around 24&ndash;36% later in life. These shifts are normal and reflect changes in metabolism and muscle mass over time.
    </p>
    <p>
      It&apos;s important to remember that lower body fat is not always better. Extremely low levels can cause fatigue, hormone disruption, and weakened immunity, while slightly higher levels may still be healthy if a person is active and strong. Measurement methods also vary in accuracy, so body fat percentage should be viewed as one health indicator, not the whole picture.
    </p>
    <p></p>
    
    <h3>Body Fat Categories</h3>
    <p>
      <strong>Essential Fat:</strong> Minimum fat needed for basic physical and physiological health. 
      Going below this range can be dangerous.
    </p>
    <p>
      <strong>Athletic Range:</strong> Typical for competitive athletes and very fit individuals.
    </p>
    <p>
      <strong>Fitness Range:</strong> Indicates good physical fitness and health.
    </p>
    <p>
      <strong>Average Range:</strong> Typical for the general population, still considered healthy.
    </p>
    
    <h3>Health Considerations</h3>
    <p>
      Body fat distribution matters as much as total percentage. Visceral fat around organs is more health-concerning than subcutaneous fat. The waist-to-height ratio helps assess this risk.
    </p>
  </div>
);

export default BodyFatCalculator;