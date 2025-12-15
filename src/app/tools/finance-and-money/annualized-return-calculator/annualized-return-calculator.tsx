'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';
import CurrencySelector from '@/components/currencySelector';
import { formatCurrency, getCurrencySymbol } from '@/utils/currencyHelpers';

interface InvestmentResults {
  totalReturn: number;
  totalReturnPercent: number;
  absoluteGainLoss: number;
  annualizedReturn: number;
  investmentPeriod: {
    years: number;
    months: number;
    days: number;
  };
  simpleAnnualReturn: number;
  returnMultiple: number;
  moneyDoubledIn: number;
  futureValueProjections: {
    oneYear: number;
    fiveYears: number;
    tenYears: number;
  };
}

export function AnnualizedReturnCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('10000');
  const [finalValue, setFinalValue] = useState('15000');
  const [years, setYears] = useState('5');
  const [months, setMonths] = useState('0');
  const [days, setDays] = useState('0');
  const [startDate, setStartDate] = useState('2020-11-16');
  const [endDate, setEndDate] = useState('2025-11-17');
  const [currency, setCurrency] = useState('USD');
  const [results, setResults] = useState<InvestmentResults | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  // Calculate investment period from dates
  const calculatePeriodFromDates = useCallback(() => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) return;
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const yearsDiff = Math.floor(diffDays / 365);
    const monthsDiff = Math.floor((diffDays % 365) / 30);
    const daysDiff = (diffDays % 365) % 30;
    
    setYears(yearsDiff.toString());
    setMonths(monthsDiff.toString());
    setDays(daysDiff.toString());
  }, [startDate, endDate]);

  // Main calculation function
  const calculateReturns = useCallback(() => {
    try {
      const initial = parseFloat(initialInvestment);
      const final = parseFloat(finalValue);
      const y = parseFloat(years);
      const m = parseFloat(months);
      const d = parseFloat(days);

      if (isNaN(initial) || isNaN(final) || initial <= 0 || final <= 0) {
        throw new Error('Please enter valid positive numbers for investment amounts');
      }

      // Calculate total period in years
      const totalYears = y + (m / 12) + (d / 365);
      
      if (totalYears <= 0) {
        throw new Error('Investment period must be greater than 0');
      }

      // Calculate returns
      const totalReturn = final - initial;
      const totalReturnPercent = ((final - initial) / initial) * 100;
      const absoluteGainLoss = totalReturn;
      
      // Annualized return using compound annual growth rate (CAGR)
      const annualizedReturn = (Math.pow(final / initial, 1 / totalYears) - 1) * 100;
      
      // Simple annual return
      const simpleAnnualReturn = (totalReturnPercent / totalYears);
      
      // Return multiple
      const returnMultiple = final / initial;
      
      // Money doubled calculation
      const moneyDoubledIn = Math.log(2) / Math.log(1 + (annualizedReturn / 100));
      
      // Future value projections
      const oneYear = initial * Math.pow(1 + (annualizedReturn / 100), 1);
      const fiveYears = initial * Math.pow(1 + (annualizedReturn / 100), 5);
      const tenYears = initial * Math.pow(1 + (annualizedReturn / 100), 10);

      const calculatedResults: InvestmentResults = {
        totalReturn: totalReturnPercent,
        totalReturnPercent,
        absoluteGainLoss,
        annualizedReturn,
        investmentPeriod: {
          years: y,
          months: m,
          days: d
        },
        simpleAnnualReturn,
        returnMultiple,
        moneyDoubledIn,
        futureValueProjections: {
          oneYear,
          fiveYears,
          tenYears
        }
      };

      setResults(calculatedResults);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error calculating returns');
      setResults(null);
    }
  }, [initialInvestment, finalValue, years, months, days]);

  // Auto-calculate when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(calculateReturns, 300);
    return () => clearTimeout(timeoutId);
  }, [calculateReturns]);

  // Update dates when period changes
  useEffect(() => {
    calculatePeriodFromDates();
  }, [startDate, endDate, calculatePeriodFromDates]);

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
  };

  const formatPercent = (percent: number) => {
    return `${percent.toFixed(2)}%`;
  };

  const getPerformanceColor = (percent: number) => {
    if (percent > 0) return 'text-green-600';
    if (percent < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBenchmarkStatus = (annualizedReturn: number) => {
    if (annualizedReturn > 10) return { text: 'Outperforming', color: 'bg-green-100 text-green-800' };
    if (annualizedReturn < 4) return { text: 'Underperforming', color: 'bg-red-100 text-red-800' };
    return { text: 'Beating Inflation', color: 'bg-amber-100 text-amber-800' };
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.AnnualizedReturnCalculator}
      secondaryToolDescription="Calculate investment returns, CAGR, and analyze performance with comprehensive metrics."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investment Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2>Investment Details</h2>
            
            <div className="space-y-4">
              <CurrencySelector
                value={currency}
                onChange={setCurrency}
                className="mb-4"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Investment (Principal)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{getCurrencySymbol(currency)}</span>
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="10000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Final Value
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{getCurrencySymbol(currency)}</span>
                  <input
                    type="number"
                    value={finalValue}
                    onChange={(e) => setFinalValue(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="15000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total holding period
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
                      placeholder="5"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">years</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={months}
                      onChange={(e) => setMonths(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
                      placeholder="0"
                      min="0"
                      max="11"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">months</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
                      placeholder="0"
                      min="0"
                      max="29"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">days</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">When investment began</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">When investment ended or current date</p>
              </div>

              {results && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Annualized Rate of Return:</h4>
                  <div className="text-2xl font-bold text-purple-700">
                    {formatPercent(results.annualizedReturn)}
                  </div>
                  <p className="text-sm text-purple-600 mt-1">Compound Annual Growth Rate (CAGR)</p>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Return Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2>Return Analysis</h2>
            
            {results && (
              <div className="space-y-4">
                <div className="bg-sky-50 rounded-lg p-4 relative">
                  <button
                    onClick={() => handleCopy(formatPercent(results.totalReturn))}
                    className="absolute top-3 right-3 px-3 py-1 text-xs bg-sky-500 hover:bg-sky-600 text-white rounded transition-colors"
                  >
                    Copy
                  </button>
                  <div className="text-sm text-gray-600">Total Return</div>
                  <div className={`text-2xl font-bold ${getPerformanceColor(results.totalReturn)} pr-16`}>
                    {formatPercent(results.totalReturn)}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 relative">
                  <button
                    onClick={() => handleCopy(formatCurrency(results.absoluteGainLoss, currency))}
                    className="absolute top-3 right-3 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                  >
                    Copy
                  </button>
                  <div className="text-sm text-gray-600">Absolute Gain/Loss</div>
                  <div className={`text-xl font-bold ${getPerformanceColor(results.absoluteGainLoss)} pr-16`}>
                    {formatCurrency(results.absoluteGainLoss, currency)}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Performance Benchmarks</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>vs S&P 500 (10% avg):</span>
                      <span className={`px-2 py-1 rounded text-xs ${getBenchmarkStatus(results.annualizedReturn).color}`}>
                        {results.annualizedReturn > 10 ? 'Outperforming' : results.annualizedReturn < 10 ? 'Underperforming' : 'Matching'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>vs Bonds (4% avg):</span>
                      <span className={`px-2 py-1 rounded text-xs ${results.annualizedReturn > 4 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {results.annualizedReturn > 4 ? 'Outperforming' : 'Underperforming'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>vs Inflation (3% avg):</span>
                      <span className={`px-2 py-1 rounded text-xs ${results.annualizedReturn > 3 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {results.annualizedReturn > 3 ? 'Beating Inflation' : 'Below Inflation'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Return Composition</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                      <div 
                        className="bg-sky-500 h-4 transition-all duration-300"
                        style={{ width: `${Math.min(100, (parseFloat(initialInvestment) / parseFloat(finalValue)) * 100)}%` }}
                      ></div>
                      <div 
                        className="bg-green-500 h-4 absolute top-0 transition-all duration-300"
                        style={{ 
                          left: `${Math.min(100, (parseFloat(initialInvestment) / parseFloat(finalValue)) * 100)}%`,
                          width: `${Math.max(0, 100 - (parseFloat(initialInvestment) / parseFloat(finalValue)) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-sky-600">Initial (85.7%)</span>
                    <span className="text-green-600">Gains (33.3%)</span>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Rule of 72</h4>
                  <div className="text-sm text-green-700">
                    At {formatPercent(results.annualizedReturn)}, your money doubles every{' '}
                    <span className="font-bold">{results.moneyDoubledIn.toFixed(1)} years</span>
                  </div>
                </div>
              </div>
            )}

            {!results && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter investment details to see return analysis</p>
              </div>
            )}
          </div>

          {/* Investment Comparison & Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2>Investment Comparison</h2>
            
            {results && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Investment Metrics</h4>
                  <div className="flex justify-between items-center py-3 bg-gray-100 rounded-t-lg rounded-lg p-4">
                    <span className="text-sm">Simple Annual Return</span>
                    <span className="font-semibold">{formatPercent(results.simpleAnnualReturn)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 bg-gray-100 rounded-t-lg rounded-lg p-4">
                    <span className="text-sm">Return Multiple</span>
                    <span className="font-semibold">{results.returnMultiple.toFixed(2)}x</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 bg-gray-100 rounded-t-lg rounded-lg p-4">
                    <span className="text-sm">Money Doubled In</span>
                    <span className="font-semibold">{results.moneyDoubledIn.toFixed(1)} years</span>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">Risk-Return Profile</h4>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Return Category:</span>
                      <span className="font-medium text-purple-600">
                        {results.annualizedReturn > 15 ? 'High Growth' : results.annualizedReturn > 8 ? 'Growth' : 'Conservative'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">If you invested {formatCurrency(parseFloat(initialInvestment) || 0, currency)}</h4>
                  <div className="text-sm space-y-1">
                    <div className="space-y-4">
                      <div className="flex justify-between bg-gray-100 p-4 rounded">
                        <span>At 5% for 10 years:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(initialInvestment) * Math.pow(1.05, 10), currency)}</span>
                      </div>
                      <div className="flex justify-between bg-gray-100 p-4 rounded">
                        <span>At 8% for 10 years:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(initialInvestment) * Math.pow(1.08, 10), currency)}</span>
                      </div>
                      <div className="flex justify-between bg-gray-100 p-4 rounded">
                        <span>At 12% for 10 years:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(initialInvestment) * Math.pow(1.12, 10), currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compare Returns & Future Projections */}
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3>Compare Returns</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-100 rounded p-3 text-center">
                  <div className="text-sm text-green-700">Your Return:</div>
                  <div className="font-bold text-lg text-green-700">{formatPercent(results.annualizedReturn)}</div>
                </div>
                <div className="bg-gray-100 rounded p-3 text-center">
                  <div className="text-sm text-gray-600">S&P 500</div>
                  <div className="font-bold text-lg">10.00%</div>
                </div>
                <div className="bg-gray-100 rounded p-3 text-center">
                  <div className="text-sm text-gray-600">Treasury Bonds:</div>
                  <div className="font-bold text-lg">4 &ndash; 5%</div>
                </div>
                <div className="bg-gray-100 rounded p-3 text-center">
                  <div className="text-sm text-gray-600">Real Estate:</div>
                  <div className="font-bold text-lg">6 &ndash; 8%</div>
                </div>
                <div className="bg-gray-100 rounded p-3 text-center">
                  <div className="text-sm text-gray-600">Inflation:</div>
                  <div className="font-bold text-lg">2 &ndash; 3%</div>
                </div>
                <div className="bg-gray-100 rounded p-3 text-center">
                  <div className="text-sm text-gray-600">Savings Account:</div>
                  <div className="font-bold text-lg">0.5 &ndash; 2%</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3>Future Value Projections</h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-3 bg-gray-100 rounded-t-lg rounded-lg p-4">
                  <span className="text-gray-600">Value in 1 year:</span>
                  <span className="font-semibold">{formatCurrency(results.futureValueProjections.oneYear, currency)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 bg-gray-100 rounded-t-lg rounded-lg p-4">
                  <span className="text-gray-600">Value in 5 years:</span>
                  <span className="font-semibold text-lg">{formatCurrency(results.futureValueProjections.fiveYears, currency)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 bg-gray-100 rounded-t-lg rounded-lg p-4">
                  <span className="text-gray-600">Value in 10 years:</span>
                  <span className="font-semibold text-lg">{formatCurrency(results.futureValueProjections.tenYears, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div>
          <h3>How to Use This Annualized Returns Calculator</h3>
          <p>
            This calculator helps you find the annualized return of your investment using the Compound Annual Growth Rate (CAGR) formula. Just enter your initial investment amount, the final value of your investment, and the total holding period in years, months, and days. You can also optionally provide start and end dates to automatically calculate the holding period. The calculator will then compute key metrics like total return, annualized return, simple annual return, return multiple, and more. Use these insights to evaluate your investment performance and compare it against common benchmarks.
          </p>
          <h3>Understanding Annualized Returns</h3>
          <p>
            An annualized return shows the average growth of an investment each year. It uses the Compound Annual Growth Rate formula, which tracks how money grows over time through compounding. This method gives a clear picture of long term performance with one simple rate. 
          </p>
          <h3>How the CAGR Formula Works</h3>
          <p>
            The formula uses the starting value, the ending value, and the number of years. It is written as CAGR equals ending value divided by beginning value raised to one over the number of years minus one. This calculation shows steady yearly growth even when real returns move up and down.
          </p>
          <h3>Why Annualized Returns Matter</h3>
          <p>
            Annualized returns make it easy to compare different investments. They show how compound growth shapes long term results and help you judge real performance. Many people use common benchmarks for context. The S and P five hundred has a long average near ten percent. Bonds often land between four and six percent. Real estate grows near six to eight percent. Inflation has a long average near three percent. Savings accounts usually yield less than two percent. By comparing your annualized return to these benchmarks, you can see how well your investment performed.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}