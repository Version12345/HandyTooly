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

export function AddTimeToDate() {
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

    const newDate = addTimeToDate(date, amount, timeUnit);
    
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
            <h2>{ToolNameLists.AddTimeToDate}</h2>
            
            <CalculationTypeSelector currentType={CALCULATION_TYPE.ADD_TIME_TO_DATE} />

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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Results</h3>
            
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
  <div className="mt-5">
    <h3>Add Time to Date</h3>
    <p>Add days, weeks, months, or years to any starting date. The calculator gives you the new date right away. It&apos;s handy for planning future events, due dates, or countdowns.</p>

    <p>Simply enter your starting date, choose how much time to add (days, weeks, months, or years), and see the resulting date with full details including the weekday, day of year, and week number.</p>

    <h3>Planning Made Easy</h3>
    <p>Perfect for project planning, event scheduling, or setting reminders. Whether you need to know what date it will be 90 days from today or what day of the week Christmas falls on next year, this calculator has you covered.</p>
  </div>
);