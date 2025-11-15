'use client';
import React, { useState, useRef } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

type ConversionMode = 'text' | 'image';

export function Base64Converter() {
  const [mode, setMode] = useState<ConversionMode>('text');
  const [textInput, setTextInput] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, GIF, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setBase64Output(result.split(',')[1] || ''); // Remove data URL prefix
    };
    reader.readAsDataURL(file);
  };

  // Handle Base64 to Image conversion
  const handleBase64ToImage = () => {
    if (!base64Output.trim()) return;

    try {
      let base64Data = base64Output.trim();
      
      // Remove data URL prefix if present
      if (base64Data.startsWith('data:')) {
        base64Data = base64Data.split(',')[1] || base64Data;
      }

      // Validate Base64 format
      atob(base64Data);
      
      // Create data URL for image preview
      const dataUrl = `data:image/png;base64,${base64Data}`;
      setImagePreview(dataUrl);
      setSelectedFile(null); // Clear file selection when converting from Base64
    } catch (error) {
      alert('Invalid Base64 string. Please check your input.');
      console.error('Base64 conversion error:', error);
    }
  };

  // Download image from Base64
  const downloadImage = () => {
    if (!imagePreview || !base64Output) return;

    try {
      let base64Data = base64Output.trim();
      
      // Remove data URL prefix if present
      if (base64Data.startsWith('data:')) {
        base64Data = base64Data.split(',')[1] || base64Data;
      }

      // Convert Base64 to blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      // Detect image type from Base64 header or default to PNG
      let mimeType = 'image/png';
      let extension = 'png';
      
      // Try to detect image type from Base64 signature
      const signature = base64Data.substring(0, 20);
      if (signature.startsWith('/9j/')) {
        mimeType = 'image/jpeg';
        extension = 'jpg';
      } else if (signature.startsWith('iVBORw0KGgo')) {
        mimeType = 'image/png';
        extension = 'png';
      } else if (signature.startsWith('R0lGODlh') || signature.startsWith('R0lGODdh')) {
        mimeType = 'image/gif';
        extension = 'gif';
      }

      const blob = new Blob([byteArray], { type: mimeType });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted-image.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error downloading image. Please check your Base64 data.');
      console.error('Download error:', error);
    }
  };

  // Clear all inputs
  const clearAll = () => {
    setTextInput('');
    setBase64Output('');
    setSelectedFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Mode</h2>
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setMode('text')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'text'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Text Converter
            </button>
            <button
              onClick={() => setMode('image')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'image'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Image Converter
            </button>
          </div>
        </div>

        {mode === 'text' ? (
          /* Text Conversion Mode */
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
        ) : (
          /* Image Conversion Mode */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image to Base64 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Image to Base64</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <div className="space-y-4">
                  <div className="text-4xl text-gray-400">📁</div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Choose an image file</p>
                    <p className="text-sm text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                  >
                    Select Image
                  </button>
                </div>
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">File Information</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Name:</strong> {selectedFile.name}</p>
                    <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                    <p><strong>Type:</strong> {selectedFile.type}</p>
                  </div>
                </div>
              )}

              {imagePreview && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Image Preview</h3>
                  <div className="border border-gray-300 rounded-lg p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-auto max-h-32 mx-auto rounded"
                    />
                  </div>
                </div>
              )}

              {base64Output && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">Base64 Output</h3>
                    <button
                      onClick={() => handleCopy(base64Output, 'Base64')}
                      className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <textarea
                    value={base64Output}
                    readOnly
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm break-all bg-gray-50"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Length: {base64Output.length.toLocaleString()} characters
                  </p>
                </div>
              )}
            </div>

            {/* Base64 to Image */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Base64 to Image</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste Base64 String
                  </label>
                  <textarea
                    value={base64Output}
                    onChange={(e) => setBase64Output(e.target.value)}
                    placeholder="Paste Base64 string here (with or without data:image prefix)..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleBase64ToImage}
                    disabled={!base64Output.trim()}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Convert to Image
                  </button>
                  <button
                    onClick={() => setBase64Output('')}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Clear
                  </button>
                </div>

                {imagePreview && base64Output && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Converted Image</h3>
                    <div className="border border-gray-300 rounded-lg p-2 mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Converted"
                        className="max-w-full h-auto max-h-48 mx-auto rounded"
                      />
                    </div>
                    <button
                      onClick={downloadImage}
                      className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                    >
                      Download Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        )}

        {/* Clear All Button for Image Mode */}
        {mode === 'image' && (selectedFile || base64Output || imagePreview) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

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

          <h3>Image Conversion</h3>
          <p>
            Convert image files to Base64 format or decode Base64 back to downloadable images. 
            Upload PNG, JPG, GIF files or paste Base64 strings to convert bidirectionally.
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