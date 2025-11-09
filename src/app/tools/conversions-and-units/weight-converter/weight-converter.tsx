'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

enum WEIGHT_UNIT {
    KILOGRAMS = 'kg',
    GRAMS = 'g',
    POUNDS = 'lbs',
    OUNCES = 'oz',
    STONES = 'st',
    TONNES = 't'
}

interface WeightConversions {
  [WEIGHT_UNIT.KILOGRAMS]: number;
  [WEIGHT_UNIT.GRAMS]: number;
  [WEIGHT_UNIT.POUNDS]: number;
  [WEIGHT_UNIT.OUNCES]: number;
  [WEIGHT_UNIT.STONES]: number;
  [WEIGHT_UNIT.TONNES]: number;
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

interface WeightCategory {
  label: string;
  description: string;
  isHighlighted?: boolean;
}

// Base conversion rates to grams
const WEIGHT_CONVERSIONS = {
  [WEIGHT_UNIT.GRAMS]: 1,
  [WEIGHT_UNIT.KILOGRAMS]: 1000,
  [WEIGHT_UNIT.POUNDS]: 453.592,
  [WEIGHT_UNIT.OUNCES]: 28.3495,
  [WEIGHT_UNIT.STONES]: 6350.29,
  [WEIGHT_UNIT.TONNES]: 1000000,
};

const QUICK_SELECT_VALUES = [
    { label: '1 oz', value: 1, unit: WEIGHT_UNIT.OUNCES },
    { label: '1 kg', value: 1, unit: WEIGHT_UNIT.KILOGRAMS },
    { label: '1 lb', value: 1, unit: WEIGHT_UNIT.POUNDS },
    { label: '5 lbs', value: 5, unit: WEIGHT_UNIT.POUNDS },
    { label: '10 kg', value: 10, unit: WEIGHT_UNIT.KILOGRAMS },
    { label: '25 lbs', value: 25, unit: WEIGHT_UNIT.POUNDS },
    { label: '50 kg', value: 50, unit: WEIGHT_UNIT.KILOGRAMS },
    { label: '100 lbs', value: 100, unit: WEIGHT_UNIT.POUNDS },
    { label: '200 lbs', value: 200, unit: WEIGHT_UNIT.POUNDS },
    { label: '1 stone', value: 1, unit: WEIGHT_UNIT.STONES },
    { label: '1 ton', value: 1, unit: WEIGHT_UNIT.TONNES },
    { label: '10 ton', value: 10, unit: WEIGHT_UNIT.TONNES }
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

export function WeightConverter() {
  const [inputValue, setInputValue] = useState('10');
  const [inputUnit, setInputUnit] = useState<WEIGHT_UNIT>(WEIGHT_UNIT.KILOGRAMS);
  const [precision, setPrecision] = useState(4);
  const [inputFormat, setInputFormat] = useState(INPUT_FORMAT.DECIMAL);
  const [conversions, setConversions] = useState<WeightConversions | null>(null);
  const [specializedUnits, setSpecializedUnits] = useState<SpecializedUnit[]>([]);
  const [realWorldComparisons, setRealWorldComparisons] = useState<RealWorldComparison[]>([]);
  const [weightCategories, setWeightCategories] = useState<WeightCategory[]>([]);

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

  const getSpecializedUnits = useCallback((totalGrams: number): SpecializedUnit[] => {
    return [
      {
        label: 'Troy Ounces',
        value: totalGrams / 31.1035,
        unit: 'oz t'
      },
      {
        label: 'Carats',
        value: totalGrams / 0.2,
        unit: 'ct'
      },
      {
        label: 'Grains',
        value: totalGrams / 0.06479891,
        unit: 'gr'
      },
      {
        label: 'Long Tons (UK)',
        value: totalGrams / 1016046.9088,
        unit: 'LT'
      }
    ];
  }, []);

  const getRealWorldComparisons = useCallback((totalGrams: number): RealWorldComparison[] => {
    const totalKg = totalGrams / 1000;
    let allComparisons: RealWorldComparison[] = [];
    
    if (totalKg <= 0.001) {
      allComparisons = [
        { label: 'Grain of Rice', range: '0.02–0.03 g', icon: '🌾' },
        { label: 'Mosquito', range: '0.002–0.003 g', icon: '🦟' },
        { label: 'Snowflake', range: '0.0001–0.003 g', icon: '❄️' }
      ];
    } else if (totalKg <= 0.01) {
      allComparisons = [
        { label: 'Paperclip', range: '~1 g', icon: '📎' },
        { label: 'Feather', range: '0.6–1 g', icon: '🪶' },
        { label: 'Penny (US)', range: '2.5 g', icon: '🪙' },
        { label: 'Hummingbird', range: '2–8 g', icon: '🐦' }
      ];
    } else if (totalKg <= 0.1) {
      allComparisons = [
        { label: 'Small Apple', range: '80–100 g', icon: '🍎' },
        { label: 'AA Battery', range: '23 g', icon: '🔋' },
        { label: 'Hamster', range: '20–50 g', icon: '🐹' },
        { label: 'Tennis Ball', range: '57 g', icon: '🎾' },
        { label: 'Large Egg', range: '50–70 g', icon: '🥚' }
      ];
    } else if (totalKg <= 1) {
      allComparisons = [
        { label: 'Smartphone', range: '150–200 g', icon: '📱' },
        { label: 'Baseball', range: '145 g', icon: '⚾' },
        { label: 'Guinea Pig', range: '700–1200 g', icon: '🐹' },
        { label: 'Loaf of Bread', range: '400–800 g', icon: '🍞' },
        { label: 'Hardcover Book', range: '300–700 g', icon: '📚' }
      ];
    } else if (totalKg <= 10) {
      allComparisons = [
        { label: 'Laptop', range: '1–3 kg', icon: '💻' },
        { label: 'Cat', range: '3–5 kg', icon: '🐱' },
        { label: 'Newborn Baby', range: '2.5–4 kg', icon: '👶' },
        { label: 'Bowling Ball', range: '3–7 kg', icon: '🎳' },
        { label: 'Turkey', range: '4–10 kg', icon: '🦃' }
      ];
    } else if (totalKg <= 100) {
      allComparisons = [
        { label: 'Medium Dog', range: '15–25 kg', icon: '🐕' },
        { label: 'Bicycle', range: '10–15 kg', icon: '🚴‍♂️' },
        { label: 'Microwave Oven', range: '12–20 kg', icon: '🔥' },
        { label: 'Kangaroo', range: '40–90 kg', icon: '🦘' },
        { label: 'Adult Human', range: '60–80 kg', icon: '🧑' }
      ];
    } else if (totalKg <= 1000) {
      allComparisons = [
        { label: 'Piano', range: '200–300 kg', icon: '🎹' },
        { label: 'Grizzly Bear', range: '130–300 kg', icon: '🐻' },
        { label: 'Race Horse', range: '380–500 kg', icon: '🐎' },
        { label: 'Small Car', range: '800–1200 kg', icon: '🚗' },
        { label: 'Polar Bear', range: '350–680 kg', icon: '🐻‍❄️' }
      ];
    } else if (totalKg <= 10000) {
      allComparisons = [
        { label: 'African Elephant', range: '4000–7000 kg', icon: '🐘' },
        { label: 'Truck', range: '3000–8000 kg', icon: '🚚' },
        { label: 'Triceratops', range: '6000–9000 kg', icon: '🦕' },
        { label: 'Tyrannosaurus Rex', range: '5000–7000 kg', icon: '🦖' },
        { label: 'School Bus', range: '6000–8000 kg', icon: '🚌' }
      ];
    } else if (totalKg <= 100000) {
      allComparisons = [
        { label: 'Blue Whale', range: '100000–200000 kg', icon: '🐋' },
        { label: 'Brachiosaurus', range: '30000–60000 kg', icon: '�' },
        { label: 'Fighter Jet', range: '15000–30000 kg', icon: '✈️' },
        { label: 'Large House', range: '80000–150000 kg', icon: '🏠' },
        { label: 'Train Car', range: '25000–80000 kg', icon: '🚃' }
      ];
    } else {
      allComparisons = [
        { label: 'Cruise Ship', range: '70000000+ kg', icon: '🚢' },
        { label: 'Argentinosaurus', range: '70000–100000 kg', icon: '🦕' },
        { label: 'Skyscraper', range: '200000000+ kg', icon: '🏢' },
        { label: 'Aircraft Carrier', range: '100000000+ kg', icon: '⚓' },
        { label: 'Space Shuttle', range: '2000000 kg', icon: '🚀' }
      ];
    }
    
    // Randomly shuffle and return only 3 comparisons
    const shuffled = [...allComparisons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  const getWeightCategories = useCallback((totalGrams: number): WeightCategory[] => {
    const totalKg = totalGrams / 1000;
    
    const categories = [
      {
        label: 'Light Weight',
        description: 'Feathers, small items, documents',
        isHighlighted: totalKg < 0.1
      },
      {
        label: 'Personal Items',
        description: 'Phones, books, small appliances',
        isHighlighted: totalKg >= 0.1 && totalKg < 2
      },
      {
        label: 'Medium Weight',  
        description: 'Personal items, small appliances, packages',
        isHighlighted: totalKg >= 2 && totalKg < 20
      },
      {
        label: 'Standard Shipping',
        description: 'Typical package weight limits',
        isHighlighted: totalKg >= 20 && totalKg < 50
      },
      {
        label: 'Heavy Items',
        description: 'Furniture, large appliances',
        isHighlighted: totalKg >= 50 && totalKg < 150
      },
      {
        label: 'Extra Heavy',
        description: 'Motorcycles, large safes, industrial equipment',
        isHighlighted: totalKg >= 150 && totalKg < 500
      },
      {
        label: 'Extremely Heavy',
        description: 'Small vehicles, heavy machinery, large livestock',
        isHighlighted: totalKg >= 500
      }
    ];
    
    return categories;
  }, []);

  const convertWeight = useCallback(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      setConversions(null);
      setSpecializedUnits([]);
      setRealWorldComparisons([]);
      setWeightCategories([]);
      return;
    }

    // Convert input to grams first
    const totalGrams = value * WEIGHT_CONVERSIONS[inputUnit];

    // Convert to all other units
    const result: WeightConversions = {
      [WEIGHT_UNIT.KILOGRAMS]: totalGrams / WEIGHT_CONVERSIONS[WEIGHT_UNIT.KILOGRAMS],
      [WEIGHT_UNIT.GRAMS]: totalGrams / WEIGHT_CONVERSIONS[WEIGHT_UNIT.GRAMS],
      [WEIGHT_UNIT.POUNDS]: totalGrams / WEIGHT_CONVERSIONS[WEIGHT_UNIT.POUNDS],
      [WEIGHT_UNIT.OUNCES]: totalGrams / WEIGHT_CONVERSIONS[WEIGHT_UNIT.OUNCES],
      [WEIGHT_UNIT.STONES]: totalGrams / WEIGHT_CONVERSIONS[WEIGHT_UNIT.STONES],
      [WEIGHT_UNIT.TONNES]: totalGrams / WEIGHT_CONVERSIONS[WEIGHT_UNIT.TONNES],
    };

    setConversions(result);
    setSpecializedUnits(getSpecializedUnits(totalGrams));
    setRealWorldComparisons(getRealWorldComparisons(totalGrams));
    setWeightCategories(getWeightCategories(totalGrams));
  }, [inputValue, inputUnit, getSpecializedUnits, getRealWorldComparisons, getWeightCategories]);

  // Auto-convert when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(convertWeight, 300);
    return () => clearTimeout(timeoutId);
  }, [convertWeight]);

  const handleQuickSelect = (value: number, unit: WEIGHT_UNIT) => {
    setInputValue(value.toString());
    setInputUnit(unit);
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
  };

  const getVisualScale = (): number => {
    if (!conversions) return 0;
    const totalKg = conversions[WEIGHT_UNIT.KILOGRAMS];
    if (totalKg <= 0) return 0;
    if (totalKg >= 100) return 100;
    return Math.min(100, (totalKg / 100) * 100);
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.WeightConverter}
      secondaryToolDescription="Perfect for cooking, shipping, fitness tracking, and scientific measurements."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Weight</h2>
            
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

            {/* Weight Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight ({inputUnit})
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
                  onChange={(e) => setInputUnit(e.target.value as WEIGHT_UNIT)}
                  className="absolute right-1 top-1 bottom-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-500"
                >
                  {Object.values(WEIGHT_UNIT).map((unit) => (
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
                <p>Enter a weight value to see conversions</p>
              </div>
            )}

            {conversions && (
              <div className="space-y-4">
                {/* Main Conversions */}
                {Object.entries(conversions).map(([unit, value]) => (
                  <div key={unit} className="flex items-center justify-between p-3 bg-orange-100 rounded-lg">
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 capitalize">
                        {unit === WEIGHT_UNIT.KILOGRAMS ? 'Kilograms' :
                         unit === WEIGHT_UNIT.GRAMS ? 'Grams' :
                         unit === WEIGHT_UNIT.POUNDS ? 'Pounds' :
                         unit === WEIGHT_UNIT.OUNCES ? 'Ounces' :
                         unit === WEIGHT_UNIT.STONES ? 'Stones' :
                         unit === WEIGHT_UNIT.TONNES ? 'Tonnes' : unit} ({unit})
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

          {/* Weight Context Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weight Context</h2>
            
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
                  Relative to 100 kg ({formatNumber(conversions[WEIGHT_UNIT.KILOGRAMS] / 100 * 100)}%)
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
                    <div className="text-sm text-gray-600">{comparison.range}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Weight Categories */}
            {weightCategories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Weight Categories</h3>
                {weightCategories.map((category, index) => (
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
            The Professional Weight Converter makes it easy to switch between pounds, kilograms, ounces, grams, stones, and more. Enter any positive number in the input field, then pick your starting unit from the dropdown. Use the quick select buttons for common values like one kilogram or one pound. You can also adjust the precision to control how many decimal places you see.
          </p>

          <p className="text-gray-700 mb-4">
            All conversions appear in real time as you type. You can see how one unit compares to others instantly. The tool includes specialized units like troy ounces for precious metals and carats for gemstones. To make results easier to grasp, the tool adds real-world examples that show what each weight feels like in daily life. Copy any result directly to your clipboard for quick sharing or calculations.
          </p>

          <h3>Weight Conversion Facts</h3>
          <ol className="list-decimal list-outside space-y-3 text-gray-700 mb-6 pl-5">
            <li>
              A <strong>gram</strong> is the base unit of mass in the metric system. Originally defined as the mass of one cubic centimeter of water at 4°C, it&apos;s now defined using the kilogram and fundamental physical constants. The word comes from the Greek &ldquo;gramma&rdquo; meaning small weight.
            </li>
            <li>
              A <strong>kilogram</strong> equals 1,000 grams and is the fundamental SI unit of mass. It was originally defined as the mass of one liter of water at freezing point, but is now defined by fundamental physical constants including Planck&apos;s constant.
            </li>
            <li>
              A <strong>pound</strong> equals exactly 453.592 grams. The word comes from the Latin libra pondo, meaning &ldquo;pound weight,&rdquo; which is why the symbol is &ldquo;lb.&rdquo; The avoirdupois pound is the most common pound used today.
            </li>
            <li>
              An <strong>ounce</strong> (avoirdupois) equals exactly 28.3495 grams and is 1/16 of a pound. There are different types of ounces - avoirdupois (for general use), troy (for precious metals), and fluid ounces (for volume).
            </li>
            <li>
              A <strong>stone</strong> equals exactly 14 pounds (6.35 kg) and is commonly used in the UK and Ireland for measuring body weight. It dates back to ancient times when people used actual stones as weight standards, though the official stone was standardized in 1835.
            </li>
            <li>
              A <strong>tonne</strong> (metric ton) equals exactly 1,000 kilograms or 1,000,000 grams. It&apos;s different from the imperial ton (1016 kg in the UK, called a &ldquo;long ton&rdquo;) and the US ton (907 kg, called a &ldquo;short ton&rdquo;).
            </li>
            <li>
              A <strong>troy ounce</strong> equals 31.1035 grams, making it about 10% heavier than a regular (avoirdupois) ounce. It&apos;s used exclusively for precious metals like gold, silver, and platinum. The name comes from the French city of Troyes, a major trading center in medieval times.
            </li>
            <li>
              A <strong>carat</strong> equals exactly 200 milligrams (0.2 grams) and is used to measure gemstones and pearls. The name comes from carob seeds, which ancient merchants used as standard weights because of their uniform size and weight.
            </li>
            <li>
              A <strong>grain</strong> is one of the oldest units of measurement, equal to 64.79891 milligrams. It was originally based on the weight of a single grain of barley. It&apos;s still used in some contexts, particularly for measuring bullets, arrows, and pharmaceutical compounds.
            </li>
            <li>
              The <strong>long ton</strong> (UK) equals 1,016.047 kg (2,240 pounds) and was historically used in British commerce. It&apos;s 12% heavier than the US short ton and should not be confused with the metric tonne.
            </li>
          </ol>

          <h3>What Is The Difference between Weight and Mass?</h3>
          <p>Technically, weight measures the force of gravity on an object, while mass measures the amount of matter. On Earth, we often use these terms interchangeably, but an object&apos;s mass stays constant while its weight changes on different planets. In everyday terms, weight is what you measure on a scale, while mass is a measure of how much stuff is in an object.</p>
          <h3>Precision in Measurements</h3>
          <p>For everyday use, standard scales are accurate to the nearest gram or ounce. For scientific work, analytical balances can measure to 0.1 milligrams. For precious metals trading, measurements often go to three decimal places.</p>
          <p>The kilogram is maintained by the International Bureau of Weights and Measures in France. Until 2019, it was defined by a physical platinum-iridium cylinder, but it&apos;s now defined using quantum mechanical constants.</p>
          <h3>Cultural Differences</h3>
          <p>While most of the world uses metric units (grams and kilograms), the United States primarily uses imperial units (ounces and pounds) for everyday measurements. The UK uses a mix of both systems.</p>
          <h3>Specialized Applications</h3>
          <p>Different industries prefer different units - jewelers use carats for gemstones, pharmacists use grains for medications, metallurgists use troy ounces for precious metals, and shipping companies use tonnes for cargo.</p>
        </div>
      </div>
    </ToolLayout>
  );
}