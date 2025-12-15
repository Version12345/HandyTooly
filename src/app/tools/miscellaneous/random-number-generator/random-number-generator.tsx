'use client';

import React, { useState, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

interface RandomNumberConfig {
  count: number;
  min: number;
  max: number;
  isUnique: boolean;
}

interface GeneratedNumbers {
  numbers: number[];
}

const PROGRAMMING_EXAMPLES = [
  {
    language: 'Java',
    code: 'Math.random()*10',
    description: 'Generates a random decimal between 0-10'
  },
  {
    language: 'PHP', 
    code: 'rand(0,10)',
    description: 'Generates a random integer between 0-10'
  },
  {
    language: 'JavaScript',
    code: 'Math.floor(Math.random()*10)',
    description: 'Generates a random integer between 0-9'
  },
  {
    language: 'Python',
    code: 'random.randint(0,10)',
    description: 'Generates a random integer between 0-10 (inclusive)'
  },
  {
    language: 'Go',
    code: 'fmt.Println(rand.Intn(100))',
    description: 'Generates a random integer between 0-99'
  },
  {
    language: 'C#',
    code: 'new Random().Next(0, 11)',
    description: 'Generates a random integer between 0-10'
  },
  {
    language: 'Swift',
    code: 'arc4random() % 10 + 1',
    description: 'Generates a random integer between 1-10'
  },
  {
    language: 'Ruby',
    code: 'rand(1..10)',
    description: 'Generates a random integer between 1-10'
  }
];

export default function RandomNumberGenerator() {
  const [config, setConfig] = useState<RandomNumberConfig>({
    count: 1,
    min: 1,
    max: 100,
    isUnique: false
  });

  const [result, setResult] = useState<GeneratedNumbers | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRandomNumbers = useCallback(() => {
    setIsGenerating(true);
    
    // Simulate brief loading for better UX
    setTimeout(() => {
      const { count, min, max, isUnique } = config;
      
      if (min >= max) {
        alert('Minimum value must be less than maximum value');
        setIsGenerating(false);
        return;
      }

      if (isUnique && (max - min + 1) < count) {
        alert(`Cannot generate ${count} unique numbers from range ${min}-${max}. Range only contains ${max - min + 1} numbers.`);
        setIsGenerating(false);
        return;
      }

      const numbers: number[] = [];
      const usedNumbers = new Set<number>();

      for (let i = 0; i < count; i++) {
        let randomNum: number;
        
        if (isUnique) {
          do {
            randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
          } while (usedNumbers.has(randomNum));
          usedNumbers.add(randomNum);
        } else {
          randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        numbers.push(randomNum);
      }

      const newResult = {
        numbers
      };

      setResult(newResult);
      setIsGenerating(false);
    }, 200);
  }, [config]);

  const updateConfig = (field: keyof RandomNumberConfig, value: number | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleCopy = (numbers: number[]) => {
    const text = numbers.join(', ');
    copyToClipboard(text);
  };

  const downloadNumbers = (numbers: number[]) => {
    const text = numbers.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'random-numbers.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.RandomNumberGenerator}
      educationContent={educationContent}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Number Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of random numbers
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={config.count}
                    onChange={(e) => updateConfig('count', Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <span className="text-sm text-gray-500">(1-100)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Range
                  </label>
                  <input
                    type="number"
                    value={config.min}
                    onChange={(e) => updateConfig('min', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Range
                  </label>
                  <input
                    type="number"
                    value={config.max}
                    onChange={(e) => updateConfig('max', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="unique"
                  checked={config.isUnique}
                  onChange={(e) => updateConfig('isUnique', e.target.checked)}
                  className="mr-2 w-4 h-4 text-orange-600 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <label htmlFor="unique" className="text-sm text-gray-700">
                  Is it unique (Selected as unique)
                </label>
              </div>

              <button
                onClick={generateRandomNumbers}
                disabled={isGenerating}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Generate random numbers'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Generated Results
            </h2>
            
            {result ? (
              <div className="space-y-4">
                {result.numbers.length && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="grid grid-cols-5 gap-2 max-h-192 overflow-y-auto">
                      {result.numbers.map((num, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded px-2 py-1 text-center text-sm font-mono"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(result.numbers)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 px-3 rounded-md transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => downloadNumbers(result.numbers)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-md transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🎲</div>
                <p>Click &laquo;Generate random numbers&raquo; to start</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Presets</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Dice Roll', min: 1, max: 6, count: 1 },
              { name: 'Lottery Pick', min: 1, max: 69, count: 6, unique: true },
              { name: 'Coin Flip', min: 0, max: 1, count: 1 },
              { name: 'Card Draw', min: 1, max: 52, count: 5, unique: true },
              { name: 'Password Digit', min: 0, max: 9, count: 8 },
              { name: 'Percentage', min: 0, max: 100, count: 1 },
              { name: 'Team Picker', min: 1, max: 10, count: 1 },
              { name: 'Custom Range', min: 1, max: 1000, count: 5 }
            ].map((preset, index) => (
              <button
                key={index}
                onClick={() => setConfig({
                  min: preset.min,
                  max: preset.max,
                  count: preset.count,
                  isUnique: preset.unique || false
                })}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-sm text-gray-900">
                  {preset.name}
                </div>
                <div className="text-xs text-gray-500">
                  {preset.min}-{preset.max}, {preset.count} number{preset.count > 1 ? 's' : ''}
                  {preset.unique && ', unique'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const educationContent: React.ReactNode = (
    <div>
      <h3>What Random Number Generators Are</h3>
      <p>Random number generators use special algorithms to create numbers that appear unpredictable. These algorithms run on computers and follow clear rules, yet the output still looks random. People use these numbers in games, tests, encryption, and many other tasks that need fresh values.</p>

      <h3>Why Independence Matters</h3>
      <p>A true random number has no link to the number that comes next. Each result stands on its own. This independence keeps patterns from forming. It protects security tools, creates fair results in digital games, and helps researchers run clean simulations without hidden bias.</p>

      <h3>Pseudo Random vs Real Random</h3>
      <p>Most computer systems create pseudo random numbers. These values look random but come from math instead of nature. Real random numbers come from physical events such as radioactive decay, thermal noise in electronics, or light level variation in simple sensor readings. These natural sources add true unpredictability and give stronger results for tests that need perfect randomness.</p>

      {/* Programming Examples */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          How to generate random numbers in different programming languages
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                  Language
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                  How to generate random number
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {PROGRAMMING_EXAMPLES.map((example, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {example.language}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 mb-1">
                      {example.code}
                    </div>
                    <div className="text-xs text-gray-600">
                      {example.description}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
);