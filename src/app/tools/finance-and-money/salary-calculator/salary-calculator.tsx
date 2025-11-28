'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import FinancialDisclaimer from '@/components/disclaimers/financialDisclaimer';
import { ToolNameLists } from '@/constants/tools';
import { formatCurrency } from '@/utils/currencyHelpers';

type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY';

interface SalaryData {
  inputMethod: 'annual' | 'monthly' | 'weekly' | 'daily' | 'hourly';
  inputValue: number; // The value entered in the current input method
  annualSalary: number; // Calculated annual salary
  hoursPerWeek: number;
  weeksPerYear: number;
  currency: Currency;
  country: string;
}

interface TaxRates {
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  otherDeductions: number;
}

interface CalculationResult {
  annualGross: number;
  monthlyGross: number;
  weeklyGross: number;
  dailyGross: number;
  hourlyWage: number;
  
  annualNet: number;
  monthlyNet: number;
  weeklyNet: number;
  dailyNet: number;
  
  totalTaxBurden: number;
  effectiveTaxRate: number;
  takeHomeRate: number;
  
  federalTaxes: number;
  stateTaxes: number;
  socialSecurityTaxes: number;
  medicareTaxes: number;
  otherDeductions: number;
  
  totalHours: number;
  workingDaysPerYear: number;
  
  // Quarterly comparison
  quarterlyGross: number;
  quarterlyNet: number;
  
  // Bi-weekly comparison
  biWeeklyGross: number;
  biWeeklyNet: number;
}



const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
};

const COUNTRIES = [
  'Canada', 'United States', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan'
];

// Default tax rates by country (approximate values for demonstration)
const COUNTRY_TAX_RATES: Record<string, TaxRates> = {
  'Canada': {
    federalTax: 20.5,
    stateTax: 10.0,
    socialSecurity: 5.95, // CPP
    medicare: 1.25, // EI
    otherDeductions: 0,
  },
  'United States': {
    federalTax: 22.0,
    stateTax: 7.0,
    socialSecurity: 6.2, // Social Security
    medicare: 1.45, // Medicare
    otherDeductions: 0,
  },
  'United Kingdom': {
    federalTax: 20.0,
    stateTax: 0.0, // No separate state tax
    socialSecurity: 12.0, // National Insurance
    medicare: 0.0, // NHS covered by NI
    otherDeductions: 0,
  },
  'Australia': {
    federalTax: 25.0,
    stateTax: 0.0, // No separate state income tax
    socialSecurity: 9.5, // Superannuation
    medicare: 2.0, // Medicare Levy
    otherDeductions: 0,
  },
  'Germany': {
    federalTax: 25.0,
    stateTax: 5.5, // Solidarity surcharge
    socialSecurity: 18.6, // Pension + Unemployment
    medicare: 14.6, // Health insurance
    otherDeductions: 0,
  },
  'France': {
    federalTax: 20.0,
    stateTax: 0.0,
    socialSecurity: 15.5, // Social contributions
    medicare: 8.0, // Health contributions
    otherDeductions: 0,
  },
  'Japan': {
    federalTax: 20.0,
    stateTax: 10.0, // Local tax
    socialSecurity: 15.0, // Pension + Employment insurance
    medicare: 5.0, // Health insurance
    otherDeductions: 0,
  },
};

export function SalaryCalculator() {
  const [salaryData, setSalaryData] = useState<SalaryData>({
    inputMethod: 'annual',
    inputValue: 75000,
    annualSalary: 75000,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    currency: 'USD',
    country: 'Canada',
  });

  const [taxRates, setTaxRates] = useState<TaxRates>(COUNTRY_TAX_RATES['Canada']);

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showCountryUpdateNotification, setShowCountryUpdateNotification] = useState(false);

  const calculateAnnualSalary = useCallback((inputValue: number, inputMethod: SalaryData['inputMethod'], hoursPerWeek: number, weeksPerYear: number): number => {
    switch (inputMethod) {
      case 'annual':
        return inputValue;
      case 'monthly':
        return inputValue * 12;
      case 'weekly':
        return inputValue * weeksPerYear;
      case 'daily':
        const workingDaysPerWeek = 5; // Assuming 5-day work week
        return inputValue * workingDaysPerWeek * weeksPerYear;
      case 'hourly':
        return inputValue * hoursPerWeek * weeksPerYear;
      default:
        return inputValue;
    }
  }, []);

  const calculateSalary = useCallback((data: SalaryData, taxes: TaxRates): CalculationResult => {
    const { annualSalary, hoursPerWeek, weeksPerYear } = data;
    
    // Gross calculations
    const annualGross = annualSalary;
    const monthlyGross = annualGross / 12;
    const weeklyGross = annualGross / weeksPerYear;
    const dailyGross = weeklyGross / (hoursPerWeek / (hoursPerWeek / 5)); // Assuming 5 day work week
    const hourlyWage = annualGross / (hoursPerWeek * weeksPerYear);
    
    // Tax calculations
    const federalTaxes = (annualGross * taxes.federalTax) / 100;
    const stateTaxes = (annualGross * taxes.stateTax) / 100;
    const socialSecurityTaxes = (annualGross * taxes.socialSecurity) / 100;
    const medicareTaxes = (annualGross * taxes.medicare) / 100;
    const otherDeductions = (annualGross * taxes.otherDeductions) / 100;
    
    const totalTaxBurden = federalTaxes + stateTaxes + socialSecurityTaxes + medicareTaxes + otherDeductions;
    const effectiveTaxRate = (totalTaxBurden / annualGross) * 100;
    const takeHomeRate = 100 - effectiveTaxRate;
    
    // Net calculations
    const annualNet = annualGross - totalTaxBurden;
    const monthlyNet = annualNet / 12;
    const weeklyNet = annualNet / weeksPerYear;
    const dailyNet = weeklyNet / 5;
    
    // Additional calculations
    const totalHours = hoursPerWeek * weeksPerYear;
    const workingDaysPerYear = weeksPerYear * 5;
    
    const quarterlyGross = annualGross / 4;
    const quarterlyNet = annualNet / 4;
    
    const biWeeklyGross = annualGross / 26;
    const biWeeklyNet = annualNet / 26;

    return {
      annualGross,
      monthlyGross,
      weeklyGross,
      dailyGross,
      hourlyWage,
      
      annualNet,
      monthlyNet,
      weeklyNet,
      dailyNet,
      
      totalTaxBurden,
      effectiveTaxRate,
      takeHomeRate,
      
      federalTaxes,
      stateTaxes,
      socialSecurityTaxes,
      medicareTaxes,
      otherDeductions,
      
      totalHours,
      workingDaysPerYear,
      
      quarterlyGross,
      quarterlyNet,
      
      biWeeklyGross,
      biWeeklyNet,
    };
  }, []);

  // Update annual salary when input method or value changes
  useEffect(() => {
    const newAnnualSalary = calculateAnnualSalary(
      salaryData.inputValue,
      salaryData.inputMethod,
      salaryData.hoursPerWeek,
      salaryData.weeksPerYear
    );
    
    setSalaryData(prev => ({ ...prev, annualSalary: newAnnualSalary }));
  }, [salaryData.inputValue, salaryData.inputMethod, salaryData.hoursPerWeek, salaryData.weeksPerYear, calculateAnnualSalary]);

  // Update tax rates when country changes
  useEffect(() => {
    const countryTaxRates = COUNTRY_TAX_RATES[salaryData.country];
    if (countryTaxRates) {
      setTaxRates(countryTaxRates);
      setShowCountryUpdateNotification(true);
      
      // Hide notification after 3 seconds
      const timeout = setTimeout(() => {
        setShowCountryUpdateNotification(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [salaryData.country]);

  // Auto-calculate when data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (salaryData.annualSalary > 0) {
        const calculationResult = calculateSalary(salaryData, taxRates);
        setResult(calculationResult);
      } else {
        setResult(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [salaryData, taxRates, calculateSalary]);

  const formatPercentage = (percentage: number): string => {
    return `${percentage.toFixed(2)}%`;
  };

  const updateSalaryData = <K extends keyof SalaryData>(field: K, value: SalaryData[K]) => {
    setSalaryData(prev => ({ ...prev, [field]: value }));
  };

  const updateTaxRates = <K extends keyof TaxRates>(field: K, value: TaxRates[K]) => {
    setTaxRates(prev => ({ ...prev, [field]: value }));
  };

  const updateInputMethod = (newInputMethod: SalaryData['inputMethod']) => {
    // Convert current inputValue to the new input method
    const currentAnnualSalary = salaryData.annualSalary;
    let newInputValue = currentAnnualSalary;

    switch (newInputMethod) {
      case 'annual':
        newInputValue = currentAnnualSalary;
        break;
      case 'monthly':
        newInputValue = currentAnnualSalary / 12;
        break;
      case 'weekly':
        newInputValue = currentAnnualSalary / salaryData.weeksPerYear;
        break;
      case 'daily':
        const workingDaysPerWeek = 5;
        newInputValue = currentAnnualSalary / (workingDaysPerWeek * salaryData.weeksPerYear);
        break;
      case 'hourly':
        newInputValue = currentAnnualSalary / (salaryData.hoursPerWeek * salaryData.weeksPerYear);
        break;
    }

    setSalaryData(prev => ({
      ...prev,
      inputMethod: newInputMethod,
      inputValue: Math.round(newInputValue * 100) / 100 // Round to 2 decimal places
    }));
  };

  return (
    <ToolLayout
      toolCategory={ToolNameLists.SalaryCalculator}
      secondaryToolDescription='Get detailed insights into your gross vs net income across different time periods.'
      disclaimer={<FinancialDisclaimer />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Salary Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Salary Information</h2>
            
            <div className="space-y-4">
              {/* Currency & Country */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={salaryData.currency}
                    onChange={(e) => updateSalaryData('currency', e.target.value as Currency)}
                    className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.keys(CURRENCY_SYMBOLS).map((curr) => (
                      <option key={curr} value={curr}>
                        {curr} ({CURRENCY_SYMBOLS[curr as Currency]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    value={salaryData.country}
                    onChange={(e) => updateSalaryData('country', e.target.value)}
                    className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Salary Input Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Input Method
                </label>
                <select
                  value={salaryData.inputMethod}
                  onChange={(e) => updateInputMethod(e.target.value as SalaryData['inputMethod'])}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="annual">Annual Salary</option>
                  <option value="monthly">Monthly Salary</option>
                  <option value="weekly">Weekly Salary</option>
                  <option value="daily">Daily Wage</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>

              {/* Salary Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {salaryData.inputMethod === 'annual' && 'Annual Salary'}
                  {salaryData.inputMethod === 'monthly' && 'Monthly Salary'}
                  {salaryData.inputMethod === 'weekly' && 'Weekly Salary'}
                  {salaryData.inputMethod === 'daily' && 'Daily Wage'}
                  {salaryData.inputMethod === 'hourly' && 'Hourly Rate'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {CURRENCY_SYMBOLS[salaryData.currency]}
                  </span>
                  <input
                    type="number"
                    value={salaryData.inputValue || ''}
                    onChange={(e) => updateSalaryData('inputValue', Number(e.target.value) || 0)}
                    className="w-full shadow-sm pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={
                      salaryData.inputMethod === 'annual' ? '75000' :
                      salaryData.inputMethod === 'monthly' ? '6250' :
                      salaryData.inputMethod === 'weekly' ? '1442' :
                      salaryData.inputMethod === 'daily' ? '288' :
                      '36'
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {salaryData.inputMethod === 'annual' && 'Gross annual salary before taxes'}
                  {salaryData.inputMethod === 'monthly' && 'Gross monthly salary before taxes'}
                  {salaryData.inputMethod === 'weekly' && 'Gross weekly salary before taxes'}
                  {salaryData.inputMethod === 'daily' && 'Gross daily wage before taxes'}
                  {salaryData.inputMethod === 'hourly' && 'Gross hourly rate before taxes'}
                </p>
                
                {/* Show calculated conversions */}
                {salaryData.inputMethod !== 'annual' && salaryData.annualSalary > 0 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <span className="text-xs text-gray-500 font-medium">Equivalent annual salary:</span><br/>
                    <span className="text-sm text-gray-700 font-semibold">{formatCurrency(salaryData.annualSalary, salaryData.currency)}</span>
                  </div>
                )}
              </div>

              {/* Hours Per Week */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Per Week
                </label>
                <input
                  type="number"
                  value={salaryData.hoursPerWeek || ''}
                  onChange={(e) => updateSalaryData('hoursPerWeek', Number(e.target.value) || 0)}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="40"
                />
                <p className="text-xs text-gray-500 mt-1">Standard working hours per week</p>
              </div>

              {/* Weeks Per Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weeks Per Year
                </label>
                <input
                  type="number"
                  value={salaryData.weeksPerYear || ''}
                  onChange={(e) => updateSalaryData('weeksPerYear', Number(e.target.value) || 0)}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="52"
                />
                <p className="text-xs text-gray-500 mt-1">Include vacation time (typically 50-52)</p>
              </div>
            </div>

            {/* Tax & Deductions */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tax & Deductions</h2>
            
            {/* Country Update Notification */}
            {showCountryUpdateNotification && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-blue-700">
                    Tax rates updated for {salaryData.country}. You can adjust them manually if needed.
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Federal Tax Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Federal Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taxRates.federalTax || ''}
                  onChange={(e) => updateTaxRates('federalTax', Number(e.target.value) || 0)}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="20.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {salaryData.country === 'Canada' && 'Federal income tax'}
                  {salaryData.country === 'United States' && 'Federal income tax'}
                  {salaryData.country === 'United Kingdom' && 'Income tax'}
                  {salaryData.country === 'Australia' && 'Income tax'}
                  {salaryData.country === 'Germany' && 'Income tax (Einkommensteuer)'}
                  {salaryData.country === 'France' && 'Income tax (Impôt sur le revenu)'}
                  {salaryData.country === 'Japan' && 'National income tax'}
                </p>
              </div>

              {/* State/Provincial Tax Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {salaryData.country === 'Canada' && 'Provincial Tax (%)'}
                  {salaryData.country === 'United States' && 'State Tax (%)'}
                  {salaryData.country === 'United Kingdom' && 'Additional Tax (%)'}
                  {salaryData.country === 'Australia' && 'Additional Tax (%)'}
                  {salaryData.country === 'Germany' && 'Solidarity Surcharge (%)'}
                  {salaryData.country === 'France' && 'Additional Tax (%)'}
                  {salaryData.country === 'Japan' && 'Local Tax (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taxRates.stateTax || ''}
                  onChange={(e) => updateTaxRates('stateTax', Number(e.target.value) || 0)}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {salaryData.country === 'Canada' && 'Provincial income tax varies by province'}
                  {salaryData.country === 'United States' && 'State income tax (varies by state)'}
                  {salaryData.country === 'Germany' && 'Solidarity surcharge (Solidaritätszuschlag)'}
                  {salaryData.country === 'Japan' && 'Prefectural and municipal taxes'}
                  {(salaryData.country === 'United Kingdom' || salaryData.country === 'Australia' || salaryData.country === 'France') && 'Additional local taxes if applicable'}
                </p>
              </div>

              {/* Social Security/Pension (%) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {salaryData.country === 'Canada' && 'CPP/QPP (%)'}
                  {salaryData.country === 'United States' && 'Social Security (%)'}
                  {salaryData.country === 'United Kingdom' && 'National Insurance (%)'}
                  {salaryData.country === 'Australia' && 'Superannuation (%)'}
                  {salaryData.country === 'Germany' && 'Pension & Unemployment (%)'}
                  {salaryData.country === 'France' && 'Social Contributions (%)'}
                  {salaryData.country === 'Japan' && 'Pension & Employment Insurance (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taxRates.socialSecurity || ''}
                  onChange={(e) => updateTaxRates('socialSecurity', Number(e.target.value) || 0)}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="6.95"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {salaryData.country === 'Canada' && 'Canada/Quebec Pension Plan contributions'}
                  {salaryData.country === 'United States' && 'Social Security contributions (6.2%)'}
                  {salaryData.country === 'United Kingdom' && 'National Insurance contributions'}
                  {salaryData.country === 'Australia' && 'Mandatory superannuation contributions'}
                  {salaryData.country === 'Germany' && 'Combined pension and unemployment insurance'}
                  {salaryData.country === 'France' && 'Social security contributions'}
                  {salaryData.country === 'Japan' && 'Combined pension and employment insurance'}
                </p>
              </div>

              {/* Medicare/Healthcare (%) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {salaryData.country === 'Canada' && 'EI Premium (%)'}
                  {salaryData.country === 'United States' && 'Medicare (%)'}
                  {salaryData.country === 'United Kingdom' && 'Additional Healthcare (%)'}
                  {salaryData.country === 'Australia' && 'Medicare Levy (%)'}
                  {salaryData.country === 'Germany' && 'Health Insurance (%)'}
                  {salaryData.country === 'France' && 'Health Contributions (%)'}
                  {salaryData.country === 'Japan' && 'Health Insurance (%)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taxRates.medicare || ''}
                  onChange={(e) => updateTaxRates('medicare', Number(e.target.value) || 0)}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1.25"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {salaryData.country === 'Canada' && 'Employment Insurance premium'}
                  {salaryData.country === 'United States' && 'Medicare tax (1.45%)'}
                  {salaryData.country === 'United Kingdom' && 'Healthcare covered by National Insurance'}
                  {salaryData.country === 'Australia' && 'Medicare levy (2% of taxable income)'}
                  {salaryData.country === 'Germany' && 'Statutory health insurance contributions'}
                  {salaryData.country === 'France' && 'Health and social contributions'}
                  {salaryData.country === 'Japan' && 'National health insurance contributions'}
                </p>
              </div>

              {/* Other Deductions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Deductions (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taxRates.otherDeductions || ''}
                  onChange={(e) => updateTaxRates('otherDeductions', Number(e.target.value) || 0)}
                  className="w-full shadow-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">401k, insurance, etc. monthly amount</p>
              </div>
            </div>

            {/* Tax Rate Disclaimer */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> Tax rates are estimates and may vary based on income brackets, deductions, and local regulations. 
                Please consult with a tax professional for accurate calculations specific to your situation.
              </p>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {!result && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter your salary information to see the breakdown</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Salary Breakdown */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Breakdown</h3>
                  
                  {/* Annual Gross */}
                  <div className="bg-lime-100 rounded-lg p-4 mb-3">
                    <div className="text-sm text-lime-700 mb-1">Annual Gross</div>
                    <div className="text-2xl font-bold text-lime-800">
                      {formatCurrency(result.annualGross, salaryData.currency)}
                    </div>
                  </div>

                  {/* Monthly Gross */}
                  <div className="bg-blue-100 rounded-lg p-4 mb-3">
                    <div className="text-sm text-blue-700 mb-1">Monthly Gross</div>
                    <div className="text-xl font-bold text-blue-800">
                      {formatCurrency(result.monthlyGross, salaryData.currency)}
                    </div>
                  </div>

                  {/* Hourly Wage */}
                  <div className="bg-amber-100 rounded-lg p-4">
                    <div className="text-sm text-amber-700 mb-1">Hourly Wage</div>
                    <div className="text-xl font-bold text-amber-800">
                      {formatCurrency(result.hourlyWage, salaryData.currency)}
                    </div>
                  </div>
                </div>

                {/* Take-Home Pay */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Take-Home Pay</h3>
                  
                  {/* Annual Net */}
                  <div className="bg-lime-100 rounded-lg p-4 mb-3">
                    <div className="text-sm text-lime-700 mb-1">Annual Net</div>
                    <div className="text-xl font-bold text-lime-800">
                      {formatCurrency(result.annualNet, salaryData.currency)}
                    </div>
                  </div>

                  {/* Monthly Net */}
                  <div className="bg-blue-100 rounded-lg p-4 mb-3">
                    <div className="text-sm text-blue-700 mb-1">Monthly Net</div>
                    <div className="text-xl font-bold text-blue-800">
                      {formatCurrency(result.monthlyNet, salaryData.currency)}
                    </div>
                  </div>

                  {/* Weekly Net */}
                  <div className="bg-amber-100 rounded-lg p-4 mb-3">
                    <div className="text-sm text-amber-700 mb-1">Weekly Net</div>
                    <div className="text-lg font-bold text-amber-800">
                      {formatCurrency(result.weeklyNet, salaryData.currency)}
                    </div>
                  </div>

                  {/* Daily Net */}
                  <div className="bg-orange-100 rounded-lg p-4">
                    <div className="text-sm text-orange-700 mb-1">Daily Net</div>
                    <div className="text-lg font-bold text-orange-800">
                      {formatCurrency(result.dailyNet, salaryData.currency)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {result && (
              <>
                {/* Detailed Analysis */}
                <div>
                  <h3>Detailed Analysis</h3>
                  
                  {/* Tax Breakdown */}
                  <h4>Tax Breakdown</h4>
                  <div className="mb-6 p-4 bg-gray-100 rounded-lg text-gray-900">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Federal Taxes:</span>
                        <span>{formatCurrency(result.federalTaxes, salaryData.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>State/Provincial Taxes:</span>
                        <span>{formatCurrency(result.stateTaxes, salaryData.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Social Security/Pension:</span>
                        <span>{formatCurrency(result.socialSecurityTaxes, salaryData.currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medicare/Healthcare:</span>
                        <span>{formatCurrency(result.medicareTaxes, salaryData.currency)}</span>
                      </div>
                      {result.otherDeductions > 0 && (
                        <div className="flex justify-between">
                          <span>Other Deductions:</span>
                          <span>{formatCurrency(result.otherDeductions, salaryData.currency)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total Tax Burden */}
                  <h4>Total Tax Burden</h4>
                  <div className="mb-6 p-4 bg-gray-100 rounded-lg text-gray-900 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Annual Taxes:</span>
                      <span>{formatCurrency(result.totalTaxBurden, salaryData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Effective Tax Rate:</span>
                      <span>{result.effectiveTaxRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Take-Home Rate:</span>
                      <span>{result.takeHomeRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Gross vs Net Comparison */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Gross vs Net Comparison</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1"> 
                      <div className="flex justify-between text-xs mb-1">
                        <span>Take-Home ({formatPercentage(result.takeHomeRate)})</span>
                        <span>Taxes ({formatPercentage(result.effectiveTaxRate)})</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-6 flex overflow-hidden">
                        <div 
                          className="bg-lime-500 h-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${result.takeHomeRate}%` }}
                        >
                          {formatPercentage(result.takeHomeRate)}
                        </div>
                        <div 
                          className="bg-red-500 h-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${result.effectiveTaxRate}%` }}
                        >
                          {formatPercentage(result.effectiveTaxRate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Working Time Analysis */}
                <div className="py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Time Analysis</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-amber-100 rounded-lg p-4">
                      <div className="text-sm text-amber-700 mb-1">Hours per Year</div>
                      <div className="text-xl font-bold text-amber-800">
                        {result.totalHours.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="text-sm text-indigo-700 mb-1">Working Days/Year</div>
                      <div className="text-xl font-bold text-indigo-800">
                        {result.workingDaysPerYear}
                      </div>
                    </div>

                    <div className="bg-lime-100 rounded-lg p-4">
                      <div className="text-sm text-lime-700 mb-1">Hourly Rate after Taxes</div>
                      <div className="text-xl font-bold text-lime-800">
                        {formatCurrency(result.annualNet / result.totalHours, salaryData.currency)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Salary Comparisons */}
                <div className="py-4">
                  <h3 className="text-lg">Quick Salary Comparisons</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Bi-weekly Gross:</span>
                      <span className="font-medium">{formatCurrency(result.biWeeklyGross, salaryData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Bi-weekly Net:</span>
                      <span className="font-medium">{formatCurrency(result.biWeeklyNet, salaryData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Quarterly Gross:</span>
                      <span className="font-medium">{formatCurrency(result.quarterlyGross, salaryData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Quarterly Net:</span>
                      <span className="font-medium">{formatCurrency(result.quarterlyNet, salaryData.currency)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}