'use client';

import React, { useState, useMemo, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import DataDisclaimer from '@/components/disclaimers/dataDisclaimer';

interface JsonDiff {
  type: 'added' | 'removed' | 'modified';
  path: string;
  oldValue?: any;
  newValue?: any;
}

const JsonFormatterCompare: React.FC = () => {
  const [originalJson, setOriginalJson] = useState('');
  const [modifiedJson, setModifiedJson] = useState('');
  const [formatError, setFormatError] = useState<string>('');

  // Format JSON with proper indentation
  const formatJson = (jsonString: string): string => {
    if (!jsonString.trim()) return '';
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      console.log('Format JSON Error:', error);
      throw new Error('Invalid JSON format');
    }
  };

  // Deep comparison function to find differences
  const findDifferences = useCallback((obj1: any, obj2: any, path: string = ''): JsonDiff[] => {
    const diffs: JsonDiff[] = [];
    
    const allKeys = new Set([
      ...Object.keys(obj1 || {}),
      ...Object.keys(obj2 || {})
    ]);

    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      const val1 = obj1?.[key];
      const val2 = obj2?.[key];

      if (!(key in (obj1 || {}))) {
        diffs.push({
          type: 'added',
          path: currentPath,
          newValue: val2
        });
      } else if (!(key in (obj2 || {}))) {
        diffs.push({
          type: 'removed',
          path: currentPath,
          oldValue: val1
        });
      } else if (typeof val1 === 'object' && typeof val2 === 'object' && 
                 val1 !== null && val2 !== null && 
                 !Array.isArray(val1) && !Array.isArray(val2)) {
        diffs.push(...findDifferences(val1, val2, currentPath));
      } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        diffs.push({
          type: 'modified',
          path: currentPath,
          oldValue: val1,
          newValue: val2
        });
      }
    }

    return diffs;
  }, []);

  // Calculate differences between JSONs
  const differences = useMemo(() => {
    if (!originalJson.trim() || !modifiedJson.trim()) return [];
    
    try {
      const obj1 = JSON.parse(originalJson);
      const obj2 = JSON.parse(modifiedJson);
      return findDifferences(obj1, obj2);
    } catch {
      return [];
    }
  }, [originalJson, modifiedJson, findDifferences]);

  // Group differences by type
  const groupedDifferences = useMemo(() => {
    const groups = {
      added: differences.filter(d => d.type === 'added'),
      removed: differences.filter(d => d.type === 'removed'),
      modified: differences.filter(d => d.type === 'modified')
    };
    return groups;
  }, [differences]);

  const handleFormatJson = () => {
    try {
      setFormatError('');
      
      if (originalJson.trim()) {
        const formattedOriginal = formatJson(originalJson);
        setOriginalJson(formattedOriginal);
      }
      
      if (modifiedJson.trim()) {
        const formattedModified = formatJson(modifiedJson);
        setModifiedJson(formattedModified);
      }
    } catch (error) {
      setFormatError(error instanceof Error ? error.message : 'Format error');
    }
  };

  const handleCompareJson = () => {
    try {
      setFormatError('');
      
      if (!originalJson.trim() && !modifiedJson.trim()) {
        setFormatError('Please enter JSON data in both text areas to compare');
        return;
      }
      
      if (!originalJson.trim()) {
        setFormatError('Please enter JSON data in the Original JSON field');
        return;
      }
      
      if (!modifiedJson.trim()) {
        setFormatError('Please enter JSON data in the Modified JSON field');
        return;
      }

      // Validate both JSONs
      JSON.parse(originalJson);
      JSON.parse(modifiedJson);
      
      // The comparison will be automatically calculated via useMemo
    } catch (error) {
      setFormatError(error instanceof Error ? error.message : 'Invalid JSON format');
    }
  };

  const handleClearAll = () => {
    setOriginalJson('');
    setModifiedJson('');
    setFormatError('');
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.JsonFormatterCompare}
      secondaryToolDescription="Paste your JSON objects in the text areas below, click the compare button, and instantly see the differences highlighted. Perfect for developers, data analysts, and anyone working with JSON data structures."
      disclaimer={<DataDisclaimer />}
      educationContent={educationContent}
    >
      {/* JSON Input Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 bg-white p-4 rounded-lg shadow-sm">
        {/* Original JSON */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Original JSON
            </label>
            <button
              onClick={() => copyToClipboard(originalJson, 'original')}
              className="flex items-center px-2 py-1 text-xs bg-orange-100 hover:bg-orange-400 rounded transition-colors"
              disabled={!originalJson.trim()}
            >
              Copy
            </button>
          </div>
          <textarea
            value={originalJson}
            onChange={(e) => setOriginalJson(e.target.value)}
            placeholder='{  "test": "test"}'
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Modified JSON */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Modified JSON
            </label>
            <button
              onClick={() => copyToClipboard(modifiedJson, 'modified')}
              className="flex items-center px-2 py-1 text-xs bg-orange-100 hover:bg-orange-400 rounded transition-colors"
              disabled={!modifiedJson.trim()}
            >
              Copy
            </button>
          </div>
          <textarea
            value={modifiedJson}
            onChange={(e) => setModifiedJson(e.target.value)}
            placeholder='{  "test": "dd",  "test2": "dd",  "test3": "dd"}'
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleCompareJson}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Compare JSON
        </button>
        <button
          onClick={handleFormatJson}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Format JSON
        </button>
        <button
          onClick={handleClearAll}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Error Display */}
      {formatError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{formatError}</p>
        </div>
      )}

      {/* Comparison Results */}
      {differences.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Comparison Results:</h2>
          
          {/* Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="font-medium">Found {differences.length} difference(s)</span>
            </div>
          </div>

          {/* Added Properties */}
          {groupedDifferences.added.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium text-green-800">
                  Added Properties ({groupedDifferences.added.length})
                </span>
              </div>
              <div className="space-y-2">
                {groupedDifferences.added.map((diff, index) => (
                  <div key={index} className="font-mono text-sm">
                    <span className="text-green-700 font-medium">{diff.path}</span>
                    <span className="text-gray-600"> = </span>
                    <span className="text-green-600">&laquo;{diff.newValue}&raquo;</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modified Properties */}
          {groupedDifferences.modified.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span className="font-medium text-amber-800">
                  Modified Properties ({groupedDifferences.modified.length})
                </span>
              </div>
              <div className="space-y-3">
                {groupedDifferences.modified.map((diff, index) => (
                  <div key={index} className="font-mono text-sm">
                    <div className="text-yellow-700 font-medium mb-1">{diff.path}</div>
                    <div className="ml-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">-</span>
                        <span className="text-red-600">&laquo;{diff.oldValue}&raquo;</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">+</span>
                        <span className="text-green-600">&laquo;{diff.newValue}&raquo;</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Removed Properties */}
          {groupedDifferences.removed.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="font-medium text-red-800">
                  Removed Properties ({groupedDifferences.removed.length})
                </span>
              </div>
              <div className="space-y-2">
                {groupedDifferences.removed.map((diff, index) => (
                  <div key={index} className="font-mono text-sm">
                    <span className="text-red-700 font-medium">{diff.path}</span>
                    <span className="text-gray-600"> = </span>
                    <span className="text-red-600">&laquo;{diff.oldValue}&raquo;</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Differences */}
      {originalJson.trim() && modifiedJson.trim() && differences.length === 0 && !formatError && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <span className="font-medium">No differences found - JSON objects are identical</span>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};

export default JsonFormatterCompare;

const educationContent = (     
  <div>
    <h3>What Is JSON?</h3>
    <p>JSON stands for JavaScript Object Notation. It is a simple text format used to store and share data. It uses pairs of keys and values, which makes it easy for people to read and easy for machines to process. You will see JSON in APIs, web apps, mobile apps, and many modern tools. Its clean structure works well for both small and large datasets.</p>
    
    <h3>Why JSON Is Used</h3>
    <p>JSON is popular because it is fast, light, and easy to understand. It works across many languages, so developers can send data between different systems without extra steps. It also keeps data organized in a clear way, which helps when debugging, building features, or storing settings. Its mix of simplicity and flexibility makes it the standard format for data exchange today.</p>
    
    <h3>Our Formatting And Comparison Features</h3>
    <p>The JSON Formatter cleans and organizes JSON with clear indentation. It checks your syntax in real time and points out any errors with simple messages. You can fix issues fast and copy the formatted result with one click.</p>

    <p>The compare tool looks deep into your JSON objects and spots every change. It shows edited values, new properties, and removed fields. It also supports nested objects, so you can review complex data with ease.</p>

    <h3>Common Use Cases</h3>
    <p>Developers use this tool to compare API responses, check data structures, and debug payload issues. It also helps track changes in JSON settings and configuration files. Data teams use it to study JSON datasets and see how values shift during transformations.</p>
  </div>
);