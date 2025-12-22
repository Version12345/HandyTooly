'use client';
import React, { useState, useMemo } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

interface FindReplaceStats {
  totalMatches: number;
  replacedMatches: number;
  totalLines: number;
  totalCharacters: number;
}

export function FindAndReplace() {
  const [inputText, setInputText] = useState('');
  const [replacedText, setReplacedText] = useState('');
  const [findPattern, setFindPattern] = useState('');
  const [replacePattern, setReplacePattern] = useState('');
  const [isRegex, setIsRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [globalReplace, setGlobalReplace] = useState(true);

  // Calculate statistics
  const stats = useMemo((): FindReplaceStats => {
    if (!inputText) {
      return {
        totalMatches: 0,
        replacedMatches: 0,
        totalLines: inputText.split('\n').length,
        totalCharacters: inputText.length
      };
    }

    let matchCount = 0;
    let replacedCount = 0;

    if (findPattern) {
      try {
        const flags = `${globalReplace ? 'g' : ''}${!caseSensitive ? 'i' : ''}`;
        
        if (isRegex) {
          const regex = new RegExp(findPattern, flags);
          const matches = inputText.match(regex);
          matchCount = matches ? matches.length : 0;
          
          if (replacedText) {
            const afterReplace = inputText.replace(regex, replacePattern || '');
            const remainingMatches = afterReplace.match(regex);
            const remainingCount = remainingMatches ? remainingMatches.length : 0;
            replacedCount = matchCount - remainingCount;
          }
        } else {
          const escapedPattern = findPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedPattern, flags);
          const matches = inputText.match(regex);
          matchCount = matches ? matches.length : 0;
          
          if (replacedText) {
            const afterReplace = inputText.replace(regex, replacePattern || '');
            const remainingMatches = afterReplace.match(regex);
            const remainingCount = remainingMatches ? remainingMatches.length : 0;
            replacedCount = matchCount - remainingCount;
          }
        }
      } catch (error) {
        // Invalid regex
        matchCount = 0;
        replacedCount = 0;
      }
    }

    return {
      totalMatches: matchCount,
      replacedMatches: replacedCount,
      totalLines: inputText.split('\n').length,
      totalCharacters: inputText.length
    };
  }, [inputText, replacedText, findPattern, replacePattern, isRegex, caseSensitive, globalReplace]);

  // Perform find and replace operation
  const performReplace = () => {
    if (!inputText || !findPattern) {
      setReplacedText('');
      return;
    }

    try {
      const flags = `${globalReplace ? 'g' : ''}${!caseSensitive ? 'i' : ''}`;
      
      let result: string;
      
      if (isRegex) {
        const regex = new RegExp(findPattern, flags);
        result = inputText.replace(regex, replacePattern || '');
      } else {
        const escapedPattern = findPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedPattern, flags);
        result = inputText.replace(regex, replacePattern || '');
      }
      
      setReplacedText(result);
    } catch (error) {
      console.error('Replace error:', error);
      setReplacedText('Error: Invalid pattern');
    }
  };

  // Import text from file
  const importFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.html,.css,.js,.json,.xml,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setInputText(text);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Save text to file
  const saveToFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy
  const handleCopy = async (text: string, type: string) => {
    await copyToClipboard(text);
    console.log(`${type} copied to clipboard`);
  };

  // Clear inputs
  const clearInput = () => {
    setInputText('');
    setReplacedText('');
  };

  const clearReplace = () => {
    setReplacedText('');
  };

  // Sample patterns for quick testing
  const samplePatterns = [
    {
      name: 'Remove Extra Spaces',
      find: '\\s+',
      replace: ' ',
      regex: true,
      description: 'Replace multiple spaces with single space'
    },
    {
      name: 'Email Format',
      find: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      replace: '[EMAIL]',
      regex: true,
      description: 'Replace email addresses with [EMAIL]'
    },
    {
      name: 'Phone Numbers',
      find: '\\(\\d{3}\\)\\s*\\d{3}-\\d{4}',
      replace: '[PHONE]',
      regex: true,
      description: 'Replace phone numbers with [PHONE]'
    },
    {
      name: 'Remove HTML Tags',
      find: '<[^>]*>',
      replace: '',
      regex: true,
      description: 'Remove all HTML tags'
    },
    {
      name: 'Line Breaks to Spaces',
      find: '\\n',
      replace: ' ',
      regex: true,
      description: 'Replace line breaks with spaces'
    }
  ];

  // Sample texts
  const sampleTexts = [
    {
      name: 'Mixed Content',
      content: `Hello World!\n\nThis   is   a    sample    text with multiple   spaces.\n\nContact us at: support@example.com or call (555) 123-4567.\n\nVisit our website: <a href="https://example.com">Example.com</a>\n\n<p>This paragraph has <strong>HTML tags</strong>.</p>`
    },
    {
      name: 'Code Snippet',
      content: `function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}`
    },
    {
      name: 'Email List',
      content: `john.doe@example.com\nalice.smith@company.org\nbob.johnson@website.net\ncontact@business.com`
    }
  ];

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.FindAndReplace}
      secondaryToolDescription="Perfect for text editing, data cleaning, and pattern replacement."
      educationContent={educationContent}
    >
      <div className="space-y-6">
        {/* Statistics */}
        {(inputText || findPattern) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-2xl font-bold text-orange-600">{stats.totalMatches}</div>
                <div className="text-sm text-gray-600">Matches Found</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-2xl font-bold text-green-600">{stats.replacedMatches}</div>
                <div className="text-sm text-gray-600">Replaced</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-2xl font-bold text-blue-600">{stats.totalLines}</div>
                <div className="text-sm text-gray-600">Total Lines</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-2xl font-bold text-purple-600">{stats.totalCharacters}</div>
                <div className="text-sm text-gray-600">Characters</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Text */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Input Text</h2>
              <div className="flex gap-2">
                <button
                  onClick={importFromFile}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Import from file
                </button>
                <button
                  onClick={() => saveToFile(inputText, 'input-text.txt')}
                  disabled={!inputText}
                  className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export
                </button>
                <button
                  onClick={() => handleCopy(inputText, 'Input text')}
                  disabled={!inputText}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter or paste your text here..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
            />

            {/* Sample Texts */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Texts</h3>
              <div className="space-y-2">
                {sampleTexts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(sample.content)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-orange-100 rounded transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Replaced Text */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Replaced Text</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => saveToFile(replacedText, 'replaced-text.txt')}
                  disabled={!replacedText}
                  className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export
                </button>
                <button
                  onClick={() => handleCopy(replacedText, 'Replaced text')}
                  disabled={!replacedText}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <textarea
              value={replacedText}
              readOnly
              placeholder="Replaced text will appear here..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 resize-none font-mono text-sm"
            />
          </div>
        </div>

        {/* Tool Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🛠 Tool Options</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Text */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Search Text</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={!isRegex}
                      onChange={() => setIsRegex(false)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Find This Pattern in Text</span>
                  </label>
                  <input
                    type="text"
                    value={!isRegex ? findPattern : ''}
                    onChange={(e) => {
                      if (!isRegex) setFindPattern(e.target.value);
                    }}
                    placeholder="Text"
                    disabled={isRegex}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the text pattern that you want to replace.
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={isRegex}
                      onChange={() => setIsRegex(true)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Find a Pattern Using a RegExp</span>
                  </label>
                  <input
                    type="text"
                    value={isRegex ? findPattern : ''}
                    onChange={(e) => {
                      if (isRegex) setFindPattern(e.target.value);
                    }}
                    placeholder="Regex"
                    disabled={!isRegex}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono disabled:bg-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the regular expression that you want to replace.
                  </p>
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={caseSensitive}
                      onChange={(e) => setCaseSensitive(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm text-gray-700">Case sensitive</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={globalReplace}
                      onChange={(e) => setGlobalReplace(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm text-gray-700">Replace all occurrences</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Replace Text */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Replace Text</h3>
              
              <div>
                <input
                  type="text"
                  value={replacePattern}
                  onChange={(e) => setReplacePattern(e.target.value)}
                  placeholder="New text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the pattern to use for replacement.
                </p>
              </div>

              <div className="mt-4">
                <button
                  onClick={performReplace}
                  disabled={!inputText || !findPattern}
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Find & Replace
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={clearInput}
                  className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Clear Input
                </button>
                <button
                  onClick={clearReplace}
                  className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Clear Output
                </button>
              </div>
            </div>
          </div>

          {/* Sample Patterns */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Sample Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {samplePatterns.map((pattern, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFindPattern(pattern.find);
                    setReplacePattern(pattern.replace);
                    setIsRegex(pattern.regex);
                  }}
                  className="text-left p-3 bg-gray-100 hover:bg-orange-100 rounded transition-colors"
                >
                  <div className="font-semibold text-gray-900 text-sm">{pattern.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{pattern.description}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    Find: {pattern.find} → Replace: {pattern.replace || '(empty)'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3>About Find and Replace Tool</h3>
    <p>
      This tool allows you to search for specific text patterns and replace them with new text. You can choose to make the search case-sensitive, use regular expressions, and replace all occurrences at once.
    </p>

    <h3>Use Cases</h3>
    <ul>
      <li>Editing documents by quickly replacing phrases or words.</li>
      <li>Cleaning up data by removing unwanted characters or formatting.</li>
      <li>Updating code snippets by changing variable names or function calls.</li>
      <li>Standardizing text formats across large documents.</li>
    </ul>
  </div>
)