'use client';
import React, { useState, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';
import PrivacyDisclaimer from '@/components/disclaimers/privacyDisclaimer';

interface PasswordOptions {
  count: number;
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

const generatePasswords = (
  count: number, 
  passwordLength: number, 
  includeUppercase: boolean, 
  includeLowercase: boolean, 
  includeNumbers: boolean, 
  includeSymbols: boolean,
  excludeSimilar: boolean = false,
  excludeAmbiguous: boolean = false
): string => {
  const passwords: string[] = [];
  let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowercase = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // Exclude similar looking characters if requested
  if (excludeSimilar) {
    uppercase = uppercase.replace(/[IL]/g, '');
    lowercase = lowercase.replace(/[il]/g, '');
    numbers = numbers.replace(/[01]/g, '');
  }

  // Exclude ambiguous characters if requested
  if (excludeAmbiguous) {
    uppercase = uppercase.replace(/[O]/g, '');
    lowercase = lowercase.replace(/[o]/g, '');
    numbers = numbers.replace(/[0]/g, '');
    symbols = symbols.replace(/[{}[\]()\/\\'"~,;.<>]/g, '');
  }

  for (let i = 0; i < count; i++) {
    let charset = '';
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === '') charset = lowercase; // Fallback

    let password = '';
    
    // Ensure at least one character from each selected type
    const requiredChars: string[] = [];
    if (includeUppercase && uppercase.length > 0) requiredChars.push(uppercase.charAt(Math.floor(Math.random() * uppercase.length)));
    if (includeLowercase && lowercase.length > 0) requiredChars.push(lowercase.charAt(Math.floor(Math.random() * lowercase.length)));
    if (includeNumbers && numbers.length > 0) requiredChars.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
    if (includeSymbols && symbols.length > 0) requiredChars.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));

    // Add required characters first
    for (const char of requiredChars) {
      password += char;
    }

    // Fill the rest with random characters
    for (let j = password.length; j < passwordLength; j++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Shuffle the password to avoid predictable patterns
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    passwords.push(password);
  }

  return passwords.join('\n');
};

export function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    count: 8,
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });
  const [generatedPasswords, setGeneratedPasswords] = useState('');

  const generateText = useCallback(() => {
    const passwords = generatePasswords(
      options.count,
      options.length,
      options.includeUppercase,
      options.includeLowercase,
      options.includeNumbers,
      options.includeSymbols,
      options.excludeSimilar,
      options.excludeAmbiguous
    );
    setGeneratedPasswords(passwords);
  }, [options]);

  const handleCopy = async () => {
    await copyToClipboard(generatedPasswords);
  };

  const downloadAsText = () => {
    const blob = new Blob([generatedPasswords], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-passwords.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPasswordStrength = () => {
    let score = 0;
    if (options.length >= 8) score += 1;
    if (options.length >= 12) score += 1;
    if (options.length >= 16) score += 1;
    if (options.includeUppercase) score += 1;
    if (options.includeLowercase) score += 1;
    if (options.includeNumbers) score += 1;
    if (options.includeSymbols) score += 2;

    if (score >= 7) return { label: 'Very Strong', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 5) return { label: 'Strong', color: 'text-lime-600', bgColor: 'bg-lime-100' };
    if (score >= 3) return { label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { label: 'Weak', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const strength = getPasswordStrength();

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.PasswordGenerator}
      secondaryToolDescription="Generate secure, random passwords with customizable options. Create strong passwords for your accounts, applications, and security needs. Features include character type selection, length control, and bulk generation with no data tracking."
      educationContent={educationContent}
      disclaimer={<PrivacyDisclaimer />}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Options Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Passwords
              </label>
              <input
                type="number"
                min="6"
                max="100"
                value={options.count}
                onChange={(e) => setOptions({...options, count: parseInt(e.target.value) || 1})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <small>(Maximum 100)</small>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Length 
              </label>
              <input
                type="number"
                min="6"
                max="128"
                value={options.length}
                onChange={(e) => setOptions({...options, length: parseInt(e.target.value) || 12})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <small>(Minimum 6 Characters)</small>
            </div>

            <div className="space-y-3">
              <h3>Character Types</h3>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="uppercase"
                    checked={options.includeUppercase}
                    onChange={(e) => setOptions({...options, includeUppercase: e.target.checked})}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="uppercase" className="text-sm text-gray-700">Include Uppercase Letters (A-Z)</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lowercase"
                    checked={options.includeLowercase}
                    onChange={(e) => setOptions({...options, includeLowercase: e.target.checked})}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="lowercase" className="text-sm text-gray-700">Include Lowercase Letters (a-z)</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="numbers"
                    checked={options.includeNumbers}
                    onChange={(e) => setOptions({...options, includeNumbers: e.target.checked})}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="numbers" className="text-sm text-gray-700">Include Numbers (0-9)</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="symbols"
                    checked={options.includeSymbols}
                    onChange={(e) => setOptions({...options, includeSymbols: e.target.checked})}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="symbols" className="text-sm text-gray-700">Include Symbols (!@#$%^&*)</label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Advanced Options</h3>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="excludeSimilar"
                    checked={options.excludeSimilar}
                    onChange={(e) => setOptions({...options, excludeSimilar: e.target.checked})}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="excludeSimilar" className="text-sm text-gray-700">Exclude Similar Characters (i, l, 1, L, o, 0, O)</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="excludeAmbiguous"
                    checked={options.excludeAmbiguous}
                    onChange={(e) => setOptions({...options, excludeAmbiguous: e.target.checked})}
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="excludeAmbiguous" className="text-sm text-gray-700">Exclude Ambiguous Characters ({`{}[]()/'\"~,;.<>`})</label>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-lg ${strength.bgColor}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                <span className={`text-sm font-semibold ${strength.color}`}>{strength.label}</span>
              </div>
            </div>

            <button
              onClick={generateText}
              className="w-full px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-700 transition-colors"
            >
              Generate Passwords
            </button>
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generated Passwords
              </label>
              {generatedPasswords ? (
                <div className="space-y-2">
                  {generatedPasswords.split('\n').filter(pwd => pwd.trim()).map((password, index) => (
                    <div key={index} className="relative group">
                      <pre className="bg-gray-50 border border-gray-300 rounded-md p-3 font-mono text-sm text-gray-800 break-all whitespace-pre-wrap pr-16">
                        {password}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(password)}
                        className="absolute top-2 right-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy this password"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-300 rounded-md p-6 text-center text-gray-500">
                  Click &lsquo;Generate Passwords&rsquo; to create secure passwords...
                </div>
              )}
            </div>

            {generatedPasswords && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-700 transition-colors"
                >
                  Copy All Passwords
                </button>
                <button
                  onClick={downloadAsText}
                  className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
                >
                  Download as TXT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

const educationContent = (
  <div>
    <h3>Password Security Best Practices</h3>
    <p>Protecting your online accounts begins with strong password security. Using secure and unique passwords helps safeguard your personal data, financial information, and digital identity. By following proven security practices, you can significantly reduce the risk of unauthorized access and cyberattacks.</p>
    
    <h3>Strong Password Characteristics</h3>
    <p>A strong password should be at least 12&ndash;16 characters long and include a mix of uppercase and lowercase letters, numbers, and symbols. Each account should have a unique password, ensuring that one compromised credential doesn&apos;t endanger others. Avoid using dictionary words, personal information, or predictable patterns. For added protection, remember to update your passwords regularly.</p>
    
    <h3>Password Security Best Practices</h3>
    <p>Consider using a password manager to securely store and manage your login details. Always enable two-factor authentication (2FA) for an extra layer of security. Never share passwords through email or messaging apps, and avoid entering them on public or shared computers. Finally, monitor your accounts regularly for any signs of suspicious activity to stay one step ahead of potential threats.</p>
  </div>
);