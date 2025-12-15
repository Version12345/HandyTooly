'use client';

import React, { useState, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

interface UUIDConfig {
  count: number;
  version: 'v1' | 'v4';
  format: 'standard' | 'uppercase' | 'lowercase' | 'nodashes';
}

interface GeneratedUUIDs {
  uuids: string[];
  version: string;
  format: string;
}

const UUID_VERSIONS = [
  {
    version: 'v4' as const,
    name: 'UUID v4 (Random)',
    description: 'Randomly generated UUID using cryptographically strong pseudo-random numbers',
    example: '550e8400-e29b-41d4-a716-446655440000'
  },
  {
    version: 'v1' as const,
    name: 'UUID v1 (Time-based)',
    description: 'Time-based UUID using MAC address and timestamp',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
  }
];

const FORMAT_OPTIONS = [
  { value: 'standard' as const, label: 'Standard (with dashes)', example: '550e8400-e29b-41d4-a716-446655440000' },
  { value: 'uppercase' as const, label: 'Uppercase', example: '550E8400-E29B-41D4-A716-446655440000' },
  { value: 'lowercase' as const, label: 'Lowercase', example: '550e8400-e29b-41d4-a716-446655440000' },
  { value: 'nodashes' as const, label: 'No Dashes', example: '550e8400e29b41d4a716446655440000' }
];

const PROGRAMMING_EXAMPLES = [
  {
    language: 'JavaScript',
    code: `import { v4 as uuidv4 } from 'uuid';\nconst id = uuidv4();`,
    description: 'Generate UUID v4 using uuid library'
  },
  {
    language: 'Python',
    code: `import uuid\nid = str(uuid.uuid4())`,
    description: 'Generate UUID using Python\'s built-in uuid module'
  },
  {
    language: 'Java',
    code: `import java.util.UUID;\nString id = UUID.randomUUID().toString();`,
    description: 'Generate UUID using Java\'s built-in UUID class'
  },
  {
    language: 'C#',
    code: `using System;\nstring id = Guid.NewGuid().ToString();`,
    description: 'Generate GUID using .NET\'s Guid class'
  },
  {
    language: 'PHP',
    code: `function guidv4() {\n    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',\n        mt_rand(0, 0xffff), mt_rand(0, 0xffff),\n        mt_rand(0, 0xffff),\n        mt_rand(0, 0x0fff) | 0x4000,\n        mt_rand(0, 0x3fff) | 0x8000,\n        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)\n    );\n}`,
    description: 'Generate UUID v4 using PHP mt_rand function'
  },
  {
    language: 'Go',
    code: `import "github.com/google/uuid"\nid := uuid.New().String()`,
    description: 'Generate UUID using Google\'s uuid package'
  },
  {
    language: 'Ruby',
    code: `require 'securerandom'\nid = SecureRandom.uuid`,
    description: 'Generate UUID using Ruby\'s SecureRandom'
  },
  {
    language: 'Swift',
    code: `import Foundation\nlet id = UUID().uuidString`,
    description: 'Generate UUID using Foundation\'s UUID class'
  }
];

export default function UUIDGenerator() {
  const [config, setConfig] = useState<UUIDConfig>({
    count: 1,
    version: 'v4',
    format: 'standard'
  });

  const [result, setResult] = useState<GeneratedUUIDs | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const formatUUID = (uuid: string, format: UUIDConfig['format']): string => {
    switch (format) {
      case 'uppercase':
        return uuid.toUpperCase();
      case 'lowercase':
        return uuid.toLowerCase();
      case 'nodashes':
        return uuid.replace(/-/g, '');
      case 'standard':
      default:
        return uuid;
    }
  };

  const generateUUIDs = useCallback(() => {
    setIsGenerating(true);
    
    // Simulate brief loading for better UX
    setTimeout(() => {
      const { count, version, format } = config;
      
      const uuids: string[] = [];

      if (count < 1 || count > 100) {
        setIsGenerating(false);
        return;
      }

      for (let i = 0; i < count; i++) {
        let uuid: string;
        
        if (version === 'v1') {
          uuid = uuidv1();
        } else {
          uuid = uuidv4();
        }
        
        uuid = formatUUID(uuid, format);
        uuids.push(uuid);
      }

      const newResult = {
        uuids,
        version: version.toUpperCase(),
        format: FORMAT_OPTIONS.find(f => f.value === format)?.label || format
      };

      setResult(newResult);
      setIsGenerating(false);
    }, 200);
  }, [config]);

  const updateConfig = <T extends keyof UUIDConfig>(field: T, value: UUIDConfig[T]) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (uuids: string[]) => {
    const text = uuids.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    });
  };

  const downloadUUIDs = (uuids: string[]) => {
    const text = uuids.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uuids.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.UUIDGenerator}
      educationContent={educationContent}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              UUID Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of UUIDs to generate
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UUID Version
                </label>
                <div className="space-y-2">
                  {UUID_VERSIONS.map((versionInfo) => (
                    <label key={versionInfo.version} className="flex items-start">
                      <input
                        type="radio"
                        name="version"
                        value={versionInfo.version}
                        checked={config.version === versionInfo.version}
                        onChange={(e) => updateConfig('version', e.target.value as 'v1' | 'v4')}
                        className="mt-1 mr-3 text-sky-600"
                      />
                      <div>
                        <div className="font-medium text-sm text-gray-900">
                          {versionInfo.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {versionInfo.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <select
                  value={config.format}
                  onChange={(e) => updateConfig('format', e.target.value as UUIDConfig['format'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {FORMAT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-2">
                  Example: {FORMAT_OPTIONS.find(f => f.value === config.format)?.example}
                </div>
              </div>

              <button
                onClick={generateUUIDs}
                disabled={isGenerating}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                {isGenerating ? 'Generating...' : 'Generate UUIDs'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Generated {result?.uuids.length} Results
            </h2>
            
            {result ? (
              <div className="space-y-4">
                {result.uuids.length && (
                    <>
                    <div className="text-md space-y-1">
                      Version: {result.version} Format: {result.format}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-1 max-h-192 overflow-y-auto">
                        {result.uuids.map((uuid, index) => (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded px-3 py-2 text-xs font-mono break-all"
                          >
                            {uuid}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(result.uuids)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 px-3 rounded-md transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => downloadUUIDs(result.uuids)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-md transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">🔑</div>
                <p>Click &laquo;Generate UUIDs&raquo; to start</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Presets</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Single UUID v4', count: 1, version: 'v4' as const, format: 'standard' as const },
              { name: 'Database IDs', count: 10, version: 'v4' as const, format: 'standard' as const },
              { name: 'API Keys', count: 5, version: 'v4' as const, format: 'nodashes' as const },
              { name: 'Session Tokens', count: 3, version: 'v4' as const, format: 'uppercase' as const },
              { name: 'Time-based ID', count: 1, version: 'v1' as const, format: 'standard' as const },
              { name: 'Bulk Generation', count: 100, version: 'v4' as const, format: 'standard' as const },
              { name: 'File Names', count: 20, version: 'v4' as const, format: 'nodashes' as const },
              { name: 'Transaction IDs', count: 50, version: 'v1' as const, format: 'uppercase' as const }
            ].map((preset, index) => (
              <button
                key={index}
                onClick={() => setConfig({
                  count: preset.count,
                  version: preset.version,
                  format: preset.format
                })}
                className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-sm text-gray-900">
                  {preset.name}
                </div>
                <div className="text-xs text-gray-500">
                  {preset.count} UUID{preset.count > 1 ? 's' : ''} {preset.version.toUpperCase()} {preset.format}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3>What is a UUID?</h3>
    <p>
      A UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify information 
      in computer systems. The probability of generating duplicate UUIDs is so low that they can be 
      considered unique without requiring a central authority. UUIDs are standardized by RFC 4122 and 
      are widely used in distributed systems, databases, and software applications for creating unique identifiers.
    </p>

    <h3>UUID v1 versus v4</h3>
    <p>UUID v1 uses a MAC address and a timestamp to build each value. This mix gives strong uniqueness across space and time. It also carries traceable details, which helps with record tracking but reduces privacy. Some developers use UUID v1 for primary keys because the order of creation stays clear and predictable.</p>

    <h3>How UUID v4 Works</h3>
    <p>UUID v4 uses random or pseudo random numbers to create each value. It holds no traceable details, which protects privacy and security. It has become the most common version in modern systems. The random nature keeps each value unpredictable and easy to use across large applications.</p>

    <h3>Pros of UUID v1 and v4</h3>
    <p>UUID v1 gives clear order because each value reflects a real timestamp. This helps when sorting large records or tracking events. It also pulls in the MAC address, which keeps each value unique across devices. UUID v4 shines in simple setups. It uses random numbers and skips all hardware details. This makes it clean, private, and easy to use in any system.</p>

    <h3>Cons of UUID v1 and v4</h3>
    <p>UUID v1 exposes traceable details, including the MAC address and the creation time. This creates privacy concerns in some projects. It also grows more predictable, which reduces security in sensitive systems. UUID v4 has its own limits. It removes time information, so sorting by creation order becomes harder. It also depends on strong random sources to keep values safe from patterns.</p>

    <h3>Where These UUIDs Are Used</h3>
    <p>Developers use UUIDs in many places. Database primary keys use them to keep each record safe from conflicts. API request IDs help track calls across systems. Session tokens support user logins. File names stay unique across storage systems. Distributed systems use them to assign IDs across many servers. Message queues use them to track events, and transaction systems use them to label each action.</p>
    
    {/* Programming Examples */}
    <h3>
      How to generate UUIDs in different programming languages
    </h3>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                Language
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                How to generate UUID
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
                  <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 mb-1 whitespace-pre">
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