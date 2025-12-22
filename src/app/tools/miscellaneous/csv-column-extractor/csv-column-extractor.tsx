'use client';
import React, { useState, useMemo } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

type ExtractMode = 'number' | 'name';
type OutputFormat = 'csv' | 'json' | 'text';

type ExtractedDataType = {
  headers: string[];
  rows: string[][];
};

export function CSVColumnExtractor() {
  const [inputCSV, setInputCSV] = useState('');
  const [extractMode, setExtractMode] = useState<ExtractMode>('number');
  const [columnNumber, setColumnNumber] = useState('1');
  const [columnName, setColumnName] = useState('');
  const [extractAllCopies, setExtractAllCopies] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('text');
  const [doNotExtractComments, setDoNotExtractComments] = useState(true);
  const [commentSymbol, setCommentSymbol] = useState('#');
  const [doNotExtractEmptyLines, setDoNotExtractEmptyLines] = useState(true);

  // Parse CSV data
  const parsedCSV = useMemo(() => {
    if (!inputCSV.trim()) return { headers: [], rows: [] };
    
    const lines = inputCSV.split('\n').filter(line => {
      const trimmed = line.trim();
      if (!trimmed && doNotExtractEmptyLines) return false;
      if (doNotExtractComments && trimmed.startsWith(commentSymbol)) return false;
      return true;
    });
    
    if (lines.length === 0) return { headers: [], rows: [] };
    
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => 
      line.split(',').map(cell => cell.trim())
    );
    
    return { headers, rows };
  }, [inputCSV, doNotExtractComments, commentSymbol, doNotExtractEmptyLines]);

  // Extract column data
  const extractedData = useMemo(() => {
    if (parsedCSV.headers.length === 0) return { headers: [], rows: [] } as ExtractedDataType;
    
    let columnIndices: number[] = [];
    
    if (extractMode === 'number') {
      // Parse column numbers (supports ranges like "1,2,5" or "1-4")
      const parts = columnNumber.split(',').map(p => p.trim());
      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n.trim()));
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              if (i >= 1 && i <= parsedCSV.headers.length) {
                columnIndices.push(i - 1); // Convert to 0-based index
              }
            }
          }
        } else {
          const num = parseInt(part);
          if (!isNaN(num) && num >= 1 && num <= parsedCSV.headers.length) {
            columnIndices.push(num - 1); // Convert to 0-based index
          }
        }
      }
    } else {
      // Extract by name
      if (extractAllCopies) {
        // Find all columns with matching name
        parsedCSV.headers.forEach((header, index) => {
          if (header.toLowerCase() === columnName.toLowerCase()) {
            columnIndices.push(index);
          }
        });
      } else {
        // Find first column with matching name
        const index = parsedCSV.headers.findIndex(h => 
          h.toLowerCase() === columnName.toLowerCase()
        );
        if (index !== -1) {
          columnIndices.push(index);
        }
      }
    }
    
    // Remove duplicates and sort
    columnIndices = [...new Set(columnIndices)].sort((a, b) => a - b);
    
    if (columnIndices.length === 0) return { headers: [], rows: [] } as ExtractedDataType;
    
    // Extract data
    const extractedHeaders = columnIndices.map(i => parsedCSV.headers[i]);
    const extractedRows = parsedCSV.rows.map(row => 
      columnIndices.map(i => row[i] || '')
    );
    
    return { headers: extractedHeaders, rows: extractedRows } as ExtractedDataType;
  }, [parsedCSV, extractMode, columnNumber, columnName, extractAllCopies]);

  // Format output
  const formattedOutput = useMemo(() => {
    if (!extractedData.headers || extractedData.headers.length === 0) return '';
    
    switch (outputFormat) {
      case 'csv':
        const csvLines = [extractedData.headers.join(',')];
        csvLines.push(...extractedData.rows.map(row => row.join(',')));
        return csvLines.join('\n');
      
      case 'json':
        const jsonData = extractedData.rows.map(row => {
          const obj: Record<string, string> = {};
          extractedData.headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        return JSON.stringify(jsonData, null, 2);
      
      case 'text':
      default:
        // Simple text format - just the values
        if (extractedData.headers.length === 1) {
          return extractedData.rows.map(row => row[0] || '').join('\n');
        } else {
          return extractedData.rows.map(row => row.join('\t')).join('\n');
        }
    }
  }, [extractedData, outputFormat]);

  // Handle file import
  const importFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.txt,.tsv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setInputCSV(text);
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
    setInputCSV('');
  };

  // Sample CSV data
  const sampleCSVs = [
    {
      name: 'Programming Languages',
      data: 'language,year_released,main_paradigm\nC,1972,Procedural\nJava,1995,Object-Oriented\nPython,1991,General-Purpose\nJavaScript,1995,Scripting\nC++,1985,Object-Oriented'
    },
    {
      name: 'Employee Data',
      data: 'name,department,salary,years_experience\nJohn Doe,Engineering,75000,5\nJane Smith,Marketing,65000,3\nBob Johnson,Sales,60000,7\nAlice Brown,Engineering,80000,8'
    },
    {
      name: 'Products',
      data: 'product_id,product_name,category,price\n001,Laptop,Electronics,999.99\n002,Coffee Mug,Kitchen,12.95\n003,Notebook,Office,5.50\n004,Headphones,Electronics,79.99'
    },
    {
      name: 'Cities',
      data: 'city,country,population,area_km2\nNew York,USA,8336817,783\nLondon,UK,9648110,1572\nTokyo,Japan,14094034,2194\nParis,France,2161000,105'
    }
  ];

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.CSVColumnExtractor}
      secondaryToolDescription="Perfect for data analysis, CSV processing, and column-based data extraction."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input CSV */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Input CSV</h2>
              <div className="flex gap-2">
                <button
                  onClick={importFromFile}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  Import from file
                </button>
                <button
                  onClick={() => handleSaveAs(inputCSV, 'input-data.csv')}
                  disabled={!inputCSV.trim()}
                  className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export
                </button>
                <button
                  onClick={() => copyToClipboard(inputCSV)}
                  disabled={!inputCSV.trim()}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <textarea
              value={inputCSV}
              onChange={(e) => setInputCSV(e.target.value)}
              placeholder="Enter or paste your CSV data here..."
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

            {/* Sample CSV Data */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sample CSV Data</h3>
              <div className="space-y-2">
                {sampleCSVs.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setInputCSV(sample.data)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-orange-100 rounded transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{sample.name}</span>
                    <div className="text-xs text-gray-600 mt-1">
                      {sample.data.split('\n')[0]}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Extracted Column */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Extracted Column</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveAs(formattedOutput, `extracted-column.${outputFormat === 'json' ? 'json' : outputFormat === 'csv' ? 'csv' : 'txt'}`)}
                  disabled={!formattedOutput}
                  className="px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export
                </button>
                <button
                  onClick={() => copyToClipboard(formattedOutput)}
                  disabled={!formattedOutput}
                  className="px-3 py-1 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <textarea
              value={formattedOutput}
              readOnly
              placeholder="Extracted column data will appear here..."
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 resize-none font-mono text-sm"
            />
            
            <div className="mt-2 text-xs text-gray-500">
              {extractedData.headers?.length ? `${extractedData.headers.length} column(s)` : '0 columns'} • {extractedData.rows?.length || 0} rows • {formattedOutput.length} characters
            </div>
          </div>
        </div>

        {/* Tool Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🛠 Tool Options</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Column to Extract */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Column to Extract</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="extractMode"
                      value="number"
                      checked={extractMode === 'number'}
                      onChange={(e) => setExtractMode(e.target.value as ExtractMode)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Extract Column by Number</span>
                  </label>
                  <input
                    type="text"
                    value={columnNumber}
                    onChange={(e) => setColumnNumber(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Specify the column positions or a range. For example, &laquo;1&raquo;, &laquo;1, 2, 5&raquo;, &laquo;1-4&raquo;, or &laquo;1-4, 6&raquo;.
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="extractMode"
                      value="name"
                      checked={extractMode === 'name'}
                      onChange={(e) => setExtractMode(e.target.value as ExtractMode)}
                      className="form-radio h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Extract Column by Name</span>
                  </label>
                  <input
                    type="text"
                    value={columnName}
                    onChange={(e) => setColumnName(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="column name"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Specify the column name.
                  </p>

                  <div className="mt-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={extractAllCopies}
                        onChange={(e) => setExtractAllCopies(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-orange-600"
                      />
                      <span className="text-sm font-medium text-gray-700">Extract All Copies of Names</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      In cases when a CSV file has multiple columns with the same name, extract all of them.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Column Format */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Output Column Format</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="text">Plain Text</option>
                    <option value="csv">CSV Format</option>
                    <option value="json">JSON Format</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose how to output the columns — as CSV, JSON, or plain text.
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={doNotExtractComments}
                      onChange={(e) => setDoNotExtractComments(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Do Not Extract Comments</span>
                  </label>
                  <input
                    type="text"
                    value={commentSymbol}
                    onChange={(e) => setCommentSymbol(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="#"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Specify a symbol that starts comments in the CSV.
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={doNotExtractEmptyLines}
                      onChange={(e) => setDoNotExtractEmptyLines(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-orange-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Do Not Extract Empty Lines</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Activate to remove empty lines from the extracted column.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6" />

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">About CSV Column Extractor</h3>
          <div className="prose prose-sm max-w-none text-gray-600">
            <p>
              The CSV Column Extractor allows you to extract specific columns from CSV data using various methods. 
              This is particularly useful for data analysis, processing large datasets, and isolating specific information.
            </p>
            <h4 className="font-semibold text-gray-800">Extraction Methods:</h4>
            <ul className="list-disc list-inside">
              <li><strong>By Number:</strong> Extract columns by their position (1, 2, 3, etc.)</li>
              <li><strong>By Name:</strong> Extract columns by their header names</li>
              <li><strong>Range Support:</strong> Use ranges like &laquo;1&ndash;4&raquo; or combinations like &laquo;1,3,5&ndash;7&raquo;</li>
              <li><strong>Multiple Copies:</strong> Extract all columns with the same name</li>
            </ul>
            <h4 className="font-semibold text-gray-800">Output Formats:</h4>
            <ul className="list-disc list-inside">
              <li><strong>Plain Text:</strong> Simple text output, one value per line</li>
              <li><strong>CSV Format:</strong> Proper CSV with headers and comma separation</li>
              <li><strong>JSON Format:</strong> Structured JSON array of objects</li>
            </ul>
            <h4 className="font-semibold text-gray-800">Processing Options:</h4>
            <ul className="list-disc list-inside">
              <li><strong>Comment Handling:</strong> Skip lines that start with comment symbols</li>
              <li><strong>Empty Line Removal:</strong> Filter out empty rows from the data</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}