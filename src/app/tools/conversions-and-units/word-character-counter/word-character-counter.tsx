'use client';
import React, { useState, useMemo } from 'react';
import ToolLayout from '../../toolLayout';
import { ToolNameLists } from '@/constants/tools';
import { BookIcon, FacebookIcon, XIcon, InstagramIcon, LinkedInIcon } from '@/components/social-icon';

const CHARACTER_LIMIT = 500;
const SOCIAL_ICON_SIZE = .75;

const socialIcons = [
  { platform: 'Instagram', limit: 150, icon: <InstagramIcon scale={SOCIAL_ICON_SIZE} /> },
  { platform: 'Facebook', limit: 250, icon: <FacebookIcon scale={SOCIAL_ICON_SIZE} /> },
  { platform: 'X', limit: 280, icon: <XIcon scale={SOCIAL_ICON_SIZE} /> },
  { platform: 'LinkedIn', limit: 300, icon: <LinkedInIcon scale={SOCIAL_ICON_SIZE} /> },
  { platform: 'Average Post', limit: 1500, icon: <BookIcon scale={SOCIAL_ICON_SIZE} /> }
];

interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  averageWordsPerSentence: number;
  averageSentencesPerParagraph: number;
}

export function WordCharacterCounter() {
  const [text, setText] = useState('');
  const [includeSpaces, setIncludeSpaces] = useState(true);

  // Calculate text statistics
  const stats = useMemo((): TextStats => {
    if (!text.trim()) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        averageWordsPerSentence: 0,
        averageSentencesPerParagraph: 0
      };
    }

    // Words count
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    
    // Characters count
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Sentences count (split by . ! ? and filter empty)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    // Paragraphs count (split by double newlines or single newlines, filter empty)
    const paragraphs = text.split(/\n\s*\n|\n/).filter(p => p.trim().length > 0).length;
    
    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);
    
    // Averages
    const averageWordsPerSentence = sentences > 0 ? Math.round((words / sentences) * 100) / 100 : 0;
    const averageSentencesPerParagraph = paragraphs > 0 ? Math.round((sentences / paragraphs) * 100) / 100 : 0;

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      averageWordsPerSentence,
      averageSentencesPerParagraph
    };
  }, [text]);

  const clearText = () => {
    setText('');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // Sample texts for quick testing
  const sampleTexts = [
    {
      name: 'Short Article',
      content: 'The quick brown fox jumps over the lazy dog. This is a classic pangram sentence that contains every letter of the alphabet at least once. It is commonly used for typing practice and font testing.\n\nPangrams are useful in typography because they help designers see how all the letters look together in a particular font. They also help test keyboard layouts and typing speed.'
    },
    {
      name: 'Business Email',
      content: 'Dear Mr. Johnson,\n\nI hope this email finds you well. I am writing to follow up on our meeting last week regarding the upcoming product launch. As discussed, I have prepared a detailed timeline and budget breakdown for your review.\n\nPlease let me know if you have any questions or would like to schedule another meeting to discuss the details further.\n\nBest regards,\nSarah Thompson'
    },
    {
      name: 'Blog Post Excerpt',
      content: 'In today\'s digital age, content creation has become more important than ever. Whether you\'re writing blog posts, social media updates, or marketing copy, understanding your text statistics can help you optimize your content for better engagement.\n\nWord count matters for SEO. Search engines favor content that provides comprehensive coverage of topics, typically requiring 300-1500 words for blog posts. Character count is crucial for social media platforms where space is limited.\n\nSentence structure affects readability. Shorter sentences are easier to read and understand, while varied sentence length creates better flow and keeps readers engaged.'
    }
  ];

  // Get readability assessment
  const getReadabilityAssessment = () => {
    if (stats.words === 0) return { level: 'n/a', color: 'gray' };
    
    if (stats.averageWordsPerSentence <= 15) {
      return { level: 'Very Easy', color: 'green' };
    } else if (stats.averageWordsPerSentence <= 20) {
      return { level: 'Easy', color: 'blue' };
    } else if (stats.averageWordsPerSentence <= 25) {
      return { level: 'Moderate', color: 'yellow' };
    } else if (stats.averageWordsPerSentence <= 30) {
      return { level: 'Difficult', color: 'orange' };
    } else {
      return { level: 'Very Difficult', color: 'red' };
    }
  };

  const readability = getReadabilityAssessment();

  return (
    <ToolLayout 
      toolCategory={ToolNameLists.WordCharacterCounter}
      secondaryToolDescription="Perfect for writing, content creation, and text analysis."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Your Text</h2>
            
            <div className="mb-4">
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Type or paste your text here..."
                className="w-full h-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                style={{ lineHeight: '1.5' }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={clearText}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-00 text-white rounded transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Social Media Limits */}
            <div className="bg-gray-100 rounded-lg p-6 ">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Media Character Limits</h2>
              
              <div className="w-[90%] m-auto">
                {/* Social Icons in One Line */}
                <div className="flex items-center justify-center space-x-8 mb-10">
                  {socialIcons.map(({ platform, limit, icon }) => {
                    const percentage = Math.min((stats.characters / limit) * 100, 100);
                    const isOverLimit = stats.characters > limit;
                    
                    return (
                      <div key={platform} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 border border-white ${
                          isOverLimit ? 'bg-red-100' : 
                          percentage > 80 ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          {icon}
                        </div>
                        <div className="text-xs text-center">
                          <div className="font-medium text-gray-900">{platform}</div>
                          <div className={`${isOverLimit ? 'text-red-600' : 'text-gray-600'}`}>
                            {stats.characters}/{limit}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Progress Bar */}
                <div className="relative">
                  <div className="text-gray-500 mb-2 text-xs">
                    {/* Markers for different platforms */}
                    {
                      socialIcons.map(({ platform, limit }) => {
                        const adjustedLimit = limit > CHARACTER_LIMIT ? CHARACTER_LIMIT : limit;
                        const leftPercent = ((adjustedLimit / CHARACTER_LIMIT) * 100) - 1;
                        return (
                          <div 
                            key={`marker-${platform}`}
                            style={{ 
                              left: `${leftPercent}%`,
                              position: 'absolute',
                              top: '-1.5rem',
                            }}
                          >
                            <span>{limit}</span>
                          </div>
                        );
                      })
                    }
                  </div>
                  <div className="bg-white rounded-full h-3 relative overflow-hidden">
                    <div 
                      className="h-3 bg-orange-500 rounded-full transition-all duration-300 absolute left-0 top-0"
                      style={{ 
                        width: `${Math.min((stats.characters / CHARACTER_LIMIT) * 100, 100)}%`
                      }}
                    ></div>
                    {/* Markers for different platforms */}
                    {
                      socialIcons.map(({ platform, limit }) => {
                        const adjustedLimit = limit > CHARACTER_LIMIT ? CHARACTER_LIMIT : limit;
                        const leftPercent = (adjustedLimit / CHARACTER_LIMIT) * 100;
                        return (
                          <div 
                            key={platform}
                            className="absolute top-0 h-3 border-l-2 border-white"
                            style={{ left: `${leftPercent}%` }}
                          >
                            <div className="absolute -top-4 -left-1 text-xs text-gray-600">
                              {platform}
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600">
                    {stats.characters} characters
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Text Statistics</h2>
            
            <div className="space-y-4 mb-6">
              {/* Words */}
              <div className="bg-blue-50 rounded-lg p-4 relative flex justify-between items-start">
                <div className="text-sm text-gray-600">Words</div>
                <div className="text-xl font-bold text-gray-900">{stats.words.toLocaleString()}</div>
              </div>

              {/* Characters */}
              <div className="bg-green-50 rounded-lg p-4 relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-600">Characters</div>
                  <div className="text-xl font-bold text-gray-900">
                    {(includeSpaces ? stats.characters : stats.charactersNoSpaces).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className="flex items-center text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={includeSpaces}
                      onChange={(e) => setIncludeSpaces(e.target.checked)}
                      className="mr-2"
                    />
                    Include spaces
                  </label>
                </div>
              </div>

              {/* Sentences */}
              <div className="bg-purple-50 rounded-lg p-4 relative flex justify-between items-start">
                <div className="text-sm text-gray-600">Sentences</div>
                <div className="text-xl font-bold text-gray-900">{stats.sentences.toLocaleString()}</div>
              </div>

              {/* Paragraphs */}
              <div className="bg-orange-50 rounded-lg p-4 relative flex justify-between items-start">
                <div className="text-sm text-gray-600">Paragraphs</div>
                <div className="text-xl font-bold text-gray-900">{stats.paragraphs.toLocaleString()}</div>
              </div>

              {/* Additional Stats */}
              <div className="bg-pink-50 rounded-lg p-3 flex justify-between items-start">
                <div className="text-sm text-gray-600">Reading time</div>
                <div className="text-xl font-semibold text-gray-900">
                  &lt;{stats.readingTime} min
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-start">
                <div className="text-sm text-gray-600">Readability</div>
                <div className={`text-xl font-semibold ${
                  readability.color === 'green' ? 'text-green-600' :
                  readability.color === 'blue' ? 'text-blue-600' :
                  readability.color === 'yellow' ? 'text-yellow-600' :
                  readability.color === 'orange' ? 'text-orange-600' :
                  readability.color === 'red' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {readability.level}
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Detailed Analysis</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">{stats.averageWordsPerSentence}</div>
                  <div className="text-xs text-gray-600">Avg Words/Sentence</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">{stats.averageSentencesPerParagraph}</div>
                  <div className="text-xs text-gray-600">Avg Sentences/Paragraph</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">{stats.charactersNoSpaces}</div>
                  <div className="text-xs text-gray-600">Characters (no spaces)</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl font-bold text-gray-900">{stats.words > 0 ? Math.round(stats.characters / stats.words * 100) / 100 : 0}</div>
                  <div className="text-xs text-gray-600">Avg Characters/Word</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Texts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Texts</h3>
          <div className="space-y-2">
            {sampleTexts.map((sample, index) => (
              <button
                key={index}
                onClick={() => setText(sample.content)}
                className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-orange-100 rounded transition-colors"
              >
                <span className="font-semibold text-gray-900">{sample.name}</span>
                <div className="text-xs text-gray-600 mt-1 truncate">{sample.content.substring(0, 100)}...</div>
              </button>
            ))}
          </div>
        </div>

        {/* Educational Content */}
        <div>
          <h3>How to Use This Word Character Counter</h3>
          <p className="text-gray-700 mb-4">
            Our text analysis tool provides comprehensive statistics about your content including word count, character count, readability analysis, and social media compatibility. Simply paste or type your text to get instant analysis and insights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-300 p-4 rounded-lg">
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Content Writing</h4>
              <p className="text-sm">
                Perfect for bloggers, copywriters, and content creators who need to meet specific word count requirements and optimize readability for their audience.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Academic Writing</h4>
              <p className="text-sm">
                Essential for students and researchers working on essays, papers, and dissertations with strict word and character limits.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">Social Media</h4>
              <p className="text-sm">
                Optimize your posts for different platforms with real-time character limit tracking for Twitter, Facebook, Instagram, and LinkedIn.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-2">SEO Optimization</h4>
              <p className="text-sm">
                Ensure your content meets SEO best practices with appropriate word counts, readability scores, and content structure analysis.
              </p>
            </div>
          </div>

          <h3>Understanding Text Statistics</h3>
          <ul className="list-disc list-outside space-y-2 text-gray-700 mb-6 pl-5">
            <li><strong>Word Count:</strong> Total number of words separated by spaces. Important for SEO, academic requirements, and content planning.</li>
            <li><strong>Character Count:</strong> Total characters including or excluding spaces. Critical for social media posts and SMS messages.</li>
            <li><strong>Readability:</strong> Based on average words per sentence. Shorter sentences improve readability and user engagement.</li>
            <li><strong>Reading Time:</strong> Estimated time based on average reading speed of 200 words per minute.</li>
            <li><strong>Sentence Structure:</strong> Helps analyze writing style and identify opportunities for improved flow and clarity.</li>
          </ul>

          <h3>Tips for Better Content</h3>
          <div className="bg-yellow-50 rounded-lg p-4">
            <ul className="space-y-2 text-yellow-800 text-sm">
              <li><strong>Aim for 15-20 words per sentence</strong> for optimal readability</li>
              <li><strong>Vary sentence length</strong> to create engaging rhythm and flow</li>
              <li><strong>Use shorter paragraphs</strong> for web content (2-3 sentences max)</li>
              <li><strong>Check platform limits</strong> before posting on social media</li>
              <li><strong>Target 300-1500 words</strong> for SEO-optimized blog posts</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}