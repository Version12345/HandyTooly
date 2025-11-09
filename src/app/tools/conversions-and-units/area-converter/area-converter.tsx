'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

enum AREA_UNIT {
    SQUARE_METERS = 'm²',
    SQUARE_CENTIMETERS = 'cm²',
    SQUARE_MILLIMETERS = 'mm²',
    SQUARE_KILOMETERS = 'km²',
    SQUARE_INCHES = 'in²',
    SQUARE_FEET = 'ft²',
    SQUARE_YARDS = 'yd²',
    SQUARE_MILES = 'mi²',
    ACRES = 'ac',
    HECTARES = 'ha'
}

interface AreaConversions {
  [AREA_UNIT.SQUARE_METERS]: number;
  [AREA_UNIT.SQUARE_CENTIMETERS]: number;
  [AREA_UNIT.SQUARE_MILLIMETERS]: number;
  [AREA_UNIT.SQUARE_KILOMETERS]: number;
  [AREA_UNIT.SQUARE_INCHES]: number;
  [AREA_UNIT.SQUARE_FEET]: number;
  [AREA_UNIT.SQUARE_YARDS]: number;
  [AREA_UNIT.SQUARE_MILES]: number;
  [AREA_UNIT.ACRES]: number;
  [AREA_UNIT.HECTARES]: number;
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

interface AreaCategory {
  label: string;
  description: string;
  isHighlighted?: boolean;
}

// Base conversion rates to square meters
const AREA_CONVERSIONS = {
  [AREA_UNIT.SQUARE_METERS]: 1,
  [AREA_UNIT.SQUARE_CENTIMETERS]: 0.0001,
  [AREA_UNIT.SQUARE_MILLIMETERS]: 0.000001,
  [AREA_UNIT.SQUARE_KILOMETERS]: 1000000,
  [AREA_UNIT.SQUARE_INCHES]: 0.00064516,
  [AREA_UNIT.SQUARE_FEET]: 0.092903,
  [AREA_UNIT.SQUARE_YARDS]: 0.836127,
  [AREA_UNIT.SQUARE_MILES]: 2589988.11,
  [AREA_UNIT.ACRES]: 4046.86,
  [AREA_UNIT.HECTARES]: 10000,
};

const QUICK_SELECT_VALUES = [
    { label: '1 cm²', value: 1, unit: AREA_UNIT.SQUARE_CENTIMETERS },
    { label: '1 in²', value: 1, unit: AREA_UNIT.SQUARE_INCHES },
    { label: '1 ft²', value: 1, unit: AREA_UNIT.SQUARE_FEET },
    { label: '1 yd²', value: 1, unit: AREA_UNIT.SQUARE_YARDS },
    { label: '1 m²', value: 1, unit: AREA_UNIT.SQUARE_METERS },
    { label: '100 m²', value: 100, unit: AREA_UNIT.SQUARE_METERS },
    { label: '1000 ft²', value: 1000, unit: AREA_UNIT.SQUARE_FEET },
    { label: '1 acre', value: 1, unit: AREA_UNIT.ACRES },
    { label: '1 hectare', value: 1, unit: AREA_UNIT.HECTARES },
    { label: '1 km²', value: 1, unit: AREA_UNIT.SQUARE_KILOMETERS },
    { label: '10 acres', value: 10, unit: AREA_UNIT.ACRES },
    { label: '1 mi²', value: 1, unit: AREA_UNIT.SQUARE_MILES }
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

export function AreaConverter() {
  const [inputValue, setInputValue] = useState('100');
  const [inputUnit, setInputUnit] = useState<AREA_UNIT>(AREA_UNIT.SQUARE_METERS);
  const [precision, setPrecision] = useState(4);
  const [inputFormat, setInputFormat] = useState(INPUT_FORMAT.DECIMAL);
  const [conversions, setConversions] = useState<AreaConversions | null>(null);
  const [specializedUnits, setSpecializedUnits] = useState<SpecializedUnit[]>([]);
  const [realWorldComparisons, setRealWorldComparisons] = useState<RealWorldComparison[]>([]);
  const [areaCategories, setAreaCategories] = useState<AreaCategory[]>([]);

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

  const getSpecializedUnits = useCallback((totalSquareMeters: number): SpecializedUnit[] => {
    return [
      {
        label: 'Football Fields (American)',
        value: totalSquareMeters / 5351.22,
        unit: 'fields'
      },
      {
        label: 'Soccer Fields (FIFA)',
        value: totalSquareMeters / 7140,
        unit: 'fields'
      },
      {
        label: 'Basketball Courts',
        value: totalSquareMeters / 420,
        unit: 'courts'
      },
      {
        label: 'Tennis Courts',
        value: totalSquareMeters / 260.87,
        unit: 'courts'
      }
    ];
  }, []);

  const getRealWorldComparisons = useCallback((totalSquareMeters: number): RealWorldComparison[] => {
    let allComparisons: RealWorldComparison[] = [];
    
    if (totalSquareMeters <= 0.001) {
      allComparisons = [
        { label: 'Postage Stamp', range: '4–6 cm²', icon: '📮' },
        { label: 'Coin (Quarter)', range: '~4.5 cm²', icon: '🪙' },
        { label: 'Fingernail', range: '1–2 cm²', icon: '💅' }
      ];
    } else if (totalSquareMeters <= 0.01) {
      allComparisons = [
        { label: 'Credit Card', range: '~46 cm²', icon: '💳' },
        { label: 'Smartphone Screen', range: '40–80 cm²', icon: '📱' },
        { label: 'Business Card', range: '~55 cm²', icon: '💼' },
        { label: 'Playing Card', range: '~35 cm²', icon: '🃏' }
      ];
    } else if (totalSquareMeters <= 1) {
      allComparisons = [
        { label: 'Sheet of Paper (A4)', range: '624 cm²', icon: '📄' },
        { label: 'iPad Screen', range: '300–400 cm²', icon: '📱' },
        { label: 'Computer Monitor (24")', range: '2000–2500 cm²', icon: '🖥️' },
        { label: 'Laptop Screen (15")', range: '700–900 cm²', icon: '💻' },
        { label: 'Pizza (Large)', range: '800–1000 cm²', icon: '🍕' }
      ];
    } else if (totalSquareMeters <= 10) {
      allComparisons = [
        { label: 'Parking Space', range: '12–15 m²', icon: '🅿️' },
        { label: 'Small Bedroom', range: '9–12 m²', icon: '🛏️' },
        { label: 'Office Cubicle', range: '6–9 m²', icon: '🏢' },
        { label: 'Bathroom', range: '3–6 m²', icon: '🚿' },
        { label: 'Walk-in Closet', range: '4–8 m²', icon: '👔' }
      ];
    } else if (totalSquareMeters <= 100) {
      allComparisons = [
        { label: 'Studio Apartment', range: '25–40 m²', icon: '🏠' },
        { label: 'Living Room', range: '20–35 m²', icon: '🛋️' },
        { label: 'Hotel Room', range: '20–30 m²', icon: '🏨' },
        { label: 'Classroom', range: '50–70 m²', icon: '🏫' },
        { label: 'Two-Car Garage', range: '40–60 m²', icon: '🚗' }
      ];
    } else if (totalSquareMeters <= 1000) {
      allComparisons = [
        { label: 'Basketball Court', range: '420 m²', icon: '🏀' },
        { label: 'Tennis Court', range: '261 m²', icon: '🎾' },
        { label: 'Small House', range: '100–200 m²', icon: '🏡' },
        { label: 'Restaurant', range: '200–400 m²', icon: '🍽️' },
        { label: 'Retail Store', range: '300–800 m²', icon: '🛍️' }
      ];
    } else if (totalSquareMeters <= 10000) {
      allComparisons = [
        { label: 'Football Field (American)', range: '5351 m²', icon: '🏈' },
        { label: 'Soccer Field (FIFA)', range: '7140 m²', icon: '⚽' },
        { label: 'Large House', range: '300–500 m²', icon: '🏘️' },
        { label: 'Walmart Supercenter', range: '16000–20000 m²', icon: '🛒' },
        { label: 'City Block', range: '6000–10000 m²', icon: '🏙️' }
      ];
    } else if (totalSquareMeters <= 100000) {
      allComparisons = [
        { label: 'Shopping Mall', range: '20000–80000 m²', icon: '🛍️' },
        { label: 'Large Parking Lot', range: '10000–50000 m²', icon: '🅿️' },
        { label: 'City Park', range: '20000–100000 m²', icon: '🌳' },
        { label: 'Golf Course (9 holes)', range: '200000–400000 m²', icon: '⛳' },
        { label: 'Airport Terminal', range: '50000–200000 m²', icon: '✈️' }
      ];
    } else if (totalSquareMeters <= 10000000) {
      allComparisons = [
        { label: 'Central Park (NYC)', range: '3410000 m²', icon: '🌲' },
        { label: 'Golf Course (18 holes)', range: '600000–800000 m²', icon: '⛳' },
        { label: 'University Campus', range: '1000000–5000000 m²', icon: '🎓' },
        { label: 'Large Farm', range: '1000000–10000000 m²', icon: '🚜' },
        { label: 'Small Town', range: '5000000–20000000 m²', icon: '🏘️' }
      ];
    } else {
      allComparisons = [
        { label: 'Manhattan Island', range: '59500000 m²', icon: '🏙️' },
        { label: 'San Francisco', range: '121000000 m²', icon: '🌉' },
        { label: 'Large City', range: '100000000+ m²', icon: '🏙️' },
        { label: 'National Park', range: '1000000000+ m²', icon: '🏔️' },
        { label: 'Small Country', range: '10000000000+ m²', icon: '🗺️' }
      ];
    }
    
    // Randomly shuffle and return only 3 comparisons
    const shuffled = [...allComparisons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  const getAreaCategories = useCallback((totalSquareMeters: number): AreaCategory[] => {
    const categories = [
      {
        label: 'Tiny Objects',
        description: 'Coins, stamps, small items',
        isHighlighted: totalSquareMeters < 0.001
      },
      {
        label: 'Small Items',
        description: 'Cards, screens, documents',
        isHighlighted: totalSquareMeters >= 0.001 && totalSquareMeters < 1
      },
      {
        label: 'Room Features',  
        description: 'Furniture, appliances, small spaces',
        isHighlighted: totalSquareMeters >= 1 && totalSquareMeters < 100
      },
      {
        label: 'Rooms & Spaces',
        description: 'Bedrooms, offices, apartments',
        isHighlighted: totalSquareMeters >= 100 && totalSquareMeters < 1000
      },
      {
        label: 'Buildings',
        description: 'Houses, stores, sports facilities',
        isHighlighted: totalSquareMeters >= 1000 && totalSquareMeters < 100000
      },
      {
        label: 'Large Properties',
        description: 'Campuses, parks, golf courses',
        isHighlighted: totalSquareMeters >= 100000 && totalSquareMeters < 10000000
      },
      {
        label: 'Geographic Areas',
        description: 'Cities, regions, countries',
        isHighlighted: totalSquareMeters >= 10000000
      }
    ];
    
    return categories;
  }, []);

  const convertArea = useCallback(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      setConversions(null);
      setSpecializedUnits([]);
      setRealWorldComparisons([]);
      setAreaCategories([]);
      return;
    }

    // Convert input to square meters first
    const totalSquareMeters = value * AREA_CONVERSIONS[inputUnit];

    // Convert to all other units
    const result: AreaConversions = {
      [AREA_UNIT.SQUARE_METERS]: totalSquareMeters / AREA_CONVERSIONS[AREA_UNIT.SQUARE_METERS],
      [AREA_UNIT.SQUARE_CENTIMETERS]: totalSquareMeters / AREA_CONVERSIONS[AREA_UNIT.SQUARE_CENTIMETERS],
      [AREA_UNIT.SQUARE_MILLIMETERS]: totalSquareMeters / AREA_CONVERSIONS[AREA_UNIT.SQUARE_MILLIMETERS],
      [AREA_UNIT.SQUARE_KILOMETERS]: totalSquareMeters / AREA_CONVERSIONS[AREA_UNIT.SQUARE_KILOMETERS],
      [AREA_UNIT.SQUARE_INCHES]: totalSquareMeters / AREA_CONVERSIONS[AREA_UNIT.SQUARE_INCHES],
      [AREA_UNIT.SQUARE_FEET]: totalSquareMeters / AREA_CONVERSIONS[AREA_UNIT.SQUARE_FEET],
      [AREA_UNIT.SQUARE_YARDS]: totalSquareMeters / AREA_CONVERSIONS[AREA_UNIT.SQUARE_YARDS],
      [AREA_UNIT.SQUARE_MILES]: totalSquareMeters / AREA_CONVERSIONS[AREA_UNIT.SQUARE_MILES],
      [AREA_UNIT.ACRES]: totalSquareMeters / AREA_CONVERSIONS[AREA_UNIT.ACRES],
      [AREA_UNIT.HECTARES]: totalSquareMeters / AREA_CONVERSIONS[AREA_UNIT.HECTARES],
    };

    setConversions(result);
    setSpecializedUnits(getSpecializedUnits(totalSquareMeters));
    setRealWorldComparisons(getRealWorldComparisons(totalSquareMeters));
    setAreaCategories(getAreaCategories(totalSquareMeters));
  }, [inputValue, inputUnit, getSpecializedUnits, getRealWorldComparisons, getAreaCategories]);

  // Auto-convert when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(convertArea, 300);
    return () => clearTimeout(timeoutId);
  }, [convertArea]);

  const handleQuickSelect = (value: number, unit: AREA_UNIT) => {
    setInputValue(value.toString());
    setInputUnit(unit);
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
  };

  const getVisualScale = (): number => {
    if (!conversions) return 0;
    const totalSqM = conversions[AREA_UNIT.SQUARE_METERS];
    if (totalSqM <= 0) return 0;
    if (totalSqM >= 1000) return 100;
    return Math.min(100, (totalSqM / 1000) * 100);
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.AreaConverter}
      secondaryToolDescription="Perfect for real estate, gardening, construction, and land measurements. Get instant conversions with high precision calculations."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Area</h2>
            
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

            {/* Area Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area ({inputUnit})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="100"
                  className="w-full shadow-sm px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value as AREA_UNIT)}
                  className="absolute right-1 top-1 bottom-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-500 text-xs"
                >
                  {Object.values(AREA_UNIT).map((unit) => (
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
                <p>Enter an area value to see conversions</p>
              </div>
            )}

            {conversions && (
              <div className="space-y-4">
                {/* Main Conversions */}
                {Object.entries(conversions).map(([unit, value]) => (
                  <div key={unit} className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 capitalize">
                        {unit === AREA_UNIT.SQUARE_METERS ? 'Square Meters' :
                         unit === AREA_UNIT.SQUARE_CENTIMETERS ? 'Square Centimeters' :
                         unit === AREA_UNIT.SQUARE_MILLIMETERS ? 'Square Millimeters' :
                         unit === AREA_UNIT.SQUARE_KILOMETERS ? 'Square Kilometers' :
                         unit === AREA_UNIT.SQUARE_INCHES ? 'Square Inches' :
                         unit === AREA_UNIT.SQUARE_FEET ? 'Square Feet' :
                         unit === AREA_UNIT.SQUARE_YARDS ? 'Square Yards' :
                         unit === AREA_UNIT.SQUARE_MILES ? 'Square Miles' :
                         unit === AREA_UNIT.ACRES ? 'Acres' :
                         unit === AREA_UNIT.HECTARES ? 'Hectares' : unit} ({unit})
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

          {/* Area Context Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Area Context</h2>
            
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
                  Relative to 1000 m² ({formatNumber(conversions[AREA_UNIT.SQUARE_METERS] / 1000 * 100)}%)
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

            {/* Area Categories */}
            {areaCategories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Area Categories</h3>
                {areaCategories.map((category, index) => (
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
            The Professional Area Converter makes it easy to switch between square meters, square feet, acres, hectares, and more. Enter any positive number in the input field, then pick your starting unit from the dropdown. Use the quick select buttons for common values like one acre or 100 square meters. You can also adjust the precision to control how many decimal places you see.
          </p>

          <p className="text-gray-700 mb-4">
            All conversions appear in real time as you type. You can see how one unit compares to others instantly. The tool includes specialized units like football fields and basketball courts for sports applications. To make results easier to grasp, the tool adds real-world examples that show what each area feels like in daily life. Copy any result directly to your clipboard for quick sharing or calculations.
          </p>

          <h3>Area Conversion Facts</h3>
          <ol className="list-decimal list-outside space-y-3 text-gray-700 mb-6 pl-5">
            <li>
              A <strong>square meter</strong> (m²) is the SI unit of area, equal to the area of a square with sides of one meter. It&apos;s the standard unit for measuring floor space, land area, and surface area in most countries using the metric system.
            </li>
            <li>
              A <strong>square foot</strong> (ft²) equals the area of a square with sides of one foot (12 inches). It&apos;s commonly used in the United States for measuring room sizes, house areas, and smaller land plots. One square foot equals 0.092903 square meters.
            </li>
            <li>
              An <strong>acre</strong> equals exactly 43,560 square feet or 4,046.86 square meters. Originally defined as the area that could be plowed by one ox in one day, it&apos;s still widely used for measuring land, especially in agriculture and real estate in the United States.
            </li>
            <li>
              A <strong>hectare</strong> equals exactly 10,000 square meters or 2.471 acres. Used worldwide for measuring land area, especially in agriculture, forestry, and land planning. The name comes from the Greek word &ldquo;hecto&rdquo; (hundred) and &ldquo;are&rdquo; (a metric unit of area).
            </li>
            <li>
              A <strong>square kilometer</strong> (km²) equals one million square meters or 100 hectares. It&apos;s used for measuring large areas like cities, countries, lakes, and forests. One square kilometer equals about 0.386 square miles or 247.1 acres.
            </li>
            <li>
              A <strong>square mile</strong> (mi²) equals 640 acres or 2.59 square kilometers. Commonly used in the United States for measuring large land areas, cities, states, and countries. It represents the area of a square with sides of exactly one mile (5,280 feet).
            </li>
            <li>
              A <strong>square inch</strong> (in²) is used for small areas and equals 6.4516 square centimeters. It&apos;s commonly used in manufacturing, engineering, and anywhere precise small area measurements are needed, such as electronic components or jewelry.
            </li>
            <li>
              A <strong>square yard</strong> (yd²) equals 9 square feet or 0.836127 square meters. Often used for measuring carpeting, fabric, and medium-sized areas. One yard equals 3 feet, so a square yard is a 3×3 foot area.
            </li>
            <li>
              <strong>Square centimeters</strong> (cm²) and <strong>square millimeters</strong> (mm²) are used for very small areas. One cm² equals 100 mm² and is commonly used in science, medicine, and engineering for precise measurements of small surfaces.
            </li>
            <li>
              The <strong>are</strong> is a metric unit equal to 100 square meters, though it&apos;s rarely used today. The hectare (100 ares) is much more common. The are was part of the original metric system introduced in France in the 1790s.
            </li>
          </ol>

          <h3>Real Estate and Land Measurement</h3>
          <p>In real estate, areas are typically measured in square feet (US), square meters (most other countries), or acres/hectares for larger properties. Understanding these conversions helps when comparing international properties or working with different measurement systems.</p>
          
          <h3>Agricultural and Land Planning</h3>
          <p>Farmers and land planners use acres (US) or hectares (international) for field sizes, crop planning, and land management. Agricultural machinery and seed calculations are often based on these units, making accurate conversion essential for farming operations.</p>
          
          <h3>Construction and Architecture</h3>
          <p>Building plans use square feet or square meters for floor areas, room sizes, and material calculations. Architects and contractors need precise area measurements for cost estimation, material ordering, and building code compliance.</p>
          
          <h3>Sports and Recreation</h3>
          <p>Sports facilities have standardized areas - a football field is about 1.32 acres, a basketball court is 420 m², and a tennis court is 261 m². These references help visualize larger areas in familiar terms.</p>
        </div>
      </div>
    </ToolLayout>
  );
}