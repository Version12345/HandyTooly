import React from 'react';
import { useRouter } from 'next/navigation';
import { ToolNameLists, ToolUrls } from '@/constants/tools';

export enum CALCULATION_TYPE {
  FIND_WEEKDAY = 'Find Weekday',
  DATE_DIFFERENCE = 'Date Difference',
  ADD_TIME_TO_DATE = 'Add Time to Date',
  SUBTRACT_TIME_FROM_DATE = 'Subtract Time from Date',
  BUSINESS_DAYS_CALCULATOR = 'Business Days Calculator'
}

const CALCULATION_ROUTES = {
  [CALCULATION_TYPE.FIND_WEEKDAY]: ToolUrls[ToolNameLists.FindWeekday],
  [CALCULATION_TYPE.DATE_DIFFERENCE]: ToolUrls[ToolNameLists.DateDifference],
  [CALCULATION_TYPE.ADD_TIME_TO_DATE]: ToolUrls[ToolNameLists.AddTimeToDate],
  [CALCULATION_TYPE.SUBTRACT_TIME_FROM_DATE]: ToolUrls[ToolNameLists.SubtractTimeFromDate],
  [CALCULATION_TYPE.BUSINESS_DAYS_CALCULATOR]: ToolUrls[ToolNameLists.BusinessDaysCalculator]
};

interface CalculationTypeSelectorProps {
  currentType: CALCULATION_TYPE;
}

export function CalculationTypeSelector({ currentType }: CalculationTypeSelectorProps) {
  const router = useRouter();

  const handleTypeChange = (type: CALCULATION_TYPE) => {
    router.push(CALCULATION_ROUTES[type]);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Calculation Type:
      </label>
      <select
        value={currentType}
        onChange={(e) => handleTypeChange(e.target.value as CALCULATION_TYPE)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {Object.values(CALCULATION_TYPE).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}