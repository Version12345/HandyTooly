'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

export function HexToDecimalConverter() {
  const [conversionMode, setConversionMode] = useState<'hex-to-decimal' | 'decimal-to-hex'>('hex-to-decimal');
  const [hexInput, setHexInput] = useState('FF');
  const [decimalInput, setDecimalInput] = useState('255');
  const [hexResult, setHexResult] = useState('');
  const [decimalResult, setDecimalResult] = useState('');
  const [binaryResult, setBinaryResult] = useState('');
  const [octalResult, setOctalResult] = useState('');
  const [asciiResult, setAsciiResult] = useState('');
  const [isValidInput, setIsValidInput] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Helper function to validate hex input
  const isValidHexadecimal = useCallback((hex: string): boolean => {
    if (!hex.trim()) return false;
    // Remove common prefixes
    const cleanHex = hex.replace(/^(0x|0X|#)/, '');
    // Check if it contains only valid hex characters
    return /^[0-9A-Fa-f]+$/.test(cleanHex);
  }, []);

  // Helper function to validate decimal input
  const isValidDecimal = useCallback((decimal: string): boolean => {
    if (!decimal.trim()) return false;
    // Check if it's a valid positive integer
    return /^[0-9]+$/.test(decimal.trim()) && parseInt(decimal.trim()) >= 0;
  }, []);

  // Helper function to clean hex input
  const cleanHexInput = useCallback((hex: string): string => {
    return hex.replace(/^(0x|0X|#)/, '').toUpperCase();
  }, []);

  // Convert hex to decimal
  const hexToDecimal = useCallback((hex: string): number => {
    const cleanHex = cleanHexInput(hex);
    return parseInt(cleanHex, 16);
  }, [cleanHexInput]);

  // Convert decimal to hex
  const decimalToHex = useCallback((decimal: number): string => {
    return decimal.toString(16).toUpperCase();
  }, []);

  // Convert decimal to binary
  const decimalToBinary = useCallback((decimal: number): string => {
    return decimal.toString(2);
  }, []);

  // Convert decimal to octal
  const decimalToOctal = useCallback((decimal: number): string => {
    return decimal.toString(8);
  }, []);

  // Convert hex to ASCII (for valid ASCII range)
  const hexToASCII = useCallback((hex: string): string => {
    const cleanHex = cleanHexInput(hex);
    let result = '';
    
    // Process in pairs (each ASCII character is represented by 2 hex digits)
    for (let i = 0; i < cleanHex.length; i += 2) {
      const hexPair = cleanHex.substr(i, 2);
      if (hexPair.length === 2) {
        const decimal = parseInt(hexPair, 16);
        // Only include printable ASCII characters (32-126)
        if (decimal >= 32 && decimal <= 126) {
          result += String.fromCharCode(decimal);
        } else if (decimal < 32) {
          // Control characters
          result += `[${decimal}]`;
        }
      }
    }
    return result || 'N/A';
  }, [cleanHexInput]);

  // Main conversion function
  const performConversion = useCallback(() => {
    if (conversionMode === 'hex-to-decimal') {
      if (!hexInput.trim()) {
        setDecimalResult('');
        setBinaryResult('');
        setOctalResult('');
        setAsciiResult('');
        setIsValidInput(true);
        setErrorMessage('');
        return;
      }

      if (!isValidHexadecimal(hexInput)) {
        setIsValidInput(false);
        setErrorMessage('Invalid hexadecimal input. Use digits 0-9 and letters A-F.');
        setDecimalResult('');
        setBinaryResult('');
        setOctalResult('');
        setAsciiResult('');
        return;
      }

      try {
        setIsValidInput(true);
        setErrorMessage('');
        
        const decimal = hexToDecimal(hexInput);
        const binary = decimalToBinary(decimal);
        const octal = decimalToOctal(decimal);
        const ascii = hexToASCII(hexInput);

        setDecimalResult(decimal.toString());
        setBinaryResult(binary);
        setOctalResult(octal);
        setAsciiResult(ascii);
        setHexResult(''); // Clear hex result in this mode
      } catch {
        setIsValidInput(false);
        setErrorMessage('Error converting hexadecimal. Please check your input.');
        setDecimalResult('');
        setBinaryResult('');
        setOctalResult('');
        setAsciiResult('');
      }
    } else {
      // decimal-to-hex mode
      if (!decimalInput.trim()) {
        setHexResult('');
        setBinaryResult('');
        setOctalResult('');
        setAsciiResult('');
        setIsValidInput(true);
        setErrorMessage('');
        return;
      }

      if (!isValidDecimal(decimalInput)) {
        setIsValidInput(false);
        setErrorMessage('Invalid decimal input. Use positive integers only.');
        setHexResult('');
        setBinaryResult('');
        setOctalResult('');
        setAsciiResult('');
        return;
      }

      try {
        setIsValidInput(true);
        setErrorMessage('');
        
        const decimal = parseInt(decimalInput.trim());
        const hex = decimalToHex(decimal);
        const binary = decimalToBinary(decimal);
        const octal = decimalToOctal(decimal);
        const ascii = hexToASCII(hex);

        setHexResult(hex);
        setBinaryResult(binary);
        setOctalResult(octal);
        setAsciiResult(ascii);
        setDecimalResult(''); // Clear decimal result in this mode
      } catch {
        setIsValidInput(false);
        setErrorMessage('Error converting decimal. Please check your input.');
        setHexResult('');
        setBinaryResult('');
        setOctalResult('');
        setAsciiResult('');
      }
    }
  }, [conversionMode, hexInput, decimalInput, isValidHexadecimal, isValidDecimal, hexToDecimal, decimalToHex, decimalToBinary, decimalToOctal, hexToASCII]);

  // Auto-convert when input changes
  useEffect(() => {
    const timeoutId = setTimeout(performConversion, 300);
    return () => clearTimeout(timeoutId);
  }, [performConversion]);

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
  };

  // Common examples for quick testing
  const hexExamples = [
    { hex: 'FF', description: 'Maximum single byte (255)' },
    { hex: '100', description: 'First three-digit hex (256)' },
    { hex: '1A2B', description: 'Common hex value (6699)' },
    { hex: 'DEADBEEF', description: 'Famous hex constant' },
    { hex: '48656C6C6F', description: 'Hello in ASCII' },
    { hex: '7FFFFFFF', description: 'Max 32-bit signed int' }
  ];

  const decimalExamples = [
    { decimal: '255', description: 'Maximum single byte (FF)' },
    { decimal: '256', description: 'First 3-digit hex (100)' },
    { decimal: '1024', description: 'Common power of 2 (400)' },
    { decimal: '65535', description: 'Max 16-bit value (FFFF)' },
    { decimal: '16777215', description: 'Max 24-bit RGB (FFFFFF)' },
    { decimal: '2147483647', description: 'Max 32-bit signed int' }
  ];

  // Fun facts about hexadecimal
  const hexFacts = [
    'Hexadecimal uses base 16, with digits 0-9 and letters A-F representing values 10-15.',
    'Hex is widely used in computer programming because it\'s a compact way to represent binary data.',
    'Each hex digit represents exactly 4 binary digits (bits), making conversion simple.',
    'Color codes in web development use hex format, like #FF0000 for red.',
    'Memory addresses in debugging are typically displayed in hexadecimal format.',
    'The prefix "0x" is commonly used in programming to denote hexadecimal numbers.',
    'DEADBEEF is a famous hex constant used in debugging to identify uninitialized memory.',
    'Hex is perfect for representing bytes since one byte (8 bits) equals exactly 2 hex digits.'
  ];

  const getRandomExample = () => {
    if (conversionMode === 'hex-to-decimal') {
      const randomExample = hexExamples[Math.floor(Math.random() * hexExamples.length)];
      setHexInput(randomExample.hex);
    } else {
      const randomExample = decimalExamples[Math.floor(Math.random() * decimalExamples.length)];
      setDecimalInput(randomExample.decimal);
    }
  };

  const getRandomFact = () => {
    return hexFacts[Math.floor(Math.random() * hexFacts.length)];
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.HexToDecimalConverter}
      secondaryToolDescription="Perfect for programming, web development, and computer science calculations."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Conversion Mode Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setConversionMode('hex-to-decimal')}
                  className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                    conversionMode === 'hex-to-decimal'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-orange-100'
                  }`}
                >
                  Hex → Decimal
                </button>
                <button
                  onClick={() => setConversionMode('decimal-to-hex')}
                  className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                    conversionMode === 'decimal-to-hex'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-orange-100'
                  }`}
                >
                  Decimal → Hex
                </button>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {conversionMode === 'hex-to-decimal' ? 'Hexadecimal Input' : 'Decimal Input'}
            </h2>
            
            <div className="mb-4">
              {conversionMode === 'hex-to-decimal' ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Hexadecimal Number
                  </label>
                  <input
                    type="text"
                    value={hexInput}
                    onChange={(e) => setHexInput(e.target.value)}
                    placeholder="FF"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      !isValidInput ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter hex digits (0-9, A-F). Prefixes like 0x, 0X, # are optional.
                  </p>
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Decimal Number
                  </label>
                  <input
                    type="number"
                    value={decimalInput}
                    onChange={(e) => setDecimalInput(e.target.value)}
                    placeholder="255"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      !isValidInput ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a positive integer (0, 1, 2, 3...).
                  </p>
                </>
              )}
              {errorMessage && (
                <p className="text-xs text-red-600 mt-1">{errorMessage}</p>
              )}
            </div>

            {/* Quick Examples */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Examples</h3>
              <div className="space-y-2">
                {conversionMode === 'hex-to-decimal' ? (
                  hexExamples.slice(0, 3).map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setHexInput(example.hex)}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-orange-50 rounded border transition-colors"
                    >
                      <span className="font-mono font-semibold">{example.hex}</span>
                      <span className="text-gray-600 ml-2">- {example.description}</span>
                    </button>
                  ))
                ) : (
                  decimalExamples.slice(0, 3).map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setDecimalInput(example.decimal)}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-orange-50 rounded border transition-colors"
                    >
                      <span className="font-mono font-semibold">{example.decimal}</span>
                      <span className="text-gray-600 ml-2">- {example.description}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Random Example Button */}
            <button
              onClick={getRandomExample}
              className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
            >
              Try Random Example
            </button>

            {/* Input Format Info */}
            <div className="mt-4 p-3 bg-sky-50 rounded-lg">
              <h4 className="text-sm font-medium text-sky-900 mb-1">Supported Formats</h4>
              <ul className="text-xs text-sky-800 space-y-1">
                <li>FF (basic hex)</li>
                <li>0xFF (C-style)</li>
                <li>#FF0000 (HTML color)</li>
                <li>DEADBEEF (multi-byte)</li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Results</h2>
            
            {((conversionMode === 'hex-to-decimal' && !hexInput.trim()) || 
              (conversionMode === 'decimal-to-hex' && !decimalInput.trim())) && (
              <div className="text-center text-gray-500 py-8">
                <p>
                  Enter a {conversionMode === 'hex-to-decimal' ? 'hexadecimal' : 'decimal'} number to see conversions
                </p>
              </div>
            )}

            {((conversionMode === 'hex-to-decimal' && hexInput.trim() && isValidInput) || 
              (conversionMode === 'decimal-to-hex' && decimalInput.trim() && isValidInput)) && (
              <div className="space-y-4">
                {/* Hex Result (for decimal-to-hex mode) */}
                {conversionMode === 'decimal-to-hex' && hexResult && (
                  <div className="bg-orange-50 rounded-lg p-4 relative">
                    <button
                      onClick={() => handleCopy(hexResult)}
                      className="absolute top-3 right-3 px-3 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                    >
                      Copy
                    </button>
                    <div className="text-sm text-gray-600">Hexadecimal</div>
                    <div className="text-2xl font-bold text-gray-900 font-mono pr-16">{hexResult}</div>
                    <div className="text-sm text-orange-600">Base 16</div>
                  </div>
                )}

                {/* Decimal Result (for hex-to-decimal mode) */}
                {conversionMode === 'hex-to-decimal' && decimalResult && (
                  <div className="bg-green-50 rounded-lg p-4 relative">
                    <button
                      onClick={() => handleCopy(decimalResult)}
                      className="absolute top-3 right-3 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                    >
                      Copy
                    </button>
                    <div className="text-sm text-gray-600">Decimal</div>
                    <div className="text-2xl font-bold text-gray-900 font-mono pr-16">{decimalResult}</div>
                    <div className="text-sm text-green-600">Base 10</div>
                  </div>
                )}

                {/* Binary Result */}
                <div className="bg-sky-50 rounded-lg p-4 relative">
                  <button
                    onClick={() => handleCopy(binaryResult)}
                    className="absolute top-3 right-3 px-3 py-1 text-xs bg-sky-500 hover:bg-sky-600 text-white rounded transition-colors"
                  >
                    Copy
                  </button>
                  <div className="text-sm text-gray-600">Binary</div>
                  <div className="text-xl font-bold text-gray-900 font-mono break-all pr-16">{binaryResult}</div>
                  <div className="text-sm text-sky-600">Base 2</div>
                </div>

                {/* Octal Result */}
                <div className="bg-purple-50 rounded-lg p-4 relative">
                  <button
                    onClick={() => handleCopy(octalResult)}
                    className="absolute top-3 right-3 px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
                  >
                    Copy
                  </button>
                  <div className="text-sm text-gray-600">Octal</div>
                  <div className="text-xl font-bold text-gray-900 font-mono pr-16">{octalResult}</div>
                  <div className="text-sm text-purple-600">Base 8</div>
                </div>

                {/* ASCII Result */}
                <div className="bg-orange-50 rounded-lg p-4 relative">
                  {asciiResult !== 'N/A' && (
                    <button
                      onClick={() => handleCopy(asciiResult)}
                      className="absolute top-3 right-3 px-3 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                    >
                      Copy
                    </button>
                  )}
                  <div className="text-sm text-gray-600">ASCII Text</div>
                  <div className="text-lg font-bold text-gray-900 font-mono break-all pr-16">
                    {asciiResult}
                  </div>
                  <div className="text-sm text-orange-600">Character representation</div>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Number System Info</h2>
            
            {/* Current Conversion Details */}
            {((conversionMode === 'hex-to-decimal' && hexInput.trim() && isValidInput) || 
              (conversionMode === 'decimal-to-hex' && decimalInput.trim() && isValidInput)) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Conversion Details</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  {conversionMode === 'hex-to-decimal' ? (
                    <>
                      <div className="flex justify-between">
                        <span>Input:</span>
                        <span className="font-mono font-semibold">{cleanHexInput(hexInput)} (hex)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Decimal:</span>
                        <span className="font-mono font-semibold">{decimalResult}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Input:</span>
                        <span className="font-mono font-semibold">{decimalInput} (decimal)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hex:</span>
                        <span className="font-mono font-semibold">{hexResult}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span>Bit Length:</span>
                    <span className="font-mono font-semibold">{binaryResult.length} bits</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Byte Length:</span>
                    <span className="font-mono font-semibold">{Math.ceil(binaryResult.length / 8)} bytes</span>
                  </div>
                </div>
              </div>
            )}

            {/* Random Fact */}
            <div className="bg-yellow-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-yellow-900 mb-1">Did You Know?</h4>
              <p className="text-xs text-yellow-800">{getRandomFact()}</p>
            </div>
          </div>
        </div>

        <hr className="my-5" />

        {/* Educational Content */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use This Hex to Decimal Converter</h3>
          <p className="text-gray-700 mb-4">
            Our hexadecimal to decimal converter makes it easy to convert between different number systems used in computer science and programming. Simply enter any hexadecimal number (with or without prefixes like 0x or #) and instantly see its decimal, binary, octal, and ASCII representations.
          </p>

          <p className="text-gray-700 mb-4">
            The converter automatically validates your input and provides detailed conversion information including bit length and byte size. Use the quick examples to test common hexadecimal values, or try the random example button to explore different conversions.
          </p>

          <h3>Understanding Number Systems</h3>
          <ol className="list-decimal list-outside space-y-3 text-gray-700 mb-6 pl-5">
            <li>
              <strong>Hexadecimal (Base 16)</strong> uses 16 distinct symbols: 0-9 for values 0-9, and A-F for values 10-15. It&apos;s widely used in computing because it provides a compact representation of binary data.
            </li>
            <li>
              <strong>Decimal (Base 10)</strong> is our everyday number system using digits 0-9. It&apos;s the most intuitive system for humans but not as efficient for computer storage and processing.
            </li>
            <li>
              <strong>Binary (Base 2)</strong> uses only 0s and 1s, representing the on/off states of computer circuits. Each hex digit equals exactly 4 binary digits, making conversion straightforward.
            </li>
            <li>
              <strong>Octal (Base 8)</strong> uses digits 0-7 and was historically popular in computing. While less common today, it&apos;s still used in some Unix file permissions and assembly programming.
            </li>
            <li>
              <strong>ASCII conversion</strong> interprets hex pairs as character codes. Standard ASCII uses values 0-127, with printable characters in the range 32-126. Our converter shows control characters as numbers in brackets.
            </li>
            <li>
              <strong>Color codes</strong> in web development use hex format like #FF0000 (red), #00FF00 (green), and #0000FF (blue). Each pair represents the intensity of red, green, and blue components.
            </li>
            <li>
              <strong>Memory addresses</strong> are typically displayed in hex because they align perfectly with byte boundaries. A 32-bit address needs exactly 8 hex digits, making debugging more intuitive.
            </li>
            <li>
              <strong>Prefixes and notation</strong> vary by programming language: 0x in C/C++/JavaScript, # for colors, & for assembly, and sometimes just the raw digits without any prefix.
            </li>
            <li>
              <strong>Bit manipulation</strong> is easier with hex since each digit represents 4 bits. Operations like masking, shifting, and bitwise logic become more visual and predictable.
            </li>
            <li>
              <strong>Data representation</strong> in hex makes it easy to spot patterns, identify specific byte values, and debug binary file formats or network protocols.
            </li>
          </ol>

          <h3>Common Use Cases</h3>
          <p className="text-gray-700 mb-4">
            <strong>Programming:</strong> Converting memory addresses, debugging binary data, working with bit flags, and implementing cryptographic algorithms. 
            <strong>Web Development:</strong> Color codes, Unicode character codes, and CSS hex values. 
            <strong>System Administration:</strong> File permissions, network configurations, and hardware registers. 
            <strong>Digital Forensics:</strong> Analyzing binary files, examining memory dumps, and investigating file signatures.
          </p>

          <h3>Tips and Best Practices</h3>
          <p className="text-gray-700 mb-6">
            When working with hex values, remember that each position represents a power of 16. Use consistent prefixes in your code for clarity. For large values, consider grouping digits (like DEAD-BEEF) for better readability. Always validate hex input in production applications, and remember that hex is case-insensitive (A-F equals a-f).
          </p>

          {/* Number Base Reference */}
          <h3>Number Base Reference</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Binary (Base 2):</span>
                  <span className="font-mono font-semibold text-right">0, 1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Octal (Base 8):</span>
                  <span className="font-mono font-semibold text-right">0-7</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Decimal (Base 10):</span>
                  <span className="font-mono font-semibold text-right">0-9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hex (Base 16):</span>
                  <span className="font-mono font-semibold text-right">0-9, A-F</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hex Digit Values */}
          <h3>Hex Digit Values</h3>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                ['A', '10'], ['B', '11'], ['C', '12'], 
                ['D', '13'], ['E', '14'], ['F', '15']
              ].map(([hex, dec]) => (
                <div key={hex} className="flex justify-between bg-white px-3 py-2 rounded shadow-sm">
                  <span className="font-mono font-semibold text-lg text-gray-900">{hex}</span>
                  <span className="text-gray-600">{dec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}