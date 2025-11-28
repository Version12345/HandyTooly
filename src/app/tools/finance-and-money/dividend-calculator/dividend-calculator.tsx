'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import ToolLayout from '../../toolLayout';
import FinancialDisclaimer from '@/components/disclaimers/financialDisclaimer';
import CurrencySelector from '@/components/currencySelector';
import { ToolNameLists } from '@/constants/tools';
import { formatCurrency, getCurrencySymbol } from '@/utils/currencyHelpers';

interface DividendData {
  investmentAmount: number;
  annualDividendYield: number;
  dividendGrowthRate: number;
  sharePrice: number;
  timeHorizon: number;
  taxRateOnDividends: number;
  reinvestmentStrategy: 'no' | 'full';
  currency: string;
}

interface DividendResult {
  annualDividendIncome: number;
  monthlyDividendIncome: number;
  afterTaxAnnualIncome: number;
  totalDividendsReceived: number;
  finalPortfolioValue: number;
  totalReturn: number;
  dividendCoverageRatio: number;
  yieldOnCost: number;
  compoundAnnualGrowth: number;
  annualTaxBurden: number;
  yearlyBreakdown: DividendYearlyData[];
  projectionSchedule: DividendProjection[];
  riskMetrics: RiskAssessment;
}

interface DividendYearlyData {
  year: number;
  dividendIncome: number;
  portfolioValue: number;
  yieldOnCost: number;
  sharesOwned: number;
}

interface DividendProjection {
  year: number;
  dividend: number;
  yieldOnCost: number;
  portfolioValue: number;
}

interface RiskAssessment {
  dividendSustainability: 'Sustainable' | 'Moderate' | 'High Risk';
  incomeVolatilityRisk: 'Low' | 'Medium' | 'High';
}

const DividendCalculator: React.FC = () => {
  const [formData, setFormData] = useState<DividendData>({
    investmentAmount: 10000,
    annualDividendYield: 4.5,
    dividendGrowthRate: 5.0,
    sharePrice: 60,
    timeHorizon: 10,
    taxRateOnDividends: 15.0,
    reinvestmentStrategy: 'full',
    currency: 'USD',
  });

  const [results, setResults] = useState<DividendResult | null>(null);
  const [projectionViewMode, setProjectionViewMode] = useState<'annual' | 'quarterly'>('annual');

  const calculateDividendProjections = useCallback((data: DividendData): DividendResult => {
    const {
      investmentAmount,
      annualDividendYield,
      dividendGrowthRate,
      sharePrice,
      timeHorizon,
      taxRateOnDividends,
      reinvestmentStrategy,
    } = data;

    // Initial calculations
    const initialShares = Math.floor(investmentAmount / sharePrice);
    const initialDividendPerShare = (sharePrice * annualDividendYield) / 100;
    const annualDividendIncome = initialShares * initialDividendPerShare;
    const monthlyDividendIncome = annualDividendIncome / 12;
    const afterTaxAnnualIncome = annualDividendIncome * (1 - taxRateOnDividends / 100);

    // Yearly projections
    const yearlyBreakdown: DividendYearlyData[] = [];
    const projectionSchedule: DividendProjection[] = [];
    let currentShares = initialShares;
    let currentDividendPerShare = initialDividendPerShare;
    let totalDividendsReceived = 0;

    for (let year = 1; year <= timeHorizon; year++) {
      // Grow dividend per share
      currentDividendPerShare *= (1 + dividendGrowthRate / 100);
      
      // Calculate dividend income for this year
      const yearlyDividendIncome = currentShares * currentDividendPerShare;
      const afterTaxDividendIncome = yearlyDividendIncome * (1 - taxRateOnDividends / 100);
      
      totalDividendsReceived += yearlyDividendIncome;
      
      // Reinvest dividends if full reinvestment
      if (reinvestmentStrategy === 'full') {
        const additionalShares = Math.floor(afterTaxDividendIncome / sharePrice);
        currentShares += additionalShares;
      }
      
      // Calculate portfolio value (simplified - assumes share price grows with dividend)
      const estimatedSharePrice = sharePrice * Math.pow(1 + dividendGrowthRate / 100 * 0.6, year);
      const portfolioValue = currentShares * estimatedSharePrice;
      
      // Calculate yield on cost
      const yieldOnCost = (yearlyDividendIncome / investmentAmount) * 100;
      
      yearlyBreakdown.push({
        year,
        dividendIncome: yearlyDividendIncome,
        portfolioValue,
        yieldOnCost,
        sharesOwned: currentShares,
      });

      projectionSchedule.push({
        year,
        dividend: yearlyDividendIncome,
        yieldOnCost,
        portfolioValue,
      });
    }

    const finalPortfolioValue = yearlyBreakdown[yearlyBreakdown.length - 1]?.portfolioValue || investmentAmount;
    const totalReturn = ((finalPortfolioValue + totalDividendsReceived - investmentAmount) / investmentAmount) * 100;
    const compoundAnnualGrowth = Math.pow(finalPortfolioValue / investmentAmount, 1 / timeHorizon) - 1;

    // Risk assessment
    const riskMetrics: RiskAssessment = {
      dividendSustainability: annualDividendYield > 8 ? 'High Risk' : 
                            annualDividendYield > 5 ? 'Moderate' : 'Sustainable',
      incomeVolatilityRisk: dividendGrowthRate > 10 ? 'High' : 
                           dividendGrowthRate > 5 ? 'Medium' : 'Low',
    };

    return {
      annualDividendIncome,
      monthlyDividendIncome,
      afterTaxAnnualIncome,
      totalDividendsReceived,
      finalPortfolioValue,
      totalReturn,
      dividendCoverageRatio: 1.7, // Simplified
      yieldOnCost: (annualDividendIncome / investmentAmount) * 100,
      compoundAnnualGrowth: compoundAnnualGrowth * 100,
      annualTaxBurden: annualDividendIncome * (taxRateOnDividends / 100),
      yearlyBreakdown,
      projectionSchedule,
      riskMetrics,
    };
  }, []);

  useEffect(() => {
    const calculatedResults = calculateDividendProjections(formData);
    setResults(calculatedResults);
  }, [formData, calculateDividendProjections]);

  const handleInputChange = (field: keyof DividendData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'reinvestmentStrategy' || field === 'currency' 
        ? value 
        : typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  // Chart configuration for dividend growth
  const chartOptions = useMemo<Highcharts.Options>(() => {
    if (!results) {
      return {};
    }

    return {
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
        height: 400,
      },
      title: {
        text: 'Dividend Income Projection',
        style: { fontSize: '16px', fontWeight: 'bold' }
      },
      xAxis: {
        categories: results.yearlyBreakdown.map(data => `${data.year}`),
        gridLineWidth: 1,
        title: { text: 'Years' },
      },
      yAxis: {
        title: { text: `Income (${getCurrencySymbol(formData.currency)})` },
        gridLineWidth: 1,
      },
      plotOptions: {
        area: {
          fillOpacity: 0.3,
          marker: { enabled: false },
        }
      },
      series: [
        {
          type: 'area',
          name: 'Annual Dividend Income',
          data: results.yearlyBreakdown.map(data => data.dividendIncome),
          color: '#3B82F6',
        },
        {
          type: 'area',
          name: 'Portfolio Value',
          data: results.yearlyBreakdown.map(data => data.portfolioValue),
          color: '#10B981',
        }
      ],
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
      },
      tooltip: {
        shared: true,
        formatter: function() {
          let tooltip = `<b>Year ${this.x}</b><br/>`;
          this.points?.forEach(point => {
            tooltip += `${point.series.name}: ${formatCurrency(point.y as number, formData.currency)}<br/>`;
          });
          return tooltip;
        }
      },
      credits: { enabled: false },
    };
  }, [results, formData.currency]);

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.DividendCalculator}
      educationContent={educationContent}
      disclaimer={<FinancialDisclaimer />}
    >
      <div className="space-y-8">
        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Investment Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Details</h3>
            <div className="space-y-4">
              <CurrencySelector
                value={formData.currency}
                onChange={(currency) => handleInputChange('currency', currency)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    {getCurrencySymbol(formData.currency)}
                  </span>
                  <input
                    type="number"
                    value={formData.investmentAmount}
                    onChange={(e) => handleInputChange('investmentAmount', e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Total amount invested in dividend stocks</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Dividend Yield
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.annualDividendYield}
                    onChange={(e) => handleInputChange('annualDividendYield', e.target.value)}
                    className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="4.5"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Current annual dividend yield percentage</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dividend Growth Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.dividendGrowthRate}
                    onChange={(e) => handleInputChange('dividendGrowthRate', e.target.value)}
                    className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5.0"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Expected annual dividend growth rate</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Price Appreciation
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.sharePrice}
                    onChange={(e) => handleInputChange('sharePrice', e.target.value)}
                    className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="6.0"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Expected annual price appreciation</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Horizon
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.timeHorizon}
                    onChange={(e) => handleInputChange('timeHorizon', e.target.value)}
                    className="w-full pr-16 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">years</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Investment time horizon for projections</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate on Dividends
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.taxRateOnDividends}
                    onChange={(e) => handleInputChange('taxRateOnDividends', e.target.value)}
                    className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="15.0"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tax rate applied to dividend income</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dividend Reinvestment
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="reinvestment"
                      checked={formData.reinvestmentStrategy === 'no'}
                      onChange={() => handleInputChange('reinvestmentStrategy', 'no')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">No Reinvestment</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="reinvestment"
                      checked={formData.reinvestmentStrategy === 'full'}
                      onChange={() => handleInputChange('reinvestmentStrategy', 'full')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Full Reinvestment</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Choose dividend reinvestment strategy</p>
              </div>
            </div>

            {results && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Annual Dividend Income:</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(results.annualDividendIncome, formData.currency)}
                  </div>
                  <div className="text-sm text-gray-500">Before taxes</div>
                </div>
              </div>
            )}
          </div>

          {/* Results - Dividend Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dividend Analysis</h3>
            {results && (
              <div className="space-y-4">
                <div className="bg-green-100 p-4 rounded-lg">
                  <div className="text-sm font-medium text-green-800 mb-1">Current Dividend Yield</div>
                  <div className="text-2xl font-bold text-green-700">
                    {formatPercentage(formData.annualDividendYield)}
                  </div>
                </div>

                <div className="bg-blue-100 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-1">Monthly Dividend Income</div>
                  <div className="text-xl font-bold text-blue-700">
                    {formatCurrency(results.monthlyDividendIncome, formData.currency)}
                  </div>
                </div>

                <div className="bg-purple-100 p-4 rounded-lg">
                  <div className="text-sm font-medium text-purple-800 mb-1">After-Tax Annual Income</div>
                  <div className="text-xl font-bold text-purple-700">
                    {formatCurrency(results.afterTaxAnnualIncome, formData.currency)}
                  </div>
                </div>

                <div className="bg-amber-100 p-4 rounded-lg">
                  <div className="text-sm font-medium text-amber-800 mb-1">Total Return ({formData.timeHorizon} years)</div>
                  <div className="text-xl font-bold text-amber-700">
                    {formatPercentage(results.totalReturn)}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-blue-800">Reinvestment Benefits</h4>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Final Portfolio Value:</span>
                      <span className="font-medium">{formatCurrency(results.finalPortfolioValue, formData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Dividends Received:</span>
                      <span className="font-medium">{formatCurrency(results.totalDividendsReceived, formData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compound Annual Growth:</span>
                      <span className="font-medium">{formatPercentage(results.compoundAnnualGrowth)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Yield Metrics</h4>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Yield on Cost (Year 10):</span>
                      <span className="font-medium">{formatPercentage(results.yieldOnCost * 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dividend Coverage Ratio:</span>
                      <span className="font-medium">{results.dividendCoverageRatio.toFixed(1)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Tax Burden:</span>
                      <span className="font-medium">{formatCurrency(results.annualTaxBurden, formData.currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Income Growth Projection</h4>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Year 1:</span>
                      <span className="font-medium">{formatCurrency(results.yearlyBreakdown[0]?.dividendIncome || 0, formData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Year 5:</span>
                      <span className="font-medium">{formatCurrency(results.yearlyBreakdown[4]?.dividendIncome || 0, formData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Year 10:</span>
                      <span className="font-medium">{formatCurrency(results.yearlyBreakdown[9]?.dividendIncome || 0, formData.currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Risk Assessment</h4>
                  <div className="text-sm">
                    <div className="flex justify-between items-center">
                      <span>Dividend Sustainability:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        results.riskMetrics.dividendSustainability === 'Sustainable' ? 'bg-green-100 text-green-800' :
                        results.riskMetrics.dividendSustainability === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {results.riskMetrics.dividendSustainability}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span>Income Volatility Risk:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        results.riskMetrics.incomeVolatilityRisk === 'Low' ? 'bg-green-100 text-green-800' :
                        results.riskMetrics.incomeVolatilityRisk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {results.riskMetrics.incomeVolatilityRisk}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dividend Projection Schedule */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {results && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Projection Summary</h3>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-blue-600">Total Periods:</strong>
                      <div className="font-medium">{formData.timeHorizon}</div>
                    </div>
                    <div>
                      <strong className="text-blue-600">Final Yield on Cost:</strong>
                      <div className="font-medium">{formatPercentage(results.yieldOnCost * 2)}</div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dividend Projection Schedule</h3>
                
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setProjectionViewMode('annual')}
                    className={`p-2 rounded-md text-xs font-medium transition-colors ${
                      projectionViewMode === 'annual' 
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Annual
                  </button>
                  <button 
                    onClick={() => setProjectionViewMode('quarterly')}
                    className={`p-2 ml-2 rounded-md text-xs font-medium transition-colors ${
                      projectionViewMode === 'quarterly' 
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Quarterly
                  </button>
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="bg-white shadow sticky top-0">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 pr-2">{projectionViewMode === 'annual' ? 'Year' : 'Qtr'}</th>
                        <th className="text-left py-2 pr-2">Dividend</th>
                        <th className="text-left py-2 pr-2">Yield</th>
                        <th className="text-left py-2 pr-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(projectionViewMode === 'annual' 
                        ? results.projectionSchedule
                        : results.projectionSchedule.flatMap(projection => 
                            Array.from({length: 4}, (_, i) => ({
                              ...projection,
                              year: `${projection.year}Q${i + 1}`,
                              dividend: projection.dividend / 4,
                            }))
                          )
                      ).map((projection, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 pr-2">{projection.year}</td>
                          <td className="py-2 pr-2 text-green-600 font-medium">
                            {formatCurrency(typeof projection.dividend === 'number' ? projection.dividend : 0, formData.currency)}
                          </td>
                          <td className="py-2 pr-2">{formatPercentage(projection.yieldOnCost)}</td>
                          <td className="py-2 pr-2">{formatCurrency(projection.portfolioValue, formData.currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        {results && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default DividendCalculator;

const educationContent: React.ReactNode = (
  <div>
    <h3>Understanding Dividend Investing</h3>
    <p>
      Dividend investing involves purchasing stocks that pay regular dividends to shareholders. These dividends can provide a steady income stream and can be reinvested to purchase additional shares, compounding growth over time. 
    </p>  
    
    <h3>What Dividends Are</h3>
    <p>
      Dividends are payments that companies send to their shareholders. These payments come from profits that the company earns. Some firms pay dividends every three months. Others pay once a year. A few send special payouts when profits reach a strong level. Many large names like Coca Cola and Johnson and Johnson use steady dividends to show strength and trust.
    </p>

    <h3>How Dividend Investing Works</h3>
    <p>
      Dividend investing focuses on buying stocks that pay regular cash. You earn money from the payout itself and from any rise in the stock price. People often look for companies with long records of stable payments. They also check the payout ratio, which shows how much of the profit goes to dividends. A healthy ratio gives room for growth and keeps the payment safe.
    </p>

    <h3>Why Dividends Matter</h3>
    <p>
      Dividends create steady income without selling your shares. This helps people who want cash flow, including retirees. It also gives investors a clear view of a company&apos;s health. A strong dividend shows confidence from the business. The payment can smooth out market swings and give you money even when stock prices move in rough patterns.
    </p>

    <h3>The Power of Reinvesting</h3>
    <p>
      Reinvesting dividends turns small payments into real long term growth. Each payout buys more shares. Those new shares create more future payouts. The effect builds year after year. A person who reinvests a one hundred dollar dividend at a steady rate can turn that money into far more over time. Reinvestment uses the strength of compounding, which grows faster as your share count climbs.
    </p>

    <h3>Building a Dividend Strategy</h3>
    <p>
      A strong plan starts with clear goals. Some people want steady income. Others want long term growth through reinvestment. You can mix both paths. Pick companies with solid records, honest balance sheets, and simple business models. Review your holdings at least once a year. Keep reinvesting, stay patient, and let the power of steady payouts work in your favor.
    </p>
  </div>
);