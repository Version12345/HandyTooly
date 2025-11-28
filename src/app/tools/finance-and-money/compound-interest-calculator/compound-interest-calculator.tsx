'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import ToolLayout from '../../toolLayout';
import FinancialDisclaimer from '@/components/disclaimers/financialDisclaimer';
import CurrencySelector from '@/components/currencySelector';
import { ToolNameLists } from '@/constants/tools';
import { formatCurrency, getCurrencySymbol } from '@/utils/currencyHelpers';

interface InvestmentData {
  initialPrincipal: number;
  annualInterestRate: number;
  timePeriod: number;
  timeUnit: 'years' | 'months';
  compoundingFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually';
  additionalMonthlyContribution: number;
  annualContributionIncrease: number;
  currency: string;
}

interface CalculationResult {
  finalAmount: number;
  totalInterestEarned: number;
  totalContributions: number;
  effectiveAnnualRate: number;
  compoundInterest: number;
  simpleInterest: number;
  compoundAdvantage: number;
  returnOnInvestment: number;
  doublingTime: number;
  averageMonthlyGrowth: number;
  yearlyBreakdown: YearlyData[];
  compoundingImpact: CompoundingImpact;
}

interface YearlyData {
  year: number;
  balance: number;
  interest: number;
  contributions: number;
}

interface CompoundingImpact {
  daily: number;
  monthly: number;
  annually: number;
}

const COMPOUNDING_FREQUENCIES = [
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'annually', label: 'Annually', periodsPerYear: 1 }
];

export function CompoundInterestCalculator() {
  const [investmentData, setInvestmentData] = useState<InvestmentData>({
    initialPrincipal: 10000,
    annualInterestRate: 7.5,
    timePeriod: 20,
    timeUnit: 'years',
    compoundingFrequency: 'monthly',
    additionalMonthlyContribution: 500,
    annualContributionIncrease: 3,
    currency: 'USD'
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [activeView, setActiveView] = useState<'chart' | 'breakdown'>('chart');

  const calculateCompoundInterest = useCallback((
    principal: number,
    rate: number,
    time: number,
    compoundingPerYear: number,
    monthlyContribution: number = 0,
    contributionIncrease: number = 0
  ) => {
    let balance = principal;
    let totalContributions = principal;
    let totalInterest = 0;
    const yearlyBreakdown: YearlyData[] = [];
    
    const periodicRate = rate / 100 / compoundingPerYear;
    let currentMonthlyContribution = monthlyContribution;
    
    for (let year = 1; year <= time; year++) {
      let yearContributions = 0;
      let yearInterest = 0;
      
      // Calculate how often to compound and add contributions within a year
      const periodsPerYear = compoundingPerYear;
      const monthsPerPeriod = 12 / periodsPerYear;
      
      for (let period = 1; period <= periodsPerYear; period++) {
        // Add monthly contributions for this period
        const contributionsThisPeriod = currentMonthlyContribution * monthsPerPeriod;
        if (contributionsThisPeriod > 0) {
          balance += contributionsThisPeriod;
          yearContributions += contributionsThisPeriod;
          totalContributions += contributionsThisPeriod;
        }
        
        // Apply compound interest for this period
        const interestEarned = balance * periodicRate;
        balance += interestEarned;
        yearInterest += interestEarned;
        totalInterest += interestEarned;
      }
      
      yearlyBreakdown.push({
        year,
        balance: Math.round(balance * 100) / 100,
        interest: Math.round(yearInterest * 100) / 100,
        contributions: Math.round(yearContributions * 100) / 100
      });
      
      // Increase monthly contribution annually
      if (contributionIncrease > 0) {
        currentMonthlyContribution *= (1 + contributionIncrease / 100);
      }
    }
    
    return {
      finalAmount: balance,
      totalInterest,
      totalContributions,
      yearlyBreakdown
    };
  }, []);

  const performCalculation = useCallback(() => {
    const { 
      initialPrincipal, 
      annualInterestRate, 
      timePeriod, 
      timeUnit,
      compoundingFrequency, 
      additionalMonthlyContribution,
      annualContributionIncrease 
    } = investmentData;
    
    // Ensure all values are valid numbers
    const principal = parseFloat(String(initialPrincipal)) || 0;
    const rate = parseFloat(String(annualInterestRate)) || 0;
    const period = parseFloat(String(timePeriod)) || 0;
    const monthlyContrib = parseFloat(String(additionalMonthlyContribution)) || 0;
    const contribIncrease = parseFloat(String(annualContributionIncrease)) || 0;
    
    if (!principal || !rate || !period) return;

    const timeInYears = timeUnit === 'months' ? period / 12 : period;
    const compoundingFreq = COMPOUNDING_FREQUENCIES.find(f => f.value === compoundingFrequency)?.periodsPerYear || 12;
    
    // Calculate compound interest with contributions
    const compoundResult = calculateCompoundInterest(
      principal,
      rate,
      timeInYears,
      compoundingFreq,
      monthlyContrib,
      contribIncrease
    );
    
    // Calculate simple interest for comparison
    const simpleInterest = principal * (rate / 100) * timeInYears;
    const simpleTotal = principal + simpleInterest + (monthlyContrib * 12 * timeInYears);
    
    // Calculate effective annual rate
    const effectiveRate = Math.pow(1 + (rate / 100) / compoundingFreq, compoundingFreq) - 1;
    
    // Calculate actual doubling time based on when initial investment first doubles
    const doublingTarget = principal * 2;
    const doublingYear = compoundResult.yearlyBreakdown.find(y => y.balance >= doublingTarget);
    const doublingTime = doublingYear ? doublingYear.year : 72 / rate;
    
    // Calculate ROI
    const roi = ((compoundResult.finalAmount - compoundResult.totalContributions) / compoundResult.totalContributions) * 100;
    
    // Calculate average monthly growth
    const totalMonths = timeInYears * 12;
    const averageMonthlyGrowth = (compoundResult.finalAmount - principal) / totalMonths;
    
    // Calculate compounding frequency impact
    const dailyCompounding = calculateCompoundInterest(principal, rate, timeInYears, 365, monthlyContrib, contribIncrease);
    const monthlyCompounding = calculateCompoundInterest(principal, rate, timeInYears, 12, monthlyContrib, contribIncrease);
    const annualCompounding = calculateCompoundInterest(principal, rate, timeInYears, 1, monthlyContrib, contribIncrease);

    setResult({
      finalAmount: compoundResult.finalAmount,
      totalInterestEarned: compoundResult.totalInterest,
      totalContributions: compoundResult.totalContributions,
      effectiveAnnualRate: effectiveRate * 100,
      compoundInterest: compoundResult.totalInterest,
      simpleInterest: simpleInterest,
      compoundAdvantage: compoundResult.finalAmount - simpleTotal,
      returnOnInvestment: roi,
      doublingTime: doublingTime,
      averageMonthlyGrowth: averageMonthlyGrowth,
      yearlyBreakdown: compoundResult.yearlyBreakdown,
      compoundingImpact: {
        daily: dailyCompounding.finalAmount,
        monthly: monthlyCompounding.finalAmount,
        annually: annualCompounding.finalAmount
      }
    });
  }, [investmentData, calculateCompoundInterest]);

  // Chart options for Highcharts
  const options = useMemo<Highcharts.Options>(() => ({
    credits: { 
      enabled: false 
    },
    chart: {
      marginTop: 10,
      marginBottom: 40,
      marginLeft: 70,
      marginRight: 0,
      zooming: {
        type: 'x'
      }
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: ''
      }
    },
    yAxis: {
      title: {
        text: `Investment Value (${getCurrencySymbol(investmentData.currency)})`
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
        formatter: function() {
          if (this.x && this.y) {
            return  `
              <b>${Highcharts.dateFormat('%b %e, %Y', this.x)}</b><br/>
              ${formatCurrency(this.y, investmentData.currency)}
            `;
          }
        }
    },
    plotOptions: {
      area: {
        marker: {
          radius: 2
        },
        lineWidth: 1,
        color: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, 'rgb(199, 113, 243)'],
            [0.7, 'rgb(76, 175, 254)']
          ]
        },
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },
    series: [{
      type: 'area',
      name: 'Investment Growth',
      data: result?.yearlyBreakdown.map((yearData, index) => [
        new Date(new Date().getFullYear() + index, 0, 1).getTime(),
        yearData.balance
      ]) || []
    }]
  }), [result?.yearlyBreakdown, investmentData.currency, formatCurrency]);

  useEffect(() => {
    const timeoutId = setTimeout(performCalculation, 300);
    return () => clearTimeout(timeoutId);
  }, [performCalculation]);

  const handleInputChange = (field: keyof InvestmentData, value: string | number) => {
    setInvestmentData(prev => ({ ...prev, [field]: value }));
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage.toFixed(2)}%`;
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.CompoundInterestCalculator}
      secondaryToolDescription={'Use the power of compound interest with detailed projections, investment tracking, and growth analysis. Plan your financial future with accurate calculations and visual breakdowns.'}
      disclaimer={<FinancialDisclaimer />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investment Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Investment Details</h2>
            
            {/* Currency */}
            <CurrencySelector
              value={investmentData.currency}
              onChange={(currency) => handleInputChange('currency', currency)}
              className="mb-4"
            />
            
            {/* Initial Principal */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Principal</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {getCurrencySymbol(investmentData.currency)}
                </span>
                <input
                  type="number"
                  value={investmentData.initialPrincipal}
                  onChange={(e) => {
                    handleInputChange('initialPrincipal', e.target.value);
                  }}
                  className="w-full px-3 pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={`${getCurrencySymbol(investmentData.currency)} 10,000`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Starting investment amount</p>
            </div>

            {/* Annual Interest Rate */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Interest Rate</label>
              <div className="relative">
                <input
                  type="number"
                  value={`${investmentData.annualInterestRate}`}
                  onChange={(e) => {
                    handleInputChange('annualInterestRate', e.target.value);
                  }}
                  className="w-full shadow-sm px-3 py-2 pr-25 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="7.5"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  %
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Expected annual return rate</p>
            </div>

            {/* Time Period */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={investmentData.timePeriod}
                  onChange={(e) => {
                    handleInputChange('timePeriod', e.target.value);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="20 years"
                  min="1"
                  max="100"
                />
                <select
                  value={investmentData.timeUnit}
                  onChange={(e) => handleInputChange('timeUnit', e.target.value as 'years' | 'months')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">Investment duration</p>
            </div>

            {/* Compounding Frequency */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Compounding Frequency</label>
              <select
                value={investmentData.compoundingFrequency}
                onChange={(e) => handleInputChange('compoundingFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {COMPOUNDING_FREQUENCIES.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">How often interest compounds</p>
            </div>

            {/* Additional Monthly Contribution */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Monthly Contribution</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {getCurrencySymbol(investmentData.currency)}
                </span>
                <input
                  type="number"
                  value={investmentData.additionalMonthlyContribution.toLocaleString()}
                  onChange={(e) => {
                    handleInputChange('additionalMonthlyContribution', e.target.value);
                  }}
                  className="w-full px-3 pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={`500`}
                  min="0"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Regular monthly investments</p>
            </div>

            {/* Annual Contribution Increase */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Contribution Increase</label>
              <div className="relative">
                <input
                  type="number"
                  value={investmentData.annualContributionIncrease}
                  onChange={(e) => {
                    handleInputChange('annualContributionIncrease', e.target.value);
                  }}
                  className="w-full shadow-sm px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="3"
                  min="0"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  %
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Yearly increase in contributions</p>
            </div>
          </div>

          {/* Growth Analysis */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Growth Analysis</h2>
            
            {!result && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter investment details to see analysis</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Total Interest Earned */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <strong className="text-sm font-medium mb-1">Total Interest Earned</strong>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(result.totalInterestEarned, investmentData.currency)}
                  </div>
                </div>

                {/* Total Contributions */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <strong className="text-sm font-medium mb-1">Total Contributions</strong>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(result.totalContributions, investmentData.currency)}
                  </div>
                </div>

                {/* Final Amount Display */}
                <div className="bg-green-50 rounded-lg p-4">
                  <strong className="text-sm font-medium mb-1">Final Investment value:</strong>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(result.finalAmount, investmentData.currency)}
                  </div>
                </div>

                {/* Effective Annual Rate */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <strong className="text-sm font-medium mb-1">Effective Annual Rate</strong>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatPercentage(result.effectiveAnnualRate)}
                  </div>
                </div>

                {/* Investment Composition */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <strong className="text-sm font-medium text-gray-800 mb-2">Investment Composition</strong>
                  <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
                    <div className="flex h-full rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500"
                        style={{
                          width: `${(investmentData.initialPrincipal / result.finalAmount) * 100}%`
                        }}
                      ></div>
                      <div
                        className="bg-green-500"
                        style={{
                          width: `${((result.totalContributions - investmentData.initialPrincipal) / result.finalAmount) * 100}%`
                        }}
                      ></div>
                      <div
                        className="bg-purple-500"
                        style={{
                          width: `${(result.totalInterestEarned / result.finalAmount) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center text-blue-600">
                      <div className="font-medium">
                        <strong>Principal</strong><br/> ({((investmentData.initialPrincipal / result.finalAmount) * 100).toFixed(1)}%)
                      </div>
                    </div>
                    <div className="text-center text-green-600">
                      <div className="font-medium">
                        <strong>Contributions</strong><br/> ({(((result.totalContributions - investmentData.initialPrincipal) / result.finalAmount) * 100).toFixed(1)}%)
                      </div>
                    </div>
                    <div className="text-center text-purple-600">
                      <div className="font-medium">
                        <strong>Interest</strong><br/> ({((result.totalInterestEarned / result.finalAmount) * 100).toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="bg-gray-100 space-y-3 rounded-lg p-4 mb-2">
                  <strong className="text-sm font-medium text-gray-800">Key Metrics</strong>
                  
                  <div className="flex justify-between items-center p-3 mt-2 bg-white rounded-lg">
                    <span className="font-medium text-sm">Return on Investment (ROI)</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatPercentage(result.returnOnInvestment)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-sm">Doubling Time</span>
                    <span className="text-lg font-bold text-blue-600">
                      {result.doublingTime.toFixed(1)} years
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="font-medium text-sm">Average Monthly Growth</span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatCurrency(result.averageMonthlyGrowth, investmentData.currency)}
                    </span>
                  </div>
                </div>

                {/* Investment Milestones */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Investment Milestones</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">First $100k:</span>
                      <span className="font-bold text-blue-600">
                        {result.yearlyBreakdown.find(y => y.balance >= 100000)?.year || '—'} years
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">First Million:</span>
                      <span className="font-bold text-purple-600">
                        {result.yearlyBreakdown.find(y => y.balance >= 1000000)?.year || '—'} years
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Growth Projection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Growth Projection</h2>
              
              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('chart')}
                  className={`p-2 rounded-md text-xs font-medium transition-colors ${
                    activeView === 'chart'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Chart
                </button>
                <button
                  onClick={() => setActiveView('breakdown')}
                  className={`p-2 rounded-md text-xs font-medium transition-colors ${
                    activeView === 'breakdown'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Breakdown
                </button>
              </div>
            </div>
            
            {result && (
              <>
                {/* Chart View */}
                {activeView === 'chart' && (
                  <div className="mb-6">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={options}
                    />
                    
                    {/* 5-Year Milestones */}
                    <div className="mt-6 bg-gray-100 space-y-3 rounded-lg p-4 mb-2">
                      <strong className="text-sm font-medium text-gray-700 mb-3 block">5-Year Milestones</strong>
                      <div className="space-y-2">
                        {result.yearlyBreakdown
                          .filter((_, index) => (index + 1) % 5 === 0)
                          .map((yearData) => (
                            <div key={yearData.year} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 bg-white rounded-lg px-3">
                              <div>
                                <div className="font-medium text-gray-900">Year {yearData.year}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-gray-900">
                                  {formatCurrency(yearData.balance, investmentData.currency)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Interest: {formatCurrency(yearData.interest, investmentData.currency)}
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                )}

                {/* Breakdown View */}
                {activeView === 'breakdown' && (
                  <div className="space-y-6">
                    {/* Yearly Breakdown Table */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Yearly Breakdown</h3>
                      <div className="max-h-124 overflow-y-auto w-full">
                        <div className="grid grid-cols-[9%_28%_28%_28%] gap-1 text-xs font-medium text-gray-600 mb-2 sticky top-0 bg-white">
                          <div>Year</div>
                          <div>Balance</div>
                          <div>Interest</div>
                          <div>Contributions</div>
                        </div>
                        {result.yearlyBreakdown.map((yearData) => (
                          <div key={yearData.year} className="grid grid-cols-[9%_28%_28%_28%] gap-1 text-xs py-1 border-b border-gray-100">
                            <div className="font-medium">{yearData.year}</div>
                            <div>{formatCurrency(yearData.balance, investmentData.currency)}</div>
                            <div className="text-blue-600">{formatCurrency(yearData.interest, investmentData.currency)}</div>
                            <div className="text-green-600">{formatCurrency(yearData.contributions, investmentData.currency)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Compound vs Simple Interest */}
                <div className="bg-yellow-50 rounded-lg p-4 mt-6">
                  <h3 className="text-sm font-medium mb-2">Compound vs Simple Interest</h3>
                  <div className="space-y-1 text-sm text-yellow-700">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Compound Interest:</span>
                      <span>
                        {formatCurrency(result.compoundInterest, investmentData.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Simple Interest:</span>
                      <span>
                        {formatCurrency(result.simpleInterest, investmentData.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Compound Advantage:</span>
                      <span>
                        {formatCurrency(result.compoundAdvantage, investmentData.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compounding Frequency Impact */}
                <div className="bg-orange-50 rounded-lg p-4 mt-4">
                  <h3 className="text-sm font-medium text-orange-800 mb-2">Compounding Frequency Impact</h3>
                  <div className="space-y-1 text-sm text-orange-700">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Daily:</span>
                      <span>
                        {formatCurrency(result.compoundingImpact.daily, investmentData.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Monthly:</span>
                      <span>
                        {formatCurrency(result.compoundingImpact.monthly, investmentData.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Annually:</span>
                      <span>
                        {formatCurrency(result.compoundingImpact.annually, investmentData.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Usage Information */}
        <div>
          <h3>How Compounding Works</h3>
          <p>Compound interest is the interest you earn on both your original money and the interest it already gained. It makes your investment grow faster over time because each period builds on the last one. For example, if you earn interest on $1,000, the next time you earn interest on both the $1,000 and the new interest added. The more often it compounds, the faster your balance grows. This is why starting early and staying invested are key to long-term growth.</p>
          <h3>Different between Compound vs Simple Interest</h3>
          <p>Simple interest is calculated only on the principal amount, or the initial amount of money you invested. It does not take into account any interest that has already been added to the balance. In contrast, compound interest is calculated on the principal amount and also on any interest that has been added to it over time. This means that with compound interest, you earn interest on your interest, which can lead to much higher returns over the long term.</p>
          <h3>How to Use This Calculator</h3>
          <p>To use this calculator, start by entering your initial principal, or the amount you plan to invest. Then set your expected annual interest rate to see how your money grows over time. Choose your time period in years or months, and select how often the interest is added to your balance. Each choice affects your final result, so adjust them to match your real investment plan.</p>
          <h3>Growth Strategies</h3>
          <p>For better growth, make regular contributions to your investment. Adding money each month or year increases your balance and helps your interest grow faster. Even small, consistent deposits make a big difference over time. Staying disciplined is key to reaching your financial goals.</p>
          <p>Compounding is where your investment truly shines. The more often your interest compounds, the faster your money grows. Daily or monthly compounding adds interest to both your original balance and the interest you have already earned. Time is the most powerful factor in this process. The longer you keep your money invested, the greater your returns become.</p>

        </div>
      </div>
    </ToolLayout>
  );
}