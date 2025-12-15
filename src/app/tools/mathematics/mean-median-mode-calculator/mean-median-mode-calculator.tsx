'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

interface StatisticalResults {
  mean: number;
  median: number;
  mode: number[];
  range: number;
  minimum: number;
  maximum: number;
  count: number;
  sum: number;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  outliers: number[];
  sortedData: number[];
}

export function MeanMedianModeCalculator() {
  const [inputData, setInputData] = useState('5, 8, 12, 14, 17, 17, 19, 21, 21, 21, 23, 26, 28, 30, 33, 35');
  const [results, setResults] = useState<StatisticalResults | null>(null);
  const [isValidData, setIsValidData] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Helper function to parse input data
  const parseInputData = useCallback((input: string): number[] => {
    if (!input.trim()) return [];
    
    // Split by commas, spaces, newlines, or semicolons
    const values = input.split(/[,;\s\n]+/).filter(val => val.trim() !== '');
    const numbers: number[] = [];
    
    for (const val of values) {
      const num = parseFloat(val.trim());
      if (isNaN(num)) {
        throw new Error(`Invalid number: "${val.trim()}"`);
      }
      numbers.push(num);
    }
    
    return numbers;
  }, []);

  // Calculate statistical measures
  const calculateStatistics = useCallback((data: number[]): StatisticalResults => {
    if (data.length === 0) {
      throw new Error('No data provided');
    }

    const sortedData = [...data].sort((a, b) => a - b);
    const count = data.length;
    
    // Mean
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    
    // Median
    const median = count % 2 === 0
      ? (sortedData[count / 2 - 1] + sortedData[count / 2]) / 2
      : sortedData[Math.floor(count / 2)];
    
    // Mode
    const frequency: { [key: number]: number } = {};
    data.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number);
    
    // Range
    const minimum = Math.min(...data);
    const maximum = Math.max(...data);
    const range = maximum - minimum;
    
    // Quartiles
    const q1Index = Math.floor((count + 1) / 4) - 1;
    const q3Index = Math.floor(3 * (count + 1) / 4) - 1;
    
    const q1 = count >= 4 
      ? (q1Index === Math.floor(q1Index) 
        ? sortedData[q1Index] 
        : (sortedData[Math.floor(q1Index)] + sortedData[Math.ceil(q1Index)]) / 2)
      : sortedData[0];
      
    const q2 = median;
    
    const q3 = count >= 4
      ? (q3Index === Math.floor(q3Index) 
        ? sortedData[q3Index] 
        : (sortedData[Math.floor(q3Index)] + sortedData[Math.ceil(q3Index)]) / 2)
      : sortedData[count - 1];
    
    const iqr = q3 - q1;
    
    // Outliers (using IQR method)
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = data.filter(val => val < lowerBound || val > upperBound);
    
    return {
      mean,
      median,
      mode,
      range,
      minimum,
      maximum,
      count,
      sum,
      q1,
      q2,
      q3,
      iqr,
      outliers,
      sortedData
    };
  }, []);

  // Main calculation function
  const performCalculation = useCallback(() => {
    if (!inputData.trim()) {
      setResults(null);
      setIsValidData(true);
      setErrorMessage('');
      return;
    }

    try {
      const data = parseInputData(inputData);
      if (data.length === 0) {
        setResults(null);
        setIsValidData(true);
        setErrorMessage('');
        return;
      }
      
      const calculatedResults = calculateStatistics(data);
      setResults(calculatedResults);
      setIsValidData(true);
      setErrorMessage('');
    } catch (error) {
      setIsValidData(false);
      setErrorMessage(error instanceof Error ? error.message : 'Error calculating statistics');
      setResults(null);
    }
  }, [inputData, parseInputData, calculateStatistics]);

  // Auto-calculate when input changes
  useEffect(() => {
    const timeoutId = setTimeout(performCalculation, 300);
    return () => clearTimeout(timeoutId);
  }, [performCalculation]);

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
  };

  const clearInput = () => {
    setInputData('');
  };

  // Example data sets
  const exampleDataSets = [
    { name: 'Grade Scores', data: '82, 89, 76, 94, 91, 85, 88, 92, 87, 90' },
    { name: 'Test Results', data: '5, 8, 12, 14, 17, 17, 19, 21, 21, 21, 23, 26, 28, 30, 33, 35' },
    { name: 'Sales Data', data: '115, 142, 167, 129, 185, 158, 138, 179, 146, 163' },
    { name: 'Heights (inches)', data: '67, 71, 64, 69, 72, 68, 70, 73, 65, 67, 71' },
    { name: 'Response Times (ms)', data: '238, 295, 189, 252, 276, 214, 318, 243, 287, 261' }
  ];

  const formatNumber = (num: number): string => {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.MeanMedianModeCalculator}
      secondaryToolDescription="Perfect for statistics, data analysis, and mathematical calculations."
      educationContent={educationContent}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Data Set</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Values
              </label>
              <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="5, 8, 12, 14, 17, 17, 19, 21, 21, 21, 23, 26, 28, 30, 33, 35"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                  !isValidData ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter values separated by commas or spaces. You can also copy and paste lines of data from spreadsheets or text documents.
              </p>
              {errorMessage && (
                <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2 mb-4 text-sm">
              <button
                onClick={performCalculation}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
              >
                Calculate
              </button>
              <button
                onClick={clearInput}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Example Data Sets */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Example Data Sets</h3>
              <div className="space-y-2">
                {exampleDataSets.slice(0, 3).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInputData(example.data)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-orange-50 rounded border border-gray-300 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{example.name}</span>
                    <div className="text-xs text-gray-600 mt-1 truncate">{example.data}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Format Info */}
            <div className="mt-4 p-3 bg-sky-50 rounded-lg">
              <h4 className="text-sm font-medium text-sky-900 mb-1">Supported Formats</h4>
              <ul className="text-xs text-sky-800 space-y-1">
                <li>Comma-separated: 1, 2, 3, 4</li>
                <li>Space-separated: 1 2 3 4</li>
                <li>Line-separated (paste from Excel)</li>
                <li>Mixed separators: 1, 2 3; 4</li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistical Results</h2>
            
            {!results && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter data values to see statistical calculations</p>
              </div>
            )}

            {results && (
              <div className="space-y-4">
                {/* Mean */}
                <div className="bg-orange-50 rounded-lg p-4 relative">
                  <button
                    onClick={() => handleCopy(formatNumber(results.mean))}
                    className="absolute top-3 right-3 px-3 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                  >
                    Copy
                  </button>
                  <div className="text-sm text-gray-600">Mean x̄</div>
                  <div className="text-2xl font-bold text-gray-900 font-mono pr-16">{formatNumber(results.mean)}</div>
                  <div className="text-sm text-orange-600">Average value</div>
                </div>

                {/* Median */}
                <div className="bg-green-50 rounded-lg p-4 relative">
                  <button
                    onClick={() => handleCopy(formatNumber(results.median))}
                    className="absolute top-3 right-3 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                  >
                    Copy
                  </button>
                  <div className="text-sm text-gray-600">Median x̃</div>
                  <div className="text-2xl font-bold text-gray-900 font-mono pr-16">{formatNumber(results.median)}</div>
                  <div className="text-sm text-green-600">Middle value</div>
                </div>

                {/* Mode */}
                <div className="bg-sky-50 rounded-lg p-4 relative">
                  <button
                    onClick={() => handleCopy(results.mode.map(formatNumber).join(', '))}
                    className="absolute top-3 right-3 px-3 py-1 text-xs bg-sky-500 hover:bg-sky-600 text-white rounded transition-colors"
                  >
                    Copy
                  </button>
                  <div className="text-sm text-gray-600">Mode</div>
                  <div className="text-xl font-bold text-gray-900 font-mono pr-16">
                    {results.mode.length === results.count ? 'No mode' : results.mode.map(formatNumber).join(', ')}
                  </div>
                  <div className="text-sm text-sky-600">Most frequent value(s)</div>
                </div>

                {/* Range */}
                <div className="bg-purple-50 rounded-lg p-4 relative">
                  <button
                    onClick={() => handleCopy(formatNumber(results.range))}
                    className="absolute top-3 right-3 px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
                  >
                    Copy
                  </button>
                  <div className="text-sm text-gray-600">Range</div>
                  <div className="text-xl font-bold text-gray-900 font-mono pr-16">{formatNumber(results.range)}</div>
                  <div className="text-sm text-purple-600">Max - Min</div>
                </div>

                {/* Min/Max */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Minimum</div>
                    <div className="text-lg font-bold text-gray-900 font-mono">{formatNumber(results.minimum)}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Maximum</div>
                    <div className="text-lg font-bold text-gray-900 font-mono">{formatNumber(results.maximum)}</div>
                  </div>
                </div>

                {/* Count/Sum */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Count n</div>
                    <div className="text-lg font-bold text-gray-900 font-mono">{results.count}</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600">Sum</div>
                    <div className="text-lg font-bold text-gray-900 font-mono">{formatNumber(results.sum)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Advanced Statistics</h2>
            
            {results && (
              <div className="space-y-4">
                {/* Quartiles */}
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Quartiles</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Q1:</span>
                      <span className="font-mono font-semibold">{formatNumber(results.q1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Q2 (Median):</span>
                      <span className="font-mono font-semibold">{formatNumber(results.q2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Q3:</span>
                      <span className="font-mono font-semibold">{formatNumber(results.q3)}</span>
                    </div>
                  </div>
                </div>

                {/* IQR */}
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Interquartile Range</h4>
                  <div className="text-lg font-bold text-gray-900 font-mono">{formatNumber(results.iqr)}</div>
                  <div className="text-xs text-gray-600 mt-1">IQR = Q3 - Q1</div>
                </div>

                {/* Outliers */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Outliers</h4>
                  <div className="text-sm font-mono">
                    {results.outliers.length === 0 ? 'none' : results.outliers.map(formatNumber).join(', ')}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Using IQR method (1.5 × IQR)</div>
                </div>

                {/* Sorted Data Preview */}
                <div className="bg-gray-100 rounded-lg p-4 relative">
                  <button
                    onClick={() => handleCopy(results.sortedData.map(formatNumber).join(', '))}
                    className="absolute top-3 right-3 px-3 py-1 text-xs bg-gray-400 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Copy
                  </button>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 pr-16">Sorted Data</h4>
                  <div className="text-xs font-mono text-gray-700 max-h-20 overflow-y-auto">
                    {results.sortedData.map(formatNumber).join(', ')}
                  </div>
                </div>
              </div>
            )}

            {!results && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter data to see quartiles, outliers, and more</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use This Mean Median Mode Calculator</h3>
    <p className="text-gray-700 mb-4">
      Our statistical calculator makes it easy to analyze data sets and understand central tendency measures. Simply enter your data values separated by commas or spaces, and instantly see comprehensive statistical analysis including mean, median, mode, quartiles, and outlier detection.
    </p>

    <h3>What are Mean, Median, and Mode?</h3>
    <p className="text-gray-700 mb-4">
      Mean, median, and mode are all measures of central tendency in statistics. In different ways they each tell us what value in a data set is typical or representative of the data set.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 bg-white p-4 rounded-lg">
      <div className="bg-gray-100 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-2">Mean (Average)</h4>
        <p className="text-sm">
          The mean is the same as the average value of a data set and is found using a calculation. Add up all of the numbers and divide by the number of numbers in the data set.
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-2">Median</h4>
        <p className="text-sm">
          The median is the central number of a data set. Arrange data points from smallest to largest and locate the central number. If there are 2 numbers in the middle, the median is the average of those 2 numbers.
        </p>
      </div>
      <div className="bg-gray-100 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-2">Mode</h4>
        <p className="text-sm">
          The mode is the number in a data set that occurs most frequently. Count how many times each number occurs in the data set. The mode is the number with the highest tally.
        </p>
      </div>
    </div>

    <h3>How to Find the Mean</h3>
    <ol className="list-decimal list-outside space-y-2 text-gray-700 mb-6 pl-5">
      <li>Add up all data values to get the sum</li>
      <li>Count the number of values in your data set</li>
      <li>Divide the sum by the count</li>
    </ol>

    <h3>Understanding Quartiles and Outliers</h3>
    <p className="text-gray-700 mb-4">
      Quartiles divide your data into four equal parts. Q1 (first quartile) marks the 25th percentile, Q2 is the median (50th percentile), and Q3 (third quartile) marks the 75th percentile. The Interquartile Range (IQR) is Q3 - Q1 and helps identify outliers.
    </p>

    <p className="text-gray-700 mb-6">
      Outliers are data points that fall significantly outside the typical range. Our calculator uses the standard IQR method: any value below Q1 - 1.5&times;IQR or above Q3 + 1.5&times;IQR is considered an outlier.
    </p>

    <h3>Common Applications</h3>
    <p className="text-gray-700 mb-4">
      <strong>Education:</strong> Analyzing test scores, grade distributions, and academic performance metrics.
      <strong>Business:</strong> Sales data analysis, performance metrics, and quality control measurements.
      <strong>Research:</strong> Scientific data analysis, survey results, and experimental measurements.
      <strong>Sports:</strong> Performance statistics, scoring analysis, and player comparisons.
    </p>

    <h3>Tips for Data Analysis</h3>
    <p className="text-gray-700 mb-6">
      When analyzing data, consider all measures together. The mean can be affected by outliers, making the median a better measure of central tendency for skewed data. The mode is especially useful for categorical data or when you need to know the most common value. Always check for outliers as they may indicate data entry errors or unusual conditions that warrant investigation.
    </p>
  </div>
);