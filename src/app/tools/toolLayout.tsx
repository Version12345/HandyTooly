'use client';

import { RightCol } from '@/components/rightCol';
import Breadcrumb from '@/components/breadcrumb';
import RelatedTools from '@/components/relatedTools';
import React, { useState, useEffect, useMemo } from 'react';
import { getSessionStorageItem, setSessionStorageItem } from '@/utils/sessionStorage';
import AdBanner from '@/components/adsBanner/adBanner';
import { ToolDescription, ToolNameLists, Tools, ToolCategory } from '@/constants/tools';
import ToolCard from '@/components/toolCard';

interface LayoutProps {
  toolCategory: ToolNameLists;
  secondaryToolDescription?: string;
  children: React.ReactNode;
  educationContent?: React.ReactNode;
  disclaimer?: React.ReactNode;
}

export default function ToolLayout({ toolCategory, children, disclaimer, secondaryToolDescription, educationContent }: LayoutProps) {
  const [isRightColExpanded, setIsRightColExpanded] = useState(true);
  
  // Floating menu state
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get all tools from all categories with icons
  const allTools = useMemo(() => {
    const toolsWithIcons: Array<{name: string, path: string, category: string, description: string}> = [];
    
    // Add tools from each category
    Object.entries(Tools).forEach(([category, tools]) => {
      tools.forEach(tool => {        
        toolsWithIcons.push({
          name: tool.name,
          path: tool.link,
          category: category,
          description: tool.description
        });
      });
    });
    
    return toolsWithIcons;
  }, []);

  // Filter tools based on search
  const filteredTools = useMemo(() => {
    if (!searchQuery) return allTools;
    return allTools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allTools]);

  useEffect(() => {
    const savedState = getSessionStorageItem('isRightColExpanded');

    if (savedState !== null && (savedState === 'true' || savedState === 'false')) {
      setIsRightColExpanded(JSON.parse(savedState));
    }
  }, []);

  // Prevent body scroll when search overlay is open
  useEffect(() => {
    if (showSearchOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSearchOverlay]);

  const toggleRightCol = () => {
    const newState = !isRightColExpanded;
    setIsRightColExpanded(newState);
    setSessionStorageItem('isRightColExpanded', JSON.stringify(newState));
  };

  return (
    <main className="p-8 pt-4 tool-layout"> 
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Heading with Toggle Button */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="mb-0">
            {toolCategory}
          </h1>
          
          {/* Toggle Button */}
          <button
            onClick={toggleRightCol}
            className="lg:flex hidden items-center gap-2 px-3 py-2 text-sm bg-orange-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            title={isRightColExpanded ? "Hide sidebar" : "Show sidebar"}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isRightColExpanded ? 'rotate-0' : 'rotate-180'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {isRightColExpanded ? 'Hide' : 'Show'} Sidebar
          </button>
        </div>

        <div className={`grid grid-cols-1 gap-8 ${isRightColExpanded ? 'lg:grid-cols-[75%_22%]' : 'lg:grid-cols-1'}`}>
          {/* Left Column */}
          <div>
            {/* Description */}
            {ToolDescription[toolCategory] && (
              <p className="text-sm">
                {ToolDescription[toolCategory]} {secondaryToolDescription}
              </p>
            )}
            {children}
            {educationContent ? (
              <div className="class-education-content">
                <hr className="my-6" />
                {educationContent}
              </div>
            ) : null}
            {disclaimer}

            {/* Related Tools Section */}
            <RelatedTools className="mt-8" />

            <AdBanner
              data-ad-slot="1993929346"
              data-full-width-responsive="true"
              data-ad-format="auto"
            />
          </div>
          
          {/* Right Column - Conditionally Rendered */}
          {isRightColExpanded && (
            <div className="transition-all duration-300">
              <RightCol
                title={toolCategory}
              />

              <div className="mt-8">
                <AdBanner
                  data-ad-slot="1993929346"
                  data-full-width-responsive="true"
                  data-ad-format="auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Related Tools Menu */}
        {showFloatingMenu && (
          <div className="absolute bottom-16 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]">
            {/* 
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
              Quick Tools
            </div>
            {[
              { name: 'Health & Wellness', icon: '❤️', category: ToolCategory.Health },
              { name: 'Finance & Money', icon: '💰', category: ToolCategory.Finance },
              { name: 'Conversions & Units', icon: '🔄', category: ToolCategory.Conversions },
              { name: 'Mathematics', icon: '🧮', category: ToolCategory.Mathematics },
              { name: 'Jobs & Career', icon: '💼', category: ToolCategory.Jobs },
              { name: 'Miscellaneous', icon: '🛠️', category: ToolCategory.Miscellaneous },
            ].map((toolCategory, index) => (
              <button
                key={index}
                onClick={() => {
                  setShowSearchOverlay(true);
                  setShowFloatingMenu(false);
                  setSearchQuery(toolCategory.category.toLowerCase());
                }}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <span className="text-lg">{toolCategory.icon}</span>
                <span className="text-sm font-medium text-gray-700">{toolCategory.name}</span>
              </button>
            ))} 
            <hr className="my-1" />
            */}
            <button
              onClick={() => {
                setShowSearchOverlay(true);
                setShowFloatingMenu(false);
                setSearchQuery('');
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
            >
              <span className="text-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <span className="text-sm font-medium text-gray-700">Search All Tools</span>
            </button>
          </div>
        )}

        {/* Cog Button */}
        <button
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Search Overlay */}
      {showSearchOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="bg-white w-full h-screen md:max-w-2xl shadow-xl flex flex-col z-50">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-200">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tools..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setShowSearchOverlay(false);
                  setSearchQuery('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="text-xs font-semibold mb-4">
                Search Results: {filteredTools.length} result{filteredTools.length !== 1 ? 's' : ''}
              </div>
              <div className="space-y-2">
                {filteredTools.map((tool, index) => (
                  <ToolCard 
                    key={index}
                    tool={{ name: tool.name, description: tool.description, link: tool.path }}
                    category={tool.category}
                    showCategoryLabel
                  />
                ))}
                {filteredTools.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-1.007-6-2.686C7.5 10.993 9.66 10 12 10s4.5.993 6 2.314c.478.4.883.84 1.172 1.296A7.966 7.966 0 0112 21a7.966 7.966 0 01-7.172-2.39z" />
                    </svg>
                    <p>No tools found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-gray-900/50 hover:cursor-pointer"
            onClick={() => {
              setShowSearchOverlay(false);
              setSearchQuery('');
            }}
          >
          </div>
        </div>
      )}
    </main>
  );
}