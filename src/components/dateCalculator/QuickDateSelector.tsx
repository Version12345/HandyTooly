import React from 'react';
import { QUICK_DATE_OPTIONS, formatDateShort } from '@/utils/dateCalculations';

interface QuickDateSelectorProps {
  onDateSelect: (date: string) => void;
}

export function QuickDateSelector({ onDateSelect }: QuickDateSelectorProps) {
  const handleQuickDateSelect = (option: typeof QUICK_DATE_OPTIONS[0]) => {
    const date = option.getValue();
    onDateSelect(formatDateShort(date));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Quick Date Selection
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {QUICK_DATE_OPTIONS.map((option) => (
          <button
            key={option.label}
            onClick={() => handleQuickDateSelect(option)}
            className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}