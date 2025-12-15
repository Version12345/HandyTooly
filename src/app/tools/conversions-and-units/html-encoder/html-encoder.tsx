'use client';
import React, { useState, useEffect } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

type ConversionMode = 'encode' | 'decode';

export function HtmlEncoder() {
  const [mode, setMode] = useState<ConversionMode>('encode');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [lastEditedField, setLastEditedField] = useState<'input' | 'output'>('input');

  // HTML entity mappings
  const htmlEntities = React.useMemo<Record<string, string>>(() => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    ' ': '&nbsp;', // Only for multiple spaces or special spacing
  }), []);

  // Reverse mapping for decoding
  const reverseHtmlEntities = React.useMemo<Record<string, string>>(() => ({
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  }), []);

  // Extended entities for comprehensive encoding/decoding
  const extendedEntities = React.useMemo<Record<string, string>>(() => ({
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '§': '&sect;',
    '¶': '&para;',
    '†': '&dagger;',
    '‡': '&Dagger;',
    '•': '&bull;',
    '…': '&hellip;',
    '′': '&prime;',
    '″': '&Prime;',
    '‹': '&lsaquo;',
    '›': '&rsaquo;',
    '«': '&laquo;',
    '»': '&raquo;',
    '\u201C': '&ldquo;',
    '\u201D': '&rdquo;',
    '\u2018': '&lsquo;',
    '\u2019': '&rsquo;',
    '\u2013': '&ndash;',
    '\u2014': '&mdash;',
    '×': '&times;',
    '÷': '&divide;',
    '±': '&plusmn;',
    '¼': '&frac14;',
    '½': '&frac12;',
    '¾': '&frac34;',
    '°': '&deg;',
    'µ': '&micro;',
    'α': '&alpha;',
    'β': '&beta;',
    'γ': '&gamma;',
    'δ': '&delta;',
    'π': '&pi;',
    'Σ': '&Sigma;',
    'Ω': '&Omega;',
  }), []);

  // HTML encode function
  const encodeHtml = React.useCallback((text: string): string => {
    let encoded = text;
    
    // First encode basic HTML characters
    Object.entries(htmlEntities).forEach(([char, entity]) => {
      if (char === ' ') return; // Handle spaces separately
      encoded = encoded.split(char).join(entity);
    });
    
    // Encode extended entities
    Object.entries(extendedEntities).forEach(([char, entity]) => {
      encoded = encoded.split(char).join(entity);
    });
    
    return encoded;
  }, [htmlEntities, extendedEntities]);

  // HTML decode function
  const decodeHtml = React.useCallback((text: string): string => {
    let decoded = text;
    
    // Decode extended entities first
    Object.entries(extendedEntities).forEach(([char, entity]) => {
      decoded = decoded.split(entity).join(char);
    });
    
    // Decode basic HTML entities
    Object.entries(reverseHtmlEntities).forEach(([entity, char]) => {
      decoded = decoded.split(entity).join(char);
    });
    
    // Decode numeric entities (&#123; and &#x1A;)
    decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(parseInt(dec, 10));
    });
    
    decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
    
    return decoded;
  }, [extendedEntities, reverseHtmlEntities]);

  // Handle conversion from input to output
  const handleConvert = React.useCallback(() => {
    if (lastEditedField !== 'input') return; // Only convert if input was last edited
    
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    
    try {
      if (mode === 'encode') {
        setOutputText(encodeHtml(inputText));
      } else {
        setOutputText(decodeHtml(inputText));
      }
    } catch (error) {
      setOutputText('Error: Unable to process text');
      console.error('Conversion error:', error);
    }
  }, [decodeHtml, encodeHtml, inputText, mode, lastEditedField]);

  // Auto-update when input or mode changes
  useEffect(() => {
    if (lastEditedField === 'input') {
      handleConvert();
    }
  }, [inputText, mode, handleConvert, lastEditedField]);

  // Handle reverse conversion when output is edited
  useEffect(() => {
    if (lastEditedField === 'output' && outputText.trim()) {
      try {
        if (mode === 'encode') {
          // If we're in encode mode, decode the output back to input
          setInputText(decodeHtml(outputText));
        } else {
          // If we're in decode mode, encode the output back to input
          setInputText(encodeHtml(outputText));
        }
      } catch (error) {
        console.error('Reverse conversion error:', error);
      }
    } else if (lastEditedField === 'output' && !outputText.trim()) {
      setInputText('');
    }
  }, [outputText, mode, lastEditedField, decodeHtml, encodeHtml]);

  // Handle output text change - convert back to input
  const handleOutputChange = React.useCallback((text: string) => {
    setLastEditedField('output');
    setOutputText(text);
    
    if (!text.trim()) {
      setInputText('');
      return;
    }
    
    try {
      // Convert in reverse direction
      if (mode === 'encode') {
        // If we're in encode mode, decode the output back to input
        setInputText(decodeHtml(text));
      } else {
        // If we're in decode mode, encode the output back to input
        setInputText(encodeHtml(text));
      }
    } catch (error) {
      console.error('Reverse conversion error:', error);
    }
  }, [decodeHtml, encodeHtml, mode]);

  // Copy to clipboard
  const handleCopy = async (text: string, type: string) => {
    await copyToClipboard(text);
    console.log(`${type} copied to clipboard`);
  };

  // Clear inputs
  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  // Sample texts for quick testing
  const sampleTexts = [
    {
      name: 'Basic HTML Tags',
      encoded: '&lt;div class=&quot;container&quot;&gt;&lt;h1&gt;Hello World&lt;/h1&gt;&lt;/div&gt;',
      decoded: '<div class="container"><h1>Hello World</h1></div>'
    },
    {
      name: 'Special Characters',
      encoded: 'Copyright &copy; 2023 &amp; Company &trade; - All Rights Reserved &reg;',
      decoded: 'Copyright © 2023 & Company ™ - All Rights Reserved ®'
    },
    {
      name: 'Quotes & Apostrophes',
      encoded: '&quot;Hello&quot; he said, &quot;It&apos;s a beautiful day!&quot;',
      decoded: '"Hello" he said, "It\'s a beautiful day!"'
    },
    {
      name: 'Mathematical Symbols',
      encoded: '2 &times; 3 = 6, 10 &divide; 2 = 5, Temperature: 25&deg;C &plusmn; 2&deg;',
      decoded: '2 × 3 = 6, 10 ÷ 2 = 5, Temperature: 25°C ± 2°'
    }
  ];

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.HtmlEncoder}
      secondaryToolDescription="Perfect for web development, content management, and HTML processing."
    >
      <div className="space-y-6">
        {/* Settings Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mode Selection */}
            <div>
              <div className="inline-flex rounded-lg bg-gray-100 p-1 w-full text-xs">
                <button
                  onClick={() => setMode('encode')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                    mode === 'encode'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Encode
                </button>
                <button
                  onClick={() => setMode('decode')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                    mode === 'decode'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Decode
                </button>
              </div>
            </div>

            {/* Swap Button */}
            <div>
              <button
                onClick={() => {
                  const temp = inputText;
                  setInputText(outputText);
                  setOutputText(temp);
                  setLastEditedField('input'); // Focus on input after swap
                }}
                disabled={!inputText && !outputText}
                className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded transition-colors text-sm"
              >
                ⇄ Swap Input & Output
              </button>
            </div>

            {/* Clear All Button */}
            <div>
              <button
                onClick={clearAll}
                className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors text-sm"
              >
                Clear All
              </button>
            </div> 
          </div>
        </div>

        {/* Conversion Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'encode' ? 'Input' : 'Input'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(inputText, 'Input')}
                  disabled={!inputText}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
                <button
                  onClick={() => setInputText('')}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => {
                setLastEditedField('input');
                setInputText(e.target.value);
              }}
              placeholder={mode === 'encode' ? 'Enter HTML code to encode...' : 'Enter HTML entities to decode...'}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
            />
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Output</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(outputText, 'Output')}
                  disabled={!outputText}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
                <button
                  onClick={() => setOutputText('')}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <textarea
              value={outputText}
              onChange={(e) => handleOutputChange(e.target.value)}
              placeholder={mode === 'encode' ? 'Encoded HTML entities will appear here...' : 'Decoded HTML will appear here...'}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm whitespace-pre-wrap"
            />
          </div>
        </div>

        {/* Sample Texts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Texts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleTexts.map((sample, index) => (
              <button
                key={index}
                onClick={() => {
                  setLastEditedField('input');
                  setInputText(mode === 'encode' ? sample.decoded : sample.encoded);
                }}
                className="text-left p-4 bg-gray-100 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <div className="font-semibold text-gray-900 mb-2">{sample.name}</div>
                <div className="text-sm text-gray-600 font-mono truncate">
                  {mode === 'encode' ? sample.decoded : sample.encoded}
                </div>
              </button>
            ))}
          </div>
        </div>

        <hr className="my-5" />

        {/* Information Section */}
        <div>
          <h3>How to Use This HTML Encoder/Decoder</h3>
          <p>
            This HTML encoder/decoder helps you safely encode HTML content to entities or decode HTML entities back to readable text. 
            Essential for web development, content management, and preventing XSS attacks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-200 p-4 rounded-lg">
            <div className="bg-white rounded-lg p-4">
              <h4>HTML Encoding</h4>
              <p className="text-sm">
                Convert HTML tags and special characters to safe entities. Prevents code injection and ensures proper display in HTML documents.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4>HTML Decoding</h4>
              <p className="text-sm">
                Convert HTML entities back to their original characters. Useful for processing stored HTML data or API responses.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Common HTML Entities</h3>
          <div className="gap-6 mb-6 bg-gray-200 p-4 rounded-lg w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-white rounded-lg p-4">
              <div><span className="font-semibold">&lt;</span> → &amp;lt;</div>
              <div><span className="font-semibold">&gt;</span> → &amp;gt;</div>
              <div><span className="font-semibold">&amp;</span> → &amp;amp;</div>
              <div><span className="font-semibold">&quot;</span> → &amp;quot;</div>
              <div><span className="font-semibold">©</span> → &amp;copy;</div>
              <div><span className="font-semibold">®</span> → &amp;reg;</div>
              <div><span className="font-semibold">™</span> → &amp;trade;</div>
              <div><span className="font-semibold">€</span> → &amp;euro;</div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Use Cases</h3>
          <ul className="list-disc list-outside space-y-2 text-gray-700 mb-6 pl-5">
            <li><strong>Web Development:</strong> Safely display user-generated content without XSS vulnerabilities</li>
            <li><strong>Content Management:</strong> Store and process HTML content in databases and APIs</li>
            <li><strong>Email Templates:</strong> Ensure special characters display correctly in HTML emails</li>
            <li><strong>XML/HTML Processing:</strong> Prepare content for XML parsers and HTML documents</li>
            <li><strong>Data Migration:</strong> Convert between encoded and plain text formats during system migrations</li>
          </ul>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-yellow-900 mb-2">Security Notes</h4>
            <ul className="space-y-1 text-yellow-800 text-sm">
              <li><strong>XSS Prevention:</strong> Always encode user input before displaying in HTML</li>
              <li><strong>Context Matters:</strong> Different contexts (HTML content, attributes, JavaScript) require different encoding</li>
              <li><strong>Validation:</strong> HTML encoding is not a substitute for proper input validation</li>
              <li><strong>Double Encoding:</strong> Be careful not to double-encode already encoded content</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}