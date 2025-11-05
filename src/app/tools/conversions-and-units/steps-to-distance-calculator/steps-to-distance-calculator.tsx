'use client';

import React, { useState, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolDescription, ToolNameLists } from '@/constants/tools';

interface EquivalentExample {
  icon: string;
  description: string;
  color: string;
}

interface CalculationResult {
  miles: number;
  kilometers: number;
  stepsPerMile: number;
  stepsPerKm: number;
  caloriesBurned: number;
  stepsPerMinute: number;
  minutesForMile: number;
  minutesForKm: number;
  equivalentDistance: string;
  equivalentExamples: EquivalentExample[];
}

type PaceOption = 'very-slow' | 'slow' | 'average' | 'brisk' | 'jog' | 'run' | 'fast-run' | 'very-fast-run';
type UnitSystem = 'metric' | 'imperial';

interface PersonData {
  biologicalSex: 'female' | 'male';
  height: {
    feet: number;
    inches: number;
    cm: number;
  };
  weight: {
    lbs: number;
    kg: number;
  };
  unit: UnitSystem;
  paceOfWalking: PaceOption;
  steps: number;
  calculateCalories: boolean;
  rememberEnteredInfo: boolean;
}

export function StepsToMilesCalculator() {
  const [personData, setPersonData] = useState<PersonData>({
    biologicalSex: 'female',
    height: {
      feet: 5,
      inches: 9,
      cm: 175
    },
    weight: {
      lbs: 175,
      kg: 79
    },
    unit: 'imperial',
    paceOfWalking: 'average',
    steps: 10000,
    calculateCalories: true,
    rememberEnteredInfo: false
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  // Get speed in mph for each pace option
  const getPaceSpeed = useCallback((pace: PaceOption): number => {
    const paceMap = {
      'very-slow': 1.5,
      'slow': 2,
      'average': 3,
      'brisk': 4,
      'jog': 5,
      'run': 6,
      'fast-run': 7.5,
      'very-fast-run': 10
    };
    return paceMap[pace];
  }, []);

  // Unit conversion helpers
  const cmToInches = useCallback((cm: number): number => {
    return cm / 2.54;
  }, []);

  const inchesToCm = useCallback((inches: number): number => {
    return inches * 2.54;
  }, []);

  const lbsToKg = useCallback((lbs: number): number => {
    return lbs / 2.205;
  }, []);

  const kgToLbs = useCallback((kg: number): number => {
    return kg * 2.205;
  }, []);

  // Handle unit system change with conversion
  const handleUnitChange = useCallback((newUnit: UnitSystem) => {
    if (newUnit === personData.unit) return;

    setPersonData(prev => ({
      ...prev,
      unit: newUnit
    }));
  }, [personData.unit]);

  // Handle height changes with unit conversion
  const handleHeightChange = (type: 'feet' | 'inches' | 'cm', value: number) => {
    setPersonData(prev => {
      if (type === 'cm') {
        const totalInches = cmToInches(value);
        const feet = Math.floor(totalInches / 12);
        const inches = totalInches % 12;
        return {
          ...prev,
          height: {
            feet,
            inches: Math.round(inches * 10) / 10,
            cm: value
          }
        };
      } else {
        const newHeight = { ...prev.height, [type]: value };
        const totalInches = (newHeight.feet * 12) + newHeight.inches;
        const cm = inchesToCm(totalInches);
        return {
          ...prev,
          height: {
            ...newHeight,
            cm: Math.round(cm * 10) / 10
          }
        };
      }
    });
  };

  // Handle weight changes with unit conversion
  const handleWeightChange = (unit: 'lbs' | 'kg', value: number) => {
    setPersonData(prev => {
      if (unit === 'lbs') {
        return {
          ...prev,
          weight: {
            lbs: value,
            kg: Math.round(lbsToKg(value) * 10) / 10
          }
        };
      } else {
        return {
          ...prev,
          weight: {
            kg: value,
            lbs: Math.round(kgToLbs(value) * 10) / 10
          }
        };
      }
    });
  };

  // Generate equivalent distance examples
  const generateEquivalentExamples = useCallback((miles: number): EquivalentExample[] => {
    const examples: EquivalentExample[] = [];
    
    // Convert miles to feet for more precise comparisons
    const totalFeet = miles * 5280;
    
    // Tennis court: ~78 feet
    const tennisCourtLength = 78;
    if (totalFeet >= tennisCourtLength && totalFeet < 300) {
      const ratio = (totalFeet / tennisCourtLength);
      examples.push({
        icon: '🎾',
        description: `${ratio.toFixed(1)} lengths of a tennis court`,
        color: 'bg-blue-50 text-blue-700'
      });
    }
    
    // Basketball court: ~94 feet
    const basketballCourtLength = 94;
    if (totalFeet >= basketballCourtLength && totalFeet < 400) {
      const ratio = (totalFeet / basketballCourtLength);
      examples.push({
        icon: '🏀',
        description: `${ratio.toFixed(1)} lengths of a basketball court`,
        color: 'bg-purple-50 text-purple-700'
      });
    }
    
    // Swimming pool (Olympic): ~164 feet
    const olympicPoolLength = 164;
    if (totalFeet >= olympicPoolLength * 0.5) {
      const ratio = (totalFeet / olympicPoolLength);
      examples.push({
        icon: '🏊',
        description: `${ratio.toFixed(1)} lengths of an Olympic swimming pool`,
        color: 'bg-blue-50 text-blue-700'
      });
    }
    
    // Football field: ~300 feet
    const footballFieldLength = 300;
    if (totalFeet >= footballFieldLength * 0.5) {
      const ratio = (totalFeet / footballFieldLength);
      examples.push({
        icon: '🏈',
        description: `${ratio.toFixed(1)} lengths of a football field`,
        color: 'bg-orange-50 text-orange-700'
      });
    }
    
    // Baseball field (home to center field): ~400 feet
    const baseballDistance = 400;
    if (totalFeet >= baseballDistance * 0.5) {
      const ratio = (totalFeet / baseballDistance);
      examples.push({
        icon: '⚾',
        description: `${ratio.toFixed(1)} home runs to center field`,
        color: 'bg-green-50 text-green-700'
      });
    }
    
    // City block (average): ~264 feet
    const cityBlockLength = 264;
    if (totalFeet >= cityBlockLength * 0.5) {
      const ratio = (totalFeet / cityBlockLength);
      examples.push({
        icon: '🏢',
        description: `${ratio.toFixed(1)} city blocks`,
        color: 'bg-gray-50 text-gray-700'
      });
    }
    
    // Soccer pitch perimeter: ~1,050 feet (360 x 230 feet field)
    const soccerPitchPerimeter = 1050;
    if (totalFeet >= soccerPitchPerimeter * 0.3) {
      const ratio = (totalFeet / soccerPitchPerimeter);
      examples.push({
        icon: '⚽',
        description: `${ratio.toFixed(1)} circuits of a soccer pitch`,
        color: 'bg-green-50 text-green-700'
      });
    }
    
    // London Bridge: ~930 feet
    const londonBridgeLength = 930;
    if (totalFeet >= londonBridgeLength * 0.3) {
      const ratio = (totalFeet / londonBridgeLength);
      examples.push({
        icon: '🌉',
        description: `${ratio.toFixed(1)} lengths of London Bridge`,
        color: 'bg-orange-50 text-orange-700'
      });
    }
    
    // Brooklyn Bridge: ~1,595 feet
    const brooklynBridgeLength = 1595;
    if (totalFeet >= brooklynBridgeLength * 0.2) {
      const ratio = (totalFeet / brooklynBridgeLength);
      examples.push({
        icon: '🌉',
        description: `${ratio.toFixed(1)} lengths of Brooklyn Bridge`,
        color: 'bg-orange-50 text-orange-700'
      });
    }
    
    // Empire State Building height: ~1,250 feet
    const empireStateHeight = 1250;
    if (totalFeet >= empireStateHeight * 0.2) {
      const ratio = (totalFeet / empireStateHeight);
      examples.push({
        icon: '🏗️',
        description: `${ratio.toFixed(1)} heights of Empire State Building`,
        color: 'bg-gray-50 text-gray-700'
      });
    }
    
    // Eiffel Tower height: ~1,083 feet
    const eiffelTowerHeight = 1083;
    if (totalFeet >= eiffelTowerHeight * 0.2) {
      const ratio = (totalFeet / eiffelTowerHeight);
      examples.push({
        icon: '🗼',
        description: `${ratio.toFixed(1)} heights of Eiffel Tower`,
        color: 'bg-purple-50 text-purple-700'
      });
    }
    
    // Titanic length: ~882 feet
    const titanicLength = 882;
    if (totalFeet >= titanicLength * 0.3) {
      const ratio = (totalFeet / titanicLength);
      examples.push({
        icon: '🚢',
        description: `${ratio.toFixed(1)} lengths of the Titanic`,
        color: 'bg-blue-50 text-blue-700'
      });
    }
    
    // Statue of Liberty (with base): ~305 feet
    const statueOfLibertyHeight = 305;
    if (totalFeet >= statueOfLibertyHeight * 0.5) {
      const ratio = (totalFeet / statueOfLibertyHeight);
      examples.push({
        icon: '🗽',
        description: `${ratio.toFixed(1)} heights of Statue of Liberty`,
        color: 'bg-green-50 text-green-700'
      });
    }
    
    // NASCAR track (Daytona): ~2.5 miles = 13,200 feet
    const nascarTrackLength = 13200;
    if (totalFeet >= nascarTrackLength * 0.05) {
      const ratio = (totalFeet / nascarTrackLength);
      examples.push({
        icon: '🏁',
        description: `${ratio.toFixed(1)} laps of Daytona International Speedway`,
        color: 'bg-green-50 text-green-700'
      });
    }
    
    // Golden Gate Bridge: ~8,980 feet
    const goldenGateLength = 8980;
    if (totalFeet >= goldenGateLength * 0.05) {
      const ratio = (totalFeet / goldenGateLength);
      examples.push({
        icon: '🌉',
        description: `${ratio.toFixed(1)} lengths of the Golden Gate Bridge`,
        color: 'bg-orange-50 text-orange-700'
      });
    }
    
    // Heathrow Airport runway: ~12,800 feet
    const heathrowRunway = 12800;
    if (totalFeet >= heathrowRunway * 0.05) {
      const ratio = (totalFeet / heathrowRunway);
      examples.push({
        icon: '✈️',
        description: `${ratio.toFixed(1)} lengths of Heathrow Airport runway`,
        color: 'bg-orange-50 text-orange-700'
      });
    }
    
    // Central Park length: ~2.5 miles = 13,200 feet
    const centralParkLength = 13200;
    if (totalFeet >= centralParkLength * 0.05) {
      const ratio = (totalFeet / centralParkLength);
      examples.push({
        icon: '🌳',
        description: `${ratio.toFixed(1)} lengths of Central Park`,
        color: 'bg-green-50 text-green-700'
      });
    }
    
    // Half marathon: ~6.9 miles = 36,432 feet
    const halfMarathonLength = 36432;
    if (totalFeet >= halfMarathonLength * 0.1) {
      const ratio = (totalFeet / halfMarathonLength);
      examples.push({
        icon: '�',
        description: `${ratio.toFixed(1)} half marathons`,
        color: 'bg-yellow-50 text-yellow-700'
      });
    }
    
    // Marathon: ~13.1 miles = 69,168 feet
    const marathonLength = 69168;
    if (totalFeet >= marathonLength * 0.05) {
      const ratio = (totalFeet / marathonLength);
      examples.push({
        icon: '🏃‍♂️',
        description: `${ratio.toFixed(1)} marathons`,
        color: 'bg-yellow-50 text-yellow-700'
      });
    }
    
    // Mount Everest height: ~29,032 feet
    const everestHeight = 29032;
    if (totalFeet >= everestHeight * 0.02) {
      const ratio = (totalFeet / everestHeight);
      examples.push({
        icon: '🏔️',
        description: `${ratio.toFixed(1)} heights of Mount Everest`,
        color: 'bg-gray-50 text-gray-700'
      });
    }
    
    // Commercial airplane cruising altitude: ~35,000 feet
    const cruisingAltitude = 35000;
    if (totalFeet >= cruisingAltitude * 0.02) {
      const ratio = (totalFeet / cruisingAltitude);
      examples.push({
        icon: '✈️',
        description: `${ratio.toFixed(1)} commercial airplane cruising altitudes`,
        color: 'bg-blue-50 text-blue-700'
      });
    }
    
    // Return up to 4 most relevant examples, prioritizing appropriate scale
    return examples
      .sort((a, b) => {
        // Sort by relevance - prefer ratios closer to 1-50 range
        const aRatio = parseFloat(a.description.split(' ')[0]);
        const bRatio = parseFloat(b.description.split(' ')[0]);
        
        // Score based on how close the ratio is to ideal range (1-50)
        const getScore = (ratio: number) => {
          if (ratio >= 1 && ratio <= 50) return 0; // Perfect range
          if (ratio < 1) return Math.abs(1 - ratio) * 2; // Penalty for too small
          return Math.abs(ratio - 25) / 25; // Penalty for too large
        };
        
        return getScore(aRatio) - getScore(bRatio);
      })
      .slice(0, 4);
  }, []);

  // Calculate stride length based on height and biological sex
  const calculateStrideLength = useCallback((heightInInches: number, biologicalSex: 'female' | 'male'): number => {
    // Average stride length formulas
    if (biologicalSex === 'female') {
      return heightInInches * 0.413; // Female stride length factor
    } else {
      return heightInInches * 0.415; // Male stride length factor
    }
  }, []);

  // Calculate calories burned based on steps, weight, biological sex, and pace
  const calculateCalories = useCallback((steps: number, weightLbs: number, biologicalSex: 'female' | 'male', pace: PaceOption): number => {
    // Get speed for pace
    const speedMph = getPaceSpeed(pace);
    
    // Base metabolic rate (calories per step)
    let baseCaloriesPerStep;
    if (biologicalSex === 'female') {
      baseCaloriesPerStep = (weightLbs * 0.0000175) + 0.035;
    } else {
      baseCaloriesPerStep = (weightLbs * 0.0000225) + 0.04;
    }
    
    // Pace multiplier based on speed
    let paceMultiplier = 1;
    if (speedMph <= 2) {
      paceMultiplier = 0.8; // Very slow/slow walking
    } else if (speedMph <= 3) {
      paceMultiplier = 1; // Average walking
    } else if (speedMph <= 4) {
      paceMultiplier = 1.3; // Brisk walking
    } else if (speedMph <= 5) {
      paceMultiplier = 1.8; // Jogging
    } else if (speedMph <= 6) {
      paceMultiplier = 2.2; // Running
    } else if (speedMph <= 7.5) {
      paceMultiplier = 2.8; // Fast running
    } else {
      paceMultiplier = 3.5; // Very fast running
    }
    
    return steps * baseCaloriesPerStep * paceMultiplier;
  }, [getPaceSpeed]);

  // Main calculation function
  const performCalculation = useCallback(() => {
    const { height, biologicalSex, weight, steps, calculateCalories: shouldCalculateCalories, paceOfWalking } = personData;
    
    // Convert height to inches
    const totalHeightInches = (height.feet * 12) + height.inches;
    
    // Calculate stride length in inches
    const strideLengthInches = calculateStrideLength(totalHeightInches, biologicalSex);
    
    // Convert stride length to feet
    const strideLengthFeet = strideLengthInches / 12;
    
    // Calculate distance in feet, then convert to miles and kilometers
    const totalDistanceFeet = steps * strideLengthFeet;
    const miles = totalDistanceFeet / 5280; // 5280 feet in a mile
    const kilometers = miles * 1.609344; // Convert miles to kilometers
    
    // Calculate steps per mile and per kilometer
    const stepsPerMile = Math.round(5280 / strideLengthFeet);
    const stepsPerKm = Math.round(stepsPerMile / 1.609344);
    
    // Calculate calories if enabled (use lbs for calculation)
    const caloriesBurned = shouldCalculateCalories ? calculateCalories(steps, weight.lbs, biologicalSex, paceOfWalking) : 0;
    
    // Calculate steps per minute based on pace
    const speedMph = getPaceSpeed(paceOfWalking);
    let stepsPerMinute: number;
    
    // Steps per minute based on walking/running speed
    if (speedMph <= 2) {
      stepsPerMinute = 90;  // Very slow/slow walking
    } else if (speedMph <= 3) {
      stepsPerMinute = 120; // Average walking
    } else if (speedMph <= 4) {
      stepsPerMinute = 150; // Brisk walking
    } else if (speedMph <= 5) {
      stepsPerMinute = 180; // Jogging
    } else if (speedMph <= 6) {
      stepsPerMinute = 200; // Running
    } else if (speedMph <= 7.5) {
      stepsPerMinute = 220; // Fast running
    } else {
      stepsPerMinute = 250; // Very fast running
    }
    
    // Calculate minutes needed to walk a mile and kilometer at this pace
    const minutesForMile = stepsPerMile / stepsPerMinute;
    const minutesForKm = stepsPerKm / stepsPerMinute;
    
    // Generate equivalent distance description
    let equivalentDistance = '';
    if (miles >= 1) {
      equivalentDistance = `About ${miles.toFixed(1)} ${miles >= 2 ? 'miles' : 'mile'}`;
    } else if (miles >= 0.5) {
      equivalentDistance = 'About half a mile';
    } else if (miles >= 0.25) {
      equivalentDistance = 'About a quarter mile';
    } else {
      const feet = Math.round(totalDistanceFeet);
      equivalentDistance = `About ${feet} feet`;
    }

    // Generate equivalent examples
    const equivalentExamples = generateEquivalentExamples(miles);

    setResult({
      miles,
      kilometers,
      stepsPerMile,
      stepsPerKm,
      caloriesBurned,
      stepsPerMinute: stepsPerMinute,
      minutesForMile,
      minutesForKm,
      equivalentDistance,
      equivalentExamples
    });
  }, [personData, calculateStrideLength, calculateCalories, getPaceSpeed, generateEquivalentExamples]);

  // Auto-calculate when data changes
  React.useEffect(() => {
    const timeoutId = setTimeout(performCalculation, 300);
    return () => clearTimeout(timeoutId);
  }, [performCalculation]);

  const updatePersonData = <K extends keyof PersonData>(field: K, value: PersonData[K]) => {
    setPersonData(prev => ({ ...prev, [field]: value }));
  };

  const formatNumber = (num: number, decimals: number = 1): string => {
    return num.toFixed(decimals).replace(/\.0$/, '');
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.StepsToDistanceCalculator}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            {/* Unit System */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit System</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleUnitChange('metric')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    personData.unit === 'metric'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Metric
                </button>
                <button
                  onClick={() => handleUnitChange('imperial')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    personData.unit === 'imperial'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Imperial
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Choose your preferred measurement system</p>
            </div>

            {/* Biological Sex */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Biological Sex</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => updatePersonData('biologicalSex', 'female')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    personData.biologicalSex === 'female'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Female
                </button>
                <button
                  onClick={() => updatePersonData('biologicalSex', 'male')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    personData.biologicalSex === 'male'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Male
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Used for stride length and calorie calculations</p>
            </div>

            {/* Height */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              {personData.unit === 'metric' ? (
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={personData.height.cm}
                    onChange={(e) => handleHeightChange('cm', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="175"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    cm
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      min="3"
                      max="8"
                      value={personData.height.feet}
                      onChange={(e) => handleHeightChange('feet', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Feet</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={personData.height.inches}
                      onChange={(e) => handleHeightChange('inches', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Inches</p>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {personData.unit === 'metric' ? 'Enter height in centimeters' : 'Enter feet and inches separately'}
              </p>
            </div>

            {/* Pace of Walking */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pace of Walking</label>
              <select
                value={personData.paceOfWalking}
                onChange={(e) => updatePersonData('paceOfWalking', e.target.value as PaceOption)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {personData.unit === 'metric' ? (
                  <>
                    <option value="very-slow">Very slow walk (&lt;3.2km/h)</option>
                    <option value="slow">Slow walk (3.2km/h)</option>
                    <option value="average">Average walk (4.8km/h)</option>
                    <option value="brisk">Brisk walk (6.4km/h)</option>
                    <option value="jog">Jog (8km/h)</option>
                    <option value="run">Run (9.7km/h)</option>
                    <option value="fast-run">Fast Run (12km/h)</option>
                    <option value="very-fast-run">Very Fast Run (16km/h)</option>
                  </>
                ) : (
                  <>
                    <option value="very-slow">Very slow walk (&lt;2mph)</option>
                    <option value="slow">Slow walk (2mph)</option>
                    <option value="average">Average walk (3mph)</option>
                    <option value="brisk">Brisk walk (4mph)</option>
                    <option value="jog">Jog (5mph)</option>
                    <option value="run">Run (6mph)</option>
                    <option value="fast-run">Fast Run (7.5mph)</option>
                    <option value="very-fast-run">Very Fast Run (10mph)</option>
                  </>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">Walking/running speed affects calorie calculation</p>
            </div>

            {/* Steps */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
              <input
                type="number"
                min="1"
                max="100000"
                value={personData.steps}
                onChange={(e) => updatePersonData('steps', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="10000"
              />
              <p className="text-xs text-gray-500 mt-1">Number of steps to convert</p>
            </div>

            {/* Calculate Calories */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={personData.calculateCalories}
                  onChange={(e) => updatePersonData('calculateCalories', e.target.checked)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Calculate calories burned?</span>
              </label>
            </div>

            {/* Weight (only shown if calculating calories) */}
            {personData.calculateCalories && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    min={personData.unit === 'metric' ? '30' : '60'}
                    max={personData.unit === 'metric' ? '200' : '400'}
                    value={personData.unit === 'metric' ? personData.weight.kg : personData.weight.lbs}
                    onChange={(e) => handleWeightChange(personData.unit === 'metric' ? 'kg' : 'lbs', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={personData.unit === 'metric' ? '70' : '175'}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {personData.unit === 'metric' ? 'kg' : 'lbs'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Weight is needed for calorie calculations</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
            
            {!result && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter your information to see the conversion results</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Miles for Steps */}
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-blue-800">
                      {personData.unit === 'metric' ? 'Kilometers' : 'Miles'} for {personData.steps.toLocaleString()} steps
                    </h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {personData.unit === 'metric' 
                      ? `${formatNumber(result.kilometers)} km` 
                      : `${formatNumber(result.miles)} miles`
                    }
                  </div>
                  <p className="text-sm text-blue-700">{result.equivalentDistance}</p>
                </div>

                {/* Steps Per Mile/KM */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 22 22">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-gray-800">
                        Your steps per {personData.unit === 'metric' ? 'kilometer' : 'mile'}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {personData.unit === 'metric' 
                        ? result.stepsPerKm.toLocaleString() 
                        : result.stepsPerMile.toLocaleString()
                      }
                    </span>
                  </div>
                </div>

                {/* Calories Burned */}
                {personData.calculateCalories && (
                  <div className="text-center p-6 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-8 h-8 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-lg font-semibold text-orange-800">Calories Burned</h3>
                    </div>
                    <div className="text-3xl font-bold text-orange-600">
                      {Math.round(result.caloriesBurned)} kcal
                    </div>
                  </div>
                )}

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-purple-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-xl font-bold text-purple-600">{result.stepsPerMinute}</div>
                    <div className="text-sm text-purple-700">steps per minute</div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {personData.unit === 'metric' 
                        ? Math.round(result.minutesForKm) 
                        : Math.round(result.minutesForMile)
                      }
                    </div>
                    <div className="text-sm text-green-700">
                      minutes for a {personData.unit === 'metric' ? 'kilometer' : 'mile'}
                    </div>
                  </div>
                </div>

                {/* Equivalent Examples */}
                {result.equivalentExamples.length > 0 && (
                  <div className="bg-gray-100 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    This distance is equivalent to...
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.equivalentExamples.map((example, index) => (
                        <div
                          key={index}
                          className={`${example.color} p-4 rounded-lg flex items-center space-x-3 transition-transform hover:scale-105`}
                        >
                          <div className="text-2xl flex-shrink-0">{example.icon}</div>
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-tight">
                              {example.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                      *Distance predictions are specific to people with a normal level of weight.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div>
          <h3>How Steps to Miles Conversion Works</h3>
          <p>Steps are converted to miles using your stride length. Stride length depends on height and biological sex. For most people, the formula is simple. Female stride length equals height multiplied by 0.413. Male stride length equals height multiplied by 0.415. Each person&post;s walking style and speed can change the result slightly, so individual variation is normal.</p>

          <p>Walking 10,000 steps equals about 4 to 5 miles for most adults. This distance burns roughly 300 to 500 calories depending on pace and body weight. It strengthens the heart, improves circulation, and supports healthy weight control. Reaching this step goal each day is a simple way to boost overall fitness.</p>

          <h3>How Calories Are Calculated</h3>
          <p>Calories burned while walking depend on several factors, including weight, walking speed, and duration. On average, a person burns about 100 calories per mile walked. Therefore, walking 10,000 steps (approximately 4 to 5 miles) can burn between 300 to 500 calories.</p>
          
          <p>Heavier individuals tend to burn more calories for the same distance due to the increased energy required to move a larger mass. Additionally, walking at a brisk pace or uphill increases calorie expenditure compared to a leisurely stroll. Using a pedometer or fitness tracker can help estimate calories burned based on your specific data.</p>

          <h3>Why Track Steps and Distance?</h3>
          <p>Tracking steps and distance helps monitor physical activity levels. Walking is a low-impact exercise that benefits cardiovascular health, aids weight management, and enhances mental well-being. Setting daily step goals encourages movement throughout the day, reducing sedentary behavior. Understanding the distance covered provides motivation to stay active and improve fitness over time.</p>

          <h3>Tips to Increase Daily Steps</h3>
          <p>Incorporate walking into your daily routine by taking short breaks to stroll, using stairs instead of elevators, and parking farther from entrances. Consider walking meetings or phone calls to stay active during work hours. Setting reminders to move every hour can help break up long periods of sitting. Using a pedometer or fitness tracker can provide motivation and accountability to reach your step goals.</p>
        </div>
      </div>
    </ToolLayout>
  );
}