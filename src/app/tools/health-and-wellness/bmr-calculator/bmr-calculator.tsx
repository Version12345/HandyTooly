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
    SEDENTARY = 'Sedentary',
    LIGHT = 'Light Activity',
    MODERATE = 'Moderate Activity',
    VERY_ACTIVE = 'Very Active',
    EXTREMELY_ACTIVE = 'Extremely Active'
}

enum PRIMARY_GOAL {
    MAINTAIN = 'Maintain Weight',
    LOSE = 'Lose Weight',
    GAIN = 'Gain Weight'
}

enum WEIGHT_CHANGE_RATE {
    SLOW = 'Slow (0.5 lbs/week)',
    MODERATE = 'Moderate (1 lbs/week)',
    FAST = 'Fast (2 lbs/week)'
}

interface BMRResults {
    bmr: number;
    tdee: number;
    maintenanceCalories: number;
    targetCalories: number;
    macronutrients: {
        protein: { grams: number; calories: number; percentage: number };
        carbs: { grams: number; calories: number; percentage: number };
        fats: { grams: number; calories: number; percentage: number };
    };
    tdeeByActivity: {
        [key in ACTIVITY_LEVEL]: number;
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
    { value: ACTIVITY_LEVEL.SEDENTARY, label: 'Sedentary', description: 'Little to no exercise', multiplier: 1.2 },
    { value: ACTIVITY_LEVEL.LIGHT, label: 'Light Activity', description: 'Light exercise 1-3 days/week', multiplier: 1.375 },
    { value: ACTIVITY_LEVEL.MODERATE, label: 'Moderate Activity', description: 'Moderate exercise 3-5 days/week', multiplier: 1.55 },
    { value: ACTIVITY_LEVEL.VERY_ACTIVE, label: 'Very Active', description: 'Heavy exercise 6-7 days/week', multiplier: 1.725 },
    { value: ACTIVITY_LEVEL.EXTREMELY_ACTIVE, label: 'Extremely Active', description: 'Very heavy exercise, physical job', multiplier: 1.9 }
];

const PRIMARY_GOALS = [
    { value: PRIMARY_GOAL.MAINTAIN, label: 'Maintain Weight' },
    { value: PRIMARY_GOAL.LOSE, label: 'Lose Weight' },
    { value: PRIMARY_GOAL.GAIN, label: 'Gain Weight' }
];

const WEIGHT_CHANGE_RATES = [
    { value: WEIGHT_CHANGE_RATE.SLOW, label: 'Slow (0.5 lbs/week)', calorieChange: 250 },
    { value: WEIGHT_CHANGE_RATE.MODERATE, label: 'Moderate (1 lbs/week)', calorieChange: 500 },
    { value: WEIGHT_CHANGE_RATE.FAST, label: 'Fast (2 lbs/week)', calorieChange: 1000 }
];

export function BMRCalculator() {
    const [unitSystem, setUnitSystem] = useState<UNIT_SYSTEM>(UNIT_SYSTEM.METRIC);
    const [gender, setGender] = useState<GENDER>(GENDER.MALE);
    const [age, setAge] = useState('30');
    const [heightFt, setHeightFt] = useState('5');
    const [heightIn, setHeightIn] = useState('8');
    const [heightCm, setHeightCm] = useState('175');
    const [weightLbs, setWeightLbs] = useState('160');
    const [weightKg, setWeightKg] = useState('73');
    const [activityLevel, setActivityLevel] = useState<ACTIVITY_LEVEL>(ACTIVITY_LEVEL.MODERATE);
    const [primaryGoal, setPrimaryGoal] = useState<PRIMARY_GOAL>(PRIMARY_GOAL.MAINTAIN);
    const [weightChangeRate, setWeightChangeRate] = useState<WEIGHT_CHANGE_RATE>(WEIGHT_CHANGE_RATE.MODERATE);
    const [bodyFatPercentage, setBodyFatPercentage] = useState('');
    const [results, setResults] = useState<BMRResults | null>(null);

    const calculateBMR = useCallback((
        genderValue: GENDER,
        ageValue: number,
        heightValue: number, // in cm
        weightValue: number // in kg
    ): number => {
        // Mifflin-St Jeor Equation (more accurate)
        if (genderValue === GENDER.MALE) {
            return 10 * weightValue + 6.25 * heightValue - 5 * ageValue + 5;
        } else {
            return 10 * weightValue + 6.25 * heightValue - 5 * ageValue - 161;
        }
    }, []);

    const calculateKatchMcArdle = useCallback((
        weightValue: number, // in kg
        bodyFatPercent: number
    ): number => {
        const leanBodyMass = weightValue * (1 - bodyFatPercent / 100);
        return 370 + (21.6 * leanBodyMass);
    }, []);

    const convertToMetric = useCallback((
        unitSystemValue: UNIT_SYSTEM,
        heightFtValue: number,
        heightInValue: number,
        heightCmValue: number,
        weightLbsValue: number,
        weightKgValue: number
    ) => {
        let height = 0;
        let weight = 0;

        if (unitSystemValue === UNIT_SYSTEM.IMPERIAL) {
            // Convert feet and inches to cm
            height = (heightFtValue * 12 + heightInValue) * 2.54;
            // Convert lbs to kg
            weight = weightLbsValue * 0.453592;
        } else {
            height = heightCmValue;
            weight = weightKgValue;
        }

        return { height, weight };
    }, []);

    const calculateMacronutrients = useCallback((calories: number) => {
        // Standard macro distribution: 25% protein, 45% carbs, 30% fats
        const proteinCalories = calories * 0.25;
        const carbsCalories = calories * 0.45;
        const fatsCalories = calories * 0.30;

        return {
            protein: {
                grams: proteinCalories / 4, // 4 calories per gram
                calories: proteinCalories,
                percentage: 25
            },
            carbs: {
                grams: carbsCalories / 4, // 4 calories per gram
                calories: carbsCalories,
                percentage: 45
            },
            fats: {
                grams: fatsCalories / 9, // 9 calories per gram
                calories: fatsCalories,
                percentage: 30
            }
        };
    }, []);

    const performCalculation = useCallback(() => {
        const ageNum = parseFloat(age);
        const heightFtNum = parseFloat(heightFt);
        const heightInNum = parseFloat(heightIn);
        const heightCmNum = parseFloat(heightCm);
        const weightLbsNum = parseFloat(weightLbs);
        const weightKgNum = parseFloat(weightKg);
        const bodyFatNum = parseFloat(bodyFatPercentage);

        if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
            setResults(null);
            return;
        }

        const { height, weight } = convertToMetric(
            unitSystem,
            heightFtNum,
            heightInNum,
            heightCmNum,
            weightLbsNum,
            weightKgNum
        );

        if (height <= 0 || weight <= 0) {
            setResults(null);
            return;
        }

        // Calculate BMR using Mifflin-St Jeor (primary) or Katch-McArdle if body fat is provided
        let bmr: number;
        if (bodyFatPercentage && !isNaN(bodyFatNum) && bodyFatNum > 0 && bodyFatNum < 50) {
            bmr = calculateKatchMcArdle(weight, bodyFatNum);
        } else {
            bmr = calculateBMR(gender, ageNum, height, weight);
        }

        // Calculate TDEE for current activity level
        const activityMultiplier = ACTIVITY_LEVELS.find(level => level.value === activityLevel)?.multiplier || 1.55;
        const tdee = bmr * activityMultiplier;

        // Calculate TDEE for all activity levels
        const tdeeByActivity = {} as { [key in ACTIVITY_LEVEL]: number };
        ACTIVITY_LEVELS.forEach(level => {
            tdeeByActivity[level.value] = bmr * level.multiplier;
        });

        // Calculate target calories based on goal
        let targetCalories = tdee;
        if (primaryGoal === PRIMARY_GOAL.LOSE) {
            const calorieDeficit = WEIGHT_CHANGE_RATES.find(rate => rate.value === weightChangeRate)?.calorieChange || 500;
            targetCalories = tdee - calorieDeficit;
        } else if (primaryGoal === PRIMARY_GOAL.GAIN) {
            const calorieSurplus = WEIGHT_CHANGE_RATES.find(rate => rate.value === weightChangeRate)?.calorieChange || 500;
            targetCalories = tdee + calorieSurplus;
        }

        // Ensure minimum calories for safety
        targetCalories = Math.max(targetCalories, gender === GENDER.FEMALE ? 1200 : 1500);

        const macronutrients = calculateMacronutrients(targetCalories);

        setResults({
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            maintenanceCalories: Math.round(tdee),
            targetCalories: Math.round(targetCalories),
            macronutrients,
            tdeeByActivity
        });
    }, [
        age, heightFt, heightIn, heightCm, weightLbs, weightKg, gender, activityLevel, 
        primaryGoal, weightChangeRate, bodyFatPercentage, unitSystem,
        calculateBMR, calculateKatchMcArdle, convertToMetric, calculateMacronutrients
    ]);

    // Auto-calculate when inputs change
    useEffect(() => {
        const timeoutId = setTimeout(performCalculation, 300);
        return () => clearTimeout(timeoutId);
    }, [performCalculation]);

    const handleCopy = async (text: string) => {
        await copyToClipboard(text);
    };

    const getBMICategory = (): { category: string; color: string } => {
        if (!results) return { category: '', color: '' };

        const { height, weight } = convertToMetric(
            unitSystem,
            parseFloat(heightFt),
            parseFloat(heightIn),
            parseFloat(heightCm),
            parseFloat(weightLbs),
            parseFloat(weightKg)
        );

        const bmi = weight / ((height / 100) ** 2);

        if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
        if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600' };
        if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
        return { category: 'Obese', color: 'text-red-600' };
    };

    return (
        <ToolLayout 
          toolCategory={ToolNameLists.BMRCalculator}
          disclaimer={<MedicalDisclaimer />}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Personal Information Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                        
                        {/* Units */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
                            <div className="inline-flex rounded-lg bg-gray-100 p-1 w-full text-sm">
                                {UNIT_SYSTEMS.map((system) => (
                                    <button
                                        key={system.value}
                                        onClick={() => setUnitSystem(system.value)}
                                        className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                                            unitSystem === system.value
                                                ? 'bg-orange-500 text-white shadow-sm'
                                                : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                    >
                                        {system.value === UNIT_SYSTEM.METRIC ? 'Metric' : 'Imperial'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <div className="inline-flex rounded-lg bg-gray-100 p-1 w-full text-sm">
                                {GENDERS.map((genderOption) => (
                                    <button
                                        key={genderOption.value}
                                        onClick={() => setGender(genderOption.value)}
                                        className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                                            gender === genderOption.value
                                                ? 'bg-orange-500 text-white shadow-sm'
                                                : 'text-gray-700 hover:text-gray-900'
                                        }`}
                                    >
                                        {genderOption.label}
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
                                placeholder="30"
                                min="1"
                                max="120"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Age in years (18-120)</p>
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
                                            placeholder="5"
                                            min="1"
                                            max="8"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Feet</p>
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            value={heightIn}
                                            onChange={(e) => setHeightIn(e.target.value)}
                                            placeholder="8"
                                            min="0"
                                            max="11"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Inches</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="number"
                                        value={heightCm}
                                        onChange={(e) => setHeightCm(e.target.value)}
                                        placeholder="175"
                                        min="100"
                                        max="250"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Centimeters</p>
                                </>
                            )}
                        </div>

                        {/* Weight */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                            {unitSystem === UNIT_SYSTEM.IMPERIAL ? (
                                <>
                                    <input
                                        type="number"
                                        value={weightLbs}
                                        onChange={(e) => setWeightLbs(e.target.value)}
                                        placeholder="160"
                                        min="50"
                                        max="500"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Pounds (lbs)</p>
                                </>
                            ) : (
                                <>
                                    <input
                                        type="number"
                                        value={weightKg}
                                        onChange={(e) => setWeightKg(e.target.value)}
                                        placeholder="73"
                                        min="20"
                                        max="300"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Kilograms (kg)</p>
                                </>
                            )}
                        </div>

                        {/* Activity Level */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                            <select
                                value={activityLevel}
                                onChange={(e) => setActivityLevel(e.target.value as ACTIVITY_LEVEL)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {ACTIVITY_LEVELS.map((level) => (
                                    <option key={level.value} value={level.value}>
                                        {level.label} - {level.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* BMI Display */}
                        {results && (
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm text-gray-600">BMI:</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-gray-900">
                                        {(() => {
                                            const { height, weight } = convertToMetric(
                                                unitSystem,
                                                parseFloat(heightFt),
                                                parseFloat(heightIn),
                                                parseFloat(heightCm),
                                                parseFloat(weightLbs),
                                                parseFloat(weightKg)
                                            );
                                            return (weight / ((height / 100) ** 2)).toFixed(1);
                                        })()}
                                    </span>
                                    <span className={`text-sm font-medium ${getBMICategory().color}`}>
                                        {getBMICategory().category}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Body Composition & Goals Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Body Composition (Optional)</h2>
                        
                        {/* Enhanced Calculations Note */}
                        <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <p className="text-sm text-blue-800">
                                <strong>Enhanced Calculations</strong><br />
                                For more accurate BMR using Katch-McArdle formula
                            </p>
                        </div>

                        {/* Body Fat Percentage */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Body Fat Percentage</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={bodyFatPercentage}
                                    onChange={(e) => setBodyFatPercentage(e.target.value)}
                                    placeholder="15"
                                    min="5"
                                    max="50"
                                    step="0.1"
                                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    %
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Leave empty to use standard formula</p>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Settings</h3>
                        <p className="text-sm text-gray-600 mb-4">Customize your calorie targets</p>

                        {/* Primary Goal */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Goal</label>
                            <select
                                value={primaryGoal}
                                onChange={(e) => setPrimaryGoal(e.target.value as PRIMARY_GOAL)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {PRIMARY_GOALS.map((goal) => (
                                    <option key={goal.value} value={goal.value}>
                                        {goal.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Weight Change Rate */}
                        {primaryGoal !== PRIMARY_GOAL.MAINTAIN && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Weight Change Rate</label>
                                <select
                                    value={weightChangeRate}
                                    onChange={(e) => setWeightChangeRate(e.target.value as WEIGHT_CHANGE_RATE)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    {WEIGHT_CHANGE_RATES.map((rate) => (
                                        <option key={rate.value} value={rate.value}>
                                            {rate.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Quick Tips */}
                        <div className="bg-green-50 rounded-lg p-3">
                            <p className="text-sm text-green-800">
                                <strong>Quick Tips</strong><br />
                                Body fat % improves accuracy. Use our body fat calculator to provide measurements.
                            </p>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">BMR & Calorie Analysis</h2>
                        
                        {!results && (
                            <div className="text-center text-gray-500 py-8">
                                <p>Enter your details to see results</p>
                            </div>
                        )}

                        {results && (
                            <div className="space-y-4">
                                {/* BMR (Recommended) */}
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600">Your BMR (Recommended)</div>
                                    <div className="text-3xl font-bold text-gray-900">{results.bmr}</div>
                                    <div className="text-sm text-green-600">calories/day (Mifflin-St Jeor)</div>
                                    <button
                                        onClick={() => handleCopy(results.bmr.toString())}
                                        className="mt-2 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>

                                {/* Total Daily Energy Expenditure */}
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600">Total Daily Energy Expenditure</div>
                                    <div className="text-2xl font-bold text-gray-900">{results.tdee}</div>
                                    <div className="text-sm text-blue-600">calories/day for maintenance</div>
                                    <button
                                        onClick={() => handleCopy(results.tdee.toString())}
                                        className="mt-2 px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>

                                {/* Maintenance Calories */}
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600">Maintenance Calories</div>
                                    <div className="text-2xl font-bold text-gray-900">{results.maintenanceCalories}</div>
                                    <div className="text-sm text-orange-600">calories/day</div>
                                    <button
                                        onClick={() => handleCopy(results.maintenanceCalories.toString())}
                                        className="mt-2 px-3 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>

                                {/* Target Calories (based on goals) */}
                                {primaryGoal !== PRIMARY_GOAL.MAINTAIN && (
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-600">
                                            Target Calories ({primaryGoal === PRIMARY_GOAL.LOSE ? 'Weight Loss' : 'Weight Gain'})
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">{results.targetCalories}</div>
                                        <div className="text-sm text-purple-600">
                                            calories/day ({weightChangeRate.replace('(', '').replace(')', '')})
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {primaryGoal === PRIMARY_GOAL.LOSE ? 'Deficit' : 'Surplus'}: {
                                                Math.abs(results.targetCalories - results.maintenanceCalories)
                                            } calories/day
                                        </div>
                                        <button
                                            onClick={() => handleCopy(results.targetCalories.toString())}
                                            className="mt-2 px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                )}

                                {/* BMR Comparison */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">BMR Comparison</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Harris-Benedict (Revised):</span>
                                            <span className="font-semibold">1719 cal/day</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Mifflin-St Jeor:</span>
                                            <span className="font-semibold">{results.bmr} cal/day</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Macronutrient Breakdown */}
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">Macronutrient Breakdown</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Protein:</span>
                                            <span className="font-semibold">
                                                {Math.round(results.macronutrients.protein.grams)}g ({Math.round(results.macronutrients.protein.calories)} cal)
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Carbohydrates:</span>
                                            <span className="font-semibold">
                                                {Math.round(results.macronutrients.carbs.grams)}g ({Math.round(results.macronutrients.carbs.calories)} cal)
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Fats:</span>
                                            <span className="font-semibold">
                                                {Math.round(results.macronutrients.fats.grams)}g ({Math.round(results.macronutrients.fats.calories)} cal)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* TDEE by Activity Level */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">TDEE by Activity Level</h4>
                                    <div className="space-y-1 text-xs">
                                        {ACTIVITY_LEVELS.map((level) => (
                                            <div 
                                                key={level.value} 
                                                className={`flex justify-between p-2 rounded ${
                                                    level.value === activityLevel ? 'bg-blue-100' : ''
                                                }`}
                                            >
                                                <span className="text-gray-600">{level.label}:</span>
                                                <span className="font-semibold">{Math.round(results.tdeeByActivity[level.value])} cal/day</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Educational Content */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use This BMR Calculator</h3>
                    <p className="text-gray-700 mb-4">
                        Our BMR (Basal Metabolic Rate) calculator determines how many calories your body burns at rest. Enter your age, gender, height, and weight to get your BMR using the scientifically-validated Mifflin-St Jeor equation. For enhanced accuracy, you can also input your body fat percentage to use the Katch-McArdle formula.
                    </p>

                    <p className="text-gray-700 mb-4">
                        Select your activity level to calculate your Total Daily Energy Expenditure (TDEE), which represents the total calories you burn per day including physical activity. Set your primary goal (maintain, lose, or gain weight) and desired rate of change to get personalized calorie targets with detailed macronutrient breakdown.
                    </p>

                    <h3>Understanding Your Results</h3>
                    <ol className="list-decimal list-outside space-y-3 text-gray-700 mb-6 pl-5">
                        <li>
                            <strong>BMR (Basal Metabolic Rate)</strong> is the number of calories your body needs to perform basic physiological functions like breathing, circulation, and cell production while at complete rest. This represents about 60-75% of your total daily calorie burn.
                        </li>
                        <li>
                            <strong>TDEE (Total Daily Energy Expenditure)</strong> is your BMR multiplied by an activity factor that accounts for your exercise and daily movement. This represents the total calories you burn in a day and is used to determine maintenance calories.
                        </li>
                        <li>
                            <strong>Mifflin-St Jeor equation</strong> is currently considered the most accurate formula for calculating BMR in healthy individuals. It&apos;s more precise than the older Harris-Benedict equation, especially for overweight individuals.
                        </li>
                        <li>
                            <strong>Katch-McArdle formula</strong> is used when body fat percentage is known and can be more accurate for very lean or very muscular individuals since it&apos;s based on lean body mass rather than total weight.
                        </li>
                        <li>
                            <strong>Activity levels</strong> range from sedentary (1.2x BMR) for desk jobs with no exercise to extremely active (1.9x BMR) for athletes or people with physically demanding jobs plus daily intense training.
                        </li>
                        <li>
                            <strong>Calorie deficits and surpluses</strong> of 500 calories per day typically result in about 1 pound of weight change per week, since one pound of fat contains approximately 3,500 calories.
                        </li>
                        <li>
                            <strong>Macronutrient ratios</strong> shown are general recommendations (25% protein, 45% carbohydrates, 30% fats) but can be adjusted based on individual goals, dietary preferences, and medical conditions.
                        </li>
                        <li>
                            <strong>Minimum calorie intake</strong> should generally not go below 1,200 calories for women or 1,500 for men to ensure adequate nutrition and prevent metabolic slowdown, regardless of weight loss goals.
                        </li>
                        <li>
                            <strong>Individual variation</strong> in metabolism can be ±10-15% from calculated values due to factors like genetics, muscle mass, hormonal status, and metabolic adaptations from previous dieting.
                        </li>
                        <li>
                            <strong>Regular monitoring</strong> and adjustment of calorie intake based on actual weight changes and energy levels is recommended, as metabolic rate can change with weight loss, muscle gain, or changes in activity level.
                        </li>
                    </ol>

                    <h3>Factors Affecting Metabolism</h3>
                    <p>Age, gender, body composition, genetics, hormonal status, and previous dieting history all influence your metabolic rate. Muscle tissue burns more calories than fat tissue, which is why strength training can boost metabolism. Extreme calorie restriction can slow metabolism, making gradual changes more sustainable.</p>
                    
                    <h3>Using Your Results</h3>
                    <p>Use your TDEE as a starting point for calorie planning. Track your weight and energy levels for 2-3 weeks, then adjust calories up or down by 100-200 per day as needed. Remember that sustainable weight changes happen gradually - aim for 0.5-2 pounds per week for best long-term results.</p>
                </div>
            </div>
        </ToolLayout>
    );
}