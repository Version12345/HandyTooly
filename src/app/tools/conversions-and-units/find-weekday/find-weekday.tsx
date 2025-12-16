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
  getWeekOfYear 
} from '@/utils/dateCalculations';

export function FindWeekday() {
  const [dateToCheck, setDateToCheck] = useState(() => formatDateToString(new Date()));
  const [result, setResult] = useState<{
    weekday: string;
    date: string;
    dayOfYear: number;
    weekOfYear: number;
  } | null>(null);

  useEffect(() => {
    if (!dateToCheck) return;

    const date = parseLocalDate(dateToCheck);
    if (isNaN(date.getTime())) return;

    setResult({
      weekday: getWeekday(date),
      date: formatDate(date),
      dayOfYear: getDayOfYear(date),
      weekOfYear: getWeekOfYear(date)
    });
  }, [dateToCheck]);

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.DayConverterDateCalculator}
      educationContent={educationalContent}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2>{ToolNameLists.FindWeekday}</h2>
            
            <CalculationTypeSelector currentType={CALCULATION_TYPE.FIND_WEEKDAY} />

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
    <h3>Find Weekday</h3>
    <p>Use this tool to learn what day of the week any date falls on. Type in a date, and it instantly tells you if it&apos;s a Monday, Friday, or any other day. It&apos;s perfect for checking birthdays, anniversaries, or planning events.</p>

    <p>The tool also shows additional information like the day of the year (1-365/366) and the week number of the year. This is useful for project planning, scheduling, and understanding date patterns.</p>

    <h3>Quick Date Selection</h3>
    <p>Use the quick date buttons to easily select common dates like today, tomorrow, next week, or special dates like Christmas and New Year. This saves time when you need to check weekdays for frequently used dates.</p>
  </div>
);