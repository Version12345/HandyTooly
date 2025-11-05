'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';

interface TimeZoneData {
  utcTime: string;
  localTime: string;
  utcOffset: number;
  timeZone: string;
  is24Hour: boolean;
}

interface ConversionResult {
  utcTime: Date;
  localTime: Date;
  utcTimeString: string;
  localTimeString: string;
  timeZoneName: string;
  timeZoneAbbreviation: string;
  utcOffset: string;
  isDST: boolean;
}

// Get user's current timezone and create comprehensive time zones list
const getUserTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/New_York'; // fallback
  }
};

// All major time zones with their identifiers
const getTimeZonesList = () => {
  const currentTimeZone = getUserTimeZone();
  
  const allZones = [
    // UTC
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: 0 },
    
    // Americas - North America
    { value: 'America/New_York', label: 'Eastern Time (ET) - New York, Toronto', offset: -5 },
    { value: 'America/Chicago', label: 'Central Time (CT) - Chicago, Dallas', offset: -6 },
    { value: 'America/Denver', label: 'Mountain Time (MT) - Denver, Phoenix', offset: -7 },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT) - Los Angeles, Seattle', offset: -8 },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT) - Anchorage', offset: -9 },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST) - Honolulu', offset: -10 },
    { value: 'America/Toronto', label: 'Toronto, Canada', offset: -5 },
    { value: 'America/Vancouver', label: 'Vancouver, Canada', offset: -8 },
    { value: 'America/Montreal', label: 'Montreal, Canada', offset: -5 },
    { value: 'America/Halifax', label: 'Halifax, Canada (AST)', offset: -4 },
    { value: 'America/St_Johns', label: 'Newfoundland Time (NST)', offset: -3.5 },
    
    // Americas - Central America & Caribbean
    { value: 'America/Mexico_City', label: 'Mexico City, Mexico', offset: -6 },
    { value: 'America/Cancun', label: 'Cancun, Mexico', offset: -5 },
    { value: 'America/Guatemala', label: 'Guatemala City', offset: -6 },
    { value: 'America/Havana', label: 'Havana, Cuba', offset: -5 },
    { value: 'America/Jamaica', label: 'Kingston, Jamaica', offset: -5 },
    { value: 'America/Barbados', label: 'Bridgetown, Barbados', offset: -4 },
    
    // Americas - South America
    { value: 'America/Sao_Paulo', label: 'São Paulo, Brazil (BRT)', offset: -3 },
    { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires, Argentina', offset: -3 },
    { value: 'America/Santiago', label: 'Santiago, Chile', offset: -3 },
    { value: 'America/Lima', label: 'Lima, Peru', offset: -5 },
    { value: 'America/Bogota', label: 'Bogotá, Colombia', offset: -5 },
    { value: 'America/Caracas', label: 'Caracas, Venezuela', offset: -4 },
    { value: 'America/La_Paz', label: 'La Paz, Bolivia', offset: -4 },
    { value: 'America/Montevideo', label: 'Montevideo, Uruguay', offset: -3 },
    { value: 'America/Asuncion', label: 'Asunción, Paraguay', offset: -3 },
    { value: 'America/Guyana', label: 'Georgetown, Guyana', offset: -4 },
    
    // Europe - Western
    { value: 'Europe/London', label: 'London, UK (GMT/BST)', offset: 0 },
    { value: 'Europe/Dublin', label: 'Dublin, Ireland', offset: 0 },
    { value: 'Europe/Lisbon', label: 'Lisbon, Portugal', offset: 0 },
    { value: 'Europe/Madrid', label: 'Madrid, Spain', offset: 1 },
    { value: 'Europe/Paris', label: 'Paris, France (CET)', offset: 1 },
    { value: 'Europe/Brussels', label: 'Brussels, Belgium', offset: 1 },
    { value: 'Europe/Amsterdam', label: 'Amsterdam, Netherlands', offset: 1 },
    { value: 'Europe/Berlin', label: 'Berlin, Germany', offset: 1 },
    { value: 'Europe/Zurich', label: 'Zurich, Switzerland', offset: 1 },
    { value: 'Europe/Vienna', label: 'Vienna, Austria', offset: 1 },
    { value: 'Europe/Rome', label: 'Rome, Italy', offset: 1 },
    
    // Europe - Central & Eastern
    { value: 'Europe/Prague', label: 'Prague, Czech Republic', offset: 1 },
    { value: 'Europe/Warsaw', label: 'Warsaw, Poland', offset: 1 },
    { value: 'Europe/Budapest', label: 'Budapest, Hungary', offset: 1 },
    { value: 'Europe/Stockholm', label: 'Stockholm, Sweden', offset: 1 },
    { value: 'Europe/Oslo', label: 'Oslo, Norway', offset: 1 },
    { value: 'Europe/Copenhagen', label: 'Copenhagen, Denmark', offset: 1 },
    { value: 'Europe/Helsinki', label: 'Helsinki, Finland', offset: 2 },
    { value: 'Europe/Athens', label: 'Athens, Greece', offset: 2 },
    { value: 'Europe/Istanbul', label: 'Istanbul, Turkey', offset: 3 },
    { value: 'Europe/Moscow', label: 'Moscow, Russia (MSK)', offset: 3 },
    { value: 'Europe/Kiev', label: 'Kiev, Ukraine', offset: 2 },
    { value: 'Europe/Bucharest', label: 'Bucharest, Romania', offset: 2 },
    
    // Africa
    { value: 'Africa/Cairo', label: 'Cairo, Egypt', offset: 2 },
    { value: 'Africa/Lagos', label: 'Lagos, Nigeria (WAT)', offset: 1 },
    { value: 'Africa/Nairobi', label: 'Nairobi, Kenya (EAT)', offset: 3 },
    { value: 'Africa/Johannesburg', label: 'Johannesburg, South Africa (SAST)', offset: 2 },
    { value: 'Africa/Casablanca', label: 'Casablanca, Morocco', offset: 0 },
    { value: 'Africa/Tunis', label: 'Tunis, Tunisia', offset: 1 },
    { value: 'Africa/Algiers', label: 'Algiers, Algeria', offset: 1 },
    { value: 'Africa/Addis_Ababa', label: 'Addis Ababa, Ethiopia', offset: 3 },
    { value: 'Africa/Kinshasa', label: 'Kinshasa, DR Congo', offset: 1 },
    
    // Asia - Middle East
    { value: 'Asia/Dubai', label: 'Dubai, UAE (GST)', offset: 4 },
    { value: 'Asia/Qatar', label: 'Doha, Qatar', offset: 3 },
    { value: 'Asia/Kuwait', label: 'Kuwait City, Kuwait', offset: 3 },
    { value: 'Asia/Riyadh', label: 'Riyadh, Saudi Arabia', offset: 3 },
    { value: 'Asia/Baghdad', label: 'Baghdad, Iraq', offset: 3 },
    { value: 'Asia/Tehran', label: 'Tehran, Iran (IRST)', offset: 3.5 },
    { value: 'Asia/Jerusalem', label: 'Jerusalem, Israel', offset: 2 },
    
    // Asia - South Asia
    { value: 'Asia/Kolkata', label: 'Delhi, Mumbai, India (IST)', offset: 5.5 },
    { value: 'Asia/Karachi', label: 'Karachi, Pakistan (PKT)', offset: 5 },
    { value: 'Asia/Dhaka', label: 'Dhaka, Bangladesh', offset: 6 },
    { value: 'Asia/Kathmandu', label: 'Kathmandu, Nepal', offset: 5.75 },
    { value: 'Asia/Colombo', label: 'Colombo, Sri Lanka', offset: 5.5 },
    { value: 'Asia/Kabul', label: 'Kabul, Afghanistan', offset: 4.5 },
    
    // Asia - Southeast Asia
    { value: 'Asia/Bangkok', label: 'Bangkok, Thailand (ICT)', offset: 7 },
    { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh City, Vietnam', offset: 7 },
    { value: 'Asia/Jakarta', label: 'Jakarta, Indonesia (WIB)', offset: 7 },
    { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 8 },
    { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur, Malaysia', offset: 8 },
    { value: 'Asia/Manila', label: 'Manila, Philippines (PHT)', offset: 8 },
    { value: 'Asia/Yangon', label: 'Yangon, Myanmar', offset: 6.5 },
    { value: 'Asia/Phnom_Penh', label: 'Phnom Penh, Cambodia', offset: 7 },
    { value: 'Asia/Vientiane', label: 'Vientiane, Laos', offset: 7 },
    
    // Asia - East Asia
    { value: 'Asia/Shanghai', label: 'Beijing, Shanghai, China (CST)', offset: 8 },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', offset: 8 },
    { value: 'Asia/Taipei', label: 'Taipei, Taiwan', offset: 8 },
    { value: 'Asia/Tokyo', label: 'Tokyo, Osaka, Japan (JST)', offset: 9 },
    { value: 'Asia/Seoul', label: 'Seoul, South Korea (KST)', offset: 9 },
    { value: 'Asia/Pyongyang', label: 'Pyongyang, North Korea', offset: 9 },
    { value: 'Asia/Ulaanbaatar', label: 'Ulaanbaatar, Mongolia', offset: 8 },
    
    // Asia - Central Asia
    { value: 'Asia/Tashkent', label: 'Tashkent, Uzbekistan', offset: 5 },
    { value: 'Asia/Almaty', label: 'Almaty, Kazakhstan', offset: 6 },
    { value: 'Asia/Bishkek', label: 'Bishkek, Kyrgyzstan', offset: 6 },
    { value: 'Asia/Dushanbe', label: 'Dushanbe, Tajikistan', offset: 5 },
    { value: 'Asia/Ashgabat', label: 'Ashgabat, Turkmenistan', offset: 5 },
    
    // Oceania
    { value: 'Australia/Sydney', label: 'Sydney, Melbourne (AEST)', offset: 10 },
    { value: 'Australia/Perth', label: 'Perth, Australia (AWST)', offset: 8 },
    { value: 'Australia/Adelaide', label: 'Adelaide, Australia (ACST)', offset: 9.5 },
    { value: 'Australia/Brisbane', label: 'Brisbane, Australia (AEST)', offset: 10 },
    { value: 'Australia/Darwin', label: 'Darwin, Australia (ACST)', offset: 9.5 },
    { value: 'Pacific/Auckland', label: 'Auckland, New Zealand (NZST)', offset: 12 },
    { value: 'Pacific/Fiji', label: 'Suva, Fiji', offset: 12 },
    { value: 'Pacific/Samoa', label: 'Apia, Samoa', offset: 13 },
    { value: 'Pacific/Tongatapu', label: 'Nukuʻalofa, Tonga', offset: 13 },
    { value: 'Pacific/Port_Moresby', label: 'Port Moresby, Papua New Guinea', offset: 10 },
    { value: 'Pacific/Vanuatu', label: 'Port Vila, Vanuatu', offset: 11 },
    { value: 'Pacific/Noumea', label: 'Nouméa, New Caledonia', offset: 11 },
    { value: 'Pacific/Tahiti', label: 'Papeete, French Polynesia', offset: -10 },
    { value: 'Pacific/Marquesas', label: 'Marquesas Islands', offset: -9.5 },
    { value: 'Pacific/Gambier', label: 'Gambier Islands', offset: -9 },
    { value: 'Pacific/Pitcairn', label: 'Pitcairn Islands', offset: -8 },
    
    // Atlantic Islands
    { value: 'Atlantic/Azores', label: 'Azores, Portugal', offset: -1 },
    { value: 'Atlantic/Canary', label: 'Canary Islands, Spain', offset: 0 },
    { value: 'Atlantic/Cape_Verde', label: 'Cape Verde', offset: -1 },
    { value: 'Atlantic/Reykjavik', label: 'Reykjavik, Iceland', offset: 0 },
    { value: 'Atlantic/Bermuda', label: 'Hamilton, Bermuda', offset: -4 },
    
    // Indian Ocean
    { value: 'Indian/Mauritius', label: 'Port Louis, Mauritius', offset: 4 },
    { value: 'Indian/Reunion', label: 'Saint-Denis, Réunion', offset: 4 },
    { value: 'Indian/Seychelles', label: 'Victoria, Seychelles', offset: 4 },
    { value: 'Indian/Maldives', label: 'Malé, Maldives', offset: 5 },
  ];

  // Add user's current timezone if it's not already in the list
  const hasCurrentZone = allZones.some(zone => zone.value === currentTimeZone);
  if (!hasCurrentZone) {
    // Create a label for the user's timezone
    const currentZoneLabel = currentTimeZone.replace('_', ' ').replace('/', ' - ');
    allZones.unshift({
      value: currentTimeZone,
      label: `${currentZoneLabel} (Your Local Time)`,
      offset: 0 // Will be calculated dynamically
    });
  }

  return allZones;
};

const TIME_ZONES = getTimeZonesList();

export function UTCTimeZoneConverter() {
  // Get current time and timezone for defaults
  const getCurrentDefaults = () => {
    const now = new Date();
    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcTimeString = now.toISOString().slice(0, 19); // Remove Z and milliseconds
    
    return {
      utcTime: utcTimeString,
      timeZone: currentTimeZone
    };
  };

  const defaults = getCurrentDefaults();

  const [timeZoneData, setTimeZoneData] = useState<TimeZoneData>({
    utcTime: defaults.utcTime,
    localTime: '',
    utcOffset: 0,
    timeZone: defaults.timeZone,
    is24Hour: true,
  });

  const [result, setResult] = useState<ConversionResult | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = useCallback((date: Date, is24Hour: boolean, timeZone?: string): string => {
    if (timeZone) {
      return date.toLocaleString('en-US', {
        timeZone,
        hour12: !is24Hour,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
    
    return date.toLocaleString('en-US', {
      hour12: !is24Hour,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, []);

  const convertTime = useCallback((utcTimeStr: string, targetTimeZone: string, is24Hour: boolean): ConversionResult => {
    let utcDate: Date;
    
    if (utcTimeStr) {
      // Parse the input UTC time
      utcDate = new Date(utcTimeStr + (utcTimeStr.includes('Z') ? '' : 'Z'));
    } else {
      // Use current time if no input
      utcDate = new Date();
    }

    // Create local time in target timezone
    const localTime = new Date(utcDate.toLocaleString('en-US', { timeZone: targetTimeZone }));
    
    // Format times
    const utcTimeString = formatTime(utcDate, is24Hour, 'UTC');
    const localTimeString = formatTime(utcDate, is24Hour, targetTimeZone);
    
    // Get timezone info
    const timeZoneName = new Intl.DateTimeFormat('en', {
      timeZone: targetTimeZone,
      timeZoneName: 'long'
    }).formatToParts().find(part => part.type === 'timeZoneName')?.value || targetTimeZone;
    
    const timeZoneAbbreviation = new Intl.DateTimeFormat('en', {
      timeZone: targetTimeZone,
      timeZoneName: 'short'
    }).formatToParts().find(part => part.type === 'timeZoneName')?.value || '';
    
    // Calculate UTC offset
    const offsetMinutes = new Date().getTimezoneOffset() - new Date(utcDate.toLocaleString('en-US', { timeZone: targetTimeZone })).getTimezoneOffset();
    const offsetHours = offsetMinutes / 60;
    const utcOffset = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
    
    // Check if DST (simplified check)
    const janOffset = new Date(utcDate.getFullYear(), 0, 1).toLocaleString('en-US', { timeZone: targetTimeZone });
    const julOffset = new Date(utcDate.getFullYear(), 6, 1).toLocaleString('en-US', { timeZone: targetTimeZone });
    const isDST = janOffset !== julOffset;

    return {
      utcTime: utcDate,
      localTime: localTime,
      utcTimeString,
      localTimeString,
      timeZoneName,
      timeZoneAbbreviation,
      utcOffset,
      isDST
    };
  }, [formatTime]);

  // Auto-convert when data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const conversionResult = convertTime(timeZoneData.utcTime, timeZoneData.timeZone, timeZoneData.is24Hour);
        setResult(conversionResult);
      } catch (error) {
        console.error('Time conversion error:', error);
        setResult(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [timeZoneData, convertTime]);

  const updateTimeZoneData = <K extends keyof TimeZoneData>(field: K, value: TimeZoneData[K]) => {
    setTimeZoneData(prev => ({ ...prev, [field]: value }));
  };

  const setCurrentTime = () => {
    const now = new Date();
    const utcTimeString = now.toISOString().slice(0, 19); // Remove Z and milliseconds
    updateTimeZoneData('utcTime', utcTimeString);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    });
  };

  const getCurrentTimeInZone = (timeZone: string): string => {
    return formatTime(currentDateTime, timeZoneData.is24Hour, timeZone);
  };

  const getTimeZoneAbbreviation = (timeZone: string): string => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(date);
    const timeZoneName = parts.find(part => part.type === 'timeZoneName');
    return timeZoneName ? timeZoneName.value : '';
  };

  return (
    <ToolLayout pageTitle="UTC Time Zone Converter">
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Convert between UTC and local time zones with real-time updates. 
          Perfect for scheduling meetings, coordinating across time zones, and understanding global time differences.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Time Conversion</h2>
            
            <div className="space-y-4">
              {/* UTC Time Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    UTC Time
                  </label>
                  <button
                    onClick={setCurrentTime}
                    className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 transition-colors"
                  >
                    Use Current Time
                  </button>
                </div>
                <input
                  type="datetime-local"
                  value={timeZoneData.utcTime}
                  onChange={(e) => updateTimeZoneData('utcTime', e.target.value)}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter time in UTC format</p>
              </div>

              {/* Time Zone Selection */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Convert to Time Zone
                  </label>
                  <button
                    onClick={() => updateTimeZoneData('timeZone', getUserTimeZone())}
                    className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 transition-colors"
                  >
                    Use Current Timezone
                  </button>
                </div>
                <select
                  value={timeZoneData.timeZone}
                  onChange={(e) => updateTimeZoneData('timeZone', e.target.value)}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TIME_ZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label} {tz.offset !== 0 ? `(UTC${tz.offset >= 0 ? '+' : ''}${tz.offset})` : '(UTC)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* 12/24 Hour Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Format
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={timeZoneData.is24Hour}
                      onChange={() => updateTimeZoneData('is24Hour', true)}
                      className="mr-2"
                    />
                    <span className="text-sm">24 Hour</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!timeZoneData.is24Hour}
                      onChange={() => updateTimeZoneData('is24Hour', false)}
                      className="mr-2"
                    />
                    <span className="text-sm">12 Hour (AM/PM)</span>
                  </label>
                </div>
              </div>

              {/* Current Time Display */}
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Time</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>UTC:</span>
                    <span className="font-mono">{getCurrentTimeInZone('UTC')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected Zone:</span>
                    <span className="font-mono">{getCurrentTimeInZone(timeZoneData.timeZone)}</span>
                  </div>
                  {timeZoneData.timeZone === getUserTimeZone() && (
                    <div className="flex justify-center mt-2">
                      <span className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full">
                        Your Local Time Zone
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Results</h2>
            
            {!result && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter a UTC time to see the conversion results</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* UTC Time */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-blue-700 mb-1">UTC Time</div>
                      <div className="text-xl font-bold text-blue-800 font-mono">
                        {result.utcTimeString}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.utcTimeString)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Copy to clipboard"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Local Time */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-green-700 mb-1">Local Time</div>
                      <div className="text-xl font-bold text-green-800 font-mono">
                        {result.localTimeString}
                      </div>
                      <div className="text-sm text-green-600 mt-1">
                        {result.timeZoneName}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.localTimeString)}
                      className="text-green-600 hover:text-green-800 p-2"
                      title="Copy to clipboard"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Time Zone Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Time Zone Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Time Zone:</span>
                      <span className="font-medium">{result.timeZoneName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Abbreviation:</span>
                      <span className="font-medium">{result.timeZoneAbbreviation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>UTC Offset:</span>
                      <span className="font-medium">{result.utcOffset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daylight Saving:</span>
                      <span className={`font-medium ${result.isDST ? 'text-orange-600' : 'text-gray-600'}`}>
                        {result.isDST ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Time Zone Reference */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Time Zone Reference</h3>
          <p className="text-sm text-gray-600 mb-4">Click on any time zone for quick conversion. All {TIME_ZONES.length} time zones are available in the dropdown above.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIME_ZONES.filter(tz => [
              'UTC',
              'America/New_York',
              'America/Chicago', 
              'America/Denver',
              'America/Los_Angeles',
              'Europe/London',
              'Africa/Cairo',
              'Europe/Paris',
              'Europe/Moscow',
              'Asia/Dubai',
              'Asia/Kolkata',
              'Asia/Shanghai',
              'Asia/Tokyo',
              'Australia/Sydney',
              'Pacific/Auckland'
            ].includes(tz.value) || tz.value === getUserTimeZone()).map((tz) => (
              <div
                key={tz.value}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  tz.value === timeZoneData.timeZone 
                    ? 'bg-orange-100 hover:bg-orange-200' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => updateTimeZoneData('timeZone', tz.value)}
              >
                <div className="font-medium text-sm text-gray-900">{tz.label.split(' (')[0]}</div>
                <div className="text-xs text-gray-500 mt-1 font-mono">{getCurrentTimeInZone(tz.value)}</div>
                <div className="text-xs text-orange-600 mt-1">
                  {tz.value === 'UTC' ? 'UTC±0' : `UTC${tz.offset >= 0 ? '+' : ''}${tz.offset}`} ({getTimeZoneAbbreviation(tz.value)})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Tips */}
        <div>
          <h3>How to Use the UTC Time Zone Converter</h3>
          <p>Use the “Current Time” button to get the exact time for conversion. Copy results easily with the copy button. You can also switch between 12-hour and 24-hour formats with one click. This helps you read and share times in the format you prefer.</p>

          <p>Click any time zone in the reference list to select it quickly. Always check if daylight saving time is active to keep results accurate. Remember, UTC is the global time standard and never changes for daylight saving.</p>

          <h3>What is UTC?</h3>
          <p>UTC stands for Coordinated Universal Time. It is the primary time standard by which the world regulates clocks and time. It is not subject to daylight saving time adjustments, making it a reliable reference point for timekeeping worldwide.</p>

          <h3>Why Do We Need Time Zones?</h3>
          <p>Time zones exist to keep local time in sync with the position of the sun. Without them, noon would occur at different times across nearby cities. The world is divided into 24 main zones, each roughly one hour apart. This system keeps clocks consistent with daylight and nighttime. Time zones help standardize time across regions, allowing for synchronized activities and communication. Businesses can plan meetings, airlines can schedule flights, and people can connect across countries.</p>

          <h3>What is Daylight Saving Time (DST)</h3>
          <p>Daylight Saving Time (DST) is the practice of setting clocks forward by one hour during the warmer months to extend evening daylight. This means that in regions observing DST, clocks are typically set forward in the spring (&quot;spring forward&quot;) and set back in the fall (&quot;fall back&quot;). The main goal of DST is to make better use of daylight during the longer days of summer, which can lead to energy savings and more daylight for outdoor activities in the evening. However, not all countries or regions observe DST, and its implementation can vary widely around the world.</p>

          <h3>History of Daylight Saving Time (DST)</h3>
          <p>The concept of Daylight Saving Time was first proposed by Benjamin Franklin in 1784, although it was not implemented at that time. The modern practice began during World War I. Germany first adopted it in 1916 during World War I to conserve fuel. Many countries adopted DST during the war, and it became more widespread during World War II. After the war, some countries reverted to standard time, while others kept DST. In the United States, the Uniform Time Act of 1966 established a system of uniform DST, but states could opt out. Today, DST is observed in many countries, but not universally, and debates continue about its effectiveness and impact.</p>
        </div>
      </div>
    </ToolLayout>
  );
}