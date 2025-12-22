'use client';
import React, { useState, useMemo } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { exportToFile, importFromFile } from '@/utils/fileOperations';

type JoinerMode = 'character' | 'newline' | 'custom' | 'none';

export function JoinText() {
  const [inputText, setInputText] = useState('foo\nbar\nbaz\nqux\nquux\nquuz\ncorge\ngrault\ngarply\nwaldo\nfred\nplugh\nxyzzy\nthud');
  const [joinerMode, setJoinerMode] = useState<JoinerMode>('newline');
  const [joinCharacter, setJoinCharacter] = useState(' ');
  const [customSeparator, setCustomSeparator] = useState('');
  const [leftWrapper, setLeftWrapper] = useState('');
  const [rightWrapper, setRightWrapper] = useState('');
  const [addLineNumbers, setAddLineNumbers] = useState(false);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);

  // Parse input text into array of lines
  const parsedTexts = useMemo((): string[] => {
    if (!inputText.trim()) return [];
    
    let texts = inputText.split('\n');
    
    // Remove empty lines if option is enabled
    if (removeEmptyLines) {
      texts = texts.filter(text => text.trim() !== '');
    }
    
    return texts;
  }, [inputText, removeEmptyLines]);

  // Generate joined output
  const joinedText = useMemo(() => {
    if (parsedTexts.length === 0) return '';
    
    let separator = '';
    
    switch (joinerMode) {
      case 'character':
        separator = joinCharacter;
        break;
      case 'newline':
        separator = '\n';
        break;
      case 'custom':
        separator = customSeparator.replace('\\n', '\n').replace('\\t', '\t');
        break;
      case 'none':
        separator = '';
        break;
      default:
        separator = '\n';
    }
    
    // Apply wrappers and line numbers
    const processedTexts = parsedTexts.map((text, index) => {
      let processedText = text.trim(); // Trim to remove extra spaces
      
      // Add line numbers if enabled
      if (addLineNumbers) {
        processedText = `${index + 1}. ${processedText}`;
      }
      
      // Add wrappers
      processedText = `${leftWrapper}${processedText}${rightWrapper}`;
      
      return processedText;
    });
    
    return processedTexts.join(separator + ' ');
  }, [parsedTexts, joinerMode, joinCharacter, customSeparator, leftWrapper, rightWrapper, addLineNumbers]);

  // Handle file import
  const handleImportFromFile = () => {
    importFromFile('.txt,.md,.html,.css,.js,.json,.xml,.csv', (content) => {
      setInputText(content);
    });
  };

  // Handle save as
  const handleSaveAs = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear input
  const clearInput = () => {
    setInputText('');
  };

  // Sample text sets for quick testing
  const sampleTextSets = [
    {
      name: 'Words',
      text: 'foo\nbar\nbaz\nqux\nquux\nquuz\ncorge\ngrault\ngarply\nwaldo\nfred\nplugh\nxyzzy\nthud'
    },
    {
      name: 'Names',
      text: 'John Smith\nJane Doe\nBob Johnson\nAlice Brown\nCharlie Davis'
    },
    {
      name: 'Cities',
      text: 'New York\nLos Angeles\nChicago\nHouston\nPhoenix\nPhiladelphia'
    },
    {
      name: 'Programming Languages',
      text: 'JavaScript\nPython\nJava\nC++\nGo\nRust\nTypeScript'
    }
  ];

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.JoinText}
      secondaryToolDescription="Perfect for combining data, creating lists, and assembling structured text."
      educationContent={educationContent}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Texts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Text Pieces</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleImportFromFile}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Import from file
                </button>
                <button
                  onClick={() => exportToFile(inputText, 'input-text.txt')}
                  disabled={!inputText.trim()}
                  className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export
                </button>
                <button
                  onClick={() => copyToClipboard(inputText)}
                  disabled={!inputText.trim()}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text pieces (one per line)..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={clearInput}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Sample Text Sets */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Text Sets</h3>
              <div className="space-y-2">
                {sampleTextSets.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(sample.text)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-orange-100 rounded transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{sample.name}</span>
                    <div className="text-xs text-gray-600 mt-1">
                      {sample.text.split('\n').slice(0, 3).join(', ')}{sample.text.split('\n').length > 3 ? '...' : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Joined Result */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Joined Result</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveAs(joinedText, 'joined-result.txt')}
                  disabled={!joinedText}
                  className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export
                </button>
                <button
                  onClick={() => copyToClipboard(joinedText)}
                  disabled={!joinedText}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <textarea
              value={joinedText}
              readOnly
              placeholder="Joined text will appear here..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 resize-none font-mono text-sm"
            />
            
            <div className="mt-2 text-xs text-gray-500">
              {parsedTexts.length} piece{parsedTexts.length !== 1 ? 's' : ''} • {joinedText.length} characters
            </div>
          </div>
        </div>

        {/* Tool Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🛠 Tool Options</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Joiner Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Joiner Options</h3>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="joinerMode"
                      value="newline"
                      checked={joinerMode === 'newline'}
                      onChange={(e) => setJoinerMode(e.target.value as JoinerMode)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Join with New Lines</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="joinerMode"
                      value="character"
                      checked={joinerMode === 'character'}
                      onChange={(e) => setJoinerMode(e.target.value as JoinerMode)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Join with Character</span>
                  </label>
                  <input
                    type="text"
                    value={joinCharacter}
                    onChange={(e) => setJoinCharacter(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="Enter character"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use this character between pieces (space by default).
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="joinerMode"
                      value="custom"
                      checked={joinerMode === 'custom'}
                      onChange={(e) => setJoinerMode(e.target.value as JoinerMode)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Custom Separator</span>
                  </label>
                  <input
                    type="text"
                    value={customSeparator}
                    onChange={(e) => setCustomSeparator(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
                    placeholder=", "
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use custom separator (supports \\n and \\t).
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="joinerMode"
                      value="none"
                      checked={joinerMode === 'none'}
                      onChange={(e) => setJoinerMode(e.target.value as JoinerMode)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">No Separator (Concatenate)</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Join pieces directly without any separator.
                  </p>
                </div>
              </div>
            </div>

            {/* Formatting Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Formatting Options</h3>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={addLineNumbers}
                      onChange={(e) => setAddLineNumbers(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Add Line Numbers</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Prefix each piece with line numbers (1., 2., etc.).
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={removeEmptyLines}
                      onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Remove Empty Pieces</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Skip empty or whitespace-only text pieces.
                  </p>
                </div>
              </div>
            </div>

            {/* Text Wrappers */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Text Wrappers</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={leftWrapper}
                  onChange={(e) => setLeftWrapper(e.target.value)}
                  placeholder="Left Wrapper"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <input
                  type="text"
                  value={rightWrapper}
                  onChange={(e) => setRightWrapper(e.target.value)}
                  placeholder="Right Wrapper"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-2">
                <span>Left wrapper.</span>
                <span>Right wrapper.</span>
              </div>
              <p className="text-xs text-gray-500">
                Wrap each text piece before joining (quotes, brackets, etc.).
              </p>
              
              {/* Quick wrapper presets */}
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Quick Presets:</p>
                <div className="flex gap-1 flex-wrap">
                  <button
                    onClick={() => {setLeftWrapper('"'); setRightWrapper('"');}}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    &laquo;Quotes&raquo;
                  </button>
                  <button
                    onClick={() => {setLeftWrapper('['); setRightWrapper(']');}}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    [Brackets]
                  </button>
                  <button
                    onClick={() => {setLeftWrapper('('); setRightWrapper(')');}}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    (Parens)
                  </button>
                  <button
                    onClick={() => {setLeftWrapper(''); setRightWrapper('');}}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3 className="text-xl font-semibold text-gray-900 mb-4">About Join Text Tool</h3>
    <div className="prose prose-sm max-w-none text-gray-600">
      <p>
        The Join Text Tool allows you to combine multiple text pieces into a single, unified text using various joining methods. 
        This is particularly useful for data assembly, list creation, and content organization tasks.
      </p>
      <h4 className="font-semibold text-gray-800">Joining Methods:</h4>
      <ul className="list-disc list-inside">
        <li><strong>New Lines:</strong> Join pieces with line breaks (perfect for lists)</li>
        <li><strong>Character:</strong> Use any character as separator (comma, space, etc.)</li>
        <li><strong>Custom Separator:</strong> Define complex separators with escape sequences</li>
        <li><strong>Concatenate:</strong> Join pieces directly without any separator</li>
      </ul>
      <h4 className="font-semibold text-gray-800">Formatting Features:</h4>
      <ul className="list-disc list-inside">
        <li><strong>Line Numbers:</strong> Automatically number each piece</li>
        <li><strong>Text Wrappers:</strong> Add quotes, brackets, or other symbols around each piece</li>
        <li><strong>Empty Line Removal:</strong> Skip empty or whitespace-only pieces</li>
      </ul>
    </div>
  </div>
);