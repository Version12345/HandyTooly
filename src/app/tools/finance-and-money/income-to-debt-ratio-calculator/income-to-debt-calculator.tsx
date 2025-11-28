'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import FinancialDisclaimer from '@/components/disclaimers/financialDisclaimer';
import CurrencySelector from '@/components/currencySelector';
import { ToolNameLists } from '@/constants/tools';
import { formatCurrency, getCurrencySymbol } from '@/utils/currencyHelpers';

type riskLevel = 'low' | 'moderate' | 'high';
type Status = 'good' | 'challenging' | 'difficult' | 'limited';

interface DebtItem {
  id: string;
  name: string;
  monthlyPayment: number;
}

interface IncomeData {
  primaryIncome: number;
  additionalIncome: number;
}

interface DebtData {
  mortgage: number;
  carLoan: number;
  creditCards: number;
  studentLoans: number;
  personalLoans: number;
  otherDebts: number;
  customDebts: DebtItem[];
}

interface DTIResult {
  ratio: number;
  monthlyIncome: number;
  monthlyDebtPayments: number;
  availableForOtherExpenses: number;
  riskLevel: riskLevel;
  riskColor: string;
  lendingGuidelines: {
    conventional: { limit: number; status: Status };
    fha: { limit: number; status: Status };
    auto: { limit: number; status: Status };
  };
  qualificationOutlook: Status;
}

export function IncomeToDebtCalculator() {
  const [currency, setCurrency] = useState<string>('USD');
  const [income, setIncome] = useState<IncomeData>({
    primaryIncome: 0,
    additionalIncome: 0,
  });
  const [debts, setDebts] = useState<DebtData>({
    mortgage: 0,
    carLoan: 0,
    creditCards: 0,
    studentLoans: 0,
    personalLoans: 0,
    otherDebts: 0,
    customDebts: [],
  });
  const [result, setResult] = useState<DTIResult | null>(null);

  // Add custom debt
  const addCustomDebt = useCallback(() => {
    const newDebt: DebtItem = {
      id: Date.now().toString(),
      name: 'Custom Debt',
      monthlyPayment: 0,
    };
    setDebts(prev => ({
      ...prev,
      customDebts: [...prev.customDebts, newDebt],
    }));
  }, []);

  // Remove custom debt
  const removeCustomDebt = useCallback((id: string) => {
    setDebts(prev => ({
      ...prev,
      customDebts: prev.customDebts.filter(debt => debt.id !== id),
    }));
  }, []);

  // Update custom debt
  const updateCustomDebt = useCallback((id: string, field: 'name' | 'monthlyPayment', value: string | number) => {
    setDebts(prev => ({
      ...prev,
      customDebts: prev.customDebts.map(debt =>
        debt.id === id ? { ...debt, [field]: value } : debt
      ),
    }));
  }, []);

  // Calculate ITD Ratio
  const calculateDTI = useCallback((incomeData: IncomeData, debtData: DebtData): DTIResult => {
    const monthlyIncome = incomeData.primaryIncome + incomeData.additionalIncome;
    const monthlyDebtPayments = 
      debtData.mortgage +
      debtData.carLoan +
      debtData.creditCards +
      debtData.studentLoans +
      debtData.personalLoans +
      debtData.otherDebts +
      debtData.customDebts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);

    const ratio = monthlyIncome > 0 ? (monthlyDebtPayments / monthlyIncome) * 100 : 0;
    const availableForOtherExpenses = monthlyIncome - monthlyDebtPayments;

    // Determine risk level and color
    let riskLevel: riskLevel;
    let riskColor: string;
    let qualificationOutlook: Status;

    if (ratio <= 28) {
      riskLevel = 'low';
      riskColor = 'text-green-600';
      qualificationOutlook = 'good';
    } else if (ratio <= 36) {
      riskLevel = 'moderate';
      riskColor = 'text-yellow-600';
      qualificationOutlook = 'good';
    } else if (ratio <= 43) {
      riskLevel = 'moderate';
      riskColor = 'text-orange-600';
      qualificationOutlook = 'limited';
    } else {
      riskLevel = 'high';
      riskColor = 'text-red-600';
      qualificationOutlook = 'difficult';
    }

    // Lending guidelines
    const getStatus = (limit: number): Status => {
      if (ratio <= limit * 0.8) return 'good';
      if (ratio <= limit) return 'challenging';
      return 'difficult';
    };

    return {
      ratio,
      monthlyIncome,
      monthlyDebtPayments,
      availableForOtherExpenses,
      riskLevel,
      riskColor,
      lendingGuidelines: {
        conventional: { limit: 28, status: getStatus(28) },
        fha: { limit: 43, status: getStatus(43) },
        auto: { limit: 18, status: getStatus(18) },
      },
      qualificationOutlook,
    };
  }, []);

  // Recalculate when inputs change
  useEffect(() => {
    if (income.primaryIncome > 0 || income.additionalIncome > 0) {
      const newResult = calculateDTI(income, debts);
      setResult(newResult);
    } else {
      setResult(null);
    }
  }, [income, debts, calculateDTI]);

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <ToolLayout
      toolCategory={ToolNameLists.IncomeToDebtRatioCalculator}
      secondaryToolDescription='This tool helps you measure how much of your income goes toward paying debts each month. Enter your income and monthly debt payments to see your income-to-debt ratio. This simple tool shows whether your finances are balanced or stretched, helping you plan smarter for loans, mortgages, or budgeting.'
      disclaimer={<FinancialDisclaimer />}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Income Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Income</h2>
            
            <div className="space-y-4">
              <CurrencySelector
                value={currency}
                onChange={(selectedCurrency) => setCurrency(selectedCurrency)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gross Monthly Income
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={income.primaryIncome || ''}
                    onChange={(e) => setIncome(prev => ({ ...prev, primaryIncome: Number(e.target.value) || 0 }))}
                    className="w-full shadow-sm pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="5000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Income before taxes and deductions</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Income <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={income.additionalIncome || ''}
                    onChange={(e) => setIncome(prev => ({ ...prev, additionalIncome: Number(e.target.value) || 0 }))}
                    className="w-full shadow-sm pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Part-time, freelancing, investments, etc.</p>
              </div>
            </div>

            {/* Income Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Income Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Primary Income:</span>
                  <span>{formatCurrency(income.primaryIncome, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Income:</span>
                  <span>{formatCurrency(income.additionalIncome, currency)}</span>
                </div>
                <div className="flex justify-between font-medium pt-1 border-t">
                  <span>Total Monthly Income:</span>
                  <span>{formatCurrency(income.primaryIncome + income.additionalIncome, currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Debt Payments Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Debt Payments</h2>
            
            <div className="space-y-4">
              {/* Fixed Debt Categories */}
              {[
                { key: 'mortgage' as keyof DebtData, label: 'Mortgage/Rent', placeholder: '12000' },
                { key: 'carLoan' as keyof DebtData, label: 'Car Loan', placeholder: '350' },
                { key: 'creditCards' as keyof DebtData, label: 'Credit Cards', placeholder: '150' },
                { key: 'studentLoans' as keyof DebtData, label: 'Student Loans', placeholder: '300' },
                { key: 'personalLoans' as keyof DebtData, label: 'Personal Loans', placeholder: '0' },
                { key: 'otherDebts' as keyof DebtData, label: 'Other Debts', placeholder: '0' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      value={debts[key] as number || ''}
                      onChange={(e) => setDebts(prev => ({ ...prev, [key]: Number(e.target.value) || 0 }))}
                      className="w-full shadow-sm pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder={placeholder}
                    />
                  </div>
                </div>
              ))}

              {/* Custom Debts */}
              {debts.customDebts.map((debt) => (
                <div key={debt.id} className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Custom Debt
                    </label>
                    <button
                      onClick={() => removeCustomDebt(debt.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(e) => updateCustomDebt(debt.id, 'name', e.target.value)}
                    className="w-full shadow-sm mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Debt Name"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      value={debt.monthlyPayment || ''}
                      onChange={(e) => updateCustomDebt(debt.id, 'monthlyPayment', Number(e.target.value) || 0)}
                      className="w-full shadow-sm pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="2"
                    />
                  </div>
                </div>
              ))}

              {/* Add Custom Debt Button */}
              <button
                onClick={addCustomDebt}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + Add Custom Debt
              </button>
            </div>

            {/* Debt Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Debt Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Monthly Debt:</span>
                  <span className="text-red-600 font-medium">
                    {formatCurrency(
                      debts.mortgage + debts.carLoan + debts.creditCards + 
                      debts.studentLoans + debts.personalLoans + debts.otherDebts +
                      debts.customDebts.reduce((sum, debt) => sum + debt.monthlyPayment, 0)
                    , currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Debts:</span>
                  <span>
                    {[debts.mortgage, debts.carLoan, debts.creditCards, debts.studentLoans, debts.personalLoans, debts.otherDebts]
                      .filter(debt => debt > 0).length + debts.customDebts.filter(debt => debt.monthlyPayment > 0).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DTI Analysis Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis</h2>
            
            {result ? (
              <div className="space-y-6">
                {/* ITD Ratio Display */}
                <div className="text-center">
                  <div className={`text-4xl font-bold ${result.riskColor} mb-2`}>
                    {result.ratio.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Your Income-to-Debt Ratio</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    result.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                    result.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.riskLevel === 'low' ? 'Low ITD Ratio' :
                     result.riskLevel === 'moderate' ? 'Moderate ITD Ratio' :
                     'High ITD Ratio'}
                  </div>
                  {result.riskLevel === 'high' && (
                    <p className="text-sm text-red-600 mt-2">
                      High ITD may significantly limit borrowing options. Focus on debt reduction and income growth.
                    </p>
                  )}
                </div>

                {/* Breakdown */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly Income:</span>
                      <span>{formatCurrency(result.monthlyIncome, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Debt Payments:</span>
                      <span>{formatCurrency(result.monthlyDebtPayments, currency)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Available for Other Expenses:</span>
                      <span className="font-medium">{formatCurrency(result.availableForOtherExpenses, currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Lending Guidelines */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Lending Guidelines</h4>
                  <div className="space-y-2 text-sm">
                    {[
                      { type: 'Conventional Mortgage', limit: '≤ 28% (front-end)', status: result.lendingGuidelines.conventional.status },
                      { type: 'Total ITD (back-end)', limit: '≤ 43%', status: result.lendingGuidelines.fha.status },
                      { type: 'FHA Loans', limit: '≤ 31%/43%', status: result.lendingGuidelines.fha.status },
                      { type: 'Auto Loans', limit: '≤ 10-18%', status: result.lendingGuidelines.auto.status },
                    ].map((guideline, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{guideline.type}:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-700">{guideline.limit}</span>
                          <span className={`w-2 h-2 rounded-full ${
                            guideline.status === 'good' ? 'bg-green-500' :
                            guideline.status === 'challenging' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Loan Qualification Outlook */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Loan Qualification Outlook</h4>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2 ${
                      result.qualificationOutlook === 'good' ? 'text-green-700' :
                      result.qualificationOutlook === 'limited' ? 'text-yellow-700' : 'text-red-700'
                    }`}>
                      <span className={`w-3 h-3 rounded-full ${
                        result.qualificationOutlook === 'good' ? 'bg-green-500' :
                        result.qualificationOutlook === 'limited' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                      <span className="text-sm font-medium">
                        {result.qualificationOutlook === 'good' ? 'Mortgage: Good options' :
                         result.qualificationOutlook === 'limited' ? 'Auto Loans: Limited options' :
                         'Personal Loans: Difficult'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Enter your income and debt information to see your income-to-debt analysis</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h3>Understanding Income and Debt</h3>
          <p>Your income is the total money you earn from work, investments, or other sources each month. Debt includes all the money you owe, such as loans, credit cards, or mortgages. The key to healthy finances is keeping your debt smaller than your income. Lenders often use your income-to-debt ratio to see if you can handle more credit. A lower ratio means better financial balance and less stress.</p>

          <h3>Why the Income-to-Debt Ratio Matters</h3>
          <p>A good income-to-debt ratio is usually under 36 percent. This means no more than one-third of your income goes to debt. If the number is higher, it can be harder to save or qualify for loans. Checking your ratio often helps you spot problems early. The goal is to keep payments manageable and avoid living paycheck to paycheck.</p>

          <h3>Tips for Managing Debt</h3>
          <p>Start by listing all your debts and their interest rates. Pay off the most expensive ones first to save money over time. Avoid adding new debt unless it is for something essential. Use cash or debit cards for everyday spending to stay within your limits. Create a simple budget that tracks income, bills, and goals. Review it once a month to stay on track.</p>

          <h3>Steps Toward a Debt-Free Life</h3>
          <p>Pay more than the minimum on each balance when possible. Set small milestones to stay motivated. Try a side income or sell unused items to pay faster. Build an emergency fund equal to three months of expenses to avoid new debt. Celebrate progress as you go. Debt-free living brings freedom, lower stress, and more room for saving and investing.</p>
        </div>
      </div>
    </ToolLayout>
  );
}