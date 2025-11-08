'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

enum VOLUME_UNIT {
    LITERS = 'L',
    MILLILITERS = 'mL',
    CUBIC_METERS = 'm³',
    GALLONS_US = 'gal (US)',
    GALLONS_UK = 'gal (UK)',
    QUARTS_US = 'qt (US)',
    PINTS_US = 'pt (US)',
    CUPS_US = 'cup (US)',
    FLUID_OUNCES_US = 'fl oz (US)',
    TABLESPOONS = 'tbsp',
    TEASPOONS = 'tsp'
}

interface VolumeConversions {
  [VOLUME_UNIT.LITERS]: number;
  [VOLUME_UNIT.MILLILITERS]: number;
  [VOLUME_UNIT.CUBIC_METERS]: number;
  [VOLUME_UNIT.GALLONS_US]: number;
  [VOLUME_UNIT.GALLONS_UK]: number;
  [VOLUME_UNIT.QUARTS_US]: number;
  [VOLUME_UNIT.PINTS_US]: number;
  [VOLUME_UNIT.CUPS_US]: number;
  [VOLUME_UNIT.FLUID_OUNCES_US]: number;
  [VOLUME_UNIT.TABLESPOONS]: number;
  [VOLUME_UNIT.TEASPOONS]: number;
}

interface SpecializedUnit {
  label: string;
  value: number;
  unit: string;
}

interface RealWorldComparison {
  label: string;
  range: string;
  icon: string;
}

interface VolumeCategory {
  label: string;
  description: string;
  isHighlighted?: boolean;
}

// Base conversion rates to liters
const VOLUME_CONVERSIONS = {
  [VOLUME_UNIT.LITERS]: 1,
  [VOLUME_UNIT.MILLILITERS]: 0.001,
  [VOLUME_UNIT.CUBIC_METERS]: 1000,
  [VOLUME_UNIT.GALLONS_US]: 3.78541,
  [VOLUME_UNIT.GALLONS_UK]: 4.54609,
  [VOLUME_UNIT.QUARTS_US]: 0.946353,
  [VOLUME_UNIT.PINTS_US]: 0.473176,
  [VOLUME_UNIT.CUPS_US]: 0.236588,
  [VOLUME_UNIT.FLUID_OUNCES_US]: 0.0295735,
  [VOLUME_UNIT.TABLESPOONS]: 0.0147868,
  [VOLUME_UNIT.TEASPOONS]: 0.00492892,
};

const QUICK_SELECT_VALUES = [
    { label: '1 tsp', value: 1, unit: VOLUME_UNIT.TEASPOONS },
    { label: '1 tbsp', value: 1, unit: VOLUME_UNIT.TABLESPOONS },
    { label: '1 cup', value: 1, unit: VOLUME_UNIT.CUPS_US },
    { label: '1 pint', value: 1, unit: VOLUME_UNIT.PINTS_US },
    { label: '1 quart', value: 1, unit: VOLUME_UNIT.QUARTS_US },
    { label: '1 liter', value: 1, unit: VOLUME_UNIT.LITERS },
    { label: '1 gallon', value: 1, unit: VOLUME_UNIT.GALLONS_US },
    { label: '5 liters', value: 5, unit: VOLUME_UNIT.LITERS },
    { label: '10 liters', value: 10, unit: VOLUME_UNIT.LITERS },
    { label: '100 mL', value: 100, unit: VOLUME_UNIT.MILLILITERS },
    { label: '500 mL', value: 500, unit: VOLUME_UNIT.MILLILITERS },
    { label: '1000 L', value: 1000, unit: VOLUME_UNIT.LITERS }
];

enum INPUT_FORMAT {
    DECIMAL = 'Decimal',
    FRACTION = 'Fraction'
}

const INPUT_FORMATS = [
  { value: INPUT_FORMAT.DECIMAL, label: 'Decimal' },
  { value: INPUT_FORMAT.FRACTION, label: 'Fraction' },
];

const PRECISION_OPTIONS = [
  { value: 0, label: '0 decimals' },
  { value: 2, label: '2 decimals' },
  { value: 4, label: '4 decimals' },
];

export function VolumeConverter() {
  const [inputValue, setInputValue] = useState('1');
  const [inputUnit, setInputUnit] = useState<VOLUME_UNIT>(VOLUME_UNIT.LITERS);
  const [precision, setPrecision] = useState(4);
  const [inputFormat, setInputFormat] = useState(INPUT_FORMAT.DECIMAL);
  const [conversions, setConversions] = useState<VolumeConversions | null>(null);
  const [specializedUnits, setSpecializedUnits] = useState<SpecializedUnit[]>([]);
  const [realWorldComparisons, setRealWorldComparisons] = useState<RealWorldComparison[]>([]);
  const [volumeCategories, setVolumeCategories] = useState<VolumeCategory[]>([]);

  const formatNumber = useCallback((value: number, decimals: number = precision): string => {
    if (inputFormat === INPUT_FORMAT.FRACTION && value < 1 && value > 0) {
      // Simple fraction approximation for small values
      const denominator = Math.pow(10, decimals);
      const numerator = Math.round(value * denominator);
      return `${numerator}/${denominator}`;
    } else {
      return value.toFixed(decimals);
    }
  }, [precision, inputFormat]);

  const getSpecializedUnits = useCallback((totalLiters: number): SpecializedUnit[] => {
    return [
      {
        label: 'Barrels (Oil)',
        value: totalLiters / 158.987,
        unit: 'bbl'
      },
      {
        label: 'Cubic Inches',
        value: totalLiters * 61.0237,
        unit: 'in³'
      },
      {
        label: 'Cubic Feet',
        value: totalLiters / 28.3168,
        unit: 'ft³'
      },
      {
        label: 'Hogsheads',
        value: totalLiters / 238.481,
        unit: 'hhd'
      }
    ];
  }, []);

  const getRealWorldComparisons = useCallback((totalLiters: number): RealWorldComparison[] => {
    let allComparisons: RealWorldComparison[] = [];
    
    if (totalLiters <= 0.001) {
      allComparisons = [
        { label: 'Raindrop', range: '0.05–0.2 mL', icon: '💧' },
        { label: 'Teardrop', range: '~0.5 mL', icon: '😢' },
        { label: 'Medicine Dropper', range: '0.05 mL per drop', icon: '💉' }
      ];
    } else if (totalLiters <= 0.01) {
      allComparisons = [
        { label: 'Teaspoon', range: '~5 mL', icon: '🥄' },
        { label: 'Medicine Dose', range: '5–15 mL', icon: '💊' },
        { label: 'Small Perfume Sample', range: '1–2 mL', icon: '🌸' },
        { label: 'Eye Drop', range: '0.03–0.05 mL', icon: '👁️' }
      ];
    } else if (totalLiters <= 0.1) {
      allComparisons = [
        { label: 'Tablespoon', range: '~15 mL', icon: '🥄' },
        { label: 'Shot Glass', range: '30–45 mL', icon: '🥃' },
        { label: 'Espresso Cup', range: '30 mL', icon: '☕' },
        { label: 'Small Juice Box', range: '125–200 mL', icon: '🧃' },
        { label: 'Wine Glass', range: '150 mL', icon: '🍷' }
      ];
    } else if (totalLiters <= 1) {
      allComparisons = [
        { label: 'Coffee Mug', range: '250–350 mL', icon: '☕' },
        { label: 'Soda Can', range: '330–355 mL', icon: '🥤' },
        { label: 'Water Bottle', range: '500 mL', icon: '💧' },
        { label: 'Beer Bottle', range: '330–500 mL', icon: '🍺' },
        { label: 'Pint Glass', range: '473–568 mL', icon: '🍺' }
      ];
    } else if (totalLiters <= 10) {
      allComparisons = [
        { label: 'Large Water Bottle', range: '1–1.5 L', icon: '🍼' },
        { label: 'Wine Bottle', range: '750 mL', icon: '🍷' },
        { label: 'Milk Jug', range: '1–4 L', icon: '🥛' },
        { label: 'Large Soda Bottle', range: '2 L', icon: '🥤' },
        { label: 'Cooking Pot', range: '3–8 L', icon: '🍲' }
      ];
    } else if (totalLiters <= 100) {
      allComparisons = [
        { label: 'Kitchen Sink', range: '15–25 L', icon: '🚿' },
        { label: 'Bucket', range: '10–20 L', icon: '🪣' },
        { label: 'Aquarium (Small)', range: '40–80 L', icon: '🐠' },
        { label: 'Washing Machine Load', range: '40–60 L', icon: '👕' },
        { label: 'Bathtub (Half Full)', range: '80–150 L', icon: '🛁' }
      ];
    } else if (totalLiters <= 1000) {
      allComparisons = [
        { label: 'Bathtub (Full)', range: '300–400 L', icon: '🛁' },
        { label: 'Hot Water Tank', range: '150–300 L', icon: '🏠' },
        { label: 'Spa/Jacuzzi', range: '1000–1500 L', icon: '🧖‍♀️' },
        { label: 'Large Aquarium', range: '200–1000 L', icon: '🐟' },
        { label: 'Rain Barrel', range: '200–400 L', icon: '🌧️' }
      ];
    } else if (totalLiters <= 10000) {
      allComparisons = [
        { label: 'Small Swimming Pool', range: '20000–50000 L', icon: '🏊‍♂️' },
        { label: 'Car Fuel Tank', range: '40–80 L', icon: '⛽' },
        { label: 'Water Storage Tank', range: '1000–10000 L', icon: '🏭' },
        { label: 'Large Spa', range: '2000–5000 L', icon: '♨️' },
        { label: 'Fire Truck Tank', range: '1000–4000 L', icon: '🚒' }
      ];
    } else if (totalLiters <= 100000) {
      allComparisons = [
        { label: 'Olympic Swimming Pool', range: '2500000 L', icon: '🏊‍♀️' },
        { label: 'Large Water Truck', range: '20000–40000 L', icon: '🚛' },
        { label: 'Residential Pool', range: '40000–100000 L', icon: '🏊' },
        { label: 'Water Tower (Small)', range: '500000–2000000 L', icon: '🗼' },
        { label: 'Tanker Truck', range: '20000–50000 L', icon: '🚚' }
      ];
    } else {
      allComparisons = [
        { label: 'Lake (Small)', range: '1000000000+ L', icon: '🏞️' },
        { label: 'Oil Tanker Ship', range: '300000000+ L', icon: '🚢' },
        { label: 'Water Reservoir', range: '100000000+ L', icon: '🏔️' },
        { label: 'Large Water Tower', range: '5000000+ L', icon: '🗼' },
        { label: 'Dam Reservoir', range: '10000000000+ L', icon: '🌊' }
      ];
    }
    
    // Randomly shuffle and return only 3 comparisons
    const shuffled = [...allComparisons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  const getVolumeCategories = useCallback((totalLiters: number): VolumeCategory[] => {
    const categories = [
      {
        label: 'Drops & Doses',
        description: 'Medicine, perfume, eye drops, small measurements',
        isHighlighted: totalLiters < 0.001
      },
      {
        label: 'Cooking Measures',
        description: 'Teaspoons, tablespoons, small cooking amounts',
        isHighlighted: totalLiters >= 0.001 && totalLiters < 0.1
      },
      {
        label: 'Beverage Servings',  
        description: 'Cups, glasses, cans, bottles',
        isHighlighted: totalLiters >= 0.1 && totalLiters < 1
      },
      {
        label: 'Kitchen Containers',
        description: 'Large bottles, jugs, small pots',
        isHighlighted: totalLiters >= 1 && totalLiters < 10
      },
      {
        label: 'Household Containers',
        description: 'Buckets, sinks, appliance capacities',
        isHighlighted: totalLiters >= 10 && totalLiters < 1000
      },
      {
        label: 'Large Containers',
        description: 'Tanks, pools, industrial containers',
        isHighlighted: totalLiters >= 1000 && totalLiters < 100000
      },
      {
        label: 'Industrial Scale',
        description: 'Reservoirs, large tanks, natural bodies',
        isHighlighted: totalLiters >= 100000
      }
    ];
    
    return categories;
  }, []);

  const convertVolume = useCallback(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      setConversions(null);
      setSpecializedUnits([]);
      setRealWorldComparisons([]);
      setVolumeCategories([]);
      return;
    }

    // Convert input to liters first
    const totalLiters = value * VOLUME_CONVERSIONS[inputUnit];

    // Convert to all other units
    const result: VolumeConversions = {
      [VOLUME_UNIT.LITERS]: totalLiters / VOLUME_CONVERSIONS[VOLUME_UNIT.LITERS],
      [VOLUME_UNIT.MILLILITERS]: totalLiters / VOLUME_CONVERSIONS[VOLUME_UNIT.MILLILITERS],
      [VOLUME_UNIT.CUBIC_METERS]: totalLiters / VOLUME_CONVERSIONS[VOLUME_UNIT.CUBIC_METERS],
      [VOLUME_UNIT.GALLONS_US]: totalLiters / VOLUME_CONVERSIONS[VOLUME_UNIT.GALLONS_US],
      [VOLUME_UNIT.GALLONS_UK]: totalLiters / VOLUME_CONVERSIONS[VOLUME_UNIT.GALLONS_UK],
      [VOLUME_UNIT.QUARTS_US]: totalLiters / VOLUME_CONVERSIONS[VOLUME_UNIT.QUARTS_US],
      [VOLUME_UNIT.PINTS_US]: totalLiters / VOLUME_CONVERSIONS[VOLUME_UNIT.PINTS_US],
      [VOLUME_UNIT.CUPS_US]: totalLiters / VOLUME_CONVERSIONS[VOLUME_UNIT.CUPS_US],
      [VOLUME_UNIT.FLUID_OUNCES_US]: totalLiters / VOLUME_CONVERSIONS[VOLUME_UNIT.FLUID_OUNCES_US],
      [VOLUME_UNIT.TABLESPOONS]: totalLiters / VOLUME_CONVERSIONS[VOLUME_UNIT.TABLESPOONS],
      [VOLUME_UNIT.TEASPOONS]: totalLiters / VOLUME_CONVERSIONS[VOLUME_UNIT.TEASPOONS],
    };

    setConversions(result);
    setSpecializedUnits(getSpecializedUnits(totalLiters));
    setRealWorldComparisons(getRealWorldComparisons(totalLiters));
    setVolumeCategories(getVolumeCategories(totalLiters));
  }, [inputValue, inputUnit, getSpecializedUnits, getRealWorldComparisons, getVolumeCategories]);

  // Auto-convert when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(convertVolume, 300);
    return () => clearTimeout(timeoutId);
  }, [convertVolume]);

  const handleQuickSelect = (value: number, unit: VOLUME_UNIT) => {
    setInputValue(value.toString());
    setInputUnit(unit);
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
  };

  const getVisualScale = (): number => {
    if (!conversions) return 0;
    const totalL = conversions[VOLUME_UNIT.LITERS];
    if (totalL <= 0) return 0;
    if (totalL >= 100) return 100;
    return Math.min(100, (totalL / 100) * 100);
  };

  return (
    <ToolLayout toolCategory={ToolNameLists.VolumeConverter}>
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Convert liters, gallons, cups, milliliters, and more with our comprehensive volume converter. Perfect for cooking, chemistry, engineering, and everyday measurements. Get instant conversions with high precision calculations.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Volume</h2>
            
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

            {/* Volume Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume ({inputUnit})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="1"
                  className="w-full shadow-sm px-3 py-2 pr-24 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value as VOLUME_UNIT)}
                  className="absolute right-1 top-1 bottom-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-500 text-xs"
                >
                  {Object.values(VOLUME_UNIT).map((unit) => (
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
              <div className="grid grid-cols-2 gap-2">
                {QUICK_SELECT_VALUES.map((quick) => (
                  <button
                    key={quick.label}
                    onClick={() => handleQuickSelect(quick.value, quick.unit)}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-orange-300 text-gray-700 rounded-md transition-colors"
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
                <p>Enter a volume value to see conversions</p>
              </div>
            )}

            {conversions && (
              <div className="space-y-4">
                {/* Main Conversions */}
                {Object.entries(conversions).map(([unit, value]) => (
                  <div key={unit} className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 capitalize">
                        {unit === VOLUME_UNIT.LITERS ? 'Liters' :
                         unit === VOLUME_UNIT.MILLILITERS ? 'Milliliters' :
                         unit === VOLUME_UNIT.CUBIC_METERS ? 'Cubic Meters' :
                         unit === VOLUME_UNIT.GALLONS_US ? 'Gallons (US)' :
                         unit === VOLUME_UNIT.GALLONS_UK ? 'Gallons (UK)' :
                         unit === VOLUME_UNIT.QUARTS_US ? 'Quarts (US)' :
                         unit === VOLUME_UNIT.PINTS_US ? 'Pints (US)' :
                         unit === VOLUME_UNIT.CUPS_US ? 'Cups (US)' :
                         unit === VOLUME_UNIT.FLUID_OUNCES_US ? 'Fluid Ounces (US)' :
                         unit === VOLUME_UNIT.TABLESPOONS ? 'Tablespoons' :
                         unit === VOLUME_UNIT.TEASPOONS ? 'Teaspoons' : unit} ({unit})
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatNumber(value)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(formatNumber(value))}
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
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Specialized Units</h3>
                    {specializedUnits.map((unit, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                        <div className="flex-1">
                          <div className="text-xs text-gray-600">{unit.label} ({unit.unit})</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {formatNumber(unit.value)}
                          </div>
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

          {/* Volume Context Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Volume Context</h2>
            
            {/* Visual Scale */}
            {conversions && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Visual Scale</h3>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-300" 
                    style={{ width: `${getVisualScale()}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  Relative to 100 liters ({formatNumber(conversions[VOLUME_UNIT.LITERS] / 100 * 100)}%)
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

            {/* Volume Categories */}
            {volumeCategories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Volume Categories</h3>
                {volumeCategories.map((category, index) => (
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

        {/* Usage Information */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use This Tool</h3>
          <p className="text-gray-700 mb-4">
            The Professional Volume Converter makes it easy to switch between liters, gallons, cups, milliliters, and more. Enter any positive number in the input field, then pick your starting unit from the dropdown. Use the quick select buttons for common values like one cup or one liter. You can also adjust the precision to control how many decimal places you see.
          </p>

          <p className="text-gray-700 mb-4">
            All conversions appear in real time as you type. You can see how one unit compares to others instantly. The tool includes specialized units like oil barrels for industrial applications and cubic measurements for scientific work. To make results easier to grasp, the tool adds real-world examples that show what each volume feels like in daily life. Copy any result directly to your clipboard for quick sharing or calculations.
          </p>

          <h3>Volume Conversion Facts</h3>
          <ol className="list-decimal list-outside space-y-3 text-gray-700 mb-6 pl-5">
            <li>
              A <strong>liter</strong> is the base unit of volume in the metric system. Originally defined as the volume of one kilogram of water at maximum density, it&apos;s now defined as exactly one cubic decimeter (1000 cm³). The symbol &ldquo;L&rdquo; is preferred to avoid confusion with the number &ldquo;1&rdquo;.
            </li>
            <li>
              A <strong>milliliter</strong> equals 1/1000 of a liter (0.001 L) and is exactly equivalent to one cubic centimeter (1 cm³). It&apos;s the standard unit for small volume measurements in medicine, cooking, and laboratory work.
            </li>
            <li>
              A <strong>cubic meter</strong> equals 1,000 liters and is the SI unit for volume. It represents the volume of a cube with sides of exactly one meter. It&apos;s used for large-scale measurements like room volumes, water flow, and industrial capacities.
            </li>
            <li>
              A <strong>gallon (US)</strong> equals exactly 231 cubic inches or 3.785412 liters. It evolved from the British wine gallon and differs from the imperial gallon. The US gallon is divided into 4 quarts, 8 pints, or 128 fluid ounces.
            </li>
            <li>
              A <strong>gallon (UK/Imperial)</strong> equals exactly 4.54609 liters, making it about 20% larger than the US gallon. It&apos;s based on the volume of 10 pounds of water at standard temperature. Still used in the UK for fuel and some other liquids.
            </li>
            <li>
              A <strong>quart (US)</strong> equals exactly 1/4 of a US gallon or 0.946353 liters. The name comes from &ldquo;quarter gallon.&rdquo; It&apos;s commonly used for measuring milk, oil, and other liquids in cooking and automotive applications.
            </li>
            <li>
              A <strong>pint (US)</strong> equals exactly 1/2 of a US quart or 473.176 milliliters. The liquid pint differs from the dry pint (used for berries, etc.), which equals 550.6 mL. &ldquo;A pint&apos;s a pound the world around&rdquo; is approximately true for water.
            </li>
            <li>
              A <strong>cup (US)</strong> equals exactly 1/2 of a US pint or 236.588 milliliters (about 237 mL). It&apos;s the standard measuring cup in American recipes. The metric cup used in some countries equals exactly 250 mL.
            </li>
            <li>
              A <strong>fluid ounce (US)</strong> equals exactly 1/8 of a US cup or 29.5735 milliliters. Unlike the avoirdupois ounce (weight), the fluid ounce measures volume. The imperial fluid ounce is slightly larger at 28.413 mL.
            </li>
            <li>
              A <strong>tablespoon (US)</strong> equals exactly 1/2 fluid ounce or 14.7868 milliliters (about 15 mL). It&apos;s abbreviated as &ldquo;tbsp&rdquo; or &ldquo;T&rdquo; in recipes. International recipes often use 15 mL as the standard tablespoon measure.
            </li>
            <li>
              A <strong>teaspoon (US)</strong> equals exactly 1/3 tablespoon or 4.92892 milliliters (about 5 mL). It&apos;s abbreviated as &ldquo;tsp&rdquo; or &ldquo;t&rdquo; in recipes. The metric teaspoon is exactly 5 mL, making conversions easier in international cooking.
            </li>
            <li>
              A <strong>barrel (oil)</strong> equals exactly 42 US gallons or 158.987 liters. This petroleum barrel became the standard for oil trading worldwide. It differs from other barrel sizes used for beer (31 gallons) and wine (31.5 gallons).
            </li>
          </ol>

          <h3>Cooking and Recipe Conversions</h3>
          <p>When converting recipes, remember that volume measurements for dry ingredients can vary significantly by how tightly packed they are. Professional baking often uses weight measurements for accuracy. Liquid measurements are more consistent across different measuring tools.</p>
          
          <h3>Metric vs Imperial Systems</h3>
          <p>Most of the world uses metric volumes (liters, milliliters), which are based on powers of 10. The United States uses customary units (gallons, cups, fluid ounces) derived from British imperial measurements, though with some differences in actual sizes.</p>
          
          <h3>Laboratory and Scientific Measurements</h3>
          <p>Scientific work typically uses milliliters and liters for precision. Laboratory glassware is calibrated to specific temperatures (usually 20°C) since liquid volume changes with temperature. For very small volumes, microliters (μL) are common.</p>
          
          <h3>Industrial and Commercial Applications</h3>
          <p>Different industries prefer different units: fuel is sold by gallons or liters, chemicals by liters or barrels, beverages by fluid ounces or milliliters. Understanding these preferences helps in professional communication and international trade.</p>
        </div>
      </div>
    </ToolLayout>
  );
}