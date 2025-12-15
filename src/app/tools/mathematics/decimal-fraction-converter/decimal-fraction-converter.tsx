'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';

interface Fraction {
  numerator: number;
  denominator: number;
}

type ConversionMode = 'decimal-to-fraction' | 'fraction-to-decimal';

export default function DecimalFractionConverter() {
  const [mode, setMode] = useState<ConversionMode>('fraction-to-decimal');
  const [decimalInput, setDecimalInput] = useState('1.4');
  const [numeratorInput, setNumeratorInput] = useState('1');
  const [denominatorInput, setDenominatorInput] = useState('3');
  const [wholeNumberInput, setWholeNumberInput] = useState('');
  const [repeatDigits, setRepeatDigits] = useState('6');

  // Greatest Common Divisor function
  const gcd = useCallback((a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  }, []);

  // Convert decimal to fraction
  const decimalToFraction = useCallback((decimal: number, repeatDigits?: string): Fraction => {
    if (repeatDigits && repeatDigits.trim() !== '') {
      // Handle repeating decimals using algebraic method
      const decimalStr = decimal.toString();
      const integerPart = Math.floor(Math.abs(decimal));
      const isNegative = decimal < 0;
      
      // Get the non-repeating decimal part (everything after decimal point before repeating)
      let nonRepeatingPart = '';
      if (decimalStr.includes('.')) {
        const afterDecimal = decimalStr.split('.')[1];
        // Find where the repeating part starts in the decimal
        const repeatIndex = afterDecimal.indexOf(repeatDigits);
        if (repeatIndex >= 0) {
          nonRepeatingPart = afterDecimal.substring(0, repeatIndex);
        } else {
          // If repeating digits not found in decimal, assume they start immediately after decimal
          nonRepeatingPart = '';
        }
      }
      
      const nonRepeatingLength = nonRepeatingPart.length;
      const repeatingLength = repeatDigits.length;
      
      // Use algebraic method: if x = 0.abc̄def̄, then solve system of equations
      const nonRepeatingValue = nonRepeatingPart ? parseInt(nonRepeatingPart) : 0;
      const repeatingValue = parseInt(repeatDigits);
      
      const numerator = nonRepeatingValue * (Math.pow(10, repeatingLength) - 1) + repeatingValue;
      const denominator = Math.pow(10, nonRepeatingLength) * (Math.pow(10, repeatingLength) - 1);
      
      const totalNumerator = integerPart * denominator + numerator;
      const finalNumerator = isNegative ? -totalNumerator : totalNumerator;
      const commonDivisor = gcd(Math.abs(finalNumerator), denominator);
      
      return {
        numerator: finalNumerator / commonDivisor,
        denominator: denominator / commonDivisor
      };
    } else {
      // Handle terminating decimals
      const decimalStr = decimal.toString();
      const decimalPlaces = decimalStr.includes('.') ? decimalStr.split('.')[1].length : 0;
      
      const numerator = Math.round(decimal * Math.pow(10, decimalPlaces));
      const denominator = Math.pow(10, decimalPlaces);
      
      const commonDivisor = gcd(Math.abs(numerator), denominator);
      
      return {
        numerator: numerator / commonDivisor,
        denominator: denominator / commonDivisor
      };
    }
  }, [gcd]);

  // Convert fraction to decimal
  const fractionToDecimal = useCallback((numerator: number, denominator: number): string => {
    if (denominator === 0) return 'Undefined (division by zero)';
    
    const result = numerator / denominator;
    
    // Check if it's a repeating decimal by doing long division
    const quotient = Math.floor(Math.abs(result));
    const remainder = Math.abs(numerator) % denominator;
    
    if (remainder === 0) {
      return result.toString();
    }
    
    const decimalPart: string[] = [];
    const remainders: number[] = [];
    let currentRemainder = remainder;
    
    while (currentRemainder !== 0 && remainders.indexOf(currentRemainder) === -1) {
      remainders.push(currentRemainder);
      currentRemainder *= 10;
      decimalPart.push(Math.floor(currentRemainder / denominator).toString());
      currentRemainder = currentRemainder % denominator;
    }
    
    if (currentRemainder === 0) {
      // Terminating decimal
      const sign = result < 0 ? '-' : '';
      return `${sign}${quotient}.${decimalPart.join('')}`;
    } else {
      // Repeating decimal
      const repeatStart = remainders.indexOf(currentRemainder);
      const nonRepeating = decimalPart.slice(0, repeatStart);
      const repeating = decimalPart.slice(repeatStart);
      const sign = result < 0 ? '-' : '';
      
      if (nonRepeating.length === 0) {
        return `${sign}${quotient}.${repeating.join('')}̄`;
      } else {
        return `${sign}${quotient}.${nonRepeating.join('')}${repeating.join('')}̄`;
      }
    }
  }, []);

  // Helper function to format decimal with specified precision
  const formatDecimalResult = useCallback((decimalStr: string, decimalPlaces?: string) => {
    // Handle repeating decimals (remove the bar for calculation)
    let cleanDecimalStr = decimalStr;
    if (decimalStr.includes('̄')) {
      // For repeating decimals, we need to approximate by repeating the pattern
      const barIndex = decimalStr.indexOf('̄');
      const beforeBar = decimalStr.substring(0, barIndex);
      const dotIndex = beforeBar.indexOf('.');
      
      if (dotIndex >= 0) {
        const integerPart = beforeBar.split('.')[0];
        const fractionalPart = beforeBar.substring(dotIndex + 1);
        
        // For formatting purposes, repeat the pattern to get enough precision
        if (decimalPlaces && decimalPlaces.trim() !== '') {
          const places = parseInt(decimalPlaces);
          if (!isNaN(places) && places > 0) {
            let repeatedFraction = fractionalPart;
            while (repeatedFraction.length < places) {
              repeatedFraction += fractionalPart;
            }
            repeatedFraction = repeatedFraction.substring(0, places);
            return `${integerPart}.${repeatedFraction}`;
          }
        }
        
        // Default: repeat pattern a few times
        const repeated = fractionalPart + fractionalPart + fractionalPart;
        cleanDecimalStr = `${integerPart}.${repeated}`;
      }
    }
    
    const num = parseFloat(cleanDecimalStr);
    if (isNaN(num)) return decimalStr;
    
    if (decimalPlaces && decimalPlaces.trim() !== '') {
      const places = parseInt(decimalPlaces);
      if (!isNaN(places) && places > 0) {
        return num.toFixed(places);
      }
    }
    
    return cleanDecimalStr;
  }, []);

  // Calculate result based on current mode
  const calculatedResult = useMemo(() => {
    try {
      if (mode === 'decimal-to-fraction') {
        const decimal = parseFloat(decimalInput);
        if (isNaN(decimal)) return null;
        
        const fraction = decimalToFraction(decimal);
        const improperFraction = `${fraction.numerator}/${fraction.denominator}`;
        
        // Convert to mixed number if improper fraction
        let mixedNumber = '';
        if (Math.abs(fraction.numerator) >= Math.abs(fraction.denominator) && fraction.denominator !== 1) {
          const wholeNumber = Math.floor(Math.abs(fraction.numerator) / Math.abs(fraction.denominator));
          const remainingNumerator = Math.abs(fraction.numerator) % Math.abs(fraction.denominator);
          const sign = fraction.numerator < 0 ? '-' : '';
          
          if (remainingNumerator === 0) {
            mixedNumber = `${sign}${wholeNumber}`;
          } else {
            mixedNumber = `${sign}${wholeNumber} ${remainingNumerator}/${Math.abs(fraction.denominator)}`;
          }
        }
        
        return {
          properFraction: improperFraction,
          mixedNumber: mixedNumber || improperFraction,
          isImproper: Math.abs(fraction.numerator) >= Math.abs(fraction.denominator) && fraction.denominator !== 1
        };
      } else {
        const numerator = parseInt(numeratorInput);
        const denominator = parseInt(denominatorInput);
        const wholeNumber = wholeNumberInput ? parseInt(wholeNumberInput) : 0;
        
        if (isNaN(numerator) || isNaN(denominator)) return null;
        
        // Convert mixed number to improper fraction if whole number is provided
        const improperNumerator = wholeNumber * denominator + numerator;
        
        return fractionToDecimal(improperNumerator, denominator);
      }
    } catch {
      return null;
    }
  }, [mode, decimalInput, numeratorInput, denominatorInput, wholeNumberInput, decimalToFraction, fractionToDecimal]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStepByStepExplanation = () => {
    if (mode === 'decimal-to-fraction') {
      const decimal = parseFloat(decimalInput);
      if (isNaN(decimal)) return '';
      
      const decimalStr = decimal.toString();
      const decimalPlaces = decimalStr.includes('.') ? decimalStr.split('.')[1].length : 0;
      
      if (decimalPlaces === 0) {
        return `${decimal} is a whole number, so the fraction is ${decimal}/1.`;
      }
      
      return `
        Step 1: Write as fraction: ${decimal} = ${decimal * Math.pow(10, decimalPlaces)}/${Math.pow(10, decimalPlaces)}
        Step 2: Find GCD of numerator and denominator
        Step 3: Simplify by dividing both by their GCD
      `;
    } else {
      const numerator = parseInt(numeratorInput);
      const denominator = parseInt(denominatorInput);
      const wholeNumber = wholeNumberInput ? parseInt(wholeNumberInput) : 0;
      if (isNaN(numerator) || isNaN(denominator)) return '';
      
      if (wholeNumber > 0) {
        const improperNumerator = wholeNumber * denominator + numerator;
        return `Step 1: Convert mixed number to improper fraction: ${wholeNumber} ${numerator}/${denominator} = ${improperNumerator}/${denominator}
          Step 2: Divide numerator by denominator: ${improperNumerator} ÷ ${denominator}
          Step 3: Perform long division to get decimal representation
        `;
      } else {
        return `Step 1: Divide numerator by denominator: ${numerator} ÷ ${denominator}
         Step 2: Perform long division to get decimal representation
         Step 3: Check if decimal terminates or repeats
        `;
      }
    }
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.DecimalFractionConverter}
      educationContent={educationContent}
    >
      <div className="space-y-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section - Left Column */}
          <div className="space-y-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Mode Toggle */}
            <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setMode('decimal-to-fraction')}
                className={`px-4 py-2 text-sm rounded-md transition-colors flex-1 border-none ${
                  mode === 'decimal-to-fraction'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Decimal to Fraction
              </button>
              <button
                onClick={() => setMode('fraction-to-decimal')}
                className={`px-4 py-2 text-sm rounded-md transition-colors flex-1 border-none ${
                  mode === 'fraction-to-decimal'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Fraction to Decimal
              </button>
            </div>
            {mode === 'decimal-to-fraction' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decimal Number
                  </label>
                  <input
                    type="text"
                    value={decimalInput}
                    onChange={(e) => setDecimalInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter decimal number (e.g., 1.4, 0.333...)"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Whole Number (optional)
                  </label>
                  <input
                    type="text"
                    value={wholeNumberInput}
                    onChange={(e) => setWholeNumberInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter whole number (leave empty for proper fractions)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For mixed numbers like 2¾, enter 2 here
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numerator
                    </label>
                    <input
                      type="text"
                      value={numeratorInput}
                      onChange={(e) => setNumeratorInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter numerator"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Denominator
                    </label>
                    <input
                      type="text"
                      value={denominatorInput}
                      onChange={(e) => setDenominatorInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter denominator"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Decimal Places (optional)
                  </label>
                  <input
                    type="number"
                    value={repeatDigits}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (parseInt(value) <= 15 || value === '') {
                        setRepeatDigits(value);
                      }
                    }}
                    min="1"
                    max="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., enter '4' for 4 decimal places"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter how many decimal places you want in the result (1-15). Leave empty for full precision.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Results Section - Right Column */}
          <div className="space-y-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 pb-2">
              Result
            </h3>
            {calculatedResult ? (
              <div className="space-y-4">
                {mode === 'decimal-to-fraction' && typeof calculatedResult === 'object' ? (
                  <>
                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600 font-medium">Simplified Fraction:</div>
                        <div className="text-2xl font-bold text-gray-800 font-mono">
                          {calculatedResult.properFraction}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(calculatedResult.properFraction)}
                        className="px-3 py-1 bg-orange-300 text-white text-sm rounded-md hover:bg-orange-500 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    
                    {calculatedResult.isImproper && calculatedResult.mixedNumber !== calculatedResult.properFraction && (
                      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600 font-medium">Mixed Number:</div>
                          <div className="text-2xl font-bold text-gray-800 font-mono">
                            {calculatedResult.mixedNumber}
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(calculatedResult.mixedNumber)}
                          className="px-3 py-1 bg-orange-300 text-white text-sm rounded-md hover:bg-orange-500 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {(() => {
                      const formattedResult = formatDecimalResult(String(calculatedResult), repeatDigits);
                      const isFormatted = repeatDigits && repeatDigits.trim() !== '' && formattedResult !== String(calculatedResult);
                      
                      return (
                        <>
                          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                            <div>
                              <div className="text-sm text-gray-600 font-medium">Decimal Result:</div>
                              <div className="text-2xl font-bold text-gray-800 font-mono">
                                {formattedResult}
                              </div>
                            </div>
                            <button
                              onClick={() => copyToClipboard(formattedResult)}
                              className="px-3 py-1 bg-orange-400 text-white text-sm rounded-md hover:bg-orange-500 transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                          
                          {isFormatted && (
                            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                              <div>
                                <div className="text-sm text-gray-700 font-medium">Full Precision:</div>
                                <div className="text-lg font-bold text-gray-800 font-mono">
                                  {(() => {
                                    const resultStr = String(calculatedResult);
                                    if (resultStr.includes('̄')) {
                                      // Handle repeating decimal with proper overline styling
                                      const barIndex = resultStr.indexOf('̄');
                                      const beforeBar = resultStr.substring(0, barIndex);
                                      const dotIndex = beforeBar.indexOf('.');
                                      
                                      if (dotIndex >= 0) {
                                        const integerPart = beforeBar.split('.')[0];
                                        const fractionalPart = beforeBar.substring(dotIndex + 1);
                                        
                                        return (
                                          <span>
                                            {integerPart}.
                                            <span style={{ textDecoration: 'overline' }}>{fractionalPart}</span>
                                          </span>
                                        );
                                      }
                                    }
                                    return resultStr;
                                  })()}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  {String(calculatedResult).includes('̄') ? 'Repeating decimal notation' : 'Unrounded result for reference'}
                                </div>
                              </div>
                              <button
                                onClick={() => copyToClipboard(String(calculatedResult).replace('̄', ''))}
                                className="px-3 py-1 bg-orange-400 text-white text-sm rounded-md hover:bg-orange-500 transition-colors"
                              >
                                Copy
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()} 
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-sm font-medium">Enter values to see results</div>
                  <div className="text-xs">Results will appear here automatically</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step-by-Step Explanation */}
        {calculatedResult && (
          <div className="bg-gray-50 rounded-lg p-6 shadow-md">
            <h3>Step-by-Step Explanation</h3>
            <div className="text-gray-700 whitespace-pre-line text-md">
              {getStepByStepExplanation()}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3>What Is A Fraction?</h3>
    <p>
      A fraction represents a part of a whole and consists of two numbers: the numerator (top) 
      and the denominator (bottom). The numerator indicates how many parts are being considered, 
      while the denominator indicates the total number of equal parts the whole is divided into.
    </p>

    <h3>What is Numerator and Denominator?</h3>
    <p>
      In a fraction, the <em>numerator</em> is the top number that represents how many parts 
      of the whole are being considered, while the <em>denominator</em> is the bottom number 
      that indicates into how many equal parts the whole is divided. For example, in the fraction 
      3/4, 3 is the numerator and 4 is the denominator.
    </p>

    <h3>Understanding Decimal and Fraction Conversion</h3>
    <p>
      <strong>Terminating Decimals:</strong> Decimals that end, like 0.5 = 1/2. These have denominators 
      with only factors of 2 and 5.
    </p>
    <p>
      <strong>Repeating Decimals:</strong> Decimals that repeat forever, like 0.333... = 1/3. 
      The repeating part is shown with a bar over the repeating digits.
    </p>
    <p>
      <strong>Mixed Numbers:</strong> A combination of a whole number and a proper fraction, 
      like 1¾, which equals the improper fraction 7/4.
    </p>
    <p>
      <strong>Simplification:</strong> Fractions are simplified by dividing both numerator and 
      denominator by their Greatest Common Divisor (GCD).
    </p>

    <h3>What Is Repeating Decimal?</h3>
    <p>
      In mathematics, a repeating decimal (or recurring decimal) is a decimal representation of a number
      that eventually becomes periodic (the same sequence of digits repeats indefinitely). For example,
      1/3 = 0.333... (with 3 repeating) and 2/11 = 0.181818... (with 18 repeating). Repeating decimals can be represented with a bar notation, where a horizontal line (vinculum) is placed over the digits that repeat. For instance, 0.666... can be written as 0.<span style={{ textDecoration: 'overline' }}>6</span>.
    </p>
  </div>
);