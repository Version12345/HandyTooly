'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import FinancialDisclaimer from '@/components/disclaimers/financialDisclaimer';
import CurrencySelector from '@/components/currencySelector';
import { formatCurrency, getCurrencySymbol } from '@/utils/currencyHelpers';
import Link from 'next/link';

interface IncomeExpenses {
  grossAnnualIncome: number;
  monthlyDebtPayments: number;
  monthlyExpenses: number;
  availableDownPayment: number;
  creditScore: string;
  currency: string;
}

interface LoanParameters {
  loanTerm: number;
  interestRate: number;
  propertyTaxRate: number;
  homeInsurance: number;
  pmiMortgageInsurance: number;
  hoaFees: number;
}

interface AffordabilityResults {
  monthlyPayment: number;
  principalAndInterest: number;
  loanAmount: number;
  downPayment: number;
  housingRatio: number;
  debtToIncomeRatio: number;
  monthlyGrossIncome: number;
  availableForHousing: number;
  downPaymentPercentage: number;
  affordabilityStatus: 'excellent' | 'good' | 'fair' | 'poor';
}

interface HomePriceScenario {
  type: 'conservative' | 'recommended' | 'maximum';
  percentage: number;
  homePrice: number;
  monthlyPayment: number;
  downPayment: number;
  loanAmount: number;
  dtiRatio: number;
}

const LOAN_TERMS = [
  { value: 30, label: '30 years' },
  { value: 25, label: '25 years' },
  { value: 20, label: '20 years' },
  { value: 15, label: '15 years' },
  { value: 10, label: '10 years' }
];

export default function HomeAffordabilityCalculator() {
  const [incomeExpenses, setIncomeExpenses] = useState<IncomeExpenses>({
    grossAnnualIncome: 85000,
    monthlyDebtPayments: 500,
    monthlyExpenses: 2000,
    availableDownPayment: 90000,
    creditScore: '740-799',
    currency: 'USD'
  });

  const [loanParameters, setLoanParameters] = useState<LoanParameters>({
    loanTerm: 30,
    interestRate: 7.0,
    propertyTaxRate: 1.0,
    homeInsurance: 1000,
    pmiMortgageInsurance: 0.0,
    hoaFees: 100
  });
  
  /**
   * Calculate the maximum house price based on income, down payment,
   * interest rate, loan term, and other expenses.
   *
   * @param {number} monthlyIncome - Gross monthly income (I)
   * @param {number} fractionForHousing - Fraction of income for housing (f)
   * @param {number} otherExpenses - Other monthly housing expenses (E)
   * @param {number} annualInterestRate - Annual interest rate in percent (e.g., 6 for 6%)
   * @param {number} loanTermYears - Loan term in years (n)
   * @param {number} downPayment - Down payment (D)
   * @returns {number} Maximum house price (P)
   */
  const calculateMaxHousePrice = (
    monthlyIncome: number, 
    monthlyInterestRate: number, 
    loanTermYears: number,
  ) => {
    const grossIncomeRate = 0.4; // 28% rule
    const maxMonthlyPayment = grossIncomeRate * monthlyIncome

    const loanAmount = maxMonthlyPayment * (
      (Math.pow(1 + monthlyInterestRate, loanTermYears * 12) - 1) / 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermYears * 12))
    )

    return loanAmount;
  };

  const calculateAffordability = useCallback((): AffordabilityResults => {
    const monthlyGrossIncome = incomeExpenses.grossAnnualIncome / 12;
    const monthlyInterestRate = loanParameters.interestRate / 100 / 12;
    const numberOfPayments = loanParameters.loanTerm * 12;

    const maxHomePrice = calculateMaxHousePrice(
      monthlyGrossIncome,
      monthlyInterestRate,
      loanParameters.loanTerm
    );

    // Calculate maximum housing payment (28% rule)
    const maxHousingPayment = monthlyGrossIncome * 0.28;
    
    // Calculate maximum total debt payment (36% rule)
    const maxHousingAfterDebt = monthlyGrossIncome - incomeExpenses.monthlyDebtPayments - incomeExpenses.monthlyExpenses;
    
    // Use the lower of the two
    const availableForHousing = Math.min(maxHousingPayment, maxHousingAfterDebt);
    
    // Fixed monthly costs
    const monthlyInsurance = loanParameters.homeInsurance / 12;
    
    // Final calculations with the determined max home price
    // Check if down payment exceeds max home price
    let loanAmount: number = 0;
    let totalMonthlyPayment: number = 0;
    let principalAndInterest: number = 0;
    
    if (incomeExpenses.availableDownPayment <= maxHomePrice) {
      // Normal calculation
      loanAmount = maxHomePrice - incomeExpenses.availableDownPayment;
      
      // Calculate monthly property tax and PMI
      const monthlyPropertyTax = (maxHomePrice * loanParameters.propertyTaxRate / 100) / 12;
      const monthlyPMI = loanAmount * (loanParameters.pmiMortgageInsurance / 100) / 12;
      
      // Calculate principal and interest
      principalAndInterest = monthlyInterestRate > 0 ? 
        loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) : 0;
      
      totalMonthlyPayment = principalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyPMI + loanParameters.hoaFees;
    }
    
    // Calculate ratios
    const housingRatio = (totalMonthlyPayment / monthlyGrossIncome) * 100;
    const debtToIncomeRatio = ((totalMonthlyPayment + incomeExpenses.monthlyDebtPayments) / monthlyGrossIncome) * 100;
    const downPaymentPercentage = (incomeExpenses.availableDownPayment / maxHomePrice) * 100;

    // Determine affordability status
    let affordabilityStatus: AffordabilityResults['affordabilityStatus'] = 'excellent';
    if (debtToIncomeRatio > 36) affordabilityStatus = 'poor';
    else if (debtToIncomeRatio > 30) affordabilityStatus = 'fair';
    else if (debtToIncomeRatio > 25) affordabilityStatus = 'good';

    return {
      monthlyPayment: totalMonthlyPayment,
      principalAndInterest,
      loanAmount: Math.max(0, loanAmount),
      downPayment: incomeExpenses.availableDownPayment,
      housingRatio,
      debtToIncomeRatio,
      monthlyGrossIncome,
      availableForHousing,
      downPaymentPercentage,
      affordabilityStatus
    };
  }, [incomeExpenses, loanParameters]);

  const results = useMemo(() => calculateAffordability(), [calculateAffordability]);

  const homePriceScenarios = useMemo((): HomePriceScenario[] => {
    const basePrice = results.loanAmount + results.downPayment;
    
    const scenarios: HomePriceScenario[] = [
      {
        type: 'conservative',
        percentage: 75,
        homePrice: basePrice * 0.75,
        monthlyPayment: 0,
        downPayment: 0,
        loanAmount: 0,
        dtiRatio: 0
      },
      {
        type: 'recommended',
        percentage: 90,
        homePrice: basePrice * 0.90,
        monthlyPayment: 0,
        downPayment: 0,
        loanAmount: 0,
        dtiRatio: 0
      },
      {
        type: 'maximum',
        percentage: 100,
        homePrice: basePrice,
        monthlyPayment: results.monthlyPayment,
        downPayment: results.downPayment,
        loanAmount: results.loanAmount,
        dtiRatio: results.debtToIncomeRatio
      }
    ];

    // Calculate details for conservative and recommended scenarios
    scenarios.forEach(scenario => {
      if (scenario.type !== 'maximum') {
        const loanAmount = scenario.homePrice - incomeExpenses.availableDownPayment;
        const monthlyInterestRate = loanParameters.interestRate / 100 / 12;
        const numberOfPayments = loanParameters.loanTerm * 12;
        
        if (loanAmount > 0) {
          const principalAndInterest = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
          const monthlyPropertyTax = (scenario.homePrice * loanParameters.propertyTaxRate / 100) / 12;
          const monthlyInsurance = loanParameters.homeInsurance / 12;
          const monthlyPMI = loanAmount * (loanParameters.pmiMortgageInsurance / 100) / 12;
          
          scenario.monthlyPayment = principalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyPMI + loanParameters.hoaFees;
          scenario.loanAmount = loanAmount;
          scenario.downPayment = incomeExpenses.availableDownPayment;
          scenario.dtiRatio = ((scenario.monthlyPayment + incomeExpenses.monthlyDebtPayments) / results.monthlyGrossIncome) * 100;
        }
      }
    });

    return scenarios;
  }, [results, incomeExpenses, loanParameters]);

  const updateIncomeExpenses = <K extends keyof IncomeExpenses>(field: K, value: IncomeExpenses[K]) => {
    setIncomeExpenses(prev => ({ ...prev, [field]: value }));
  };

  const updateLoanParameters = <K extends keyof LoanParameters>(field: K, value: LoanParameters[K]) => {
    setLoanParameters(prev => ({ ...prev, [field]: value }));
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getAffordabilityColor = (status: AffordabilityResults['affordabilityStatus']) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-sky-100 text-sky-800';
      case 'fair': return 'bg-amber-100 text-amber-800';
      case 'poor': return 'bg-red-100 text-red-800';
    }
  };

  const getScenarioColor = (type: HomePriceScenario['type']) => {
    switch (type) {
      case 'conservative': return 'bg-green-50';
      case 'recommended': return 'bg-sky-50';
      case 'maximum': return 'bg-orange-50';
    }
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.MortgageAffordabilityCalculator}
      educationContent={educationContent}
      disclaimer={<FinancialDisclaimer />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income & Monthly Expenses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Income & Monthly Expenses
            </h2>
            
            <div className="space-y-4">
              <div>
                <div>
                  <CurrencySelector
                    value={incomeExpenses.currency}
                    onChange={(currency: string) => updateIncomeExpenses('currency', currency)}
                  />
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gross Annual Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {getCurrencySymbol(incomeExpenses.currency)}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={incomeExpenses.grossAnnualIncome}
                    onChange={(e) => updateIncomeExpenses('grossAnnualIncome', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Before taxes and deductions</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Debt Payments
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {getCurrencySymbol(incomeExpenses.currency)}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={incomeExpenses.monthlyDebtPayments}
                    onChange={(e) => updateIncomeExpenses('monthlyDebtPayments', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Auto loans, credit cards, student loans</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Expenses
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {getCurrencySymbol(incomeExpenses.currency)}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={incomeExpenses.monthlyExpenses}
                    onChange={(e) => updateIncomeExpenses('monthlyExpenses', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Living expenses, insurance, food, utilities</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {getCurrencySymbol(incomeExpenses.currency)}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={incomeExpenses.availableDownPayment}
                    onChange={(e) => updateIncomeExpenses('availableDownPayment', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Loan Parameters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Loan Parameters
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term
                </label>
                <select
                  value={loanParameters.loanTerm}
                  onChange={(e) => updateLoanParameters('loanTerm', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {LOAN_TERMS.map(term => (
                    <option key={term.value} value={term.value}>
                      {term.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (Annual)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={loanParameters.interestRate}
                    onChange={(e) => updateLoanParameters('interestRate', parseFloat(e.target.value) || 0)}
                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Annual Percentage Rate (APR) based on credit score</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Tax Rate (Annual)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={loanParameters.propertyTaxRate}
                    onChange={(e) => updateLoanParameters('propertyTaxRate', parseFloat(e.target.value) || 0)}
                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Property tax as % of home value</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Insurance (Annual)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {getCurrencySymbol(incomeExpenses.currency)}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={loanParameters.homeInsurance}
                    onChange={(e) => updateLoanParameters('homeInsurance', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PMI/Mortgage Insurance
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={loanParameters.pmiMortgageInsurance}
                    onChange={(e) => updateLoanParameters('pmiMortgageInsurance', parseFloat(e.target.value) || 0)}
                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Required if down payment &lt; 20%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HOA Fees (Monthly)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {getCurrencySymbol(incomeExpenses.currency)}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="25"
                    value={loanParameters.hoaFees}
                    onChange={(e) => updateLoanParameters('hoaFees', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Homeowners association fees</p>
              </div>

              {/* Maximum Home Price */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Maximum Home Price:</h3>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(results.loanAmount + results.downPayment, incomeExpenses.currency)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Based on your financial profile</p>
              </div>
            </div>
          </div>

          {/* Affordability Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Affordability Analysis
            </h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-red-800 mb-1">Loan Amount</div>
                <div className="text-lg font-semibold text-red-900">
                  {formatCurrency(results.loanAmount, incomeExpenses.currency)}
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${getAffordabilityColor(results.affordabilityStatus)}`}>
                <div className="text-sm font-medium mb-1">Monthly Payment</div>
                <div className="text-xl font-bold">
                  {formatCurrency(results.monthlyPayment, incomeExpenses.currency)}
                </div>
              </div>

              <div className="bg-sky-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-sky-800 mb-1">Principal & Interest</div>
                <div className="text-lg font-semibold text-sky-900">
                  {formatCurrency(results.principalAndInterest, incomeExpenses.currency)}
                </div>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-orange-800 mb-1">Monthly Gross Income</div>
                <div className="text-lg font-semibold text-orange-900">
                  {formatCurrency(results.monthlyGrossIncome, incomeExpenses.currency)}
                </div>
              </div>

              <div className="bg-lime-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-lime-800 mb-1">Down Payment Percentage</div>
                <div className="text-lg font-semibold text-lime-900">
                  {formatPercentage(results.downPaymentPercentage)}
                </div>
              </div>

              <div className="bg-fuchsia-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-fuchsia-800 mb-1">Available for Housing</div>
                <div className="text-lg font-semibold text-fuchsia-900">
                  {formatCurrency(results.availableForHousing, incomeExpenses.currency)}
                  <br />
                  <span className="text-xs font-normal">Money available after expenses</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-gray-900">Debt-to-Income Ratios</h3>
                
                {/* Housing Ratio Bar Chart */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Housing Ratio (Front-end)</span>
                    <span className="font-semibold text-gray-900">{formatPercentage(results.housingRatio)}</span>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
                        results.housingRatio <= 28 ? 'bg-green-500' : 
                        results.housingRatio <= 32 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(results.housingRatio / 40 * 100, 100)}%` }}
                    ></div>
                    {/* 28% marker */}
                    <div 
                      className="absolute top-0 h-full w-0.5 bg-gray-600"
                      style={{ left: `${28 / 40 * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Recommended: ≤ 28%
                  </div>
                </div>
                
                {/* Total Debt Ratio Bar Chart */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Debt Ratio (Back-end)</span>
                    <span className="font-semibold text-gray-900">{formatPercentage(results.debtToIncomeRatio)}</span>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
                        results.debtToIncomeRatio <= 36 ? 'bg-green-500' : 
                        results.debtToIncomeRatio <= 42 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(results.debtToIncomeRatio / 50 * 100, 100)}%` }}
                    ></div>
                    {/* 36% marker */}
                    <div 
                      className="absolute top-0 h-full w-0.5 bg-gray-600"
                      style={{ left: `${36 / 50 * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Recommended: ≤ 36%
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className={`text-xs font-medium mb-2 ${results.affordabilityStatus === 'excellent' ? 'text-green-700' : 
                    results.affordabilityStatus === 'good' ? 'text-sky-700' :
                    results.affordabilityStatus === 'fair' ? 'text-yellow-700' : 'text-red-700'}`}>
                    {results.affordabilityStatus === 'excellent' && 'Excellent Affordability'}
                    {results.affordabilityStatus === 'good' && 'Good Affordability'}
                    {results.affordabilityStatus === 'fair' && 'Fair Affordability'}
                    {results.affordabilityStatus === 'poor' && 'Poor Affordability'}
                  </div>
                  <div className="text-xs text-gray-600">
                    Your debt-to-income ratio falls within conservative lending guidelines. You should have comfortable monthly payments with room for unexpected expenses.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Payment Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Payment Breakdown</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Principal & Interest</div>
              <div className="text-lg font-semibold text-sky-600">
                {formatCurrency(results.principalAndInterest, incomeExpenses.currency)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Property Tax</div>
              <div className="text-lg font-semibold text-purple-600">
                {formatCurrency((results.loanAmount + results.downPayment) * loanParameters.propertyTaxRate / 100 / 12, incomeExpenses.currency)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Insurance</div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(loanParameters.homeInsurance / 12, incomeExpenses.currency)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">HOA Fees</div>
              <div className="text-lg font-semibold text-orange-600">
                {formatCurrency(loanParameters.hoaFees, incomeExpenses.currency)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">PMI</div>
              <div className="text-lg font-semibold text-red-600">
                {formatCurrency(results.loanAmount * loanParameters.pmiMortgageInsurance / 100 / 12, incomeExpenses.currency)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Total Monthly Payment</div>
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(results.monthlyPayment, incomeExpenses.currency)}
              </div>
            </div>
          </div>
        </div>

        {/* Home Price Range Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Home Price Range Comparison</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homePriceScenarios.map((scenario) => (
              <div key={scenario.type} className={`p-4 rounded-lg ${getScenarioColor(scenario.type)}`}>
                <div className="text-center mb-3">
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {scenario.type} ({scenario.percentage}%)
                  </h4>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(scenario.homePrice, incomeExpenses.currency)}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-medium">{formatCurrency(scenario.monthlyPayment, incomeExpenses.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment:</span>
                    <span className="font-medium">{formatCurrency(scenario.downPayment, incomeExpenses.currency )}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount:</span>
                    <span className="font-medium">{formatCurrency(scenario.loanAmount, incomeExpenses.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">DTI Ratio:</span>
                    <span className="font-medium">{formatPercentage(scenario.dtiRatio)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3>Understanding Home Mortgage Affordability</h3>
    <p>Buying a home is a big step. Clear numbers and simple rules help you understand what you can handle. When you know how lenders judge your money, you gain confidence. This guide explains the key ideas and shows how affordability is calculated.</p>

    <h3>The 28/36 Rule</h3>

    <p>Most lenders follow the 28/36 rule. It sets limits on how much of your income can go toward housing and debt.</p>

    <ul className="mb-4">
      <li> <strong>Housing limit</strong> &mdash; Your monthly housing cost should stay under 28 percent of your gross income. This cost includes the loan payment, property tax, insurance, and any mortgage insurance.</li>
      <li> <strong>Debt limit</strong> &mdash; Your total debt should stay under 36 percent of your gross income. Total debt includes your housing cost plus items like car payments, credit cards, and student loans.</li>
    </ul>

    <p>These limits help protect you from stress. They keep your budget steady even when life changes.</p>

    <h3>The Role of the Down Payment</h3>
    <p>Your down payment shapes your loan size and your monthly payments. A 20 percent down payment removes PMI. Many people still buy homes with 3 to 5 percent down. Smaller down payments raise the total cost because PMI adds to your monthly bill.</p>

    <p>Think about more than the interest rate. Look at the full picture. Include PMI, taxes, insurance, and HOA fees. A home with a lower price but higher fees can cost more each month than a home with a higher price and fewer extras.</p>

    <h3>Why an Emergency Fund Matters</h3>
    <p>Homes need care. Systems break. Roofs leak. Water heaters fail. You need money ready for the sudden problems that come with home ownership. An emergency fund with 3 to 6 months of expenses covers these shocks. It lets you fix issues fast. It keeps your loan payments steady. It protects you from risk in a way a low monthly payment cannot.</p>
    <p>Buyers who skip this step often feel pressure later. A strong emergency fund gives you peace and space.</p>

    <h3>The Impact of Credit Scores</h3>
    <p>Credit scores shape the interest rate a buyer receives on a home loan. Lenders review this score to judge risk. Higher scores signal steady payments and lower risk. Lower scores tell a lender that missed payments or high balances are more common. This score affects the cost of the loan from the first day. A strong score keeps the monthly payment lower, which helps long term budgets.</p>

    <h3>What is a good credit score?</h3>
    <p>Most lenders see a score above 740 as strong. Borrowers in this range usually get the lowest rates. A score between 670 and 739 is average. Rates in this range stay competitive, though the cost tends to rise. A score from 580 to 669 is poor. Buyers in this group pay more for the same loan. The difference can reach hundreds of dollars each month. That extra cost changes the total loan amount a buyer can afford.</p>

    <h3>How to Build a Better Score</h3>
    <p>This relationship connects price, risk, and access. A better score gives the buyer more power in the loan process. It raises the loan limit because lower rates create space in the monthly budget. A poor score does the opposite. It shrinks the budget and narrows the options. Buyers who want stronger offers can improve a score by lowering balances and paying on time. These steps build a path to cheaper loans and a more stable home purchase.</p>

    <h3>How Affordability Is Calculated</h3>
    <p>Affordability begins with your income. Lenders check your <Link href="/tools/finance-and-money/salary-calculator">gross monthly income</Link>, your <Link href="/tools/finance-and-money/debt-to-income-calculator">current debts</Link>, and your planned housing costs.</p>

    <p>Start with the 28 percent limit. Multiply your income by 0.28. That number shows the highest housing cost that fits the rule. Then check the 36 percent limit. Multiply your income by 0.36 and subtract your other debts. This gives your true ceiling.</p>

    <p>Your loan officer then runs the numbers. They use the interest rate, loan term, and down payment to find the loan amount that fits your limits. They add taxes and insurance to find the final payment. The loan amount plus your down payment gives you the home price you can afford.</p>

    <p>Below is the formula we use to calculate maximum mortgage amount:</p>
    
    <div className="my-6 p-4 bg-gray-200 rounded-lg text-center">
      <div className="flex justify-center mb-2">
        <div className="mt-4 mr-1">
          <span>L = M ·</span>
        </div>
        <div>
          <div className="text-lg font-mono">
            <span className="inline-block border-b border-black px-2">{"(1 + r)^n - 1"}</span>
          </div>
          <div className="text-lg font-mono mt-1">
            <span>{"r(1 + r)^n"}</span>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-600 mt-3">
        <strong>L</strong> = Loan Amount<br />
        <strong>M</strong> = Monthly Payment<br />
        <strong>r</strong> = Monthly Interest Rate<br />
        <strong>n</strong> = Number of Payments
      </div>
    </div>

    <h3>Bringing It All Together</h3>

    <p>A home that fits your life has three traits. The payment sits under the 28 percent limit. Your full debt stays under the 36 percent limit. You still hold an emergency fund after closing. When these pieces line up, you gain strength and stability. Home ownership feels better when the home fits your money. These rules help you find that fit.</p>
  </div>
);