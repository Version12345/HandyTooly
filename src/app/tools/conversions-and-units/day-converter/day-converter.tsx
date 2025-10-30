'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';

enum CALCULATION_TYPE {
  FIND_WEEKDAY = 'Find Weekday',
  DATE_DIFFERENCE = 'Date Difference',
  ADD_TIME_TO_DATE = 'Add Time to Date',
  SUBTRACT_TIME_FROM_DATE = 'Subtract Time from Date',
  BUSINESS_DAYS_CALCULATOR = 'Business Days Calculator'
}

interface CalculationResult {
  weekday?: string;
  date?: string;
  dayOfYear?: number;
  weekOfYear?: number;
  difference?: {
    years?: number;
    months?: number;
    days?: number;
    totalDays?: number;
  };
  businessDays?: number;
}

const QUICK_DATE_OPTIONS = [
  { label: 'Today', getValue: () => new Date() },
  { label: 'Tomorrow', getValue: () => { const d = new Date(); d.setDate(d.getDate() + 1); return d; } },
  { label: 'Yesterday', getValue: () => { const d = new Date(); d.setDate(d.getDate() - 1); return d; } },
  { label: 'Next Week', getValue: () => { const d = new Date(); d.setDate(d.getDate() + 7); return d; } },
  { label: 'Last Week', getValue: () => { const d = new Date(); d.setDate(d.getDate() - 7); return d; } },
  { label: 'Next Month', getValue: () => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d; } },
  { label: 'Last Month', getValue: () => { const d = new Date(); d.setMonth(d.getMonth() - 1); return d; } },
  { label: 'New Year', getValue: () => { const d = new Date(); return new Date(d.getFullYear() + 1, 0, 1); } },
  { label: 'Christmas', getValue: () => { const d = new Date(); return new Date(d.getFullYear(), 11, 25); } },
  { label: 'End of Year', getValue: () => { const d = new Date(); return new Date(d.getFullYear(), 11, 31); } }
];

export function DayConverter() {
  const [calculationType, setCalculationType] = useState<CALCULATION_TYPE>(CALCULATION_TYPE.FIND_WEEKDAY);
  const [dateToCheck, setDateToCheck] = useState('');
  const [secondDate, setSecondDate] = useState('');
  const [timeAmount, setTimeAmount] = useState('');
  const [timeUnit, setTimeUnit] = useState('days');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const formatDate = useCallback((date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const formatDateShort = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const parseLocalDate = useCallback((dateString: string): Date => {
    // Parse date string as local date to avoid timezone issues
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      const day = parseInt(parts[2]);
      return new Date(year, month, day);
    }
    return new Date(dateString);
  }, []);

  const getWeekday = useCallback((date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }, []);

  const getDayOfYear = useCallback((date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }, []);

  const getWeekOfYear = useCallback((date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }, []);

  const calculateDateDifference = useCallback((date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = totalDays % 30;

    return { years, months, days, totalDays };
  }, []);

  const calculateBusinessDays = useCallback((startDate: Date, endDate: Date): number => {
    let count = 0;
    const curDate = new Date(startDate);
    
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    
    return count;
  }, []);

  const addTimeToDate = useCallback((date: Date, amount: number, unit: string): Date => {
    const newDate = new Date(date);
    
    switch (unit) {
      case 'days':
        newDate.setDate(newDate.getDate() + amount);
        break;
      case 'weeks':
        newDate.setDate(newDate.getDate() + (amount * 7));
        break;
      case 'months':
        newDate.setMonth(newDate.getMonth() + amount);
        break;
      case 'years':
        newDate.setFullYear(newDate.getFullYear() + amount);
        break;
    }
    
    return newDate;
  }, []);

  const performCalculation = useCallback(() => {
    if (!dateToCheck) return;

    const date = parseLocalDate(dateToCheck);
    if (isNaN(date.getTime())) return;

    let calculationResult: CalculationResult = {};

    switch (calculationType) {
      case CALCULATION_TYPE.FIND_WEEKDAY:
        calculationResult = {
          weekday: getWeekday(date),
          date: formatDate(date),
          dayOfYear: getDayOfYear(date),
          weekOfYear: getWeekOfYear(date)
        };
        break;

      case CALCULATION_TYPE.DATE_DIFFERENCE:
        if (secondDate) {
          const date2 = parseLocalDate(secondDate);
          if (!isNaN(date2.getTime())) {
            calculationResult = {
              difference: calculateDateDifference(date, date2)
            };
          }
        }
        break;

      case CALCULATION_TYPE.ADD_TIME_TO_DATE:
        if (timeAmount) {
          const amount = parseInt(timeAmount);
          if (!isNaN(amount)) {
            const newDate = addTimeToDate(date, amount, timeUnit);
            calculationResult = {
              weekday: getWeekday(newDate),
              date: formatDate(newDate),
              dayOfYear: getDayOfYear(newDate),
              weekOfYear: getWeekOfYear(newDate)
            };
          }
        }
        break;

      case CALCULATION_TYPE.SUBTRACT_TIME_FROM_DATE:
        if (timeAmount) {
          const amount = parseInt(timeAmount);
          if (!isNaN(amount)) {
            const newDate = addTimeToDate(date, -amount, timeUnit);
            calculationResult = {
              weekday: getWeekday(newDate),
              date: formatDate(newDate),
              dayOfYear: getDayOfYear(newDate),
              weekOfYear: getWeekOfYear(newDate)
            };
          }
        }
        break;

      case CALCULATION_TYPE.BUSINESS_DAYS_CALCULATOR:
        if (secondDate) {
          const date2 = parseLocalDate(secondDate);
          if (!isNaN(date2.getTime())) {
            calculationResult = {
              businessDays: calculateBusinessDays(date, date2)
            };
          }
        }
        break;
    }

    setResult(calculationResult);
  }, [calculationType, dateToCheck, secondDate, timeAmount, timeUnit, formatDate, getWeekday, getDayOfYear, getWeekOfYear, calculateDateDifference, calculateBusinessDays, addTimeToDate, parseLocalDate]);

  useEffect(() => {
    const timeoutId = setTimeout(performCalculation, 300);
    return () => clearTimeout(timeoutId);
  }, [performCalculation]);

  const handleQuickDateSelect = (option: typeof QUICK_DATE_OPTIONS[0]) => {
    const date = option.getValue();
    setDateToCheck(formatDateShort(date));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <ToolLayout pageTitle="Day Converter & Date Calculator">
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Calculate dates, find weekdays, determine date differences, and perform various date-related calculations. 
          Perfect for planning, scheduling, and date arithmetic.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Date Calculator</h2>
            
            {/* Calculation Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculation Type:
              </label>
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value as CALCULATION_TYPE)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {Object.values(CALCULATION_TYPE).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date to Check:
              </label>
              <input
                type="date"
                value={dateToCheck}
                onChange={(e) => setDateToCheck(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Conditional Inputs */}
            {(calculationType === CALCULATION_TYPE.DATE_DIFFERENCE || calculationType === CALCULATION_TYPE.BUSINESS_DAYS_CALCULATOR) && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Second Date:
                </label>
                <input
                  type="date"
                  value={secondDate}
                  onChange={(e) => setSecondDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}

            {(calculationType === CALCULATION_TYPE.ADD_TIME_TO_DATE || calculationType === CALCULATION_TYPE.SUBTRACT_TIME_FROM_DATE) && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount:
                  </label>
                  <input
                    type="number"
                    value={timeAmount}
                    onChange={(e) => setTimeAmount(e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit:
                  </label>
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
            )}

            {/* Quick Date Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Date Selection
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {QUICK_DATE_OPTIONS.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleQuickDateSelect(option)}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Calculation Results</h2>
            
            {!result && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter a date to see calculation results</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Main Result Display */}
                {result.weekday && (
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {result.weekday}
                    </div>
                    <div className="text-lg text-blue-800">
                      {result.date}
                    </div>
                  </div>
                )}

                {/* Detailed Information */}
                {result.dayOfYear && (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Weekday:</span>
                      <div className="flex items-center gap-2">
                        <span>{result.weekday}</span>
                        <button
                          onClick={() => copyToClipboard(result.weekday || '')}
                          className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Day of Year:</span>
                      <div className="flex items-center gap-2">
                        <span>{result.dayOfYear}</span>
                        <button
                          onClick={() => copyToClipboard(result.dayOfYear?.toString() || '')}
                          className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Week of Year:</span>
                      <div className="flex items-center gap-2">
                        <span>{result.weekOfYear}</span>
                        <button
                          onClick={() => copyToClipboard(result.weekOfYear?.toString() || '')}
                          className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Difference Results */}
                {result.difference && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Date Difference:</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {result.difference.totalDays} days
                        </div>
                        <div className="text-sm text-gray-600">
                          {result.difference.years} years, {result.difference.months} months, {result.difference.days} days
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Business Days Results */}
                {result.businessDays !== undefined && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">Business Days:</h3>
                    <div className="text-2xl font-bold text-green-600">
                      {result.businessDays} days
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      Excluding weekends
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Usage Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Calculation Types</h4>
              <ul className="space-y-1">
                <li>• <strong>Find Weekday:</strong> Determine what day of the week a date falls on</li>
                <li>• <strong>Date Difference:</strong> Calculate the time between two dates</li>
                <li>• <strong>Add/Subtract Time:</strong> Add or subtract time from a specific date</li>
                <li>• <strong>Business Days:</strong> Count working days between dates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Features</h4>
              <ul className="space-y-1">
                <li>• Quick date selection buttons for common dates</li>
                <li>• Multiple result formats and time zones</li>
                <li>• Copy results to clipboard</li>
                <li>• Real-time calculations as you type</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}