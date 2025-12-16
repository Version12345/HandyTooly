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
  calculateBusinessDays 
} from '@/utils/dateCalculations';

export function BusinessDaysCalculator() {
  const currentDate = new Date();
  const [dateToCheck, setDateToCheck] = useState(() => formatDateToString(currentDate));
  const [secondDate, setSecondDate] = useState(() => formatDateToString(new Date(currentDate.setDate(currentDate.getDate() + 7))));
  const [result, setResult] = useState<{
    businessDays: number;
  } | null>(null);

  useEffect(() => {
    if (!dateToCheck || !secondDate) return;

    const date1 = parseLocalDate(dateToCheck);
    const date2 = parseLocalDate(secondDate);
    
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) return;

    setResult({
      businessDays: calculateBusinessDays(date1, date2)
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
            <h2>{ToolNameLists.BusinessDaysCalculator}</h2>
            
            <CalculationTypeSelector currentType={CALCULATION_TYPE.BUSINESS_DAYS_CALCULATOR} />

            {/* Date Inputs */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date:
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
                End Date:
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
              {result?.businessDays !== undefined && (
                <div className="bg-sky-50 rounded-lg p-4">
                  <h3 className="font-medium text-sky-800 mb-2">Business Days:</h3>
                  <div className="text-2xl font-bold text-sky-600">
                    {result.businessDays} days
                  </div>
                  <div className="text-sm text-sky-700 mt-1">
                    Excluding weekends (Saturday & Sunday)
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
    <h3>Business Days Calculator</h3>
    <p>This tool counts only working days between two dates, skipping weekends and holidays. It&apos;s ideal for business planning, payroll, or tracking workdays in a project.</p>

    <p>Business days are typically Monday through Friday, excluding Saturday and Sunday. This calculator automatically excludes weekends from the count, giving you the exact number of working days between your selected dates.</p>

    <h3>Perfect for Business Planning</h3>
    <p>Use this calculator for project timelines, delivery schedules, payroll calculations, or any situation where you need to count only weekdays. It&apos;s especially useful for determining realistic project deadlines and work schedules.</p>

    <h3>Note</h3>
    <p>This calculator excludes weekends but does not account for public holidays, which may vary by location and year. For precise business day calculations that include holidays, consider your local holiday calendar.</p>
  </div>
);