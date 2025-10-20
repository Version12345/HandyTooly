"use client"
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

import { Tools } from '../constants/tools';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term with 3 seconds delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter tools based on debounced search term
  const filteredTools = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return Tools;
    }

    const filtered: Record<string, typeof Tools[string]> = {};
    
    Object.entries(Tools).forEach(([category, toolsList]) => {
      const filteredToolsList = toolsList.filter(tool =>
        tool.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      
      if (filteredToolsList.length > 0) {
        filtered[category] = filteredToolsList;
      }
    });

    return filtered;
  }, [debouncedSearchTerm]);

  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-6">
          <h1>
            <span className="text-4xl">
              The handy tools for every tasks
            </span>
          </h1>
          <p className="leading-relaxed">
            A collection of online tools for fast, free, and built for everyone.
          </p>
          
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="mt-8">
          {Object.keys(filteredTools).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tools found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          ) : (
            Object.entries(filteredTools).map(([category, toolsList]) => (
              <div key={category} className="mb-12">
                {/* Category Heading with Gray Underline */}
                <h2 className="text-2xl font-bold text-gray-900 pb-2 mb-8 border-b-2 border-gray-300">
                  {category}
                  {debouncedSearchTerm && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({toolsList.length} result{toolsList.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </h2>
                
                {/* Tools Grid - 3 columns on large screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {toolsList.map((tool, index) => (
                    <Link 
                      key={index} 
                      href={tool.link}
                      className="block bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed hidden md:block">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
