'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';

interface TimeZoneConversionData {
  inputTime: string;
  inputDate: string;
  fromTimeZone: string;
  toTimeZone: string;
  is24Hour: boolean;
}

interface ConversionResult {
  fromTime: Date;
  toTime: Date;
  fromTimeString: string;
  toTimeString: string;
  fromTimeZoneName: string;
  toTimeZoneName: string;
  fromOffset: string;
  toOffset: string;
  timeDifference: string;
  isDSTFrom: boolean;
  isDSTTo: boolean;
}

// Get user's current timezone
const getUserTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/New_York';
  }
};

// Comprehensive time zones list
const getTimeZonesList = () => {
  const currentTimeZone = getUserTimeZone();
  
  const allZones = [
    // UTC
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)', region: 'UTC' },
    
    // Americas - North America
    { value: 'America/New_York', label: 'Eastern Time (ET) - New York, Toronto', region: 'North America' },
    { value: 'America/Chicago', label: 'Central Time (CT) - Chicago, Dallas', region: 'North America' },
    { value: 'America/Denver', label: 'Mountain Time (MT) - Denver, Phoenix', region: 'North America' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT) - Los Angeles, Seattle', region: 'North America' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT) - Anchorage', region: 'North America' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST) - Honolulu', region: 'North America' },
    { value: 'America/Toronto', label: 'Toronto, Canada', region: 'North America' },
    { value: 'America/Vancouver', label: 'Vancouver, Canada', region: 'North America' },
    { value: 'America/Halifax', label: 'Halifax, Canada (AST)', region: 'North America' },
    { value: 'America/St_Johns', label: 'Newfoundland Time (NST)', region: 'North America' },
    { value: 'America/Mexico_City', label: 'Mexico City, Mexico', region: 'North America' },
    
    // Americas - South America
    { value: 'America/Sao_Paulo', label: 'São Paulo, Brazil (BRT)', region: 'South America' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires, Argentina', region: 'South America' },
    { value: 'America/Santiago', label: 'Santiago, Chile', region: 'South America' },
    { value: 'America/Lima', label: 'Lima, Peru', region: 'South America' },
    { value: 'America/Bogota', label: 'Bogotá, Colombia', region: 'South America' },
    { value: 'America/Caracas', label: 'Caracas, Venezuela', region: 'South America' },
    
    // Europe
    { value: 'Europe/London', label: 'London, UK (GMT/BST)', region: 'Europe' },
    { value: 'Europe/Paris', label: 'Paris, France (CET)', region: 'Europe' },
    { value: 'Europe/Berlin', label: 'Berlin, Germany', region: 'Europe' },
    { value: 'Europe/Rome', label: 'Rome, Italy', region: 'Europe' },
    { value: 'Europe/Madrid', label: 'Madrid, Spain', region: 'Europe' },
    { value: 'Europe/Amsterdam', label: 'Amsterdam, Netherlands', region: 'Europe' },
    { value: 'Europe/Brussels', label: 'Brussels, Belgium', region: 'Europe' },
    { value: 'Europe/Zurich', label: 'Zurich, Switzerland', region: 'Europe' },
    { value: 'Europe/Vienna', label: 'Vienna, Austria', region: 'Europe' },
    { value: 'Europe/Prague', label: 'Prague, Czech Republic', region: 'Europe' },
    { value: 'Europe/Warsaw', label: 'Warsaw, Poland', region: 'Europe' },
    { value: 'Europe/Stockholm', label: 'Stockholm, Sweden', region: 'Europe' },
    { value: 'Europe/Oslo', label: 'Oslo, Norway', region: 'Europe' },
    { value: 'Europe/Helsinki', label: 'Helsinki, Finland', region: 'Europe' },
    { value: 'Europe/Athens', label: 'Athens, Greece', region: 'Europe' },
    { value: 'Europe/Moscow', label: 'Moscow, Russia (MSK)', region: 'Europe' },
    { value: 'Europe/Istanbul', label: 'Istanbul, Turkey', region: 'Europe' },
    
    // Asia - East Asia
    { value: 'Asia/Tokyo', label: 'Tokyo, Japan (JST)', region: 'East Asia' },
    { value: 'Asia/Seoul', label: 'Seoul, South Korea (KST)', region: 'East Asia' },
    { value: 'Asia/Shanghai', label: 'Beijing, Shanghai, China (CST)', region: 'East Asia' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', region: 'East Asia' },
    { value: 'Asia/Taipei', label: 'Taipei, Taiwan', region: 'East Asia' },
    
    // Asia - Southeast Asia
    { value: 'Asia/Singapore', label: 'Singapore (SGT)', region: 'Southeast Asia' },
    { value: 'Asia/Bangkok', label: 'Bangkok, Thailand (ICT)', region: 'Southeast Asia' },
    { value: 'Asia/Jakarta', label: 'Jakarta, Indonesia (WIB)', region: 'Southeast Asia' },
    { value: 'Asia/Manila', label: 'Manila, Philippines (PHT)', region: 'Southeast Asia' },
    { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur, Malaysia', region: 'Southeast Asia' },
    { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh City, Vietnam', region: 'Southeast Asia' },
    
    // Asia - South Asia
    { value: 'Asia/Kolkata', label: 'Delhi, Mumbai, India (IST)', region: 'South Asia' },
    { value: 'Asia/Karachi', label: 'Karachi, Pakistan (PKT)', region: 'South Asia' },
    { value: 'Asia/Dhaka', label: 'Dhaka, Bangladesh', region: 'South Asia' },
    { value: 'Asia/Kathmandu', label: 'Kathmandu, Nepal', region: 'South Asia' },
    { value: 'Asia/Colombo', label: 'Colombo, Sri Lanka', region: 'South Asia' },
    
    // Asia - Middle East
    { value: 'Asia/Dubai', label: 'Dubai, UAE (GST)', region: 'Middle East' },
    { value: 'Asia/Qatar', label: 'Doha, Qatar', region: 'Middle East' },
    { value: 'Asia/Riyadh', label: 'Riyadh, Saudi Arabia', region: 'Middle East' },
    { value: 'Asia/Tehran', label: 'Tehran, Iran (IRST)', region: 'Middle East' },
    { value: 'Asia/Jerusalem', label: 'Jerusalem, Israel', region: 'Middle East' },
    
    // Africa
    { value: 'Africa/Cairo', label: 'Cairo, Egypt', region: 'Africa' },
    { value: 'Africa/Lagos', label: 'Lagos, Nigeria (WAT)', region: 'Africa' },
    { value: 'Africa/Nairobi', label: 'Nairobi, Kenya (EAT)', region: 'Africa' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg, South Africa (SAST)', region: 'Africa' },
    { value: 'Africa/Casablanca', label: 'Casablanca, Morocco', region: 'Africa' },
    
    // Oceania
    { value: 'Australia/Sydney', label: 'Sydney, Melbourne (AEST)', region: 'Oceania' },
    { value: 'Australia/Perth', label: 'Perth, Australia (AWST)', region: 'Oceania' },
    { value: 'Australia/Adelaide', label: 'Adelaide, Australia (ACST)', region: 'Oceania' },
    { value: 'Pacific/Auckland', label: 'Auckland, New Zealand (NZST)', region: 'Oceania' },
    { value: 'Pacific/Fiji', label: 'Suva, Fiji', region: 'Oceania' },
  ];

  // Add user's current timezone if it's not already in the list
  const hasCurrentZone = allZones.some(zone => zone.value === currentTimeZone);
  if (!hasCurrentZone) {
    const currentZoneLabel = currentTimeZone.replace('_', ' ').replace('/', ' - ');
    allZones.unshift({
      value: currentTimeZone,
      label: `${currentZoneLabel} (Your Local Time)`,
      region: 'Local'
    });
  }

  return allZones.sort((a, b) => {
    if (a.region === 'Local') return -1;
    if (b.region === 'Local') return 1;
    if (a.region === 'UTC') return -1;
    if (b.region === 'UTC') return 1;
    return a.region.localeCompare(b.region);
  });
};

export default function TimeZoneConverter() {
  const currentTimeZone = getUserTimeZone();
  const timeZones = useMemo(() => getTimeZonesList(), []);
  
  const [conversionData, setConversionData] = useState<TimeZoneConversionData>({
    inputTime: new Date().toTimeString().slice(0, 5),
    inputDate: new Date().toISOString().split('T')[0],
    fromTimeZone: currentTimeZone,
    toTimeZone: 'UTC',
    is24Hour: true,
  });

  const [result, setResult] = useState<ConversionResult | null>(null);

  const convertTimeZone = useCallback(() => {
    try {
      const { inputTime, inputDate, fromTimeZone, toTimeZone } = conversionData;
      
      if (!inputTime || !inputDate) return;

      // Create datetime string and parse in from timezone
      const dateTimeString = `${inputDate}T${inputTime}:00`;
      const inputDateTime = new Date(dateTimeString);
      
      // Format times
      const formatOptions: Intl.DateTimeFormatOptions = {
        hour12: !conversionData.is24Hour,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };

      const fromTimeString = inputDateTime.toLocaleString('en-US', {
        ...formatOptions,
        timeZone: fromTimeZone,
      });
      
      const toTimeString = inputDateTime.toLocaleString('en-US', {
        ...formatOptions,
        timeZone: toTimeZone,
      });

      // Get timezone names and offsets
      const fromTimeZoneName = timeZones.find(tz => tz.value === fromTimeZone)?.label || fromTimeZone;
      const toTimeZoneName = timeZones.find(tz => tz.value === toTimeZone)?.label || toTimeZone;
      
      // Get timezone offsets as strings
      const getTimezoneOffset = (timezone: string, date: Date): string => {
        const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
        const local = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
        const offsetMinutes = (local.getTime() - utc.getTime()) / (1000 * 60);
        const hours = Math.floor(Math.abs(offsetMinutes) / 60);
        const minutes = Math.abs(offsetMinutes) % 60;
        const sign = offsetMinutes >= 0 ? '+' : '-';
        return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      };

      const fromOffsetString = getTimezoneOffset(fromTimeZone, inputDateTime);
      const toOffsetString = getTimezoneOffset(toTimeZone, inputDateTime);
      
      // Calculate time difference
      const fromMillis = new Date(inputDateTime.toLocaleString('en-US', { timeZone: fromTimeZone })).getTime();
      const toMillis = new Date(inputDateTime.toLocaleString('en-US', { timeZone: toTimeZone })).getTime();
      const diffHours = Math.abs(toMillis - fromMillis) / (1000 * 60 * 60);
      const diffText = diffHours === 0 ? 'Same time' : 
                     diffHours < 1 ? `${Math.round(diffHours * 60)} minutes` : 
                     diffHours % 1 === 0 ? `${diffHours} hours` : 
                     `${Math.floor(diffHours)} hours ${Math.round((diffHours % 1) * 60)} minutes`;

      // Check for DST (simplified check)
      const isDSTFrom = fromOffsetString !== getTimezoneOffset(fromTimeZone, new Date('2024-01-01'));
      const isDSTTo = toOffsetString !== getTimezoneOffset(toTimeZone, new Date('2024-01-01'));

      setResult({
        fromTime: inputDateTime,
        toTime: inputDateTime,
        fromTimeString,
        toTimeString,
        fromTimeZoneName,
        toTimeZoneName,
        fromOffset: fromOffsetString,
        toOffset: toOffsetString,
        timeDifference: diffText,
        isDSTFrom,
        isDSTTo,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      setResult(null);
    }
  }, [conversionData]);

  useEffect(() => {
    convertTimeZone();
  }, [convertTimeZone]);

  const updateConversionData = (field: keyof TimeZoneConversionData, value: string | boolean) => {
    setConversionData(prev => ({ ...prev, [field]: value }));
  };

  const swapTimeZones = () => {
    setConversionData(prev => ({
      ...prev,
      fromTimeZone: prev.toTimeZone,
      toTimeZone: prev.fromTimeZone,
    }));
  };

  const setCurrentTime = () => {
    const now = new Date();
    setConversionData(prev => ({
      ...prev,
      inputTime: now.toTimeString().slice(0, 5),
      inputDate: now.toISOString().split('T')[0],
    }));
  };

  const groupedTimeZones = useMemo(() => {
    const grouped: {[key: string]: typeof timeZones} = {};
    timeZones.forEach(tz => {
      if (!grouped[tz.region]) {
        grouped[tz.region] = [];
      }
      grouped[tz.region].push(tz);
    });
    return grouped;
  }, [timeZones]);

  return (
    <ToolLayout toolCategory={ToolNameLists.UTCTimeZoneConverter}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Time Zone Converter</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={conversionData.inputDate}
                  onChange={(e) => updateConversionData('inputDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={conversionData.inputTime}
                    onChange={(e) => updateConversionData('inputTime', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={setCurrentTime}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                  >
                    Now
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Time Zone
                </label>
                <select
                  value={conversionData.fromTimeZone}
                  onChange={(e) => updateConversionData('fromTimeZone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(groupedTimeZones).map(([region, zones]) => (
                    <optgroup key={region} label={region}>
                      {zones.map(zone => (
                        <option key={zone.value} value={zone.value}>
                          {zone.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={swapTimeZones}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  title="Swap time zones"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Swap
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Time Zone
                </label>
                <select
                  value={conversionData.toTimeZone}
                  onChange={(e) => updateConversionData('toTimeZone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(groupedTimeZones).map(([region, zones]) => (
                    <optgroup key={region} label={region}>
                      {zones.map(zone => (
                        <option key={zone.value} value={zone.value}>
                          {zone.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="24hour"
                  checked={conversionData.is24Hour}
                  onChange={(e) => updateConversionData('is24Hour', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="24hour" className="text-sm text-gray-700">
                  Use 24-hour format
                </label>
              </div>
            </div>
          </div>

          {/* Conversion Result */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Result</h2>
            
            {result ? (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-800 mb-1">From</div>
                  <div className="text-lg font-semibold text-blue-900">
                    {result.fromTimeString}
                  </div>
                  <div className="text-sm text-blue-700">
                    {result.fromTimeZoneName}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {result.fromOffset} {result.isDSTFrom && '(DST)'}
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-gray-500">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="h-px bg-gray-300 flex-1"></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.timeDifference}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-green-800 mb-1">To</div>
                  <div className="text-lg font-semibold text-green-900">
                    {result.toTimeString}
                  </div>
                  <div className="text-sm text-green-700">
                    {result.toTimeZoneName}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {result.toOffset} {result.isDSTTo && '(DST)'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Enter time details to see conversion</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Conversions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Time Zone Conversions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { from: 'America/New_York', to: 'Europe/London', label: 'New York ↔ London' },
              { from: 'America/Los_Angeles', to: 'Asia/Tokyo', label: 'Los Angeles ↔ Tokyo' },
              { from: 'Europe/Paris', to: 'Asia/Singapore', label: 'Paris ↔ Singapore' },
              { from: 'America/Chicago', to: 'Australia/Sydney', label: 'Chicago ↔ Sydney' },
              { from: 'Asia/Shanghai', to: 'America/New_York', label: 'Shanghai ↔ New York' },
              { from: 'Europe/Berlin', to: 'Asia/Dubai', label: 'Berlin ↔ Dubai' },
            ].map((conversion, index) => (
              <button
                key={index}
                onClick={() => {
                  setConversionData(prev => ({
                    ...prev,
                    fromTimeZone: conversion.from,
                    toTimeZone: conversion.to,
                  }));
                }}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">
                  {conversion.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Click to convert
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Educational Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Understanding Time Zones</h3>
          <p className="text-gray-700">
            Time zones are regions of the Earth that have adopted the same standard time. The world is divided into 24 time zones, 
            each typically 15 degrees of longitude wide, corresponding to one hour of time difference. This system helps coordinate 
            activities across different regions of the world.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-900">How to Use This Converter</h4>
          <p className="text-gray-700">
            Select your source time zone and the time zone you want to convert to, then enter the date and time. The converter 
            will show you the equivalent time in your target time zone, along with useful information like the time difference 
            and timezone offsets.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-900">Daylight Saving Time</h4>
          <p className="text-gray-700">
            Many regions observe Daylight Saving Time (DST), where clocks are moved forward by one hour during warmer months. 
            This converter automatically accounts for DST when it&apos;s in effect, ensuring accurate time conversions year-round.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}