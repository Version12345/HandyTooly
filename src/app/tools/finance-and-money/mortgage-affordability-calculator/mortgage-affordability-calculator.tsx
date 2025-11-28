'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import FinancialDisclaimer from '@/components/disclaimers/financialDisclaimer';

interface IncomeExpenses {
  grossAnnualIncome: number;
  monthlyDebtPayments: number;
  monthlyExpenses: number;
  availableDownPayment: number;
  creditScore: string;
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

const CREDIT_SCORE_RANGES = [
  { value: '800-850', label: 'Excellent (800-850)' },
  { value: '740-799', label: 'Very Good (740-799)' },
  { value: '670-739', label: 'Good (670-739)' },
  { value: '580-669', label: 'Fair (580-669)' },
  { value: '300-579', label: 'Poor (300-579)' }
];

const LOAN_TERMS = [
  { value: 30, label: '30 years' },
  { value: 25, label: '25 years' },
  { value: 20, label: '20 years' },
  { value: 15, label: '15 years' },
  { value: 10, label: '10 years' }
];

export default function HomeAffordabilityCalculator() {
  const [incomeExpenses, setIncomeExpenses] = useState<IncomeExpenses>({
    grossAnnualIncome: 75000,
    monthlyDebtPayments: 500,
    monthlyExpenses: 2000,
    availableDownPayment: 50000,
    creditScore: '740-799'
  });

  const [loanParameters, setLoanParameters] = useState<LoanParameters>({
    loanTerm: 30,
    interestRate: 6.5,
    propertyTaxRate: 1.2,
    homeInsurance: 1200,
    pmiMortgageInsurance: 0.5,
    hoaFees: 150
  });

  const calculateAffordability = useCallback((): AffordabilityResults => {
    const monthlyGrossIncome = incomeExpenses.grossAnnualIncome / 12;
    const monthlyInterestRate = loanParameters.interestRate / 100 / 12;
    const numberOfPayments = loanParameters.loanTerm * 12;

    // Calculate maximum housing payment (28% rule)
    const maxHousingPayment = monthlyGrossIncome * 0.28;
    
    // Calculate maximum total debt payment (36% rule)
    const maxTotalDebtPayment = monthlyGrossIncome * 0.36;
    const maxHousingAfterDebt = maxTotalDebtPayment - incomeExpenses.monthlyDebtPayments;
    
    // Use the lower of the two
    const availableForHousing = Math.min(maxHousingPayment, maxHousingAfterDebt);
    
    // Subtract fixed monthly costs
    const monthlyInsurance = loanParameters.homeInsurance / 12;
    const availableForPI = availableForHousing - monthlyInsurance - loanParameters.hoaFees;
    
    // Calculate maximum loan amount
    const loanAmount = availableForPI * (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments)) / monthlyInterestRate;
    
    // Calculate maximum home price
    const maxHomePrice = loanAmount + incomeExpenses.availableDownPayment;
    
    // Calculate monthly property tax and PMI
    const monthlyPropertyTax = (maxHomePrice * loanParameters.propertyTaxRate / 100) / 12;
    const monthlyPMI = loanAmount * (loanParameters.pmiMortgageInsurance / 100) / 12;
    
    // Calculate actual monthly payment
    const principalAndInterest = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    const totalMonthlyPayment = principalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyPMI + loanParameters.hoaFees;
    
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getAffordabilityColor = (status: AffordabilityResults['affordabilityStatus']) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-amber-100 text-amber-800';
      case 'poor': return 'bg-red-100 text-red-800';
    }
  };

  const getScenarioColor = (type: HomePriceScenario['type']) => {
    switch (type) {
      case 'conservative': return 'bg-green-50';
      case 'recommended': return 'bg-blue-50';
      case 'maximum': return 'bg-orange-50';
    }
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.MortgageAffordabilityCalculator}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gross Annual Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={incomeExpenses.grossAnnualIncome}
                    onChange={(e) => updateIncomeExpenses('grossAnnualIncome', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Before taxes and deductions</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Debt Payments
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={incomeExpenses.monthlyDebtPayments}
                    onChange={(e) => updateIncomeExpenses('monthlyDebtPayments', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Auto loans, credit cards, student loans</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Expenses
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={incomeExpenses.monthlyExpenses}
                    onChange={(e) => updateIncomeExpenses('monthlyExpenses', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Living expenses, insurance, food, utilities</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Down Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={incomeExpenses.availableDownPayment}
                    onChange={(e) => updateIncomeExpenses('availableDownPayment', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cash available for down payment</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Score Range
                </label>
                <select
                  value={incomeExpenses.creditScore}
                  onChange={(e) => updateIncomeExpenses('creditScore', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {CREDIT_SCORE_RANGES.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Affects interest rate and loan terms</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {LOAN_TERMS.map(term => (
                    <option key={term.value} value={term.value}>
                      {term.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Longer terms = lower monthly payment</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="0.1"
                    value={loanParameters.interestRate}
                    onChange={(e) => updateLoanParameters('interestRate', parseFloat(e.target.value) || 0)}
                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Annual interest rate (APR) - based on credit score</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Tax Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={loanParameters.propertyTaxRate}
                    onChange={(e) => updateLoanParameters('propertyTaxRate', parseFloat(e.target.value) || 0)}
                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Annual property tax as % of home value</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Insurance (Annual)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={loanParameters.homeInsurance}
                    onChange={(e) => updateLoanParameters('homeInsurance', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Annual homeowner's insurance premium</p>
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
                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="25"
                    value={loanParameters.hoaFees}
                    onChange={(e) => updateLoanParameters('hoaFees', parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Homeowners association fees</p>
              </div>
            </div>
          </div>

          {/* Affordability Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Affordability Analysis
            </h2>
            
            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${getAffordabilityColor(results.affordabilityStatus)}`}>
                <div className="text-sm font-medium mb-1">Monthly Payment</div>
                <div className="text-xl font-bold">
                  {formatCurrency(results.monthlyPayment)}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">Principal & Interest</div>
                <div className="text-lg font-semibold text-blue-900">
                  {formatCurrency(results.principalAndInterest)}
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-purple-800 mb-1">Loan Amount</div>
                <div className="text-lg font-semibold text-purple-900">
                  {formatCurrency(results.loanAmount)}
                </div>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-orange-800 mb-1">Down Payment</div>
                <div className="text-lg font-semibold text-orange-900">
                  {formatCurrency(results.downPayment)}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-900">Debt-to-Income Ratios</h3>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Housing Ratio (Front-end):</span>
                  <span className="font-semibold text-gray-900">{formatPercentage(results.housingRatio)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Debt Ratio (Back-end):</span>
                  <span className="font-semibold text-gray-900">{formatPercentage(results.debtToIncomeRatio)}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className={`text-xs font-medium mb-2 ${results.affordabilityStatus === 'excellent' ? 'text-green-700' : 
                    results.affordabilityStatus === 'good' ? 'text-blue-700' :
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

              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-900">Key Financial Metrics</h3>
                
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Gross Income:</span>
                    <span className="font-medium">{formatCurrency(results.monthlyGrossIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available for Housing:</span>
                    <span className="font-medium">{formatCurrency(results.availableForHousing)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment Percentage:</span>
                    <span className="font-medium">{formatPercentage(results.downPaymentPercentage)}</span>
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
              <div className="text-lg font-semibold text-blue-600">
                {formatCurrency(results.principalAndInterest)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Property Tax</div>
              <div className="text-lg font-semibold text-purple-600">
                {formatCurrency((results.loanAmount + results.downPayment) * loanParameters.propertyTaxRate / 100 / 12)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Insurance</div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(loanParameters.homeInsurance / 12)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">HOA Fees</div>
              <div className="text-lg font-semibold text-orange-600">
                {formatCurrency(loanParameters.hoaFees)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">PMI</div>
              <div className="text-lg font-semibold text-red-600">
                {formatCurrency(results.loanAmount * loanParameters.pmiMortgageInsurance / 100 / 12)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Total Monthly Payment</div>
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(results.monthlyPayment)}
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
                    {formatCurrency(scenario.homePrice)}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-medium">{formatCurrency(scenario.monthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment:</span>
                    <span className="font-medium">{formatCurrency(scenario.downPayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount:</span>
                    <span className="font-medium">{formatCurrency(scenario.loanAmount)}</span>
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

        {/* Educational Content */}
        <div className="bg-indigo-50 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-xl">💡</div>
            <div>
              <h3 className="font-semibold text-indigo-900 mb-2">Understanding Home Affordability</h3>
              <div className="text-sm text-indigo-800 space-y-2">
                <p>
                  <strong>28/36 Rule:</strong> Your housing costs should not exceed 28% of gross monthly income, 
                  and total debt should not exceed 36% of gross monthly income.
                </p>
                <p>
                  <strong>Down Payment:</strong> While 20% down avoids PMI, many loan programs allow 3-5% down. 
                  Consider the total cost including PMI when deciding.
                </p>
                <p>
                  <strong>Emergency Fund:</strong> Maintain 3-6 months of expenses in savings after home purchase 
                  for unexpected repairs and maintenance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}