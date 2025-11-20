'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

enum TEMPERATURE_UNIT {
    CELSIUS = '°C',
    FAHRENHEIT = '°F',
    KELVIN = 'K',
    RANKINE = '°R',
    DELISLE = '°De',
    NEWTON = '°N',
    REAUMUR = '°Ré',
    ROMER = '°Rø'
}

interface TemperatureConversions {
  [TEMPERATURE_UNIT.CELSIUS]: number;
  [TEMPERATURE_UNIT.FAHRENHEIT]: number;
  [TEMPERATURE_UNIT.KELVIN]: number;
  [TEMPERATURE_UNIT.RANKINE]: number;
  [TEMPERATURE_UNIT.DELISLE]: number;
  [TEMPERATURE_UNIT.NEWTON]: number;
  [TEMPERATURE_UNIT.REAUMUR]: number;
  [TEMPERATURE_UNIT.ROMER]: number;
}

interface SpecializedUnit {
  label: string;
  value: number;
  unit: string;
  description: string;
}

interface RealWorldComparison {
  label: string;
  range: string;
  icon: string;
}

interface TemperatureCategory {
  label: string;
  description: string;
  isHighlighted?: boolean;
}

const QUICK_SELECT_VALUES = [
    { label: 'Absolute Zero', value: -273.15, unit: TEMPERATURE_UNIT.CELSIUS },
    { label: 'Water Freezing', value: 0, unit: TEMPERATURE_UNIT.CELSIUS },
    { label: 'Room Temperature', value: 20, unit: TEMPERATURE_UNIT.CELSIUS },
    { label: 'Body Temperature', value: 37, unit: TEMPERATURE_UNIT.CELSIUS },
    { label: 'Water Boiling', value: 100, unit: TEMPERATURE_UNIT.CELSIUS },
    { label: '32°F (Freezing)', value: 32, unit: TEMPERATURE_UNIT.FAHRENHEIT },
    { label: '68°F (Room Temp)', value: 68, unit: TEMPERATURE_UNIT.FAHRENHEIT },
    { label: '98.6°F (Body Temp)', value: 98.6, unit: TEMPERATURE_UNIT.FAHRENHEIT },
    { label: '212°F (Boiling)', value: 212, unit: TEMPERATURE_UNIT.FAHRENHEIT },
    { label: '0 K (Absolute Zero)', value: 0, unit: TEMPERATURE_UNIT.KELVIN },
    { label: '273.15 K (0°C)', value: 273.15, unit: TEMPERATURE_UNIT.KELVIN },
    { label: '373.15 K (100°C)', value: 373.15, unit: TEMPERATURE_UNIT.KELVIN }
];

enum INPUT_FORMAT {
    DECIMAL = 'Decimal',
    WHOLE_NUMBER = 'Whole Number'
}

const INPUT_FORMATS = [
  { value: INPUT_FORMAT.DECIMAL, label: 'Decimal' },
  { value: INPUT_FORMAT.WHOLE_NUMBER, label: 'Whole Number' },
];

const PRECISION_OPTIONS = [
  { value: 0, label: '0 decimals' },
  { value: 1, label: '1 decimal' },
  { value: 2, label: '2 decimals' },
  { value: 4, label: '4 decimals' },
];

export function TemperatureConverter() {
  const [inputValue, setInputValue] = useState('20');
  const [inputUnit, setInputUnit] = useState<TEMPERATURE_UNIT>(TEMPERATURE_UNIT.CELSIUS);
  const [precision, setPrecision] = useState(2);
  const [inputFormat, setInputFormat] = useState(INPUT_FORMAT.DECIMAL);
  const [conversions, setConversions] = useState<TemperatureConversions | null>(null);
  const [specializedUnits, setSpecializedUnits] = useState<SpecializedUnit[]>([]);
  const [realWorldComparisons, setRealWorldComparisons] = useState<RealWorldComparison[]>([]);
  const [temperatureCategories, setTemperatureCategories] = useState<TemperatureCategory[]>([]);

  const formatNumber = useCallback((value: number, decimals: number = precision): string => {
    if (inputFormat === INPUT_FORMAT.WHOLE_NUMBER) {
      return Math.round(value).toString();
    } else {
      return value.toFixed(decimals);
    }
  }, [precision, inputFormat]);

  // Temperature conversion functions
  const celsiusToFahrenheit = (celsius: number): number => (celsius * 9/5) + 32;
  const celsiusToKelvin = (celsius: number): number => celsius + 273.15;
  const celsiusToRankine = (celsius: number): number => (celsius + 273.15) * 9/5;
  const celsiusToDelisle = (celsius: number): number => (100 - celsius) * 3/2;
  const celsiusToNewton = (celsius: number): number => celsius * 33/100;
  const celsiusToReaumur = (celsius: number): number => celsius * 4/5;
  const celsiusToRomer = (celsius: number): number => celsius * 21/40 + 7.5;

  const fahrenheitToCelsius = (fahrenheit: number): number => (fahrenheit - 32) * 5/9;
  const kelvinToCelsius = (kelvin: number): number => kelvin - 273.15;
  const rankineToCelsius = (rankine: number): number => (rankine * 5/9) - 273.15;
  const delisleToCelsius = (delisle: number): number => 100 - (delisle * 2/3);
  const newtonToCelsius = (newton: number): number => newton * 100/33;
  const reaumurToCelsius = (reaumur: number): number => reaumur * 5/4;
  const romerToCelsius = (romer: number): number => (romer - 7.5) * 40/21;

  const convertToCelsius = useCallback((value: number, unit: TEMPERATURE_UNIT): number => {
    switch (unit) {
      case TEMPERATURE_UNIT.CELSIUS: return value;
      case TEMPERATURE_UNIT.FAHRENHEIT: return fahrenheitToCelsius(value);
      case TEMPERATURE_UNIT.KELVIN: return kelvinToCelsius(value);
      case TEMPERATURE_UNIT.RANKINE: return rankineToCelsius(value);
      case TEMPERATURE_UNIT.DELISLE: return delisleToCelsius(value);
      case TEMPERATURE_UNIT.NEWTON: return newtonToCelsius(value);
      case TEMPERATURE_UNIT.REAUMUR: return reaumurToCelsius(value);
      case TEMPERATURE_UNIT.ROMER: return romerToCelsius(value);
      default: return value;
    }
  }, []);

  const getSpecializedUnits = useCallback((celsiusValue: number): SpecializedUnit[] => {
    return [
      {
        label: 'Gas Mark',
        value: (celsiusValue - 121) / 14,
        unit: 'GM',
        description: 'British oven temperature scale'
      },
      {
        label: 'Regulo',
        value: (celsiusValue - 121) / 14,
        unit: 'R',
        description: 'European oven temperature scale'
      }
    ].filter(unit => unit.value >= 1 && unit.value <= 10); // Gas marks typically range 1-10
  }, []);

  const getRealWorldComparisons = useCallback((celsiusValue: number): RealWorldComparison[] => {
    let allComparisons: RealWorldComparison[] = [];
    
    if (celsiusValue <= -200) {
      allComparisons = [
        { label: 'Liquid Nitrogen', range: '-196°C', icon: '❄️' },
        { label: 'Outer Space', range: '-270°C', icon: '🌌' },
        { label: 'Liquid Helium', range: '-269°C', icon: '🧪' }
      ];
    } else if (celsiusValue <= -100) {
      allComparisons = [
        { label: 'Dry Ice', range: '-78.5°C', icon: '🧊' },
        { label: 'Antarctica Winter', range: '-89°C', icon: '🐧' },
        { label: 'Liquid Oxygen', range: '-183°C', icon: '💨' }
      ];
    } else if (celsiusValue <= -20) {
      allComparisons = [
        { label: 'Freezer Temperature', range: '-18°C', icon: '🧊' },
        { label: 'Winter in Siberia', range: '-40°C', icon: '🥶' },
        { label: 'Ice Hockey Rink', range: '-9°C', icon: '🏒' },
        { label: 'Frozen Food Storage', range: '-18°C', icon: '🍟' }
      ];
    } else if (celsiusValue <= 0) {
      allComparisons = [
        { label: 'Water Freezing Point', range: '0°C', icon: '🧊' },
        { label: 'Snow Formation', range: '0°C to -5°C', icon: '❄️' },
        { label: 'Winter Day', range: '-5°C to 0°C', icon: '🌨️' },
        { label: 'Ice Cubes', range: '0°C', icon: '🧊' }
      ];
    } else if (celsiusValue <= 10) {
      allComparisons = [
        { label: 'Refrigerator', range: '2°C to 4°C', icon: '❄️' },
        { label: 'Cold Day', range: '5°C to 10°C', icon: '🧥' },
        { label: 'Mountain Peak', range: '0°C to 10°C', icon: '⛰️' },
        { label: 'Wine Cellar', range: '10°C to 15°C', icon: '🍷' }
      ];
    } else if (celsiusValue <= 25) {
      allComparisons = [
        { label: 'Room Temperature', range: '20°C to 22°C', icon: '🏠' },
        { label: 'Spring Day', range: '15°C to 20°C', icon: '🌸' },
        { label: 'Cool Swimming Pool', range: '18°C to 22°C', icon: '🏊' },
        { label: 'Comfortable Indoor', range: '20°C to 24°C', icon: '😊' }
      ];
    } else if (celsiusValue <= 40) {
      allComparisons = [
        { label: 'Body Temperature', range: '37°C', icon: '🌡️' },
        { label: 'Hot Summer Day', range: '30°C to 35°C', icon: '☀️' },
        { label: 'Warm Bath', range: '37°C to 40°C', icon: '🛁' },
        { label: 'Desert Day', range: '35°C to 45°C', icon: '🏜️' },
        { label: 'Fever Temperature', range: '38°C to 40°C', icon: '🤒' }
      ];
    } else if (celsiusValue <= 60) {
      allComparisons = [
        { label: 'Hot Coffee', range: '60°C to 70°C', icon: '☕' },
        { label: 'Hot Tub', range: '38°C to 40°C', icon: '🛁' },
        { label: 'Dishwasher Water', range: '60°C', icon: '🍽️' },
        { label: 'Pasteurization', range: '63°C', icon: '🥛' }
      ];
    } else if (celsiusValue <= 100) {
      allComparisons = [
        { label: 'Water Boiling Point', range: '100°C', icon: '💧' },
        { label: 'Steam Sauna', range: '80°C to 100°C', icon: '🧖‍♀️' },
        { label: 'Hot Tea', range: '80°C to 90°C', icon: '🫖' },
        { label: 'Cooking Water', range: '100°C', icon: '🍲' }
      ];
    } else if (celsiusValue <= 200) {
      allComparisons = [
        { label: 'Baking Oven (Low)', range: '150°C to 180°C', icon: '🍞' },
        { label: 'Slow Roasting', range: '120°C to 160°C', icon: '🍖' },
        { label: 'Candy Making', range: '150°C to 180°C', icon: '🍬' }
      ];
    } else if (celsiusValue <= 500) {
      allComparisons = [
        { label: 'Pizza Oven', range: '400°C to 500°C', icon: '🍕' },
        { label: 'Wood Fire', range: '300°C to 600°C', icon: '🔥' },
        { label: 'Baking Oven (High)', range: '200°C to 250°C', icon: '🥖' },
        { label: 'Self-Cleaning Oven', range: '480°C', icon: '🔥' }
      ];
    } else {
      allComparisons = [
        { label: 'Steel Melting', range: '1370°C to 1500°C', icon: '🔥' },
        { label: 'Volcano Lava', range: '1000°C to 1200°C', icon: '🌋' },
        { label: 'Candle Flame', range: '800°C to 1000°C', icon: '🕯️' },
        { label: 'Furnace', range: '1000°C+', icon: '🏭' }
      ];
    }
    
    // Randomly shuffle and return only 3 comparisons
    const shuffled = [...allComparisons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  const getTemperatureCategories = useCallback((celsiusValue: number): TemperatureCategory[] => {
    const categories = [
      {
        label: 'Extreme Cold',
        description: 'Cryogenic temperatures, liquid gases',
        isHighlighted: celsiusValue < -100
      },
      {
        label: 'Very Cold',
        description: 'Freezer temperatures, polar regions',
        isHighlighted: celsiusValue >= -100 && celsiusValue < -20
      },
      {
        label: 'Cold',
        description: 'Winter weather, refrigeration',
        isHighlighted: celsiusValue >= -20 && celsiusValue < 0
      },
      {
        label: 'Cool',
        description: 'Cool weather, refrigerated storage',
        isHighlighted: celsiusValue >= 0 && celsiusValue < 15
      },
      {
        label: 'Comfortable',
        description: 'Room temperature, pleasant weather',
        isHighlighted: celsiusValue >= 15 && celsiusValue < 30
      },
      {
        label: 'Warm',
        description: 'Hot weather, body temperature',
        isHighlighted: celsiusValue >= 30 && celsiusValue < 50
      },
      {
        label: 'Hot',
        description: 'Very hot weather, hot water',
        isHighlighted: celsiusValue >= 50 && celsiusValue < 100
      },
      {
        label: 'Very Hot',
        description: 'Boiling water, cooking temperatures',
        isHighlighted: celsiusValue >= 100 && celsiusValue < 300
      },
      {
        label: 'Extreme Heat',
        description: 'Industrial processes, fire temperatures',
        isHighlighted: celsiusValue >= 300
      }
    ];
    
    return categories;
  }, []);

  const convertTemperature = useCallback(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setConversions(null);
      setSpecializedUnits([]);
      setRealWorldComparisons([]);
      setTemperatureCategories([]);
      return;
    }

    // Convert input to Celsius first
    const celsiusValue = convertToCelsius(value, inputUnit);

    // Convert from Celsius to all other units
    const result: TemperatureConversions = {
      [TEMPERATURE_UNIT.CELSIUS]: celsiusValue,
      [TEMPERATURE_UNIT.FAHRENHEIT]: celsiusToFahrenheit(celsiusValue),
      [TEMPERATURE_UNIT.KELVIN]: celsiusToKelvin(celsiusValue),
      [TEMPERATURE_UNIT.RANKINE]: celsiusToRankine(celsiusValue),
      [TEMPERATURE_UNIT.DELISLE]: celsiusToDelisle(celsiusValue),
      [TEMPERATURE_UNIT.NEWTON]: celsiusToNewton(celsiusValue),
      [TEMPERATURE_UNIT.REAUMUR]: celsiusToReaumur(celsiusValue),
      [TEMPERATURE_UNIT.ROMER]: celsiusToRomer(celsiusValue),
    };

    setConversions(result);
    setSpecializedUnits(getSpecializedUnits(celsiusValue));
    setRealWorldComparisons(getRealWorldComparisons(celsiusValue));
    setTemperatureCategories(getTemperatureCategories(celsiusValue));
  }, [inputValue, inputUnit, convertToCelsius, getSpecializedUnits, getRealWorldComparisons, getTemperatureCategories]);

  // Auto-convert when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(convertTemperature, 300);
    return () => clearTimeout(timeoutId);
  }, [convertTemperature]);

  const handleQuickSelect = (value: number, unit: TEMPERATURE_UNIT) => {
    setInputValue(value.toString());
    setInputUnit(unit);
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
  };

  const getTemperatureColor = (): string => {
    if (!conversions) return 'bg-gray-500';
    const celsius = conversions[TEMPERATURE_UNIT.CELSIUS];
    if (celsius < -50) return 'bg-blue-900';
    if (celsius < -10) return 'bg-blue-600';
    if (celsius < 0) return 'bg-blue-400';
    if (celsius < 15) return 'bg-green-400';
    if (celsius < 30) return 'bg-yellow-400';
    if (celsius < 50) return 'bg-orange-400';
    if (celsius < 100) return 'bg-red-400';
    return 'bg-red-600';
  };

  const getVisualScale = (): number => {
    if (!conversions) return 50;
    const celsius = conversions[TEMPERATURE_UNIT.CELSIUS];
    // Scale from -50°C to 150°C for visual representation
    const normalized = ((celsius + 50) / 200) * 100;
    return Math.max(0, Math.min(100, normalized));
  };

  return (
    <ToolLayout toolCategory={ToolNameLists.TemperatureConverter}>
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Convert Celsius, Fahrenheit, Kelvin, Rankine, and more with our comprehensive temperature converter. Perfect for cooking, science experiments, weather forecasting, and engineering applications. Get instant conversions with high precision calculations.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Temperature</h2>
            
            {/* Format Controls */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Format
                </label>
                <select
                  value={inputFormat}
                  onChange={(e) => setInputFormat(e.target.value as INPUT_FORMAT)}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {INPUT_FORMATS.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precision
                </label>
                <select
                  value={precision}
                  onChange={(e) => setPrecision(Number(e.target.value))}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {PRECISION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Temperature Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature ({inputUnit})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="20"
                  className="w-full shadow-sm px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value as TEMPERATURE_UNIT)}
                  className="absolute right-1 top-1 bottom-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-500 text-xs"
                >
                  {Object.values(TEMPERATURE_UNIT).map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Select
              </label>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_SELECT_VALUES.map((quick) => (
                  <button
                    key={quick.label}
                    onClick={() => handleQuickSelect(quick.value, quick.unit)}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-orange-300 text-gray-700 rounded-md transition-colors text-left"
                  >
                    {quick.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conversion Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Results</h2>
            
            {!conversions && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter a temperature value to see conversions</p>
              </div>
            )}

            {conversions && (
              <div className="space-y-4">
                {/* Main Conversions */}
                {Object.entries(conversions).map(([unit, value]) => (
                  <div key={unit} className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 capitalize">
                        {unit === TEMPERATURE_UNIT.CELSIUS ? 'Celsius' :
                         unit === TEMPERATURE_UNIT.FAHRENHEIT ? 'Fahrenheit' :
                         unit === TEMPERATURE_UNIT.KELVIN ? 'Kelvin' :
                         unit === TEMPERATURE_UNIT.RANKINE ? 'Rankine' :
                         unit === TEMPERATURE_UNIT.DELISLE ? 'Delisle' :
                         unit === TEMPERATURE_UNIT.NEWTON ? 'Newton' :
                         unit === TEMPERATURE_UNIT.REAUMUR ? 'Réaumur' :
                         unit === TEMPERATURE_UNIT.ROMER ? 'Rømer' : unit} ({unit})
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatNumber(value)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(`${formatNumber(value)} ${unit}`)}
                      className="px-2 py-1 text-xs bg-orange-300 hover:bg-orange-400 text-white rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      Copy
                    </button>
                  </div>
                ))}

                {/* Specialized Units */}
                {specializedUnits.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Cooking Units</h3>
                    {specializedUnits.map((unit, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                        <div className="flex-1">
                          <div className="text-xs text-gray-600">{unit.label} ({unit.unit})</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {formatNumber(unit.value)}
                          </div>
                          <div className="text-xs text-gray-500">{unit.description}</div>
                        </div>
                        <button
                          onClick={() => handleCopy(`${formatNumber(unit.value)} ${unit.unit}`)}
                          className="px-2 py-1 text-xs bg-gray-300 hover:bg-gray-400 text-white rounded transition-colors"
                          title="Copy to clipboard"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Temperature Context Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Temperature Context</h2>
            
            {/* Visual Temperature Scale */}
            {conversions && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Temperature Scale</h3>
                <div className="w-full bg-gray-200 rounded-full h-6 mb-2 overflow-hidden">
                  <div 
                    className={`h-6 rounded-full transition-all duration-300 ${getTemperatureColor()}`}
                    style={{ width: `${getVisualScale()}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 text-center">
                  {conversions && `${formatNumber(conversions[TEMPERATURE_UNIT.CELSIUS])}°C`}
                </div>
              </div>
            )}

            {/* Real-world Comparisons */}
            {realWorldComparisons.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Real-world Comparisons</h3>
                {realWorldComparisons.map((comparison, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{comparison.icon}</span>
                      <div className="font-medium text-gray-900">{comparison.label}</div>
                    </div>
                    <div className="text-sm text-gray-600 text-right">{comparison.range}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Temperature Categories */}
            {temperatureCategories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Temperature Categories</h3>
                {temperatureCategories.map((category, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg mb-2 ${
                      category.isHighlighted 
                        ? 'bg-amber-100' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{category.label}</div>
                    <div className="text-xs text-gray-600">{category.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <hr className="my-5" />

        {/* Usage Information */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use This Tool</h3>
          <p className="text-gray-700 mb-4">
            The Professional Temperature Converter makes it easy to switch between Celsius, Fahrenheit, Kelvin, Rankine, and other temperature scales. Enter any temperature in the input field, then select your starting unit from the dropdown. Use the quick select buttons for common temperatures like water freezing, room temperature, or body temperature. You can also adjust the precision to control how many decimal places you see.
          </p>

          <p className="text-gray-700 mb-4">
            All conversions appear in real time as you type. You can see how one temperature scale compares to others instantly. The tool includes specialized units like Gas Mark for cooking applications. To make results easier to understand, the tool adds real-world examples that show what each temperature feels like in daily life. The visual temperature scale uses colors to help you quickly understand if a temperature is cold, comfortable, or hot. Copy any result directly to your clipboard for quick sharing or calculations.
          </p>

          <h3>Temperature Conversion Facts</h3>
          <ol className="list-decimal list-outside space-y-3 text-gray-700 mb-6 pl-5">
            <li>
              <strong>Celsius (°C)</strong>, also called centigrade, is based on the freezing point (0°C) and boiling point (100°C) of water at standard atmospheric pressure. It&apos;s the most widely used temperature scale in the world and is part of the International System of Units (SI).
            </li>
            <li>
              <strong>Fahrenheit (°F)</strong> was developed by Daniel Gabriel Fahrenheit in 1724. Water freezes at 32°F and boils at 212°F. It&apos;s primarily used in the United States, Belize, and some Caribbean territories. The conversion formula is °F = (°C × 9/5) + 32.
            </li>
            <li>
              <strong>Kelvin (K)</strong> is the base unit of temperature in the International System of Units (SI). It starts at absolute zero (-273.15°C), the theoretical point where all molecular motion stops. Scientists use Kelvin because it&apos;s an absolute temperature scale with no negative numbers.
            </li>
            <li>
              <strong>Rankine (°R)</strong> is an absolute temperature scale like Kelvin, but it uses Fahrenheit-sized degrees. Absolute zero is 0°R, which equals -459.67°F. It&apos;s mainly used in engineering applications in the United States, particularly in thermodynamics.
            </li>
            <li>
              <strong>Delisle (°De)</strong> was created by Joseph-Nicolas Delisle in 1732. Unusually, the scale is inverted—higher numbers represent colder temperatures. Water boils at 0°De and freezes at 150°De. It was used in Russia for nearly a century but is now obsolete.
            </li>
            <li>
              <strong>Newton (°N)</strong> was developed by Isaac Newton around 1700. Water freezes at 0°N and boils at 33°N. While historically interesting as one of the early temperature scales, it&apos;s not used in modern applications.
            </li>
            <li>
              <strong>Réaumur (°Ré)</strong> was created by René Antoine Ferchault de Réaumur in 1730. Water freezes at 0°Ré and boils at 80°Ré. It was widely used in Europe, especially in France and Germany, until the late 19th century when Celsius became standard.
            </li>
            <li>
              <strong>Rømer (°Rø)</strong> was developed by Ole Christensen Rømer in 1701. Water freezes at 7.5°Rø and boils at 60°Rø. This scale influenced the development of both Fahrenheit and Celsius scales, but it&apos;s no longer used practically.
            </li>
            <li>
              <strong>Absolute zero</strong> (-273.15°C, -459.67°F, 0 K) is the theoretical temperature at which all atomic and molecular motion stops. It&apos;s impossible to reach in practice, but scientists have cooled materials to within billionths of a degree of absolute zero.
            </li>
            <li>
              <strong>Gas Mark</strong> is a temperature scale used on gas ovens, primarily in the UK and Ireland. Gas Mark 1 equals about 275°F (135°C), and each subsequent mark increases by about 25°F (14°C). Gas Mark 4 (350°F/180°C) is considered moderate heat for baking.
            </li>
          </ol>

          <h3>Cooking and Baking</h3>
          <p>In cooking, temperature control is crucial for food safety and quality. Different cooking methods require specific temperatures—slow roasting at 120-160°C, baking bread at 200-220°C, or deep frying at 175-190°C. Understanding these conversions helps when following international recipes.</p>
          
          <h3>Weather and Climate</h3>
          <p>Weather reports use different temperature scales depending on location. Most of the world uses Celsius, while the United States uses Fahrenheit. Understanding both scales helps when traveling or reading international weather forecasts and climate data.</p>
          
          <h3>Science and Engineering</h3>
          <p>Scientific research often requires Kelvin or Celsius for calculations, while engineering applications in the US may use Rankine or Fahrenheit. Accurate temperature conversion is essential for material properties, chemical reactions, and thermodynamic calculations.</p>
          
          <h3>Medical and Health</h3>
          <p>Body temperature varies slightly by measurement method and individual, but normal ranges are 36.1-37.2°C (97-99°F). Fever begins around 37.8°C (100°F). Medical equipment and research may use different temperature scales depending on the application and location.</p>
        </div>
      </div>
    </ToolLayout>
  );
}