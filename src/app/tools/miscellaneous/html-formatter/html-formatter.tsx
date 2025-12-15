'use client';

import React, { useState } from 'react';
import { Copy, CheckCircle, Code, FileText, Download } from 'lucide-react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';

interface CopyState {
  [key: string]: boolean;
}

const HtmlFormatter: React.FC = () => {
  const [inputHtml, setInputHtml] = useState('');
  const [formattedHtml, setFormattedHtml] = useState('');
  const [indentationLevel, setIndentationLevel] = useState(2);
  const [encoding, setEncoding] = useState('UTF-8');
  const [stripAttributes, setStripAttributes] = useState(false);
  const [removeScripts, setRemoveScripts] = useState(false);
  const [removeComments, setRemoveComments] = useState(false);
  const [error, setError] = useState<string>('');
  const [copyStates, setCopyStates] = useState<CopyState>({});

  const CHARACTER_LIMIT = 300000;

  const indentationOptions = [
    { value: 2, label: '2 spaces per indent level' },
    { value: 4, label: '4 spaces per indent level' },
    { value: 8, label: '8 spaces per indent level' },
    { value: 1, label: '1 tab per indent level' }
  ];

  const encodingOptions = [
    'UTF-8',
    'UTF-16',
    'ASCII',
    'ISO-8859-1'
  ];

  // Strip attributes from HTML tags
  const stripHtmlAttributes = (html: string): string => {
    return html.replace(/<(\w+)([^>]*?)>/g, (match, tagName) => {
      // Keep only the tag name, remove all attributes
      return `<${tagName}>`;
    });
  };

  // Remove script tags and their content
  const removeScriptTags = (html: string): string => {
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  // Remove HTML comments
  const removeHtmlComments = (html: string): string => {
    return html.replace(/<!--[\s\S]*?-->/g, '');
  };

  // HTML formatting function
  const formatHtml = (html: string, indent: number, shouldStripAttributes: boolean, shouldRemoveScripts: boolean, shouldRemoveComments: boolean): string => {
    if (!html.trim()) return '';

    try {
      let processedHtml = html;
      
      // Remove comments if requested
      if (shouldRemoveComments) {
        processedHtml = removeHtmlComments(processedHtml);
      }
      
      // Remove script tags if requested
      if (shouldRemoveScripts) {
        processedHtml = removeScriptTags(processedHtml);
      }
      
      // Strip attributes if requested
      if (shouldStripAttributes) {
        processedHtml = stripHtmlAttributes(processedHtml);
      }
      
      let formatted = '';
      let indentLevel = 0;
      const indentChar = indent === 1 ? '\t' : ' '.repeat(indent);
      
      // Remove extra whitespace and normalize
      processedHtml = processedHtml.replace(/>\s+</g, '><').trim();
      
      // Split by tags
      const tokens = processedHtml.split(/(<[^>]*>)/);
      
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        
        if (!token) continue;
        
        if (token.startsWith('<')) {
          // It's a tag
          const isClosingTag = token.startsWith('</');
          const isSelfClosing = token.endsWith('/>') || 
            /^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/.test(token.toLowerCase());
          
          if (isClosingTag) {
            indentLevel = Math.max(0, indentLevel - 1);
          }
          
          if (formatted && !formatted.endsWith('\n')) {
            formatted += '\n';
          }
          
          formatted += indentChar.repeat(indentLevel) + token;
          
          if (!isClosingTag && !isSelfClosing) {
            indentLevel++;
          }
          
          // Add newline after tag
          if (i < tokens.length - 1 && tokens[i + 1] && !tokens[i + 1].startsWith('<')) {
            formatted += '\n' + indentChar.repeat(indentLevel);
          }
        } else {
          // It's content
          const content = token.trim();
          if (content) {
            formatted += content;
          }
        }
      }
      
      return formatted;
    } catch {
      throw new Error('Invalid HTML format');
    }
  };

  const handleFormatHtml = () => {
    try {
      setError('');
      if (!inputHtml.trim()) {
        setError('Please enter HTML content to format');
        return;
      }
      
      if (inputHtml.length > CHARACTER_LIMIT) {
        setError(`HTML content exceeds the ${CHARACTER_LIMIT} character limit. Current length: ${inputHtml.length} characters.`);
        return;
      }
      
      const formatted = formatHtml(inputHtml, indentationLevel, stripAttributes, removeScripts, removeComments);
      setFormattedHtml(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to format HTML');
      setFormattedHtml('');
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadFormattedHtml = () => {
    if (!formattedHtml) {
      setError('No formatted HTML to download');
      return;
    }

    const blob = new Blob([formattedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInputHtml('');
    setFormattedHtml('');
    setError('');
    setCopyStates({});
  };

  return (
    <ToolLayout
      toolCategory={ToolNameLists.HtmlFormatter}
      secondaryToolDescription={`Maximum input length is ${CHARACTER_LIMIT} characters.`}
      educationContent={educationalContent}
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        {/* Input Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Copy-paste your HTML here
            </label>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${inputHtml.length > CHARACTER_LIMIT ? 'text-red-600' : 'text-gray-500'}`}>
                {inputHtml.length}/{CHARACTER_LIMIT} characters
              </span>
              <button
                onClick={() => copyToClipboard(inputHtml, 'input')}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                disabled={!inputHtml.trim()}
              >
                {copyStates.input ? (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Copy
              </button>
            </div>
          </div>
          <textarea
            value={inputHtml}
            onChange={(e) => setInputHtml(e.target.value)}
            placeholder="Copy-paste your HTML here"
            className={`w-full h-48 p-3 border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              inputHtml.length > CHARACTER_LIMIT ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
        </div>

        {/* Configuration Options */}
        <div className="space-y-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Encoding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File encoding
              </label>
              <select
                value={encoding}
                onChange={(e) => setEncoding(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {encodingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Indentation Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indentation level
              </label>
              <select
                value={indentationLevel}
                onChange={(e) => setIndentationLevel(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {indentationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Processing Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Processing Options:</h4>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="stripAttributes"
                checked={stripAttributes}
                onChange={(e) => setStripAttributes(e.target.checked)}
                className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 focus:ring-2"
              />
              <label htmlFor="stripAttributes" className="text-sm font-medium text-gray-700">
                Strip all styles and attributes from HTML tags
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="removeScripts"
                checked={removeScripts}
                onChange={(e) => setRemoveScripts(e.target.checked)}
                className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 focus:ring-2"
              />
              <label htmlFor="removeScripts" className="text-sm font-medium text-gray-700">
                Remove script tags and their content
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="removeComments"
                checked={removeComments}
                onChange={(e) => setRemoveComments(e.target.checked)}
                className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 focus:ring-2"
              />
              <label htmlFor="removeComments" className="text-sm font-medium text-gray-700">
                Remove HTML comments
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleFormatHtml}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center gap-2"
          >
            <Code className="w-4 h-4" />
            Format HTML
          </button>
          <button
            onClick={downloadFormattedHtml}
            disabled={!formattedHtml}
            className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={clearAll}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Clear All
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Formatted Output */}
        {formattedHtml && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Formatted HTML:</h3>
              <button
                onClick={() => copyToClipboard(formattedHtml, 'output')}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {copyStates.output ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                Copy Formatted HTML
              </button>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto max-h-96">
                {formattedHtml}
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default HtmlFormatter;

const educationalContent = (
  <div>
    <h3>What Is HTML</h3>
    <p>HTML is the core language used to build web pages. It gives structure to text, images, links, forms, and many other elements. Browsers read HTML and turn it into the pages people see and use each day. The language works through tags that mark each part of the page, which makes the content clear and organized.</p>

    <h3>Early History of HTML</h3>
    <p>HTML began in 1991 when Tim Berners-Lee created the first version to share documents on the early web. The language started with a small set of simple tags. These early pages focused on text and basic links. As more people came online, the need for stronger page structure grew, which pushed the language forward.</p>

    <h3>Growth Over Time</h3>
    <p>HTML gained new features as the web expanded. Tables, images, and forms arrived in the mid 1990s, which opened the door to richer sites. Later versions added audio, video, and cleaner rules for structure. HTML5 became the modern standard in 2014, bringing strong support for media, graphics, and apps built directly in the browser.</p>

    <h3>How This Tool Works</h3>
    <p>The HTML Formatter cleans and organizes HTML with automatic indentation and clear spacing. It lets you pick the indent size, such as two, four, or eight spaces, or tabs. You can format the code in place, open the result in a new window, or download a formatted file. The tool keeps all text between tags so the original content stays intact.</p>

    <h3>Best Practices</h3>
    <p>Use a consistent indent style during development to keep your team on the same page. Clean HTML helps you find missing or broken tags faster during debugging. Minified files work well in production, but formatted HTML supports clear development and faster updates. Well organized code also shortens maintenance time and improves long term understanding.</p>
  </div>
);