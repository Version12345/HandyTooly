'use client';

import React, { useState, useCallback } from 'react';
import ToolLayout from '../../toolLayout';

interface ConversionResult {
  romanNumeral: string;
  number: number;
  explanation: Array<{ symbol: string; value: number; count: number }>;
}

export function RomanNumeralsConverter() {
  const [input, setInput] = useState('1000');
  const [conversionType, setConversionType] = useState<'toRoman' | 'toNumber'>('toRoman');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Roman numeral mappings (including vinculum for large numbers)
  const romanNumerals = React.useMemo(() => [
    { symbol: 'M̄', value: 1000000, display: 'M̄' },
    { symbol: 'C̄M̄', value: 900000, display: 'C̄M̄' },
    { symbol: 'D̄', value: 500000, display: 'D̄' },
    { symbol: 'C̄D̄', value: 400000, display: 'C̄D̄' },
    { symbol: 'C̄', value: 100000, display: 'C̄' },
    { symbol: 'X̄C̄', value: 90000, display: 'X̄C̄' },
    { symbol: 'L̄', value: 50000, display: 'L̄' },
    { symbol: 'X̄L̄', value: 40000, display: 'X̄L̄' },
    { symbol: 'X̄', value: 10000, display: 'X̄' },
    { symbol: 'ĪX̄', value: 9000, display: 'ĪX̄' },
    { symbol: 'V̄', value: 5000, display: 'V̄' },
    { symbol: 'ĪV̄', value: 4000, display: 'ĪV̄' },
    { symbol: 'M', value: 1000, display: 'M' },
    { symbol: 'CM', value: 900, display: 'CM' },
    { symbol: 'D', value: 500, display: 'D' },
    { symbol: 'CD', value: 400, display: 'CD' },
    { symbol: 'C', value: 100, display: 'C' },
    { symbol: 'XC', value: 90, display: 'XC' },
    { symbol: 'L', value: 50, display: 'L' },
    { symbol: 'XL', value: 40, display: 'XL' },
    { symbol: 'X', value: 10, display: 'X' },
    { symbol: 'IX', value: 9, display: 'IX' },
    { symbol: 'V', value: 5, display: 'V' },
    { symbol: 'IV', value: 4, display: 'IV' },
    { symbol: 'I', value: 1, display: 'I' }
  ], []);

  const numberToRoman = useCallback((num: number): { roman: string; explanation: Array<{ symbol: string; value: number; count: number }> } => {
    let result = '';
    let remaining = num;
    const explanation: Array<{ symbol: string; value: number; count: number }> = [];

    for (const { symbol, value, display } of romanNumerals) {
      const count = Math.floor(remaining / value);
      if (count > 0) {
        result += symbol.repeat(count);
        explanation.push({ symbol: display || symbol, value, count });
        remaining -= value * count;
      }
    }

    return { roman: result, explanation };
  }, [romanNumerals]);

  const romanToNumber = useCallback((roman: string): { number: number; explanation: Array<{ symbol: string; value: number; count: number }> } => {
    // Allow vinculum characters (overline) and standard Roman numerals
    const cleanRoman = roman.toUpperCase().replace(/[^IVXLCDM̄]/g, '');
    let result = 0;
    let i = 0;
    const explanation: Array<{ symbol: string; value: number; count: number }> = [];
    const symbolCounts: { [key: string]: number } = {};

    while (i < cleanRoman.length) {
      // Check for longer combinations first (up to 3 characters for vinculum combinations)
      let found = false;
      
      for (let len = Math.min(3, cleanRoman.length - i); len >= 1; len--) {
        const substring = cleanRoman.substring(i, i + len);
        const matchedValue = romanNumerals.find(rn => rn.symbol === substring);
        
        if (matchedValue) {
          result += matchedValue.value;
          symbolCounts[substring] = (symbolCounts[substring] || 0) + 1;
          i += len;
          found = true;
          break;
        }
      }
      
      if (!found) {
        i += 1; // Skip invalid character
      }
    }

    // Convert counts to explanation format
    Object.entries(symbolCounts).forEach(([symbol, count]) => {
      const symbolData = romanNumerals.find(rn => rn.symbol === symbol);
      if (symbolData) {
        explanation.push({ symbol: symbolData.display || symbol, value: symbolData.value, count });
      }
    });

    return { number: result, explanation };
  }, [romanNumerals]);

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    try {
      if (conversionType === 'toRoman') {
        const num = parseInt(input.replace(/[^\d]/g, ''));
        if (isNaN(num) || num < 1) {
          setResult(null);
          setError('Please enter a valid number greater than 0');
          return;
        }
        if (num > 1000000) {
          setResult(null);
          setError('Number must be 1,000,000 or less. Roman numerals don\'t support numbers above this limit.');
          return;
        }
        
        const conversion = numberToRoman(num);
        setResult({
          romanNumeral: conversion.roman,
          number: num,
          explanation: conversion.explanation
        });
        setError(null);
      } else {
        const conversion = romanToNumber(input);
        if (conversion.number === 0) {
          setResult(null);
          setError('Please enter valid Roman numerals (I, V, X, L, C, D, M)');
          return;
        }
        
        setResult({
          romanNumeral: input.toUpperCase().replace(/[^IVXLCDM̄]/g, ''),
          number: conversion.number,
          explanation: conversion.explanation
        });
        setError(null);
      }
    } catch {
      setResult(null);
      setError('An error occurred during conversion. Please check your input.');
    }
  }, [input, conversionType, numberToRoman, romanToNumber]);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleTypeChange = (type: 'toRoman' | 'toNumber') => {
    setConversionType(type);
    setInput('');
    setResult(null);
    setError(null);
  };

  const copyToClipboard = () => {
    if (result) {
      const textToCopy = conversionType === 'toRoman' ? result.romanNumeral : result.number.toString();
      navigator.clipboard.writeText(textToCopy);
    }
  };

  // Auto-convert on input change
  React.useEffect(() => {
    const timeoutId = setTimeout(handleConvert, 300);
    return () => clearTimeout(timeoutId);
  }, [handleConvert]);

  return (
    <ToolLayout pageTitle="Roman Numerals Converter">
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Convert between regular numbers (1-1,000,000) and Roman numerals. Supports traditional notation 
          and vinculum (overline) for large numbers. Perfect for academic work, historical references, 
          clock faces, and formal document numbering.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Converter</h2>
            
            {/* Translation Type Toggle */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Translation Type</label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleTypeChange('toRoman')}
                  className={`flex-1 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                    conversionType === 'toRoman'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Numbers to Roman numerals
                </button>
                <button
                  onClick={() => handleTypeChange('toNumber')}
                  className={`flex-1 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                    conversionType === 'toNumber'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Roman numerals to numbers
                </button>
              </div>
            </div>

            {/* Input Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {conversionType === 'toRoman' ? 'Enter a Number' : 'Enter Roman Numerals'}
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={conversionType === 'toRoman' ? '1000' : 'M'}
              />
              <p className="text-xs text-gray-500 mt-1">
                {conversionType === 'toRoman' 
                  ? 'Enter a number from 1 to 1,000,000' 
                  : 'Enter Roman numerals (I, V, X, L, C, D, M) with vinculum (̄) for large numbers'}
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Result</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!result && !error && (
              <div className="text-center text-gray-500 py-8">
                <p>Enter a {conversionType === 'toRoman' ? 'number' : 'Roman numeral'} to see the conversion</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Main Result */}
                <div className="text-center p-6 bg-gray-100 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {conversionType === 'toRoman' ? result.romanNumeral : result.number}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md transition-colors"
                  >
                    Copy
                  </button>
                </div>

                {/* Explanation */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Explanation</h3>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="font-medium text-gray-700">Symbol</div>
                      <div className="font-medium text-gray-700">Value</div>
                    </div>
                    {result.explanation.map((item, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-200 last:border-0">
                        <div className="font-mono text-lg">
                          {item.symbol}
                          {item.count > 1 && <span className="text-sm text-gray-500 ml-1">× {item.count}</span>}
                        </div>
                        <div className="text-gray-900">
                          {item.value}
                          {item.count > 1 && <span className="text-gray-500 ml-1">= {item.value * item.count}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Roman Numerals Reference */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Roman Numerals Reference</h3>
          
          {/* Basic Symbols */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Basic Symbols</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
              {romanNumerals.filter(rn => rn.symbol.length === 1 && !rn.symbol.includes('̄')).map((rn) => (
                <div key={rn.symbol} className="text-center p-3 bg-gray-100 rounded-md">
                  <div className="font-bold text-lg">{rn.display}</div>
                  <div className="text-gray-600">{rn.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtractive Combinations */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Subtractive Combinations</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
              {romanNumerals.filter(rn => rn.symbol.length === 2 && !rn.symbol.includes('̄')).map((rn) => (
                <div key={rn.symbol} className="text-center p-3 bg-gray-100 rounded-md">
                  <div className="font-bold text-lg">{rn.display}</div>
                  <div className="text-gray-600">{rn.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vinculum (Large Numbers) */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Vinculum Notation (Large Numbers)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
              {romanNumerals.filter(rn => rn.symbol.includes('̄')).slice(0, 6).map((rn) => (
                <div key={rn.symbol} className="text-center p-3 bg-gray-100 rounded-md">
                  <div className="font-bold text-lg">{rn.display}</div>
                  <div className="text-gray-600">{rn.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              An overline (vinculum) multiplies the value by 1,000
            </p>
          </div>
        </div>

        <div>
          <h3>What is Roman Numerals?</h3>
          <p>Roman numerals began in ancient Rome over 2,000 years ago. They used letters from the Latin alphabet to show numbers. The main symbols are I for 1, V for 5, X for 10, L for 50, C for 100, D for 500, and M for 1,000. People used them in trade, stone carvings, and early clocks. The system is simple for small numbers but less practical for big calculations.</p>
          <p>Numbers beyond 4,000 were written using a bar placed above a numeral to mean it was multiplied by 1,000. For example, a bar over V means 5,000, and a bar over X means 10,000. This method allowed the Romans to write very large numbers clearly. Today, Roman numerals are still used in clocks, book chapters, and movie titles as a link to history and tradition.</p>
          <h3>How to Convert Numbers to Roman Numerals</h3>
          <p>To convert Roman numerals, start by learning the main symbols and their values. I is 1, V is 5, X is 10, L is 50, C is 100, D is 500, and M is 1,000. Read the numeral from left to right. When a smaller number appears before a larger one, subtract it. When it appears after, add it. This rule helps you find the correct value every time.</p>
          <p>For example, IX equals 9 because 10 minus 1 equals 9. XI equals 11 because 10 plus 1 equals 11. XL equals 40 since 50 minus 10 equals 40. LX equals 60 since 50 plus 10 equals 60. MCM equals 1,900 because 1,000 plus 900 equals 1,900. Practice reading and writing these examples to build confidence with Roman numerals.</p>
          <h3>How to Remember Roman Numerals with Mnemonics.</h3>
          <p>A good way to remember Roman numerals is to use a short, catchy phrase. One popular example is “<u>I</u> <u>V</u>alue <u>X</u>ylophones <u>L</u>ike <u>C</u>ows <u>D</u>o <u>M</u>ilk.” Each word stands for a numeral in order: I for 1, V for 5, X for 10, L for 50, C for 100, D for 500, and M for 1,000. Saying this phrase out loud helps fix the order in your memory. You can also make your own version using words that are easy for you to recall. Repeating and writing them often makes learning faster and more fun.</p>
        </div>
      </div>
    </ToolLayout>
  );
}