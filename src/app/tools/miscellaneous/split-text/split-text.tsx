'use client';
import React, { useState, useMemo } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { importFromFile, exportToFile } from '@/utils/fileOperations';

type SplitterMode = 'character' | 'regex' | 'length' | 'parts';

export function SplitText() {
  const [inputText, setInputText] = useState('');
  const [splitterMode, setSplitterMode] = useState<SplitterMode>('character');
  const [splitCharacter, setSplitCharacter] = useState(' ');
  const [regexPattern, setRegexPattern] = useState('\\s+');
  const [splitLength, setSplitLength] = useState(2);
  const [numberOfParts, setNumberOfParts] = useState(4);
  const [joinCharacter, setJoinCharacter] = useState('\\n');
  const [leftSymbol, setLeftSymbol] = useState('');
  const [rightSymbol, setRightSymbol] = useState('');

  // Calculate split chunks
  const chunks = useMemo((): string[] => {
    if (!inputText) return [];

    try {
      let splitArray: string[] = [];

      switch (splitterMode) {
        case 'character':
          if (splitCharacter) {
            splitArray = inputText.split(splitCharacter);
          } else {
            splitArray = inputText.split('');
          }
          break;

        case 'regex':
          if (regexPattern) {
            const regex = new RegExp(regexPattern, 'g');
            splitArray = inputText.split(regex);
          } else {
            splitArray = [inputText];
          }
          break;

        case 'length':
          if (splitLength > 0) {
            for (let i = 0; i < inputText.length; i += splitLength) {
              splitArray.push(inputText.slice(i, i + splitLength));
            }
          } else {
            splitArray = [inputText];
          }
          break;

        case 'parts':
          if (numberOfParts > 0) {
            const partLength = Math.ceil(inputText.length / numberOfParts);
            for (let i = 0; i < inputText.length; i += partLength) {
              splitArray.push(inputText.slice(i, i + partLength));
            }
          } else {
            splitArray = [inputText];
          }
          break;

        default:
          splitArray = [inputText];
      }

      // Filter out empty strings unless they're meaningful
      if (splitterMode !== 'length' && splitterMode !== 'parts') {
        splitArray = splitArray.filter(chunk => chunk !== '');
      }

      return splitArray;
    } catch (error) {
      console.error('Split error:', error);
      return [inputText]; // Return original text if error
    }
  }, [inputText, splitterMode, splitCharacter, regexPattern, splitLength, numberOfParts]);

  // Generate output with wrappers and join character
  const outputText = useMemo(() => {
    if (chunks.length === 0) return '';
    
    const wrappedChunks = chunks.map(chunk => `${leftSymbol}${chunk}${rightSymbol}`);
    const actualJoinChar = joinCharacter.replace('\\n', '\n').replace('\\t', '\t');
    return wrappedChunks.join(actualJoinChar);
  }, [chunks, leftSymbol, rightSymbol, joinCharacter]);

  // Handle file import using utility
  const handleImportFromFile = () => {
    importFromFile('.txt,.md,.html,.css,.js,.json,.xml,.csv', (content) => {
      setInputText(content);
    });
  };



  // Sample texts for quick testing
  const sampleTexts = [
    {
      name: 'Words',
      content: 'foo bar baz qux quux quuz corge grault garply waldo fred plugh xyzzy thud'
    },
    {
      name: 'CSV Data',
      content: 'name,age,city\nJohn,25,New York\nJane,30,Los Angeles\nBob,22,Chicago'
    },
    {
      name: 'Sentence',
      content: 'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet.'
    },
    {
      name: 'Email List',
      content: 'john@example.com, jane@test.org, bob@company.net, alice@domain.com'
    }
  ];

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.SplitText}
      secondaryToolDescription="Perfect for data processing, text manipulation, and content organization."
      educationContent={educationContent}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Text */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Input Text</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleImportFromFile}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Import from file
                </button>
                <button
                  onClick={() => exportToFile(inputText, 'input-text.txt')}
                  disabled={!inputText}
                  className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export
                </button>
                <button
                  onClick={() => copyToClipboard(inputText)}
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

          {/* Split Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Split Results</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToFile(outputText, 'split-results.txt')}
                  disabled={!outputText}
                  className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export
                </button>
                <button
                  onClick={() => copyToClipboard(outputText)}
                  disabled={!outputText}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <textarea
              value={outputText}
              readOnly
              placeholder="Split results will appear here..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 resize-none font-mono text-sm"
            />
          </div>
        </div>

        {/* Tool Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🛠 Tool Options</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Splitter Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Splitter Options</h3>
              <div className="space-y-4">
                {/* Split by Character */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="splitterMode"
                      value="character"
                      checked={splitterMode === 'character'}
                      onChange={(e) => setSplitterMode(e.target.value as SplitterMode)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Split by a Character</span>
                  </label>
                  <input
                    type="text"
                    value={splitCharacter}
                    onChange={(e) => setSplitCharacter(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="Enter character"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use this split character. (Space by default.)
                  </p>
                </div>

                {/* Split by Regex */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="splitterMode"
                      value="regex"
                      checked={splitterMode === 'regex'}
                      onChange={(e) => setSplitterMode(e.target.value as SplitterMode)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Split by a Regular Expression</span>
                  </label>
                  <input
                    type="text"
                    value={regexPattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
                    placeholder="\\s+"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use this regular expression. (Multiple spaces by default.)
                  </p>
                </div>

                {/* Split by Length */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="splitterMode"
                      value="length"
                      checked={splitterMode === 'length'}
                      onChange={(e) => setSplitterMode(e.target.value as SplitterMode)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Split by Length</span>
                  </label>
                  <input
                    type="number"
                    value={splitLength}
                    onChange={(e) => setSplitLength(parseInt(e.target.value) || 1)}
                    min="1"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use this length for the pieces.
                  </p>
                </div>

                {/* Split in Multiple Parts */}
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="splitterMode"
                      value="parts"
                      checked={splitterMode === 'parts'}
                      onChange={(e) => setSplitterMode(e.target.value as SplitterMode)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Split in Multiple Parts</span>
                  </label>
                  <input
                    type="number"
                    value={numberOfParts}
                    onChange={(e) => setNumberOfParts(parseInt(e.target.value) || 1)}
                    min="1"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="4"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use this number of equal parts.
                  </p>
                </div>
              </div>
            </div>

            {/* Joiner Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Joiner Options</h3>
              <div>
                <input
                  type="text"
                  value={joinCharacter}
                  onChange={(e) => setJoinCharacter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder="\\n"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use this join character in the output (newline by default.)
                </p>
              </div>
            </div>

            {/* Substring Wrappers */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Substring Wrappers</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={leftSymbol}
                  onChange={(e) => setLeftSymbol(e.target.value)}
                  placeholder="Left Symbol"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <input
                  type="text"
                  value={rightSymbol}
                  onChange={(e) => setRightSymbol(e.target.value)}
                  placeholder="Right Symbol"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <span>Left symbol.</span>
                <span>Right symbol.</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mt-0.5">i</div>
                With this option, you can wrap the split substrings in brackets, quotes, and other symbols.
              </p>
            </div>
          </div>
        </div>

        {/* Sample Texts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Texts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {sampleTexts.map((sample, index) => (
              <button
                key={index}
                onClick={() => setInputText(sample.content)}
                className="text-left p-3 bg-gray-100 hover:bg-orange-100 rounded transition-colors"
              >
                <div className="font-semibold text-gray-900 text-sm">{sample.name}</div>
                <div className="text-xs text-gray-600 mt-1 line-clamp-2">{sample.content}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3>About Split Text Tool</h3>
    <p>
      The Split Text Tool allows you to break down large text blocks into smaller, manageable chunks using various splitting methods. 
      This is particularly useful for data processing, content organization, and text manipulation tasks.
    </p>
    <h4 className="font-semibold text-gray-800">Splitting Methods:</h4>
    <ul className="list-disc list-inside">
      <li><strong>Character Split:</strong> Split text at specific characters (spaces, commas, etc.)</li>
      <li><strong>Regex Split:</strong> Use regular expressions for advanced pattern matching</li>
      <li><strong>Length Split:</strong> Divide text into fixed-length chunks</li>
      <li><strong>Parts Split:</strong> Split text into a specific number of equal parts</li>
    </ul>
    <h4 className="font-semibold text-gray-800">Output Options:</h4>
    <ul className="list-disc list-inside">
      <li><strong>Join Character:</strong> Choose how to separate the chunks in the output</li>
      <li><strong>Wrappers:</strong> Add symbols around each chunk (quotes, brackets, etc.)</li>
    </ul>
  </div>
);