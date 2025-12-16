import React from 'react';
import { copyToClipboard } from '@/utils/copyToClipboard';

interface ResultDisplayProps {
  weekday?: string;
  date?: string;
  dayOfYear?: number;
  weekOfYear?: number;
  children?: React.ReactNode;
}

export function ResultDisplay({ weekday, date, dayOfYear, weekOfYear, children }: ResultDisplayProps) {
  const handleCopy = (text: string) => {
    copyToClipboard(text);
  };

  if (!weekday && !children) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Enter a date to see calculation results</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Result Display */}
      {weekday && (
        <div className="bg-sky-50 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-sky-600 mb-2">
            {weekday}
          </div>
          <div className="text-lg text-sky-800">
            {date}
          </div>
        </div>
      )}

      {/* Detailed Information */}
      {dayOfYear && (
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Weekday:</span>
            <div className="flex items-center gap-2">
              <span>{weekday}</span>
              <button
                onClick={() => handleCopy(weekday || '')}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Day of Year:</span>
            <div className="flex items-center gap-2">
              <span>{dayOfYear}</span>
              <button
                onClick={() => handleCopy(dayOfYear?.toString() || '')}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Week of Year:</span>
            <div className="flex items-center gap-2">
              <span>{weekOfYear}</span>
              <button
                onClick={() => handleCopy(weekOfYear?.toString() || '')}
                className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom content */}
      {children}
    </div>
  );
}