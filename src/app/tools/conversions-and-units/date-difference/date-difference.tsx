'use client';

import React, { useState, useEffect } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { CalculationTypeSelector, CALCULATION_TYPE } from '@/components/dateCalculator/CalculationTypeSelector';
import { QuickDateSelector } from '@/components/dateCalculator/QuickDateSelector';
import { ResultDisplay } from '@/components/dateCalculator/ResultDisplay';
import { 
  parseLocalDate, 
  formatDateToString, 
  calculateDateDifference 
} from '@/utils/dateCalculations';

export function DateDifference() {
  const currentDate = new Date();
  const [dateToCheck, setDateToCheck] = useState(() => formatDateToString(currentDate));
  const [secondDate, setSecondDate] = useState(() => formatDateToString(new Date(currentDate.setDate(currentDate.getDate() + 7))));
  const [result, setResult] = useState<{
    difference: {
      years: number;
      months: number;
      days: number;
      totalDays: number;
    };
  } | null>(null);

  useEffect(() => {
    if (!dateToCheck || !secondDate) return;

    const date1 = parseLocalDate(dateToCheck);
    const date2 = parseLocalDate(secondDate);
    
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) return;

    setResult({
      difference: calculateDateDifference(date1, date2)
    });
  }, [dateToCheck, secondDate]);

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.DayConverterDateCalculator}
      educationContent={educationalContent}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2>{ToolNameLists.DateDifference}</h2>
            
            <CalculationTypeSelector currentType={CALCULATION_TYPE.DATE_DIFFERENCE} />

            {/* Date Inputs */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Date:
              </label>
              <input
                type="date"
                value={dateToCheck}
                onChange={(e) => setDateToCheck(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

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

            <QuickDateSelector onDateSelect={setSecondDate} />
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Results</h3>
            
            <ResultDisplay>
              {result?.difference && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Date Difference:</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-sky-50 rounded-lg">
                      <div className="text-2xl font-bold text-sky-700 mb-1">
                        {result.difference.totalDays} days
                      </div>
                      <div className="text-sm text-sky-600">
                        {result.difference.years} years, {result.difference.months} months, {result.difference.days} days
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ResultDisplay>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const educationalContent = (
  <div>
    <h3>Date Difference Calculator</h3>
    <p>This calculator finds the exact time between two dates. It shows the result in days, weeks, months, or years. It&apos;s a simple way to track project timelines, deadlines, or time since an important event.</p>

    <p>The calculator provides both the total number of days and a breakdown showing years, months, and remaining days. This dual format helps you understand the time difference in the most meaningful way for your specific use case.</p>

    <h3>How to Use</h3>
    <p>Simply enter your first date and second date. The calculator will automatically show the difference between them. Use the quick date buttons to easily select common dates like today, tomorrow, or next month.</p>
  </div>
);