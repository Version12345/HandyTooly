'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

export function Base64Converter() {
  const [textInput, setTextInput] = useState('');
  const [base64Output, setBase64Output] = useState('');

  // Text to Base64 encoding
  const encodeTextToBase64 = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
      console.error('Encoding error:', error);
      return 'Error: Unable to encode text';
    }
  };

  // Base64 to text decoding
  const decodeBase64ToText = (base64: string): string => {
    try {
      return decodeURIComponent(escape(atob(base64.trim())));
    } catch (error) {
      console.error('Decoding error:', error);
      return 'Error: Invalid Base64 string';
    }
  };

  // Handle text encoding
  const handleEncodeText = () => {
    if (!textInput.trim()) {
      setBase64Output('');
      return;
    }
    const encoded = encodeTextToBase64(textInput);
    setBase64Output(encoded);
  };

  // Handle Base64 decoding
  const handleDecodeBase64 = () => {
    if (!base64Output.trim()) {
      setTextInput('');
      return;
    }
    const decoded = decodeBase64ToText(base64Output);
    setTextInput(decoded);
  };

  // Copy to clipboard
  const handleCopy = async (text: string, type: string) => {
    await copyToClipboard(text);
    // You can add a toast notification here if available
    console.log(`${type} copied to clipboard`);
  };

  // Sample texts for quick testing
  const sampleTexts = [
    {
      name: 'Simple Text',
      content: 'Hello World!'
    },
    {
      name: 'JSON Data',
      content: '{"name":"John","age":30,"city":"New York"}'
    },
    {
      name: 'HTML Code',
      content: '<div class="container"><h1>Welcome</h1><p>This is a paragraph.</p></div>'
    },
    {
      name: 'Special Characters',
      content: 'Special chars: àáâãäåæçèéêë ñòóôõö ùúûüý 中文 العربية 🌟'
    }
  ];

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.Base64Converter}
      secondaryToolDescription="Perfect for web development, data storage, and API integration."
    >
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2>Conversion Mode</h2>
          <div className="inline-flex rounded-lg bg-gray-100 p-1 text-sm">
            <div className="px-6 py-2 rounded-md font-medium bg-orange-500 text-white shadow-sm">
              Text Converter
            </div>
            <Link
              href="/tools/conversions-and-units/base64-image-converter"
              className="px-6 py-2 rounded-md font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Image Converter
            </Link>
          </div>
        </div>

        {/* Text Conversion Mode */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Text Input */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Text</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(textInput, 'Text')}
                    disabled={!textInput}
                    className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => setTextInput('')}
                    className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text to encode to Base64..."
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
              />
              
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleEncodeText}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                >
                  Encode text to Base64
                </button>
              </div>

              {/* Sample Texts */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Texts</h3>
                <div className="grid grid-cols-1 gap-2">
                  {sampleTexts.map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => setTextInput(sample.content)}
                      className="text-left px-3 py-2 text-sm bg-gray-100 hover:bg-orange-100 rounded transition-colors"
                    >
                      <span className="font-semibold text-gray-900">{sample.name}</span>
                      <div className="text-xs text-gray-600 mt-1 truncate">{sample.content}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Base64 Output */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Base64</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(base64Output, 'Base64')}
                    disabled={!base64Output}
                    className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => setBase64Output('')}
                    className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <textarea
                value={base64Output}
                onChange={(e) => setBase64Output(e.target.value)}
                placeholder="Base64 encoded result will appear here..."
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm break-all"
              />
              
              <div className="mt-4">
                <button
                  onClick={handleDecodeBase64}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                >
                  Decode Base64 to text
                </button>
              </div>
            </div>
          </div>

        <hr className="my-5" />

        {/* Information Section */}
        <div>
          <h3>How to Use This Base64 Converter</h3>
          <p className="text-gray-700 mb-4">
            Base64 encoding is a method of converting binary data into ASCII text format. It&apos;s commonly used in web development, 
            email systems, and data storage where binary data needs to be transmitted or stored as text.
          </p>

          <h3>Text Encoding/Decoding</h3>
          <p>
            Convert regular text to Base64 format or decode Base64 strings back to readable text. 
            Perfect for encoding configuration data, API tokens, or any text that needs to be transmitted safely.
          </p>

          <p className="mt-4">
            <strong>Need to convert images?</strong> Use our dedicated <Link href="/tools/conversions-and-units/base64-image-converter" className="text-orange-500 hover:text-orange-600 underline">Base64 Image Converter</Link> for image file encoding and decoding.
          </p>

          <h3>Common Use Cases</h3>
          <ul className="list-disc list-outside space-y-2 text-gray-700 mb-6 pl-5">
            <li><strong>Web Development:</strong> Embedding small images directly in CSS or HTML using data URIs</li>
            <li><strong>API Integration:</strong> Encoding authentication tokens, configuration data, or binary payloads</li>
            <li><strong>Email Systems:</strong> Encoding attachments and embedded images in email messages</li>
            <li><strong>Data Storage:</strong> Storing binary data in text-based databases or configuration files</li>
            <li><strong>JSON/XML:</strong> Including binary data in text-based data formats</li>
            <li><strong>Security:</strong> Obfuscating sensitive data (though Base64 is NOT encryption)</li>
          </ul>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-yellow-900 mb-2">Important Notes</h4>
            <ul className="space-y-1 text-yellow-800 text-sm">
              <li><strong>Base64 is NOT encryption</strong> - it&apos;s encoding and can be easily decoded</li>
              <li><strong>Size increase:</strong> Base64 encoding increases data size by approximately 33%</li>
              <li><strong>Image limits:</strong> Keep image files under 10MB for optimal performance</li>
              <li><strong>Browser support:</strong> Modern browsers handle Base64 data URIs well for images under 32KB</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}