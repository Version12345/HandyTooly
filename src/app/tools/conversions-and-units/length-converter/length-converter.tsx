'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

enum LENGTH_UNIT {
    METERS = 'm',
    CENTIMETERS = 'cm',
    MILLIMETERS = 'mm',
    KILOMETERS = 'km',
    INCHES = 'in',
    FEET = 'ft',
    YARDS = 'yd',
    MILES = 'mi'
}

interface LengthConversions {
  [LENGTH_UNIT.METERS]: number;
  [LENGTH_UNIT.CENTIMETERS]: number;
  [LENGTH_UNIT.MILLIMETERS]: number;
  [LENGTH_UNIT.KILOMETERS]: number;
  [LENGTH_UNIT.INCHES]: number;
  [LENGTH_UNIT.FEET]: number;
  [LENGTH_UNIT.YARDS]: number;
  [LENGTH_UNIT.MILES]: number;
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

interface LengthCategory {
  label: string;
  description: string;
  isHighlighted?: boolean;
}

// Base conversion rates to meters
const LENGTH_CONVERSIONS = {
  [LENGTH_UNIT.METERS]: 1,
  [LENGTH_UNIT.CENTIMETERS]: 0.01,
  [LENGTH_UNIT.MILLIMETERS]: 0.001,
  [LENGTH_UNIT.KILOMETERS]: 1000,
  [LENGTH_UNIT.INCHES]: 0.0254,
  [LENGTH_UNIT.FEET]: 0.3048,
  [LENGTH_UNIT.YARDS]: 0.9144,
  [LENGTH_UNIT.MILES]: 1609.344,
};

const QUICK_SELECT_VALUES = [
    { label: '1 cm', value: 1, unit: LENGTH_UNIT.CENTIMETERS },
    { label: '1 inch', value: 1, unit: LENGTH_UNIT.INCHES },
    { label: '1 foot', value: 1, unit: LENGTH_UNIT.FEET },
    { label: '1 yard', value: 1, unit: LENGTH_UNIT.YARDS },
    { label: '1 meter', value: 1, unit: LENGTH_UNIT.METERS },
    { label: '5 feet', value: 5, unit: LENGTH_UNIT.FEET },
    { label: '10 feet', value: 10, unit: LENGTH_UNIT.FEET },
    { label: '100 m', value: 100, unit: LENGTH_UNIT.METERS },
    { label: '1 km', value: 1, unit: LENGTH_UNIT.KILOMETERS },
    { label: '1 mile', value: 1, unit: LENGTH_UNIT.MILES },
    { label: '10 km', value: 10, unit: LENGTH_UNIT.KILOMETERS },
    { label: '100 km', value: 100, unit: LENGTH_UNIT.KILOMETERS }
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

export function LengthConverter() {
  const [inputValue, setInputValue] = useState('10');
  const [inputUnit, setInputUnit] = useState<LENGTH_UNIT>(LENGTH_UNIT.METERS);
  const [precision, setPrecision] = useState(4);
  const [inputFormat, setInputFormat] = useState(INPUT_FORMAT.DECIMAL);
  const [conversions, setConversions] = useState<LengthConversions | null>(null);
  const [specializedUnits, setSpecializedUnits] = useState<SpecializedUnit[]>([]);
  const [realWorldComparisons, setRealWorldComparisons] = useState<RealWorldComparison[]>([]);
  const [lengthCategories, setLengthCategories] = useState<LengthCategory[]>([]);

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

  const getSpecializedUnits = useCallback((totalMeters: number): SpecializedUnit[] => {
    return [
      {
        label: 'Nautical Miles',
        value: totalMeters / 1852,
        unit: 'nmi'
      },
      {
        label: 'Light Years',
        value: totalMeters / 9.461e15,
        unit: 'ly'
      },
      {
        label: 'Astronomical Units',
        value: totalMeters / 1.496e11,
        unit: 'AU'
      },
      {
        label: 'Fathoms',
        value: totalMeters / 1.8288,
        unit: 'ftm'
      }
    ];
  }, []);

  const getRealWorldComparisons = useCallback((totalMeters: number): RealWorldComparison[] => {
    let allComparisons: RealWorldComparison[] = [];
    
    if (totalMeters <= 0.001) {
      allComparisons = [
        { label: 'Human Hair Width', range: '0.05–0.1 mm', icon: '💇' },
        { label: 'Paper Thickness', range: '0.07–0.18 mm', icon: '📄' },
        { label: 'Red Blood Cell', range: '0.006–0.008 mm', icon: '🔴' }
      ];
    } else if (totalMeters <= 0.01) {
      allComparisons = [
        { label: 'Grain of Rice', range: '5–6 mm', icon: '🌾' },
        { label: 'Pencil Lead', range: '0.5–2 mm', icon: '✏️' },
        { label: 'Ant', range: '1–5 mm', icon: '🐜' },
        { label: 'Fingernail', range: '3–10 mm', icon: '💅' }
      ];
    } else if (totalMeters <= 0.1) {
      allComparisons = [
        { label: 'Paperclip', range: '~3 cm', icon: '📎' },
        { label: 'Golf Ball', range: '4.3 cm diameter', icon: '⛳' },
        { label: 'Credit Card Width', range: '5.4 cm', icon: '💳' },
        { label: 'Tennis Ball', range: '6.7 cm diameter', icon: '🎾' },
        { label: 'Smartphone Width', range: '7–8 cm', icon: '📱' }
      ];
    } else if (totalMeters <= 1) {
      allComparisons = [
        { label: 'Smartphone Length', range: '13–16 cm', icon: '📱' },
        { label: 'Foot (Average)', range: '24–30 cm', icon: '👣' },
        { label: 'Laptop Screen', range: '30–40 cm', icon: '💻' },
        { label: 'Baseball Bat', range: '60–90 cm', icon: '⚾' },
        { label: 'Guitar', range: '95–105 cm', icon: '🎸' }
      ];
    } else if (totalMeters <= 10) {
      allComparisons = [
        { label: 'Adult Human Height', range: '1.5–2 m', icon: '🧑' },
        { label: 'Door Height', range: '2–2.1 m', icon: '🚪' },
        { label: 'Basketball Hoop', range: '3.05 m', icon: '🏀' },
        { label: 'Giraffe Height', range: '4.5–6 m', icon: '🦒' },
        { label: 'School Bus Length', range: '8–12 m', icon: '🚌' }
      ];
    } else if (totalMeters <= 100) {
      allComparisons = [
        { label: 'Tennis Court', range: '23.8 m long', icon: '🎾' },
        { label: 'Blue Whale', range: '25–30 m', icon: '🐋' },
        { label: 'Basketball Court', range: '28 m long', icon: '🏀' },
        { label: 'Football Field Width', range: '53 m', icon: '🏈' },
        { label: 'Olympic Pool', range: '50 m long', icon: '🏊‍♂️' }
      ];
    } else if (totalMeters <= 1000) {
      allComparisons = [
        { label: 'Football Field', range: '100 m long', icon: '⚽' },
        { label: 'Statue of Liberty', range: '93 m tall', icon: '🗽' },
        { label: 'Eiffel Tower', range: '330 m tall', icon: '🗼' },
        { label: 'Empire State Building', range: '443 m tall', icon: '🏢' },
        { label: 'Cruise Ship', range: '300–400 m', icon: '🚢' }
      ];
    } else if (totalMeters <= 10000) {
      allComparisons = [
        { label: 'Golden Gate Bridge', range: '2.7 km long', icon: '🌉' },
        { label: 'Mount Fuji Height', range: '3.8 km', icon: '🗻' },
        { label: 'Burj Khalifa', range: '0.83 km tall', icon: '🏗️' },
        { label: 'Brooklyn Bridge', range: '1.8 km long', icon: '🌉' },
        { label: 'Central Park Length', range: '4 km', icon: '🌳' }
      ];
    } else if (totalMeters <= 100000) {
      allComparisons = [
        { label: 'Marathon Distance', range: '42.2 km', icon: '🏃‍♂️' },
        { label: 'Mount Everest', range: '8.8 km tall', icon: '🏔️' },
        { label: 'English Channel', range: '34 km wide', icon: '🌊' },
        { label: 'Manhattan Length', range: '21 km', icon: '🏙️' },
        { label: 'Commercial Flight Altitude', range: '10–12 km', icon: '✈️' }
      ];
    } else {
      allComparisons = [
        { label: 'Earth Diameter', range: '12,756 km', icon: '🌍' },
        { label: 'Great Wall of China', range: '21,000+ km', icon: '🏯' },
        { label: 'Moon Distance', range: '384,400 km', icon: '🌙' },
        { label: 'Earth Circumference', range: '40,075 km', icon: '🌐' },
        { label: 'International Space Station', range: '408 km altitude', icon: '🚀' }
      ];
    }
    
    // Randomly shuffle and return only 3 comparisons
    const shuffled = [...allComparisons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  const getLengthCategories = useCallback((totalMeters: number): LengthCategory[] => {
    const categories = [
      {
        label: 'Microscopic',
        description: 'Hair width, cell size, microscopic measurements',
        isHighlighted: totalMeters < 0.001
      },
      {
        label: 'Small Objects',
        description: 'Coins, insects, jewelry, small parts',
        isHighlighted: totalMeters >= 0.001 && totalMeters < 0.1
      },
      {
        label: 'Personal Items',  
        description: 'Phones, books, tools, household objects',
        isHighlighted: totalMeters >= 0.1 && totalMeters < 1
      },
      {
        label: 'Human Scale',
        description: 'People, furniture, rooms, vehicles',
        isHighlighted: totalMeters >= 1 && totalMeters < 10
      },
      {
        label: 'Building Scale',
        description: 'Houses, sports fields, city blocks',
        isHighlighted: totalMeters >= 10 && totalMeters < 1000
      },
      {
        label: 'City Scale',
        description: 'Neighborhoods, bridges, mountains',
        isHighlighted: totalMeters >= 1000 && totalMeters < 100000
      },
      {
        label: 'Geographic Scale',
        description: 'Countries, continents, planetary distances',
        isHighlighted: totalMeters >= 100000
      }
    ];
    
    return categories;
  }, []);

  const convertLength = useCallback(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      setConversions(null);
      setSpecializedUnits([]);
      setRealWorldComparisons([]);
      setLengthCategories([]);
      return;
    }

    // Convert input to meters first
    const totalMeters = value * LENGTH_CONVERSIONS[inputUnit];

    // Convert to all other units
    const result: LengthConversions = {
      [LENGTH_UNIT.METERS]: totalMeters / LENGTH_CONVERSIONS[LENGTH_UNIT.METERS],
      [LENGTH_UNIT.CENTIMETERS]: totalMeters / LENGTH_CONVERSIONS[LENGTH_UNIT.CENTIMETERS],
      [LENGTH_UNIT.MILLIMETERS]: totalMeters / LENGTH_CONVERSIONS[LENGTH_UNIT.MILLIMETERS],
      [LENGTH_UNIT.KILOMETERS]: totalMeters / LENGTH_CONVERSIONS[LENGTH_UNIT.KILOMETERS],
      [LENGTH_UNIT.INCHES]: totalMeters / LENGTH_CONVERSIONS[LENGTH_UNIT.INCHES],
      [LENGTH_UNIT.FEET]: totalMeters / LENGTH_CONVERSIONS[LENGTH_UNIT.FEET],
      [LENGTH_UNIT.YARDS]: totalMeters / LENGTH_CONVERSIONS[LENGTH_UNIT.YARDS],
      [LENGTH_UNIT.MILES]: totalMeters / LENGTH_CONVERSIONS[LENGTH_UNIT.MILES],
    };

    setConversions(result);
    setSpecializedUnits(getSpecializedUnits(totalMeters));
    setRealWorldComparisons(getRealWorldComparisons(totalMeters));
    setLengthCategories(getLengthCategories(totalMeters));
  }, [inputValue, inputUnit, getSpecializedUnits, getRealWorldComparisons, getLengthCategories]);

  // Auto-convert when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(convertLength, 300);
    return () => clearTimeout(timeoutId);
  }, [convertLength]);

  const handleQuickSelect = (value: number, unit: LENGTH_UNIT) => {
    setInputValue(value.toString());
    setInputUnit(unit);
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
  };

  const getVisualScale = (): number => {
    if (!conversions) return 0;
    const totalM = conversions[LENGTH_UNIT.METERS];
    if (totalM <= 0) return 0;
    if (totalM >= 100) return 100;
    return Math.min(100, (totalM / 100) * 100);
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.LengthConverter}
      secondaryToolDescription="Perfect for construction, travel, sports, and scientific measurements. Get instant conversions with high precision calculations."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Length</h2>
            
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

            {/* Length Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length ({inputUnit})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="10"
                  className="w-full shadow-sm px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <select
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value as LENGTH_UNIT)}
                  className="absolute right-1 top-1 bottom-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-500"
                >
                  {Object.values(LENGTH_UNIT).map((unit) => (
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
                <p>Enter a length value to see conversions</p>
              </div>
            )}

            {conversions && (
              <div className="space-y-4">
                {/* Main Conversions */}
                {Object.entries(conversions).map(([unit, value]) => (
                  <div key={unit} className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 capitalize">
                        {unit === LENGTH_UNIT.METERS ? 'Meters' :
                         unit === LENGTH_UNIT.CENTIMETERS ? 'Centimeters' :
                         unit === LENGTH_UNIT.MILLIMETERS ? 'Millimeters' :
                         unit === LENGTH_UNIT.KILOMETERS ? 'Kilometers' :
                         unit === LENGTH_UNIT.INCHES ? 'Inches' :
                         unit === LENGTH_UNIT.FEET ? 'Feet' :
                         unit === LENGTH_UNIT.YARDS ? 'Yards' :
                         unit === LENGTH_UNIT.MILES ? 'Miles' : unit} ({unit})
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

          {/* Length Context Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Length Context</h2>
            
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
                  Relative to 100 meters ({formatNumber(conversions[LENGTH_UNIT.METERS] / 100 * 100)}%)
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

            {/* Length Categories */}
            {lengthCategories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Length Categories</h3>
                {lengthCategories.map((category, index) => (
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
            The Professional Length Converter makes it easy to switch between meters, feet, inches, kilometers, miles, and more. Enter any positive number in the input field, then pick your starting unit from the dropdown. Use the quick select buttons for common values like one meter or one foot. You can also adjust the precision to control how many decimal places you see.
          </p>

          <p className="text-gray-700 mb-4">
            All conversions appear in real time as you type. You can see how one unit compares to others instantly. The tool includes specialized units like nautical miles for maritime navigation and light years for astronomical distances. To make results easier to grasp, the tool adds real-world examples that show what each length feels like in daily life. Copy any result directly to your clipboard for quick sharing or calculations.
          </p>

          <h3>Length Conversion Facts</h3>
          <ol className="list-decimal list-outside space-y-3 text-gray-700 mb-6 pl-5">
            <li>
              A <strong>meter</strong> is the base unit of length in the metric system. Originally defined as one ten-millionth of the distance from the equator to the North Pole, it&apos;s now defined as the distance light travels in a vacuum in 1/299,792,458 of a second.
            </li>
            <li>
              A <strong>centimeter</strong> equals 1/100 of a meter (0.01 m). The prefix &ldquo;centi&rdquo; comes from the Latin word for hundred. It&apos;s commonly used for measuring smaller objects and in medical contexts for body measurements.
            </li>
            <li>
              A <strong>millimeter</strong> equals 1/1000 of a meter (0.001 m). The prefix &ldquo;milli&rdquo; means thousand. It&apos;s used for precise measurements in engineering, manufacturing, and scientific applications.
            </li>
            <li>
              A <strong>kilometer</strong> equals 1,000 meters. The prefix &ldquo;kilo&rdquo; means thousand. It&apos;s the standard unit for measuring longer distances like city layouts, country sizes, and travel distances in most countries.
            </li>
            <li>
              An <strong>inch</strong> equals exactly 2.54 centimeters. Originally based on the width of a human thumb, it was standardized in 1959. It&apos;s still commonly used in the United States for everyday measurements and worldwide for screen sizes.
            </li>
            <li>
              A <strong>foot</strong> equals exactly 12 inches or 30.48 centimeters. Historically based on the length of a human foot, it varies across cultures but the international foot is now standardized. It&apos;s widely used for measuring height, room dimensions, and short distances.
            </li>
            <li>
              A <strong>yard</strong> equals exactly 3 feet or 36 inches (0.9144 meters). Originally defined as the distance from King Henry I&apos;s nose to the tip of his outstretched arm. It&apos;s commonly used in sports (American football fields) and fabric measurements.
            </li>
            <li>
              A <strong>mile</strong> equals exactly 5,280 feet or 1,609.344 meters. The word comes from the Roman &ldquo;mille passus&rdquo; meaning a thousand paces. It&apos;s still the primary unit for measuring longer distances in the United States and United Kingdom.
            </li>
            <li>
              A <strong>nautical mile</strong> equals exactly 1,852 meters, which is one minute of arc along a meridian of the Earth. It&apos;s used in maritime and aviation navigation because it relates directly to latitude and longitude coordinates.
            </li>
            <li>
              A <strong>light year</strong> is the distance light travels in one year: approximately 9.461 trillion kilometers. Despite its name suggesting time, it&apos;s a unit of distance used in astronomy to measure the vast distances between stars and galaxies.
            </li>
            <li>
              An <strong>Astronomical Unit (AU)</strong> is approximately 149.6 million kilometers - the average distance between Earth and the Sun. It&apos;s used to measure distances within our solar system, making planetary distances more manageable to express.
            </li>
            <li>
              A <strong>fathom</strong> equals exactly 6 feet or 1.8288 meters. Originally defined as the span of a person&apos;s outstretched arms, it&apos;s traditionally used in maritime contexts to measure water depth and rope lengths.
            </li>
          </ol>

          <h3>Metric vs Imperial Systems</h3>
          <p>Most of the world uses the metric system (meters, centimeters, kilometers), which is based on powers of 10, making calculations easier. The United States primarily uses the imperial system (inches, feet, yards, miles) for everyday measurements, though scientific and medical fields use metric units.</p>
          
          <h3>Precision in Measurements</h3>
          <p>For construction, measurements are typically accurate to the nearest millimeter or 1/16 inch. For scientific work, measurements can be much more precise. GPS systems can determine location to within a few meters, while laser interferometry can measure distances to nanometer precision.</p>
          
          <h3>Historical Context</h3>
          <p>Early length units were based on human body parts (foot, cubit, span) or walking distances (pace, league). This led to variations between regions. Modern standardization ensures that a meter in Japan equals a meter in Brazil, enabling global commerce and scientific collaboration.</p>
          
          <h3>Specialized Applications</h3>
          <p>Different fields prefer different units: architects use feet and inches or meters, pilots use nautical miles, astronomers use light years and parsecs, and manufacturers often use millimeters for precision. Understanding these preferences helps in professional communication.</p>
        </div>
      </div>
    </ToolLayout>
  );
}