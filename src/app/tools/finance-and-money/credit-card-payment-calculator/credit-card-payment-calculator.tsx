'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';
import FinancialDisclaimer from '@/components/disclaimers/financialDisclaimer';
import CurrencySelector from '@/components/currencySelector';
import { formatCurrency, getCurrencySymbol } from '@/utils/currencyHelpers';

enum CALCULATION_MODE {
    PAYOFF_TIME = 'Pay Off Calculator',
    MONTHLY_PAYMENT = 'Monthly Repayments'
}

interface PayoffResults {
    monthsToPayoff: number;
    totalInterestPaid: number;
    totalAmountPaid: number;
    monthlyBreakdown: MonthlyPayment[];
}

interface MonthlyPayment {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
}

interface PayoffStrategy {
    name: string;
    description: string;
    monthsToPayoff: number;
    totalInterest: number;
    monthlySavings: number;
}

const CALCULATION_MODES = [
    { value: CALCULATION_MODE.PAYOFF_TIME, label: 'Pay Off Calculator' },
    { value: CALCULATION_MODE.MONTHLY_PAYMENT, label: 'Monthly Repayments' }
];

export function CreditCardPaymentCalculator() {
    const [calculationMode, setCalculationMode] = useState<CALCULATION_MODE>(CALCULATION_MODE.PAYOFF_TIME);
    const [currency, setCurrency] = useState<string>('USD');
    const [balance, setBalance] = useState('1000');
    const [interestRate, setInterestRate] = useState('25');
    const [monthlyPayment, setMonthlyPayment] = useState('100');
    const [targetMonths, setTargetMonths] = useState('12');
    const [results, setResults] = useState<PayoffResults | null>(null);
    const [payoffStrategies, setPayoffStrategies] = useState<PayoffStrategy[]>([]);
    const [options, setOptions] = useState<Highcharts.Options>({});

    const calculatePayoffTime = useCallback((
        principal: number,
        annualRate: number,
        payment: number
    ): PayoffResults => {
        const monthlyRate = annualRate / 100 / 12;
        let currentBalance = principal;
        let totalInterest = 0;
        const monthlyBreakdown: MonthlyPayment[] = [];
        let month = 0;

        // Check if payment covers interest
        if (payment <= currentBalance * monthlyRate) {
            // Payment doesn't cover interest - debt will never be paid off
            return {
                monthsToPayoff: Infinity,
                totalInterestPaid: Infinity,
                totalAmountPaid: Infinity,
                monthlyBreakdown: []
            };
        }

        while (currentBalance > 0.01 && month < 600) { // Max 50 years
            month++;
            const interestPayment = currentBalance * monthlyRate;
            const principalPayment = Math.min(payment - interestPayment, currentBalance);
            const actualPayment = interestPayment + principalPayment;

            currentBalance -= principalPayment;
            totalInterest += interestPayment;

            monthlyBreakdown.push({
                month,
                payment: actualPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: currentBalance
            });

            if (currentBalance <= 0) break;
        }

        return {
            monthsToPayoff: month,
            totalInterestPaid: totalInterest,
            totalAmountPaid: principal + totalInterest,
            monthlyBreakdown
        };
    }, []);

    const calculateRequiredPayment = useCallback((
        principal: number,
        annualRate: number,
        months: number
    ): number => {
        const monthlyRate = annualRate / 100 / 12;
        
        if (monthlyRate === 0) {
            return principal / months;
        }

        const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                       (Math.pow(1 + monthlyRate, months) - 1);
        
        return payment;
    }, []);

    const getPayoffStrategies = useCallback((
        principal: number,
        annualRate: number,
        currentPayment: number,
        currentResults: PayoffResults
    ): PayoffStrategy[] => {
        if (!currentResults || currentResults.monthsToPayoff === Infinity) {
            return [];
        }

        const strategies: PayoffStrategy[] = [];

        // Double payment strategy
        const doublePaymentResults = calculatePayoffTime(principal, annualRate, currentPayment * 2);
        if (doublePaymentResults.monthsToPayoff !== Infinity) {
            strategies.push({
                name: 'Double Monthly Payment',
                description: 'Pay twice your current monthly amount',
                monthsToPayoff: doublePaymentResults.monthsToPayoff,
                totalInterest: doublePaymentResults.totalInterestPaid,
                monthlySavings: currentPayment
            });
        }

        // Extra $50 strategy
        const extra50Results = calculatePayoffTime(principal, annualRate, currentPayment + 50);
        if (extra50Results.monthsToPayoff !== Infinity) {
            strategies.push({
                name: 'Extra $50/Month',
                description: 'Add $50 to your monthly payment',
                monthsToPayoff: extra50Results.monthsToPayoff,
                totalInterest: extra50Results.totalInterestPaid,
                monthlySavings: 50
            });
        }

        // Minimum payment + 20% strategy
        const twentyPercentExtra = currentPayment * 0.2;
        const extraTwentyResults = calculatePayoffTime(principal, annualRate, currentPayment + twentyPercentExtra);
        if (extraTwentyResults.monthsToPayoff !== Infinity) {
            strategies.push({
                name: '20% Extra Payment',
                description: 'Add 20% more to your monthly payment',
                monthsToPayoff: extraTwentyResults.monthsToPayoff,
                totalInterest: extraTwentyResults.totalInterestPaid,
                monthlySavings: twentyPercentExtra
            });
        }

        return strategies.slice(0, 3);
    }, [calculatePayoffTime]);

    const performCalculation = useCallback(() => {
        const balanceNum = parseFloat(balance);
        const rateNum = parseFloat(interestRate);
        
        if (isNaN(balanceNum) || isNaN(rateNum) || balanceNum <= 0 || rateNum < 0) {
            setResults(null);
            setPayoffStrategies([]);
            return;
        }

        if (calculationMode === CALCULATION_MODE.PAYOFF_TIME) {
            const paymentNum = parseFloat(monthlyPayment);
            if (isNaN(paymentNum) || paymentNum <= 0) {
                setResults(null);
                setPayoffStrategies([]);
                return;
            }

            const result = calculatePayoffTime(balanceNum, rateNum, paymentNum);
            setResults(result);
            setPayoffStrategies(getPayoffStrategies(balanceNum, rateNum, paymentNum, result));
            
        } else {
            const monthsNum = parseFloat(targetMonths);
            if (isNaN(monthsNum) || monthsNum <= 0) {
                setResults(null);
                setPayoffStrategies([]);
                return;
            }

            const requiredPayment = calculateRequiredPayment(balanceNum, rateNum, monthsNum);
            const result = calculatePayoffTime(balanceNum, rateNum, requiredPayment);
            setResults(result);
            setPayoffStrategies([]);
        }
    }, [balance, interestRate, monthlyPayment, targetMonths, calculationMode, calculatePayoffTime, calculateRequiredPayment, getPayoffStrategies]);

    // Auto-calculate when inputs change
    useEffect(() => {
        const timeoutId = setTimeout(performCalculation, 300);
        return () => clearTimeout(timeoutId);
    }, [performCalculation]);

    const handleCopy = async (text: string) => {
        await copyToClipboard(text);
    };

    const formatMonths = (months: number): string => {
        if (months === Infinity) return 'Never (payment too low)';
        
        const years = Math.floor(months / 12);
        const remainingMonths = Math.round(months % 12);
        
        if (years === 0) {
            return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
        } else if (remainingMonths === 0) {
            return `${years} year${years !== 1 ? 's' : ''}`;
        } else {
            return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
        }
    };

    const getSelectedCurrencySymbol = useCallback((): string => {
        return getCurrencySymbol(currency);
    }, [currency]);

    const updateChartOptions = useCallback((): Highcharts.Options => {
        if (!results || results.monthsToPayoff === Infinity || results.monthlyBreakdown.length === 0) {
            return {
                credits: { enabled: false },
                chart: { 
                    height: 300,
                    backgroundColor: '#f9fafb'
                },
                title: { 
                    text: 'Enter payment details to see chart',
                    style: { color: '#6b7280', fontSize: '14px' }
                },
                series: []
            };
        }

        // Limit to first 24 months for readability, or all months if less
        const monthsToShow = Math.min(24, results.monthsToPayoff);
        const monthlyData = results.monthlyBreakdown.slice(0, monthsToShow);
        
        const interestData = monthlyData.map(month => parseFloat(month.interest.toFixed(2)));
        const principalData = monthlyData.map(month => parseFloat(month.principal.toFixed(2)));
        const balanceData = monthlyData.map(month => parseFloat(month.balance.toFixed(2)));
        const categories = monthlyData.map((_, index) => `${index + 1}`);

        return {
            credits: { enabled: false },
            chart: {
                height: 400,
                zooming: { type: 'x' }
            },
            title: {
                text: 'Payment Breakdown Over Time',
                style: { fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }
            },
            xAxis: {
                title: { 
                    text: 'Month',
                    style: { color: '#6b7280' }
                },
                categories: categories,
                labels: {
                    style: { color: '#6b7280' }
                }
            },
            yAxis: [{
                title: { 
                    text: `Payment Amount (${getSelectedCurrencySymbol()})`,
                    style: { color: '#6b7280' }
                },
                min: 0,
                labels: {
                    style: { color: '#6b7280' }
                },
                gridLineColor: '#e5e7eb'
            }, {
                title: { 
                    text: `Remaining Balance (${getSelectedCurrencySymbol()})`,
                    style: { color: '#f59e0b' }
                },
                opposite: true,
                min: 0,
                labels: {
                    style: { color: '#6b7280' }
                },
                gridLineColor: 'transparent'
            }],
            tooltip: {
                shared: true,
                headerFormat: '<b>Month {point.key}</b><br>',
                pointFormat: `<span style="color:{series.color}">{series.name}</span>: <b>${getSelectedCurrencySymbol()}{point.y:,.2f}</b><br>`,
                backgroundColor: 'white',
                borderColor: '#d1d5db',
                borderRadius: 8,
                shadow: true
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: { enabled: false },
                    borderWidth: 0
                },
                line: {
                    marker: { 
                        enabled: true,
                        radius: 3,
                        symbol: 'circle'
                    },
                    lineWidth: 2
                }
            },
            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal',
                itemStyle: { color: '#374151' }
            },
            series: [{
                name: 'Principal Payment',
                type: 'column',
                data: principalData,
                color: '#10b981',
                yAxis: 0,
                tooltip: {
                    pointFormat: `<span style="color:#10b981">●</span> Principal Payment: <b>${getSelectedCurrencySymbol()}{point.y:,.2f}</b><br>`
                }
            }, {
                name: 'Interest Payment',
                type: 'column',
                data: interestData,
                color: '#ef4444',
                yAxis: 0,
                tooltip: {
                    pointFormat: `<span style="color:#ef4444">●</span> Interest Payment: <b>${getSelectedCurrencySymbol()}{point.y:,.2f}</b><br>`
                }
            }, {
                name: 'Remaining Balance',
                type: 'line',
                data: balanceData,
                color: '#f59e0b',
                yAxis: 1,
                lineWidth: 3,
                marker: {
                    enabled: true,
                    radius: 4,
                    fillColor: '#f59e0b',
                    lineWidth: 2,
                    lineColor: '#ffffff'
                },
                tooltip: {
                    pointFormat: `<span style="color:#f59e0b">●</span> Remaining Balance: <b>${getSelectedCurrencySymbol()}{point.y:,.2f}</b><br>`
                }
            }] as Highcharts.SeriesOptionsType[]
        };
    }, [results, getSelectedCurrencySymbol]);

    // Update chart options when results change
    useEffect(() => {
        setOptions(updateChartOptions());
    }, [results, updateChartOptions]);

    return (
        <ToolLayout 
            toolCategory={ToolNameLists.CreditCardPaymentCalculator}
            disclaimer={<FinancialDisclaimer />}
            secondaryToolDescription="Plan your payment strategy, compare different approaches, and get debt-free faster with our comprehensive credit card calculator."
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {calculationMode === CALCULATION_MODE.PAYOFF_TIME 
                                ? "How long will it take to pay off my credit card bill?"
                                : "What payment do I need to pay off in target time?"
                            }
                        </h2>
                        
                        {/* Mode Selection */}
                        <div className="mb-6">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {CALCULATION_MODES.map((mode) => (
                                    <button
                                        key={mode.value}
                                        onClick={() => setCalculationMode(mode.value)}
                                        className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                                            calculationMode === mode.value
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-transparent text-gray-600 hover:bg-orange-100'
                                        }`}
                                    >
                                        {mode.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Currency Selection */}
                        <CurrencySelector
                            value={currency}
                            onChange={(selectedCurrency) => setCurrency(selectedCurrency)}
                            className="mb-4"
                        />

                        {/* Credit Card Balance */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Credit card balance:
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    {getSelectedCurrencySymbol()}
                                </span>
                                <input
                                    type="number"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    placeholder="1000"
                                    min="0"
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        {/* Interest Rate */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interest rate (APR):
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(e.target.value)}
                                    placeholder="25"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    %
                                </span>
                            </div>
                        </div>

                        {/* Payment Amount or Target Months */}
                        {calculationMode === CALCULATION_MODE.PAYOFF_TIME ? (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment amount per month:
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        {getSelectedCurrencySymbol()}
                                    </span>
                                    <input
                                        type="number"
                                        value={monthlyPayment}
                                        onChange={(e) => setMonthlyPayment(e.target.value)}
                                        placeholder="100"
                                        min="0"
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target payoff time (months):
                                </label>
                                <input
                                    type="number"
                                    value={targetMonths}
                                    onChange={(e) => setTargetMonths(e.target.value)}
                                    placeholder="12"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Credit Card Calculation Results</h2>
                        
                        {!results && (
                            <div className="text-center text-gray-500 py-8">
                                <p>Enter your credit card details to see results</p>
                            </div>
                        )}

                        {results && results.monthsToPayoff === Infinity && (
                            <div className="text-center text-red-500 py-8">
                                <h3 className="text-lg font-semibold mb-2">⚠️ Payment Too Low</h3>
                                <p>Your monthly payment doesn&apos;t cover the interest charges. You need to pay more than the minimum to reduce your balance.</p>
                            </div>
                        )}

                        {results && results.monthsToPayoff !== Infinity && (
                            <div className="space-y-4">
                                {/* Main Results */}
                                <div className="bg-orange-100 rounded-lg p-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <div className="text-sm text-gray-600">
                                                {calculationMode === CALCULATION_MODE.PAYOFF_TIME 
                                                    ? "Months to pay off debt:"
                                                    : "Required monthly payment:"
                                                }
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {calculationMode === CALCULATION_MODE.PAYOFF_TIME 
                                                    ? formatMonths(results.monthsToPayoff)
                                                    : formatCurrency(parseFloat(monthlyPayment) || results.totalAmountPaid / results.monthsToPayoff, currency)
                                                }
                                            </div>
                                            <button
                                                onClick={() => handleCopy(
                                                    calculationMode === CALCULATION_MODE.PAYOFF_TIME 
                                                        ? results.monthsToPayoff.toString()
                                                        : (parseFloat(monthlyPayment) || results.totalAmountPaid / results.monthsToPayoff).toFixed(2)
                                                )}
                                                className="mt-2 px-3 py-1 text-xs bg-orange-300 hover:bg-orange-400 text-white rounded transition-colors"
                                            >
                                                Copy
                                            </button>
                                        </div>

                                        <div>
                                            <div className="text-sm text-gray-600">Total interest you will pay:</div>
                                            <div className="text-xl font-semibold text-gray-900">
                                                {formatCurrency(results.totalInterestPaid, currency)}
                                            </div>
                                            <button
                                                onClick={() => handleCopy(formatCurrency(results.totalInterestPaid, currency))}
                                                className="mt-2 px-3 py-1 text-xs bg-orange-300 hover:bg-orange-400 text-white rounded transition-colors"
                                            >
                                                Copy
                                            </button>
                                        </div>

                                        <div>
                                            <div className="text-sm text-gray-600">Total to pay back:</div>
                                            <div className="text-xl font-semibold text-gray-900">
                                                {formatCurrency(results.totalAmountPaid, currency)}
                                            </div>
                                            <button
                                                onClick={() => handleCopy(formatCurrency(results.totalAmountPaid, currency))}
                                                className="mt-2 px-3 py-1 text-xs bg-orange-300 hover:bg-orange-400 text-white rounded transition-colors"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Progress Bar */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-sm text-gray-600 mb-2">Interest vs Principal</div>
                                    <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-red-400 transition-all duration-300"
                                            style={{ 
                                                width: `${(results.totalInterestPaid / results.totalAmountPaid) * 100}%` 
                                            }}
                                        ></div>
                                        <div 
                                            className="bg-green-400 transition-all duration-300"
                                            style={{ 
                                                width: `${(parseFloat(balance) / results.totalAmountPaid) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                                        <span>Interest: {formatCurrency(results.totalInterestPaid, currency)}</span>
                                        <span>Principal: {formatCurrency(parseFloat(balance), currency)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Strategies & Tips Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payoff Strategies</h2>
                        
                        {/* Payoff Strategies */}
                        {payoffStrategies.length > 0 ? (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Alternative Payment Strategies</h3>
                                {payoffStrategies.map((strategy, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-3 mb-3">
                                        <div className="font-medium text-gray-900">{strategy.name}</div>
                                        <div className="text-sm text-gray-600 mb-2">{strategy.description}</div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-gray-500">Payoff time:</span>
                                                <br />
                                                <span className="font-semibold">{formatMonths(strategy.monthsToPayoff)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Interest saved:</span>
                                                <br />
                                                <span className="font-semibold text-green-600">
                                                    {results ? formatCurrency(results.totalInterestPaid - strategy.totalInterest, currency) : '$0'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 mb-6">No alternative strategies available. Adjust your payment to see different options.</p>
                        )}

                        {/* Chart Section */}
                        <h3>Payment Breakdown Chart</h3>
                        {options.series && options.series.length === 0 ? (
                            <p className="text-sm text-gray-500 mb-4">Chart will display once valid payment details are entered.</p>
                        ) : (
                            <div>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Educational Content */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use This Credit Card Calculator</h3>
                    <p className="text-gray-700 mb-4">
                        Our credit card payment calculator helps you understand exactly how long it will take to pay off your credit card debt and how much interest you&apos;ll pay. Choose between two calculation modes: &quot;Pay Off Calculator&quot; to see how long your current payment will take, or &quot;Monthly Repayments&quot; to find the payment needed to be debt-free by a target date.
                    </p>

                    <p className="text-gray-700 mb-4">
                        Enter your current credit card balance, annual percentage rate (APR), and either your monthly payment amount or target payoff timeframe. The calculator automatically updates results as you type, showing your payoff timeline, total interest costs, and total amount to be repaid. The visual progress bar helps you understand the proportion of interest versus principal in your total payments.
                    </p>

                    <h3>Credit Card Debt Facts</h3>
                    <ol className="list-decimal list-outside space-y-3 text-gray-700 mb-6 pl-5">
                        <li>
                            <strong>Minimum payments</strong> are designed to keep you in debt longer. Credit card companies typically set minimum payments at just 2-3% of your balance, which means most of your payment goes toward interest rather than reducing the principal balance.
                        </li>
                        <li>
                            <strong>Compound interest</strong> works against you with credit card debt. Interest is calculated daily and added to your balance, meaning you pay interest on previously charged interest. This is why high-interest credit card debt can grow so quickly if left unchecked.
                        </li>
                        <li>
                            <strong>Payment timing</strong> matters significantly. Making payments before your statement closes can reduce your average daily balance, lowering the interest charged. Even paying a few days early can save money over time.
                        </li>
                        <li>
                            <strong>The debt avalanche method</strong> suggests paying minimums on all cards while putting extra money toward the highest interest rate debt first. This mathematically optimal approach saves the most money in total interest payments.
                        </li>
                        <li>
                            <strong>The debt snowball method</strong> focuses on paying off the smallest balance first, regardless of interest rate. While not mathematically optimal, this psychological approach helps many people stay motivated and successfully eliminate debt.
                        </li>
                        <li>
                            <strong>Balance transfer cards</strong> can provide temporary relief with 0% introductory rates, but be aware of balance transfer fees (typically 3-5%) and what the rate becomes after the promotional period ends.
                        </li>
                        <li>
                            <strong>Credit utilization</strong> affects your credit score. Keeping balances below 30% of your credit limit (and ideally below 10%) helps maintain a good credit score, which can qualify you for better interest rates on future credit.
                        </li>
                        <li>
                            <strong>Emergency funds</strong> are crucial for breaking the debt cycle. Even a small emergency fund of $500-$1000 can prevent you from adding new debt when unexpected expenses arise.
                        </li>
                        <li>
                            <strong>Credit counseling</strong> is available through non-profit agencies that can help negotiate payment plans, lower interest rates, or debt management programs. These services are often free or low-cost and can provide valuable guidance.
                        </li>
                        <li>
                            <strong>Psychological factors</strong> play a huge role in debt repayment success. Automating payments, celebrating small victories, and having a clear visual representation of progress (like our calculator provides) significantly increase the likelihood of successfully becoming debt-free.
                        </li>
                    </ol>

                    <h3>Debt Repayment Strategies</h3>
                    <p>Consider these proven strategies: pay more than the minimum whenever possible, round up payments to the nearest $50 or $100, use windfalls like tax refunds for debt reduction, and avoid using credit cards while paying them off. The &quot;snowball&quot; method builds momentum by celebrating quick wins, while the &quot;avalanche&quot; method minimizes total interest paid.</p>
                    
                    <h3>When to Seek Help</h3>
                    <p>If you can only afford minimum payments, are using credit cards for basic necessities, or feel overwhelmed by multiple debts, consider speaking with a non-profit credit counselor. They can help create a debt management plan and may negotiate lower interest rates with your creditors.</p>
                </div>
            </div>
        </ToolLayout>
    );
}