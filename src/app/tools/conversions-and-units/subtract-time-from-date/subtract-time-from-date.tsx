'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { CalculationTypeSelector, CALCULATION_TYPE } from '@/components/dateCalculator/CalculationTypeSelector';
import { QuickDateSelector } from '@/components/dateCalculator/QuickDateSelector';
import { ResultDisplay } from '@/components/dateCalculator/ResultDisplay';
import { 
  parseLocalDate, 
  formatDate, 
  formatDateToString, 
  getWeekday, 
  getDayOfYear, 
  getWeekOfYear,
  addTimeToDate 
} from '@/utils/dateCalculations';

export function SubtractTimeFromDate() {
  const [dateToCheck, setDateToCheck] = useState(() => formatDateToString(new Date()));
  const [timeAmount, setTimeAmount] = useState('1');
  const [timeUnit, setTimeUnit] = useState('days');
  const [result, setResult] = useState<{
    weekday: string;
    date: string;
    dayOfYear: number;
    weekOfYear: number;
  } | null>(null);

  useEffect(() => {
    if (!dateToCheck || !timeAmount) return;

    const date = parseLocalDate(dateToCheck);
    const amount = parseInt(timeAmount);
    
    if (isNaN(date.getTime()) || isNaN(amount)) return;

    const newDate = addTimeToDate(date, -amount, timeUnit); // Negative amount for subtraction
    
    setResult({
      weekday: getWeekday(newDate),
      date: formatDate(newDate),
      dayOfYear: getDayOfYear(newDate),
      weekOfYear: getWeekOfYear(newDate)
    });
  }, [dateToCheck, timeAmount, timeUnit]);

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.DayConverterDateCalculator}
      educationContent={educationalContent}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2>{ToolNameLists.SubtractTimeFromDate}</h2>
            
            <CalculationTypeSelector currentType={CALCULATION_TYPE.SUBTRACT_TIME_FROM_DATE} />

            {/* Date Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Date:
              </label>
              <input
                type="date"
                value={dateToCheck}
                onChange={(e) => setDateToCheck(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Time Amount and Unit */}
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

            <QuickDateSelector onDateSelect={setDateToCheck} />
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
            
            <ResultDisplay
              weekday={result?.weekday}
              date={result?.date}
              dayOfYear={result?.dayOfYear}
              weekOfYear={result?.weekOfYear}
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const educationalContent = (
  <div>
    <h3>Subtract Time from Date</h3>
    <p>Enter a date and subtract any number of days, weeks, months, or years. You&apos;ll see the earlier date instantly. It&apos;s useful when checking how far back something happened or planning reminders.</p>

    <p>This tool is perfect for calculating past dates, determining when something occurred relative to a known date, or setting up reminder schedules that work backwards from a deadline.</p>

    <h3>Historical Dating</h3>
    <p>Whether you need to know what date it was 30 days ago, when to start a project that takes 6 weeks to complete, or what day of the week it was a year ago, this calculator makes it simple.</p>
  </div>
);
