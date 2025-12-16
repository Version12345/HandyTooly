'use client';

import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { CalculationTypeSelector, CALCULATION_TYPE } from '@/components/dateCalculator/CalculationTypeSelector';

export function DayConverter() {
  return (
    <ToolLayout 
      toolCategory={ToolNameLists.DayConverterDateCalculator}
      educationContent={educationalContent}
    >
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2>{ToolNameLists.DayConverterDateCalculator}</h2>
          
          <CalculationTypeSelector currentType={CALCULATION_TYPE.FIND_WEEKDAY} />
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-center">
              Please select a calculation type above to get started with date calculations.
            </p>
          </div>
        </div>

        {/* Usage Information */}
        
      </div>
    </ToolLayout>
  );
}

const educationalContent = (
  <div>
    <h3>Date Calculator Tools</h3>
    <p>Choose from our specialized date calculation tools to work with dates and time. Each tool is designed for specific tasks to make date calculations simple and accurate.</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Find Weekday</h3>
        <p className="text-sm text-gray-700">Discover what day of the week any date falls on, plus get additional details like day of year and week number.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Date Difference</h3>
        <p className="text-sm text-gray-700">Calculate the exact time span between two dates in days, months, and years.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Add Time to Date</h3>
        <p className="text-sm text-gray-700">Add days, weeks, months, or years to any date to find future dates for planning and scheduling.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Subtract Time from Date</h3>
        <p className="text-sm text-gray-700">Go back in time by subtracting days, weeks, months, or years from any date.</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Business Days Calculator</h3>
        <p className="text-sm text-gray-700">Count working days between dates, excluding weekends for accurate business planning.</p>
      </div>
    </div>

    <h3>How to Use</h3>
    <p>Select your desired calculation type from the dropdown above, and you&apos;ll be taken to a specialized tool designed for that specific task. Each tool includes quick date selection buttons, copy functionality, and detailed explanations to help you get the results you need.</p>
  </div>
);