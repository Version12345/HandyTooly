'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';

enum TIME_UNIT {
    MILLISECONDS = 'Milliseconds',
    SECONDS = 'Seconds',
    MINUTES = 'Minutes',
    HOURS = 'Hours',
    DAYS = 'Days',
    WEEKS = 'Weeks',
    MONTHS = 'Months',
    YEARS = 'Years',
    LIGHT_YEARS = 'Light Years',
    EONS = 'Eons'
}

interface TimeConversions {
  [TIME_UNIT.MILLISECONDS]: number;
  [TIME_UNIT.SECONDS]: number;
  [TIME_UNIT.MINUTES]: number;
  [TIME_UNIT.HOURS]: number;
  [TIME_UNIT.DAYS]: number;
  [TIME_UNIT.WEEKS]: number;
  [TIME_UNIT.MONTHS]: number;
  [TIME_UNIT.YEARS]: number;
  [TIME_UNIT.LIGHT_YEARS]: number;
  [TIME_UNIT.EONS]: number;
}

interface RealWorldComparison {
  label: string;
  description: string;
  icon: string;
}

const TIME_UNITS_CONVERSIONS = {
  [TIME_UNIT.MILLISECONDS]: 1,
  [TIME_UNIT.SECONDS]: 1000,
  [TIME_UNIT.MINUTES]: 60 * 1000,
  [TIME_UNIT.HOURS]: 60 * 60 * 1000,
  [TIME_UNIT.DAYS]: 24 * 60 * 60 * 1000,
  [TIME_UNIT.WEEKS]: 7 * 24 * 60 * 60 * 1000,
  [TIME_UNIT.MONTHS]: 30.44 * 24 * 60 * 60 * 1000, // Average month
  [TIME_UNIT.YEARS]: 365.25 * 24 * 60 * 60 * 1000, // Including leap years
  [TIME_UNIT.LIGHT_YEARS]: 365.25 * 24 * 60 * 60 * 1000, // 1 light year ≈ 1 year (time for light to travel 1 light year)
  [TIME_UNIT.EONS]: 1000000000 * 365.25 * 24 * 60 * 60 * 1000, // 1 eon = 1 billion years
};

const QUICK_SELECT_VALUES = [
    { label: '1000 ms', value: 1000, unit: TIME_UNIT.MILLISECONDS },
    { label: '1 sec', value: 1, unit: TIME_UNIT.SECONDS },
    { label: '5 min', value: 5, unit: TIME_UNIT.MINUTES },
    { label: '15 min', value: 15, unit: TIME_UNIT.MINUTES },
    { label: '30 min', value: 30, unit: TIME_UNIT.MINUTES },
    { label: '1 hour', value: 1, unit: TIME_UNIT.HOURS },
    { label: '1 day', value: 1, unit: TIME_UNIT.DAYS },
    { label: '1 week', value: 1, unit: TIME_UNIT.WEEKS },
    { label: '1 month', value: 1, unit: TIME_UNIT.MONTHS },
    { label: '1 year', value: 1, unit: TIME_UNIT.YEARS },
    { label: '1 decade', value: 10, unit: TIME_UNIT.YEARS },
    { label: '1 fortnight', value: 2, unit: TIME_UNIT.WEEKS },
    { label: '1 century', value: 100, unit: TIME_UNIT.YEARS },
    { label: '1 millennium', value: 1000, unit: TIME_UNIT.YEARS },
    { label: '1 light year', value: 1, unit: TIME_UNIT.LIGHT_YEARS },
    { label: '1 eon', value: 1, unit: TIME_UNIT.EONS }
];

enum DISPLAY_FORMAT {
    DECIMAL = 'decimal',
    SCIENTIFIC = 'scientific',
    FRACTION = 'fraction',
}

const DISPLAY_FORMATS_VALUES = [
  { value: DISPLAY_FORMAT.DECIMAL, label: 'Decimal' },
  { value: DISPLAY_FORMAT.SCIENTIFIC, label: 'Scientific Notation' },
  { value: DISPLAY_FORMAT.FRACTION, label: 'Fraction' },
];

const PRECISION_OPTIONS = [
  { value: 0, label: '0 decimals' },
  { value: 2, label: '2 decimals' },
  { value: 4, label: '4 decimals' },
];

export function TimeUnitConverter() {
  const [inputValue, setInputValue] = useState('60');
  const [inputUnit, setInputUnit] = useState<keyof typeof TIME_UNITS_CONVERSIONS>(TIME_UNIT.SECONDS);
  const [precision, setPrecision] = useState(4);
  const [displayFormat, setDisplayFormat] = useState('decimal');
  const [conversions, setConversions] = useState<TimeConversions | null>(null);
  const [realWorldComparisons, setRealWorldComparisons] = useState<RealWorldComparison[]>([]);

  const formatNumber = useCallback((value: number, decimals: number = precision): string => {
    if (displayFormat === DISPLAY_FORMAT.SCIENTIFIC) {
      return value.toExponential(decimals);
    } else if (displayFormat === DISPLAY_FORMAT.FRACTION && value < 1 && value > 0) {
      // Simple fraction approximation for small values
      const denominator = Math.pow(10, decimals);
      const numerator = Math.round(value * denominator);
      return `${numerator}/${denominator}`;
    } else {
      return value.toFixed(decimals);
    }
  }, [precision, displayFormat]);

  const getRealWorldComparisons = useCallback((totalMilliseconds: number): RealWorldComparison[] => {
    const comparisons: RealWorldComparison[] = [];
    const totalSeconds = totalMilliseconds / 1000;
    const totalMinutes = totalSeconds / 60;
    const totalHours = totalMinutes / 60;
    const totalDays = totalHours / 24;
    const totalYears = totalDays / 365.25;
    const totalLightYears = totalMilliseconds / TIME_UNITS_CONVERSIONS[TIME_UNIT.LIGHT_YEARS];
    const totalEons = totalMilliseconds / TIME_UNITS_CONVERSIONS[TIME_UNIT.EONS];

    // Milliseconds scale (less than 1 second)
    if (totalSeconds < 1) {
      const milliseconds = Math.round(totalMilliseconds);
      comparisons.push({
        label: 'Camera flash',
        description: `${Math.max(1, Math.round(milliseconds / 1))} millisecond${milliseconds === 1 ? '' : 's'} (camera flash duration)`,
        icon: '📸'
      });
      comparisons.push({
        label: 'Screen refresh',
        description: `${Math.max(1, Math.round(milliseconds / 16.67))} frame${Math.round(milliseconds / 16.67) === 1 ? '' : 's'} at 60 FPS`,
        icon: '🖥️'
      });
      comparisons.push({
        label: 'Sound travel',
        description: `Sound travels ${Math.max(1, Math.round((milliseconds / 1000) * 343))} meters in this time`,
        icon: '🔊'
      });
      comparisons.push({
        label: 'Light travel',
        description: `Light travels ${Math.max(1, Math.round((milliseconds / 1000) * 299792458))} meters`,
        icon: '💡'
      });
    }
    // Seconds scale (1 second to 1 minute)
    else if (totalSeconds < 60) {
      const seconds = Math.round(totalSeconds);
      comparisons.push({
        label: 'Heartbeats',
        description: `About ${Math.max(1, Math.round(seconds * 1.25))} heartbeats (75 bpm average)`,
        icon: '💓'
      });
      comparisons.push({
        label: 'Breathing',
        description: `${Math.max(1, Math.round(seconds / 4))} breath${Math.round(seconds / 4) === 1 ? '' : 's'} (15 breaths/min)`,
        icon: '🫁'
      });
      comparisons.push({
        label: 'Typing speed',
        description: `${Math.max(1, Math.round(seconds * 1.33))} word${Math.round(seconds * 1.33) === 1 ? '' : 's'} typed (80 WPM)`,
        icon: '⌨️'
      });
      comparisons.push({
        label: 'Walking distance',
        description: `Walk ${Math.max(1, Math.round(seconds * 1.4))} meters at normal pace`,
        icon: '🚶'
      });
    }
    // Minutes scale (1 minute to 1 hour)
    else if (totalMinutes < 60) {
      const minutes = Math.round(totalMinutes);
      comparisons.push({
        label: 'Popular songs',
        description: `${Math.max(1, Math.round(minutes / 3.5))} average song${Math.round(minutes / 3.5) === 1 ? '' : 's'} (3.5 min each)`,
        icon: '🎵'
      });
      comparisons.push({
        label: 'Cooking pasta',
        description: minutes >= 8 && minutes <= 12 ? 'Perfect pasta cooking time!' : minutes < 8 ? 'Less than pasta cooking time' : 'More than pasta cooking time',
        icon: '🍝'
      });
      comparisons.push({
        label: 'TV commercial break',
        description: `${Math.max(1, Math.round(minutes / 3))} commercial break${Math.round(minutes / 3) === 1 ? '' : 's'} (3 min each)`,
        icon: '📺'
      });
      comparisons.push({
        label: 'Coffee brewing',
        description: minutes >= 4 && minutes <= 6 ? 'Perfect coffee brewing time!' : minutes < 4 ? 'Quick coffee brew' : 'Extended coffee brewing',
        icon: '☕'
      });
      comparisons.push({
        label: 'Exercise sets',
        description: `${Math.max(1, Math.round(minutes / 2))} workout set${Math.round(minutes / 2) === 1 ? '' : 's'} (2 min rest between)`,
        icon: '💪'
      });
      comparisons.push({
        label: 'Elevator ride',
        description: `${Math.max(1, Math.round(minutes / 0.5))} elevator trip${Math.round(minutes / 0.5) === 1 ? '' : 's'} (30 sec average)`,
        icon: '🛗'
      });
    }
    // Hours scale (1 hour to 1 day)
    else if (totalHours < 24) {
      const hours = Math.round(totalHours * 10) / 10;
      comparisons.push({
        label: 'Work time',
        description: `${Math.round((hours / 8) * 100)}% of a standard work day`,
        icon: '💼'
      });
      comparisons.push({
        label: 'Movies',
        description: `${Math.max(1, Math.round(hours / 2))} average movie${Math.round(hours / 2) === 1 ? '' : 's'} (2 hours each)`,
        icon: '🎬'
      });
      comparisons.push({
        label: 'Sleep cycles',
        description: `${Math.max(1, Math.round(hours / 1.5))} sleep cycle${Math.round(hours / 1.5) === 1 ? '' : 's'} (90 min each)`,
        icon: '😴'
      });
      comparisons.push({
        label: 'Charging phone',
        description: hours >= 1.5 && hours <= 3 ? 'Full phone charge time' : hours < 1.5 ? 'Partial phone charge' : 'Multiple phone charges',
        icon: '🔋'
      });
      comparisons.push({
        label: 'Cooking roast',
        description: hours >= 3 && hours <= 6 ? 'Perfect roast cooking time' : hours < 3 ? 'Quick meal prep' : 'Slow cooking time',
        icon: '🍖'
      });
      comparisons.push({
        label: 'Flight time',
        description: hours <= 2 ? 'Domestic flight' : hours <= 8 ? 'International flight' : 'Long-haul flight',
        icon: '✈️'
      });
    }
    // Days scale (1 day to 1 year)
    else if (totalDays < 365) {
      const days = Math.round(totalDays * 10) / 10;
      comparisons.push({
        label: 'Work week',
        description: `${Math.round((days / 5) * 100)}% of a work week (5 days)`,
        icon: '📅'
      });
      comparisons.push({
        label: 'Vacation time',
        description: days <= 3 ? 'Weekend getaway' : days <= 7 ? 'Week-long vacation' : days <= 14 ? 'Two-week vacation' : 'Extended vacation',
        icon: '🏖️'
      });
      comparisons.push({
        label: 'Moon cycle',
        description: `${Math.max(1, Math.round(days / 29.5))} lunar cycle${Math.round(days / 29.5) === 1 ? '' : 's'} (29.5 days each)`,
        icon: '🌙'
      });
      comparisons.push({
        label: 'Plant growth',
        description: days <= 7 ? 'Seed germination time' : days <= 30 ? 'Seedling growth' : days <= 90 ? 'Young plant growth' : 'Mature plant development',
        icon: '🌱'
      });
      comparisons.push({
        label: 'Seasonal change',
        description: `${Math.round((days / 91) * 100)}% of a season (91 days average)`,
        icon: '🍂'
      });
      comparisons.push({
        label: 'Habit formation',
        description: days >= 21 && days <= 66 ? 'Habit formation timeframe!' : days < 21 ? 'Building towards habit' : 'Well-established habit time',
        icon: '🎯'
      });
    }
    // Years scale (1 year to geological timescales)
    else {
      const years = Math.round(totalYears * 10) / 10;
      
      // Human timescales (1-1000 years)
      if (years < 1000) {
        comparisons.push({
          label: 'Human lifespan',
          description: `${Math.round((years / 80) * 100)}% of average human lifespan`,
          icon: '👤'
        });
        comparisons.push({
          label: 'Education',
          description: years <= 4 ? 'College degree duration' : years <= 12 ? 'K-12 education' : years <= 16 ? 'Complete education cycle' : 'Multiple education cycles',
          icon: '🎓'
        });
        comparisons.push({
          label: 'Tree maturity',
          description: years <= 5 ? 'Sapling growth' : years <= 25 ? 'Young tree development' : years <= 100 ? 'Mature tree lifespan' : 'Ancient tree age',
          icon: '🌳'
        });
        comparisons.push({
          label: 'Career span',
          description: years <= 5 ? 'Entry-level experience' : years <= 15 ? 'Mid-career span' : years <= 30 ? 'Senior career span' : 'Lifetime career',
          icon: '💼'
        });
        comparisons.push({
          label: 'Historical context',
          description: years <= 10 ? 'Recent decade' : years <= 100 ? 'Century span' : 'Nearly a millennium',
          icon: '📜'
        });
        comparisons.push({
          label: 'Technology evolution',
          description: years <= 5 ? 'Smartphone generation' : years <= 20 ? 'Internet age span' : years <= 50 ? 'Computer age' : 'Multiple tech revolutions',
          icon: '💻'
        });
      }
      // Geological/Cosmic timescales (1000+ years)  
      else {
        const millions = years / 1000000;
        const billions = years / 1000000000;
        
        // Light Year scale comparisons (cosmic time)
        if (totalLightYears >= 0.1) {
          comparisons.push({
            label: 'Light travel time',
            description: `Time for light to travel ${Math.max(1, Math.round(totalLightYears * 10) / 10)} light year${totalLightYears >= 2 ? 's' : ''} through space`,
            icon: '💫'
          });
          comparisons.push({
            label: 'Stellar distances',
            description: totalLightYears <= 4.3 ? 'Within nearest star system' : totalLightYears <= 100 ? 'Local stellar neighborhood' : totalLightYears <= 100000 ? 'Across the galaxy' : 'Intergalactic distances',
            icon: '🌟'
          });
          comparisons.push({
            label: 'Cosmic communication',
            description: `Radio signals would take ${Math.round(totalLightYears * 10) / 10} year${totalLightYears >= 2 ? 's' : ''} to travel this distance`,
            icon: '📡'
          });
        }
        
        // Eon scale comparisons (geological deep time)
        if (totalEons >= 0.001) {
          const eonsValue = Math.round(totalEons * 1000) / 1000;
          comparisons.push({
            label: 'Geological eons',
            description: `${eonsValue} eon${eonsValue >= 2 ? 's' : ''} - spanning ${eonsValue >= 1 ? 'multiple' : 'partial'} geological eras`,
            icon: '🪨'
          });
          comparisons.push({
            label: 'Planetary evolution',
            description: totalEons <= 0.5 ? 'Recent Earth history' : totalEons <= 1 ? 'Major evolutionary transitions' : totalEons <= 4.6 ? 'Earth formation period' : 'Pre-Earth cosmic time',
            icon: '🌍'
          });
          comparisons.push({
            label: 'Life evolution',
            description: totalEons <= 0.54 ? 'Complex life era' : totalEons <= 2.5 ? 'Early life emergence' : totalEons <= 4 ? 'Pre-life Earth' : 'Primordial cosmic era',
            icon: '🦕'
          });
        }
        
        // Standard geological comparisons for smaller scales
        if (totalLightYears < 0.1 && totalEons < 0.001) {
          comparisons.push({
            label: 'Civilizations',
            description: years <= 10000 ? 'Human civilization span' : years <= 100000 ? 'Modern human existence' : 'Pre-human history',
            icon: '🏛️'
          });
          comparisons.push({
            label: 'Geological events',
            description: millions <= 1 ? 'Recent geological time' : millions <= 65 ? 'Since dinosaur extinction' : millions <= 540 ? 'Complex life evolution' : 'Early Earth formation',
            icon: '🌍'
          });
          comparisons.push({
            label: 'Species evolution',
            description: millions <= 0.3 ? 'Human species timespan' : millions <= 2 ? 'Human ancestors' : millions <= 100 ? 'Mammal diversification' : 'Multi-cellular life',
            icon: '🧬'
          });
        }
        
        // Universal scale comparisons
        comparisons.push({
          label: 'Solar system',
          description: billions <= 0.1 ? 'Recent cosmic time' : billions <= 1 ? 'Complex life on Earth' : billions <= 4.6 ? 'Solar system formation' : 'Pre-solar system',
          icon: '☀️'
        });
        comparisons.push({
          label: 'Universe age',
          description: `${Math.round((billions / 13.8) * 100)}% of universe age (13.8 billion years)`,
          icon: '🌌'
        });
        comparisons.push({
          label: 'Cosmic events',
          description: billions <= 0.5 ? 'Recent cosmic history' : billions <= 5 ? 'Stellar formation era' : billions <= 13.8 ? 'Early universe' : 'Beyond universe age!',
          icon: '⭐'
        });
      }
    }

    // Shuffle and return random selection to add variety
    const shuffled = comparisons.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6); // Show 6 comparisons instead of 4
  }, []);

  const convertTime = useCallback(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      setConversions(null);
      setRealWorldComparisons([]);
      return;
    }

    // Convert input to milliseconds first
    const totalMilliseconds = value * TIME_UNITS_CONVERSIONS[inputUnit];

    // Convert to all other units
    const result: TimeConversions = {
      [TIME_UNIT.MILLISECONDS]: totalMilliseconds,
      [TIME_UNIT.SECONDS]: totalMilliseconds / TIME_UNITS_CONVERSIONS[TIME_UNIT.SECONDS],
      [TIME_UNIT.MINUTES]: totalMilliseconds / TIME_UNITS_CONVERSIONS[TIME_UNIT.MINUTES],
      [TIME_UNIT.HOURS]: totalMilliseconds / TIME_UNITS_CONVERSIONS[TIME_UNIT.HOURS],
      [TIME_UNIT.DAYS]: totalMilliseconds / TIME_UNITS_CONVERSIONS[TIME_UNIT.DAYS],
      [TIME_UNIT.WEEKS]: totalMilliseconds / TIME_UNITS_CONVERSIONS[TIME_UNIT.WEEKS],
      [TIME_UNIT.MONTHS]: totalMilliseconds / TIME_UNITS_CONVERSIONS[TIME_UNIT.MONTHS],
      [TIME_UNIT.YEARS]: totalMilliseconds / TIME_UNITS_CONVERSIONS[TIME_UNIT.YEARS],
      [TIME_UNIT.LIGHT_YEARS]: totalMilliseconds / TIME_UNITS_CONVERSIONS[TIME_UNIT.LIGHT_YEARS],
      [TIME_UNIT.EONS]: totalMilliseconds / TIME_UNITS_CONVERSIONS[TIME_UNIT.EONS],
    };

    setConversions(result);
    setRealWorldComparisons(getRealWorldComparisons(totalMilliseconds));
  }, [inputValue, inputUnit, getRealWorldComparisons]);

  // Auto-convert when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(convertTime, 300);
    return () => clearTimeout(timeoutId);
  }, [convertTime]);

  const handleQuickSelect = (value: number, unit: keyof typeof TIME_UNITS_CONVERSIONS) => {
    setInputValue(value.toString());
    setInputUnit(unit);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <ToolLayout pageTitle="Time Unit Converter">
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Convert between different time units from milliseconds to cosmic scales including light years and eons. 
          See real-world comparisons to understand time durations better, from everyday activities to geological and cosmic events.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Input Settings</h2>
            
            {/* Format Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Format
                </label>
                <select
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value as keyof typeof TIME_UNITS_CONVERSIONS)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {Object.keys(TIME_UNITS_CONVERSIONS).map((unit) => (
                    <option key={unit} value={unit}>
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {PRECISION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Format
                </label>
                <select
                  value={displayFormat}
                  onChange={(e) => setDisplayFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {DISPLAY_FORMATS_VALUES.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input Value */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Time
              </label>
              <div className="flex">
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="60"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md text-gray-600 text-sm">
                  {inputUnit}
                </span>
              </div>
            </div>

            {/* Quick Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Select
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {QUICK_SELECT_VALUES.map((quick) => (
                  <button
                    key={quick.label}
                    onClick={() => handleQuickSelect(quick.value, quick.unit as keyof typeof TIME_UNITS_CONVERSIONS)}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-orange-300 text-gray-700 rounded-md transition-colors"
                  >
                    {quick.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Summary */}
            {conversions && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Input Value</h3>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(parseFloat(inputValue), 4)} {inputUnit}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {conversions[TIME_UNIT.SECONDS] >= 60
                    ? `${Math.floor(conversions[TIME_UNIT.MINUTES])} minutes, ${Math.round(conversions[TIME_UNIT.SECONDS] % 60)} seconds`
                    : `${Math.round(conversions[TIME_UNIT.SECONDS])} seconds`
                  }
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Results</h2>
            
            {!conversions && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter a time value to see conversions</p>
              </div>
            )}

            {conversions && (
              <div className="space-y-4">
                {/* Main Conversions */}
                {Object.entries(conversions).map(([label, value]) => (
                  <div key={label} className="px-3 py-2 bg-orange-100 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-[25%_65%_10%] items-center">
                        <div>
                            <span className='text-sm'>{label}</span>
                        </div>
                        <div>
                            {' '} 
                            <span className="text-lg font-semibold text-gray-900">
                            {typeof value === 'string' ? value : formatNumber(value)}
                            </span>
                        </div>
                        <button
                            onClick={() => copyToClipboard(typeof value === 'string' ? value : formatNumber(value))}
                            className="px-2 py-1 text-[10px] bg-orange-300 hover:bg-gray-400 text-white rounded transition-colors"
                            title="Copy to clipboard"
                        >
                            Copy
                        </button>
                        </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Real-world Comparisons */}
        {realWorldComparisons.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Real-world Comparisons</h2>
            <p className="text-sm text-gray-600 mb-4">
              Here are some relatable ways to understand this time duration:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {realWorldComparisons.map((comparison, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">{comparison.icon}</span>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1">{comparison.label}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{comparison.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Information */}
        <h3>How to Use This Tool</h3>
        <p>
            The Time Unit Converter makes it easy to switch between seconds, minutes, hours, days, and more. Enter any positive number in the input field, then pick your starting unit from the dropdown. Use the quick select buttons for common values like one hour or one day. You can also adjust the precision to control how many decimal places you see. Change the display format to fit your needs, whether you want a simple or detailed view.
        </p>

        <p>
            All conversions appear in real time as you type. You can see how one unit compares to others instantly. To make results easier to grasp, the tool adds real-world examples that show what each duration feels like in daily life. Copy any result directly to your clipboard for quick sharing or calculations. It&apos;s fast, accurate, and made for anyone who works with time measurements.
        </p>
        <h3>Fun Facts About Time</h3>
        <ol className="list-decimal list-outside space-y-3">
            <li>
                A <strong>second</strong> was once measured by the swing of a clock&apos;s pendulum. Today it is based on the vibration of a cesium atom, which ticks 9,192,631,770 times per second. There are about 31.5 million seconds in a year.
            </li>
            <li>
                A <strong>year on Venus</strong> is shorter than a day on Venus. The planet takes 225 Earth days to orbit the sun but spins so slowly that one full day lasts 243 Earth days.
            </li>
            <li>
                The word <strong>minute</strong> comes from the Latin phrase pars minuta prima, which means “first small part.” The word “second” comes from pars minuta secunda, meaning “second small part.”
            </li>
            <li>
                A <strong>fortnight</strong> means fourteen nights, or two weeks. The word comes from Old English feowertyne niht, meaning “fourteen nights.” People in the United Kingdom and other Commonwealth countries still use it to measure short spans of time. In online games like Fortnite, the name is a playful twist on the same word.
            </li>
            <li>
                A <strong>year</strong> is the time Earth takes to orbit the Sun once, about 365 days. Because the orbit is not perfect, we add one extra day every four years, called a leap year.
            </li>
            <li>
                A <strong>century</strong> equals 100 years. It is long enough to see massive changes in history, science, and culture. The 20th century alone brought flight, space travel, and the internet.
            </li>
            <li>
                A <strong>millennium</strong> is 1,000 years. Civilizations rise and fall in that span. The Great Pyramid of Giza, built around 2560 BCE, has seen more than four millennia pass.
            </li>
            <li>
                A <strong>light-year</strong> is not a measure of time but of distance. It is how far light travels in one year—about 9.46 trillion kilometers or 5.88 trillion miles. When you look at stars, you see light that left them years ago, so you are looking into the past.
            </li>
            <li>
                An <strong>eon</strong> is the largest unit of geological time. It can last billions of years. Earth itself is about 4.5 billion years old, or one full eon of planetary history.
            </li>
        </ol>
      </div>
    </ToolLayout>
  );
}