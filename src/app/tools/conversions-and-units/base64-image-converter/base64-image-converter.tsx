'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

export function Base64ImageConverter() {
  const [base64Output, setBase64Output] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.Base64ImageConverter}
      secondaryToolDescription="Perfect for web development, data URIs, and image encoding."
      educationContent={educationContent}
    >
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2>Conversion Mode</h2>
          <div className="inline-flex rounded-lg bg-gray-100 p-1 text-sm">
            <Link
              href="/tools/conversions-and-units/base64-converter"
              className="px-6 py-2 rounded-md font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              Text Converter
            </Link>
            <div className="px-6 py-2 rounded-md font-medium bg-orange-500 text-white shadow-sm">
              Image Converter
            </div>
          </div>
        </div>

        {/* Image Conversion Mode */}
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

        {/* Clear All Button */}
        {(selectedFile || base64Output || imagePreview) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3>How to Use This Base64 Image Converter</h3>
    <p className="text-gray-700 mb-4">
      Convert image files to Base64 format or decode Base64 strings back to downloadable images. 
      Base64 encoding allows you to embed images directly in CSS, HTML, or data URIs.
    </p>

    <h3>Image to Base64</h3>
    <p>
      Upload PNG, JPG, GIF, or other image files to convert them into Base64 encoded strings. 
      Perfect for creating data URIs, embedding images in CSS, or storing images in databases.
    </p>

    <h3>Base64 to Image</h3>
    <p>
      Paste a Base64 string to convert it back to a downloadable image file. 
      Supports both raw Base64 data and complete data URLs with MIME type prefixes.
    </p>

    <p className="mt-4">
      <strong>Need to convert text?</strong> Use our dedicated <Link href="/tools/conversions-and-units/base64-converter" className="text-orange-500 hover:text-orange-600 underline">Base64 Text Converter</Link> for text encoding and decoding.
    </p>

    <h3>Common Use Cases</h3>
    <ul className="list-disc list-outside space-y-2 text-gray-700 mb-6 pl-5">
      <li><strong>Web Development:</strong> Embedding small images directly in CSS or HTML using data URIs</li>
      <li><strong>Email Templates:</strong> Including images in email HTML without external dependencies</li>
      <li><strong>API Integration:</strong> Sending images as Base64 strings in JSON payloads</li>
      <li><strong>Database Storage:</strong> Storing small images as text in databases</li>
      <li><strong>Icon Sets:</strong> Converting SVG icons to Base64 for CSS background images</li>
      <li><strong>Mobile Apps:</strong> Bundling images as Base64 strings in app configurations</li>
    </ul>

    <div className="bg-yellow-50 rounded-lg p-4">
      <h4 className="text-lg font-semibold text-yellow-900 mb-2">Image Guidelines</h4>
      <ul className="space-y-1 text-yellow-800 text-sm">
        <li><strong>File Size:</strong> Keep images under 10MB for optimal performance</li>
        <li><strong>Web Use:</strong> Base64 images work best for small icons and graphics (under 32KB)</li>
        <li><strong>Size Increase:</strong> Base64 encoding increases file size by approximately 33%</li>
        <li><strong>Supported Formats:</strong> PNG, JPG, GIF, WebP, SVG, and other common image formats</li>
        <li><strong>Browser Support:</strong> Modern browsers handle Base64 data URIs well for reasonable file sizes</li>
      </ul>
    </div>
  </div>
);