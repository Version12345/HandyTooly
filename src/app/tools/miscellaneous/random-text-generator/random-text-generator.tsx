'use client';
import React, { useState, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';

type TextType = 'lorem-ipsum' | 'emails' | 'usernames' | 'passwords' | 'names' | 'addresses' | 'phone-numbers' | 'credit-cards' | 'urls' | 'sentences' | 'words';

interface GeneratorOptions {
  textType: TextType;
  count: number;
  startWithLorem: boolean;
  passwordLength: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

// Lorem Ipsum words pool
const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

// Domain extensions for emails and URLs
const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'example.com', 'test.com', 'company.com', 'business.org', 'website.net'];
const urlDomains = ['example.com', 'website.org', 'company.net', 'business.co', 'sample.io', 'demo.dev'];

// Names data
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Robert', 'Maria', 'James', 'Anna', 'William', 'Jessica', 'Daniel'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];

// Street names and cities
const streetNames = ['Main St', 'Oak Ave', 'Maple Dr', 'Park Blvd', 'First St', 'Second Ave', 'Elm St', 'Pine Rd', 'Cedar Ln', 'Washington St'];
const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'OH', 'NC', 'GA'];

const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateLoremIpsum = (paragraphs: number, startWithLorem: boolean): string => {
  const result: string[] = [];
  
  for (let p = 0; p < paragraphs; p++) {
    const sentenceCount = getRandomNumber(4, 8);
    const sentences: string[] = [];
    
    for (let s = 0; s < sentenceCount; s++) {
      const wordCount = getRandomNumber(8, 15);
      const words: string[] = [];
      
      for (let w = 0; w < wordCount; w++) {
        if (p === 0 && s === 0 && w === 0 && startWithLorem) {
          words.push('Lorem');
        } else if (p === 0 && s === 0 && w === 1 && startWithLorem) {
          words.push('ipsum');
        } else if (p === 0 && s === 0 && w === 2 && startWithLorem) {
          words.push('dolor');
        } else {
          words.push(getRandomElement(loremWords));
        }
      }
      
      let sentence = words.join(' ');
      sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
      sentences.push(sentence);
    }
    
    result.push(sentences.join(' '));
  }
  
  return result.join('\n\n');
};

const generateEmails = (count: number): string => {
  const emails: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const username = getRandomElement(firstNames).toLowerCase() + 
                   getRandomElement(lastNames).toLowerCase() + 
                   getRandomNumber(1, 999);
    const domain = getRandomElement(domains);
    emails.push(`${username}@${domain}`);
  }
  
  return emails.join('\n');
};

const generateUsernames = (count: number): string => {
  const usernames: string[] = [];
  const prefixes = ['smart', 'cool', 'super', 'mega', 'ultra', 'pro', 'elite', 'master', 'king', 'queen'];
  const suffixes = ['user', 'player', 'gamer', 'ninja', 'warrior', 'hero', 'legend', 'star', 'champion', 'winner'];
  
  for (let i = 0; i < count; i++) {
    const type = getRandomNumber(1, 3);
    let username = '';
    
    if (type === 1) {
      username = getRandomElement(prefixes) + getRandomElement(suffixes) + getRandomNumber(1, 999);
    } else if (type === 2) {
      username = getRandomElement(firstNames).toLowerCase() + getRandomNumber(10, 99);
    } else {
      username = getRandomElement(firstNames).toLowerCase() + '_' + getRandomElement(lastNames).toLowerCase();
    }
    
    usernames.push(username);
  }
  
  return usernames.join('\n');
};

const generatePasswords = (count: number, passwordLength: number, includeUppercase: boolean, includeLowercase: boolean, includeNumbers: boolean, includeSymbols: boolean): string => {
  const passwords: string[] = [];
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  for (let i = 0; i < count; i++) {
    let charset = '';
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    
    if (charset === '') charset = lowercase; // Fallback
    
    let password = '';
    for (let j = 0; j < passwordLength; j++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    passwords.push(password);
  }
  
  return passwords.join('\n');
};

const generateNames = (count: number): string => {
  const names: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    names.push(`${firstName} ${lastName}`);
  }
  
  return names.join('\n');
};

const generateAddresses = (count: number): string => {
  const addresses: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const streetNumber = getRandomNumber(100, 9999);
    const streetName = getRandomElement(streetNames);
    const city = getRandomElement(cities);
    const state = getRandomElement(states);
    const zipCode = getRandomNumber(10000, 99999);
    
    addresses.push(`${streetNumber} ${streetName}, ${city}, ${state} ${zipCode}`);
  }
  
  return addresses.join('\n');
};

const generatePhoneNumbers = (count: number): string => {
  const phoneNumbers: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const areaCode = getRandomNumber(200, 999);
    const exchange = getRandomNumber(200, 999);
    const number = getRandomNumber(1000, 9999);
    
    phoneNumbers.push(`(${areaCode}) ${exchange}-${number}`);
  }
  
  return phoneNumbers.join('\n');
};

const generateCreditCards = (count: number): string => {
  const creditCards: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate fake credit card numbers (not real)
    const prefix = getRandomElement(['4', '5', '3', '6']); // Visa, MC, Amex, Discover
    let number = prefix;
    
    for (let j = 1; j < 16; j++) {
      number += getRandomNumber(0, 9).toString();
    }
    
    // Format with spaces
    const formatted = number.match(/.{1,4}/g)?.join(' ') || number;
    creditCards.push(formatted);
  }
  
  return creditCards.join('\n');
};

const generateUrls = (count: number): string => {
  const urls: string[] = [];
  const protocols = ['https://', 'http://'];
  const subdomains = ['', 'www.', 'api.', 'blog.', 'shop.'];
  const paths = ['', '/home', '/about', '/contact', '/products', '/services', '/blog'];
  
  for (let i = 0; i < count; i++) {
    const protocol = getRandomElement(protocols);
    const subdomain = getRandomElement(subdomains);
    const domain = getRandomElement(urlDomains);
    const path = getRandomElement(paths);
    
    urls.push(`${protocol}${subdomain}${domain}${path}`);
  }
  
  return urls.join('\n');
};

const generateSentences = (count: number): string => {
  const sentences: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const wordCount = getRandomNumber(8, 15);
    const words: string[] = [];
    
    for (let j = 0; j < wordCount; j++) {
      words.push(getRandomElement(loremWords));
    }
    
    let sentence = words.join(' ');
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    sentences.push(sentence);
  }
  
  return sentences.join('\n');
};

const generateWords = (count: number): string => {
  const words: string[] = [];
  
  for (let i = 0; i < count; i++) {
    words.push(getRandomElement(loremWords));
  }
  
  return words.join('\n');
};

export function RandomTextGenerator() {
  const [options, setOptions] = useState<GeneratorOptions>({
    textType: 'lorem-ipsum',
    count: 3,
    startWithLorem: false,
    passwordLength: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
  });
  const [generatedText, setGeneratedText] = useState('');



  const generateText = useCallback(() => {
    let text = '';
    
    switch (options.textType) {
      case 'lorem-ipsum':
        text = generateLoremIpsum(options.count, options.startWithLorem);
        break;
      case 'emails':
        text = generateEmails(options.count);
        break;
      case 'usernames':
        text = generateUsernames(options.count);
        break;
      case 'passwords':
        text = generatePasswords(options.count, options.passwordLength, options.includeUppercase, options.includeLowercase, options.includeNumbers, options.includeSymbols);
        break;
      case 'names':
        text = generateNames(options.count);
        break;
      case 'addresses':
        text = generateAddresses(options.count);
        break;
      case 'phone-numbers':
        text = generatePhoneNumbers(options.count);
        break;
      case 'credit-cards':
        text = generateCreditCards(options.count);
        break;
      case 'urls':
        text = generateUrls(options.count);
        break;
      case 'sentences':
        text = generateSentences(options.count);
        break;
      case 'words':
        text = generateWords(options.count);
        break;
    }
    
    setGeneratedText(text);
  }, [options]);

  const handleCopy = async () => {
    await copyToClipboard(generatedText);
  };

  const downloadAsText = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-${options.textType}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const textTypes = [
    { value: 'lorem-ipsum', label: 'Lorem Ipsum' },
    { value: 'emails', label: 'Email Addresses' },
    { value: 'usernames', label: 'Usernames' },
    { value: 'passwords', label: 'Passwords' },
    { value: 'names', label: 'Full Names' },
    { value: 'addresses', label: 'Addresses' },
    { value: 'phone-numbers', label: 'Phone Numbers' },
    { value: 'credit-cards', label: 'Credit Card Numbers' },
    { value: 'urls', label: 'URLs' },
    { value: 'sentences', label: 'Sentences' },
    { value: 'words', label: 'Words' },
  ];

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.RandomTextGenerator}
      secondaryToolDescription="Generate various types of random text instantly with this easy-to-use and free tool. Create lorem ipsum, passwords, usernames, sample data, and more. No sign-up, no tracking — simply select your options and generate text in seconds."
    >
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Online Text Generator</h2>
          <p className="text-gray-700 mb-6">
            Generate various types of text content instantly with this easy-to-use and free tool. Create lorem ipsum, passwords, usernames, sample data, and more. No sign-up, no tracking — simply select your options and generate text in seconds.
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Generating Text Now</h3>
            <p className="text-gray-600 mb-4">
              Choose your text type, customize your preferences, and click generate to create your content. Perfect for developers, designers, writers, and anyone needing placeholder or sample text.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Options Panel */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Type
                </label>
                <select
                  value={options.textType}
                  onChange={(e) => setOptions({...options, textType: e.target.value as TextType})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {textTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {options.textType === 'lorem-ipsum' ? 'Number of Paragraphs' : 
                   options.textType === 'passwords' ? 'Number of Passwords' :
                   `Number of ${textTypes.find(t => t.value === options.textType)?.label || 'Items'}`}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={options.count}
                  onChange={(e) => setOptions({...options, count: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {options.textType === 'lorem-ipsum' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="startWithLorem"
                    checked={options.startWithLorem}
                    onChange={(e) => setOptions({...options, startWithLorem: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="startWithLorem" className="text-sm text-gray-700">
                    Start with &ldquo;Lorem ipsum dolor...&rdquo;
                  </label>
                </div>
              )}

              {options.textType === 'passwords' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Length
                    </label>
                    <input
                      type="number"
                      min="4"
                      max="100"
                      value={options.passwordLength}
                      onChange={(e) => setOptions({...options, passwordLength: parseInt(e.target.value) || 12})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="uppercase"
                        checked={options.includeUppercase}
                        onChange={(e) => setOptions({...options, includeUppercase: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="uppercase" className="text-sm text-gray-700">Include Uppercase (A-Z)</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="lowercase"
                        checked={options.includeLowercase}
                        onChange={(e) => setOptions({...options, includeLowercase: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="lowercase" className="text-sm text-gray-700">Include Lowercase (a-z)</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="numbers"
                        checked={options.includeNumbers}
                        onChange={(e) => setOptions({...options, includeNumbers: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="numbers" className="text-sm text-gray-700">Include Numbers (0-9)</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="symbols"
                        checked={options.includeSymbols}
                        onChange={(e) => setOptions({...options, includeSymbols: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="symbols" className="text-sm text-gray-700">Include Symbols (!@#$%^&*)</label>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={generateText}
                className="w-full px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Generate Text
              </button>
            </div>

            {/* Output Panel */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Text:
                </label>
                <pre
                  className="whitespace-pre-wrap text-sm text-gray-800 font-mono bg-gray-50 p-4 border border-gray-300 rounded-md h-64 overflow-y-auto"
                >
                  {generatedText || 'Click "Generate Text" to create content...'}
                </pre>
              </div>

              {generatedText && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Copy to Clipboard
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

        {/* Educational Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Random Text Generator Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Text Types Available</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• <strong>Lorem Ipsum:</strong> Classic placeholder text for design and development</li>
                <li>• <strong>Email Addresses:</strong> Realistic fake email addresses for testing</li>
                <li>• <strong>Usernames:</strong> Creative username combinations</li>
                <li>• <strong>Passwords:</strong> Secure random passwords with custom options</li>
                <li>• <strong>Names:</strong> Full names for sample user data</li>
                <li>• <strong>Addresses:</strong> Realistic street addresses</li>
                <li>• <strong>Phone Numbers:</strong> US format phone numbers</li>
                <li>• <strong>Credit Cards:</strong> Fake card numbers for testing (not real)</li>
                <li>• <strong>URLs:</strong> Sample website addresses</li>
                <li>• <strong>Sentences & Words:</strong> Random text content</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Use Cases</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Website and app design mockups</li>
                <li>• Database testing and development</li>
                <li>• Content management system testing</li>
                <li>• Form testing and validation</li>
                <li>• Email template design</li>
                <li>• Print design layouts</li>
                <li>• API testing with sample data</li>
                <li>• User interface prototyping</li>
                <li>• Educational examples and tutorials</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notice</h4>
            <p className="text-yellow-700 text-sm">
              All generated data is for testing and placeholder purposes only. Credit card numbers are fake and cannot be used for real transactions. 
              Do not use generated passwords for actual accounts without proper security considerations.
            </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}