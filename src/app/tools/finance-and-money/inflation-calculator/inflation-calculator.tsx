'use client';

import React, { useState, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import FinancialDisclaimer from '@/components/disclaimers/financialDisclaimer';
import CurrencySelector, { CURRENCIES } from '@/components/currencySelector';

interface InflationData {
  initialAmount: number;
  startingYear: number;
  endingYear: number;
  annualInflationRate: number;
  currency: string;
  calculationMode: 'future' | 'past';
}

interface InflationResult {
  futureValue: number;
  purchasingPowerLoss: number;
  totalInflation: number;
  yearsDifference: number;
  averageAnnualLoss: number;
  realWorldComparisons: Array<{
    item: string;
    originalPrice: number;
    inflatedPrice: number;
    originalQuantity: number;
    inflatedQuantity: number;
  }>;
}

interface ValidationErrors {
  initialAmount?: string;
  startingYear?: string;
  endingYear?: string;
  annualInflationRate?: string;
}



// Real-world comparisons data (moved outside component to prevent recreations)
const REAL_WORLD_ITEMS = [
  { item: 'Cups of Coffee', originalPrice: 3.50 },
  { item: 'Movie Tickets', originalPrice: 12.00 },
  { item: 'Gallons of Gas', originalPrice: 3.20 },
  { item: 'Loaves of Bread', originalPrice: 2.50 },
  { item: 'Months of Netflix', originalPrice: 15.99 },
];

export default function InflationCalculator() {
  const [inflationData, setInflationData] = useState<InflationData>({
    initialAmount: 1000,
    startingYear: 2000,
    endingYear: 2025,
    annualInflationRate: 3.0,
    currency: 'USD',
    calculationMode: 'future'
  });

  const [result, setResult] = useState<InflationResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((field: keyof InflationData, value: number, currentData: InflationData): string | undefined => {
    switch (field) {
      case 'initialAmount':
        if (!value || value <= 0) return 'Amount must be greater than 0';
        if (value > 10000000) return 'Amount cannot exceed $10,000,000';
        break;
      case 'startingYear':
        if (!value) return 'Starting year is required';
        if (value < 1900 || value > 2030) return 'Year must be between 1900 and 2030';
        break;
      case 'endingYear':
        if (!value) return 'Ending year is required';
        if (value < 1901 || value > 2050) return 'Year must be between 1901 and 2050';
        if (currentData.startingYear && value <= currentData.startingYear) {
          return 'Ending year must be after starting year';
        }
        break;
      case 'annualInflationRate':
        if (value === undefined || value === null) return 'Inflation rate is required';
        if (value < 0) return 'Inflation rate cannot be negative';
        if (value > 50) return 'Inflation rate cannot exceed 50%';
        break;
    }
    return undefined;
  }, []);

  const updateInflationData = useCallback((field: keyof InflationData, value: string | number) => {
    setInflationData(currentData => {
      let processedValue = value;
      
      // Handle numeric fields without defaults - let validation handle empty values
      if (field === 'annualInflationRate') {
        if (typeof value === 'string') {
          if (value === '') {
            processedValue = 0;
          } else {
            // Remove leading zeros but preserve valid decimals like "0.5"
            const cleanValue = value.replace(/^0+(?=\d)/, '') || (value.startsWith('0.') ? value : '0');
            const numValue = parseFloat(cleanValue);
            processedValue = isNaN(numValue) ? 0 : numValue;
          }
        }
      } else if (field === 'initialAmount' || field === 'startingYear' || field === 'endingYear') {
        if (typeof value === 'string') {
          if (value === '') {
            processedValue = 0;
          } else {
            const numValue = parseInt(value, 10);
            processedValue = isNaN(numValue) ? 0 : numValue;
          }
        }
      }
      
      const newData = { ...currentData, [field]: processedValue };
      
      // Validate the field and update errors
      if (typeof processedValue === 'number') {
        const error = validateField(field, processedValue, newData);
        setValidationErrors(prev => {
          const newErrors = { ...prev, [field]: error };
          
          // If we're updating years, re-validate the relationship between start and end year
          if (field === 'startingYear' || field === 'endingYear') {
            if (field === 'startingYear' && newData.endingYear > 0) {
              const endYearError = validateField('endingYear', newData.endingYear, newData);
              newErrors.endingYear = endYearError;
            } else if (field === 'endingYear' && newData.startingYear > 0) {
              const startYearError = validateField('startingYear', newData.startingYear, newData);
              newErrors.startingYear = startYearError;
            }
          }
          
          return newErrors;
        });
      }
      
      return newData;
    });
  }, [validateField]);

  const isFormValid = useCallback(() => {
    const hasErrors = Object.values(validationErrors).some(error => error !== undefined);
    const hasAllValues = inflationData.initialAmount > 0 && 
                        inflationData.startingYear > 0 && 
                        inflationData.endingYear > 0 && 
                        inflationData.annualInflationRate >= 0;
    return !hasErrors && hasAllValues;
  }, [validationErrors, inflationData]);

  const calculateInflation = useCallback(() => {
    if (!isFormValid()) {
      setResult(null);
      return;
    }

    const { initialAmount, startingYear, endingYear, annualInflationRate, calculationMode } = inflationData;

    const yearsDifference = endingYear - startingYear;
    const inflationRate = annualInflationRate / 100;
    
    // Real-world comparisons
    const realWorldComparisons = REAL_WORLD_ITEMS.map(comp => {
      const inflatedPrice = comp.originalPrice * Math.pow(1 + inflationRate, yearsDifference);
      const originalQuantity = Math.floor(inflationData.initialAmount / comp.originalPrice);
      const inflatedQuantity = Math.floor(inflationData.initialAmount / inflatedPrice);
      
      return {
        ...comp,
        inflatedPrice,
        originalQuantity,
        inflatedQuantity
      };
    });

    let futureValue: number;
    let purchasingPowerLoss: number;
    let averageAnnualLoss: number;

    if (calculationMode === 'future') {
      // Standard inflation calculation
      const inflationMultiplier = Math.pow(1 + inflationRate, yearsDifference);
      futureValue = initialAmount * inflationMultiplier;
      purchasingPowerLoss = ((futureValue - initialAmount) / initialAmount) * 100;
      averageAnnualLoss = initialAmount * (annualInflationRate / 100);
    } else {
      // Reverse calculation - what today's amount was worth in the past
      const deflationMultiplier = Math.pow(1 + inflationRate, -yearsDifference);
      futureValue = initialAmount * deflationMultiplier;
      purchasingPowerLoss = ((initialAmount - futureValue) / initialAmount) * 100;
      averageAnnualLoss = initialAmount * (annualInflationRate / 100);
    }

    const totalInflation = (Math.pow(1 + inflationRate, yearsDifference) - 1) * 100;

    setResult({
      futureValue,
      purchasingPowerLoss,
      totalInflation,
      yearsDifference,
      averageAnnualLoss,
      realWorldComparisons,
    });
  }, [inflationData, isFormValid]);

  React.useEffect(() => {
    calculateInflation();
  }, [calculateInflation]);

  const formatCurrency = (amount: number): string => {
    const currency = CURRENCIES.find(c => c.value === inflationData.currency);
    const symbol = currency?.symbol || '$';
    if (amount >= 1000000) {
      return `${symbol}${(amount / 1000000).toFixed(1)}M`;
    }
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage.toFixed(1)}%`;
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.InflationCalculator}
      disclaimer={<FinancialDisclaimer />}
      secondaryToolDescription='Understand how inflation impacts your savings and purchasing power over time.'
    >
      <div className="space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
            
            <div className="space-y-4">
              {/* Currency Selection */}
              <CurrencySelector
                value={inflationData.currency}
                onChange={(selectedCurrency) => updateInflationData('currency', selectedCurrency)}
              />

              {/* Calculation Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Mode</label>
                <div className="inline-flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => updateInflationData('calculationMode', 'future')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      inflationData.calculationMode === 'future'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Future Value
                  </button>
                  <button
                    onClick={() => updateInflationData('calculationMode', 'past')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      inflationData.calculationMode === 'past'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Past Value
                  </button>
                </div>
              </div>

              {/* Initial Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {inflationData.calculationMode === 'future' ? 'Initial Amount' : 'Today\'s Amount'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10000000"
                    value={inflationData.initialAmount}
                    onChange={(e) => updateInflationData('initialAmount', e.target.value)}
                    className={`w-full px-3 py-2 pr-16 border rounded-md focus:outline-none focus:ring-2 ${
                      validationErrors.initialAmount 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-orange-500'
                    }`}
                    placeholder="Enter amount (e.g. 1000)"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {CURRENCIES.find(c => c.value === inflationData.currency)?.symbol}
                  </span>
                </div>
                {validationErrors.initialAmount && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.initialAmount}</p>
                )}
                {!validationErrors.initialAmount && (
                  <p className="text-xs text-gray-500 mt-1">
                    {inflationData.calculationMode === 'future' 
                      ? 'Amount you want to analyze' 
                      : 'Today\'s amount to find its historical equivalent'
                    }
                  </p>
                )}
              </div>

              {/* Starting Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {inflationData.calculationMode === 'future' ? 'Starting Year' : 'Historical Year'}
                </label>
                <input
                  type="number"
                  min="1900"
                  max="2030"
                  value={inflationData.startingYear}
                  onChange={(e) => updateInflationData('startingYear', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    validationErrors.startingYear 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-orange-500'
                  }`}
                  placeholder="e.g. 2000"
                />
                {validationErrors.startingYear && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.startingYear}</p>
                )}
                {!validationErrors.startingYear && (
                  <p className="text-xs text-gray-500 mt-1">
                    {inflationData.calculationMode === 'future' 
                      ? 'Year to start calculation from' 
                      : 'Past year to compare with'
                    }
                  </p>
                )}
              </div>

              {/* Ending Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {inflationData.calculationMode === 'future' ? 'Ending Year' : 'Current Year'}
                </label>
                <input
                  type="number"
                  min="1901"
                  max="2050"
                  value={inflationData.endingYear}
                  onChange={(e) => updateInflationData('endingYear', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    validationErrors.endingYear 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-orange-500'
                  }`}
                  placeholder="e.g. 2025"
                />
                {validationErrors.endingYear && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.endingYear}</p>
                )}
                {!validationErrors.endingYear && (
                  <p className="text-xs text-gray-500 mt-1">
                    {inflationData.calculationMode === 'future' 
                      ? 'Year to calculate to' 
                      : 'Current year for comparison'
                    }
                  </p>
                )}
              </div>

              {/* Annual Inflation Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Inflation Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={inflationData.annualInflationRate}
                    onChange={(e) => updateInflationData('annualInflationRate', e.target.value)}
                    className={`w-full px-3 py-2 pr-8 border rounded-md focus:outline-none focus:ring-2 ${
                      validationErrors.annualInflationRate 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-orange-500'
                    }`}
                    placeholder="e.g. 3.0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                </div>
                {validationErrors.annualInflationRate && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.annualInflationRate}</p>
                )}
                {!validationErrors.annualInflationRate && (
                  <p className="text-xs text-gray-500 mt-1">Average annual inflation rate</p>
                )}

                {/* Quick Presets */}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateInflationData('annualInflationRate', 2.0)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Low (2%)
                    </button>
                    <button
                      onClick={() => updateInflationData('annualInflationRate', 3.0)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      Average (3%)
                    </button>
                    <button
                      onClick={() => updateInflationData('annualInflationRate', 3.3)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      US Average (3.3%)
                    </button>
                    <button
                      onClick={() => updateInflationData('annualInflationRate', 5.0)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      High (5%)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inflation Analysis</h3>
            
            {!result && (
              <div className="text-center text-gray-500 py-4">
                <p>{!isFormValid() ? 'Complete the form to see comparison' : 'Adjust values to see comparison'}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Future/Past Value */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-sm text-red-700 mb-1">
                    {inflationData.calculationMode === 'future' ? 'Future Value' : 'Historical Equivalent'}
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(result.futureValue)}
                  </div>
                  <div className="text-sm text-red-600 mt-1">
                    {inflationData.calculationMode === 'future' 
                      ? 'What you\'d need' 
                      : 'What it was worth back then'
                    }
                  </div>
                </div>

                {/* Purchasing Power Change */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-orange-700 mb-1">
                    {inflationData.calculationMode === 'future' ? 'Purchasing Power Loss' : 'Purchasing Power Difference'}
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatPercentage(result.purchasingPowerLoss)}
                  </div>
                  <div className="text-sm text-orange-600 mt-1">
                    {inflationData.calculationMode === 'future' 
                      ? 'Reduction in buying power' 
                      : 'Difference in buying power'
                    }
                  </div>
                </div>

                {/* Total Inflation */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-purple-700 mb-1">Total Inflation</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatPercentage(result.totalInflation)}
                  </div>
                  <div className="text-sm text-purple-600 mt-1">
                    Over {result.yearsDifference} years
                  </div>
                </div>
                  
                {/* Summary Section */}
                <div className="bg-amber-100 rounded-lg p-6">
                  <div className="text-sm font-bold text-amber-900 mb-1">What This Means</div>
                  <p className="text-amber-700 text-sm">
                    {inflationData.calculationMode === 'future' ? (
                      <>
                        Due to {formatPercentage(inflationData.annualInflationRate)} annual inflation over {result.yearsDifference} years, you 
                        would need {formatCurrency(result.futureValue)} in {inflationData.endingYear} to have the same 
                        purchasing power as {formatCurrency(inflationData.initialAmount)} today. This 
                        represents a {formatPercentage(result.purchasingPowerLoss)} reduction in buying power.
                      </>
                    ) : (
                      <>
                        {formatCurrency(inflationData.initialAmount)} today had the purchasing power equivalent of {formatCurrency(result.futureValue)} 
                        in {inflationData.startingYear}. This shows how inflation of {formatPercentage(inflationData.annualInflationRate)} 
                        annually over {result.yearsDifference} years has affected the value of money.
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Column 3: Value Comparison & Real-World Impact */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Value Comparison */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Value Comparison</h3>
              
              {!result && (
                <div className="text-center text-gray-500 py-4">
                  <p>{!isFormValid() ? 'Complete the form to see comparison' : 'Adjust values to see comparison'}</p>
                </div>
              )}
              
              {result && (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Original ({inflationData.startingYear}):</span>
                      <span className="font-medium">{formatCurrency(inflationData.initialAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {inflationData.calculationMode === 'future' ? 'Future' : 'Historical'} ({inflationData.endingYear}):
                      </span>
                      <span className="font-medium">{formatCurrency(result.futureValue)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm text-gray-600">Difference:</span>
                      <span className="font-medium text-red-600">{formatCurrency(Math.abs(result.futureValue - inflationData.initialAmount))}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-World Impact</h3>
                    <div className="text-sm font-medium text-gray-700 mb-3">
                      What {formatCurrency(inflationData.initialAmount)} Could Buy
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-xs font-medium text-gray-600 mb-2">
                        In {inflationData.startingYear}:
                      </div>
                      {result.realWorldComparisons.slice(0, 2).map((comparison, index) => (
                        <div key={index} className="bg-blue-50 p-3 rounded">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-900">{comparison.originalQuantity}  {comparison.item}</span>
                            <span className="text-sm text-gray-600">
                              <div className="text-xs text-blue-600">
                                {formatCurrency(comparison.originalPrice)} each
                              </div>
                            </span>
                          </div>
                        </div>
                      ))}

                      <div className="text-xs font-medium text-gray-600 mt-4 mb-2">
                        In {inflationData.endingYear}:
                      </div>
                      {result.realWorldComparisons.slice(0, 2).map((comparison, index) => (
                        <div key={index} className="bg-red-50 p-3 rounded">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-900">{comparison.inflatedQuantity} {comparison.item}</span>
                            <span className="text-sm text-gray-600">
                              <div className="text-xs text-red-600">
                                {formatCurrency(comparison.inflatedPrice)} each
                              </div>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information or Footer Section */}
        <div>
          <h3>How to Use This Calculator</h3>
          <p>
            To use the inflation calculator, input the initial amount of money you want to analyze, select the starting and ending years for the calculation, and enter the annual inflation rate. You can choose to calculate either the future value of today&apos;s money or the historical equivalent of today&apos;s money in the past. The calculator will provide you with insights into how inflation affects purchasing power over time, along with real-world comparisons to help illustrate the impact.
          </p>

          <h3>What Is Inflation?</h3>
          <p>
            Inflation is the rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power is falling. Central banks attempt to limit inflation, and avoid deflation, in order to keep the economy running smoothly. Understanding inflation helps individuals and businesses make informed financial decisions, plan for the future, and protect their wealth against the eroding effects of rising prices.
          </p>

          <h3>What Causes Inflation?</h3>
          <p>
            Inflation can be caused by a variety of factors, including demand-pull inflation, cost-push inflation, and built-in inflation. Demand-pull inflation occurs when the demand for goods and services exceeds supply, leading to higher prices. Cost-push inflation happens when the costs of production increase, causing producers to raise prices to maintain profit margins. Built-in inflation is a result of adaptive expectations, where businesses and workers expect prices to rise and adjust their behavior accordingly.
          </p>

          <h3>Why Does Inflation Matter?</h3>
          <p>
            Inflation matters because it affects the purchasing power of money. As prices rise, the same amount of money buys fewer goods and services. This can impact savings, investments, and overall economic stability. Understanding inflation helps individuals and businesses make informed financial decisions, plan for the future, and protect their wealth against the eroding effects of rising prices.
          </p>

          <h3>What Can You Do About Inflation?</h3>
          <p>
            Inflation reduces the value of your money over time. Prices rise, and your income buys less. The first step is to understand where your money goes. Track expenses, set priorities, and cut nonessential spending. Even small changes, like cooking at home or canceling unused subscriptions, can make a real difference.
          </p>
          <p>
            Next, look for ways to grow your income. Ask for a raise, start a side job, or sell unused items. Investing is another key tool. Stocks, real estate, and inflation-protected bonds often grow faster than inflation. Keep some savings liquid for emergencies, but let the rest work for you.
          </p>
          <p>
            Finally, protect your budget from future price shocks. Buy in bulk when prices are stable, and lock in fixed-rate loans. Reduce debts that carry variable interest rates. Stay informed about market trends and government policies. Inflation affects everyone, but smart planning helps you stay ahead and keep your finances strong.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}