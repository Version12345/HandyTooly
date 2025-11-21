'use client';
import React, { useState, useCallback } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { copyToClipboard } from '@/utils/copyToClipboard';
import DataDisclaimer from '@/components/disclaimers/dataDisclaimer';

type TextType = 'lorem-ipsum' | 'emails' | 'usernames' | 'names' | 'addresses' | 'phone-numbers' | 'credit-cards' | 'urls' | 'sentences' | 'words';

interface GeneratorOptions {
  textType: TextType;
  count: number;
  startWithLorem: boolean;
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
    { value: 'lorem-ipsum', label: 'Placeholder Text (Lorem Ipsum)' },
    { value: 'emails', label: 'Email Addresses' },
    { value: 'usernames', label: 'Usernames' },
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
      secondaryToolDescription="Simply select your options and generate text in seconds. For secure passwords, check out our dedicated Password Generator."
      educationContent={educationContent}
      disclaimer={<DataDisclaimer />}
    >
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Options Panel */}
          <div className="space-y-4 bg-white p-4 shadow-md rounded-md">
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



            <button
              onClick={generateText}
              className="w-full px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-700 transition-colors"
            >
              Generate Text
            </button>
          </div>

          {/* Output Panel */}
          <div className="space-y-4 bg-white p-4 shadow-md rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generated Text
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
                  className="px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-700 transition-colors text-sm"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={downloadAsText}
                  className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors text-sm"
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
    <h3>Random Text Generator Features</h3>
    <p>The Random Text Generator is a versatile tool designed to create realistic placeholder and sample data for a wide range of projects. It simplifies testing, design, and development by producing accurate and varied text elements that mimic real-world data without compromising privacy or security.</p>
    
    <h3>Text Types Available</h3>
    <p>This generator offers a diverse selection of text options to suit different needs. You can create Lorem Ipsum for traditional placeholder text, email addresses and usernames for testing login systems, or names, addresses, and phone numbers to populate sample databases. It also includes credit card numbers for testing (non-functional and safe), URLs for website examples, and sentences or words for content layout and readability checks.</p>
    
    <h3>Use Cases</h3>
    <p>The Random Text Generator is ideal for website and app mockups, database testing, and form validation. It’s also useful for email template design, print layout previews, and API testing with sample data. Designers and developers can quickly generate realistic placeholder content for user interface prototypes, while educators can use it for teaching examples and tutorials.</p>
  </div>
);