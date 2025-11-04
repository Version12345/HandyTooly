'use client';

import { RightCol } from '@/components/rightCol';
import Breadcrumb from '@/components/breadcrumb';
import RelatedTools from '@/components/relatedTools';
import React, { useState, useEffect } from 'react';
import { getSessionStorageItem, setSessionStorageItem } from '@/utils/sessionStorage';
import AdBanner from '@/components/adsBanner/adBanner';

interface LayoutProps {
  pageTitle: string;
  children: React.ReactNode;
  disclaimer?: React.ReactNode;
}

export default function ToolLayout({ pageTitle, children, disclaimer }: LayoutProps) {
  const [isRightColExpanded, setIsRightColExpanded] = useState(true);

  useEffect(() => {
    const savedState = getSessionStorageItem('isRightColExpanded');

    if (savedState !== null && (savedState === 'true' || savedState === 'false')) {
      setIsRightColExpanded(JSON.parse(savedState));
    }
  }, []);

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
            {pageTitle}
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
          <div>
            {/* Left Column */}
            {children}
            {disclaimer}

            {/* Related Tools Section */}
            <RelatedTools className="mt-8" />

            <AdBanner
              data-ad-slot="slotnumber"
              data-full-width-responsive="true"
              data-ad-layout="in-article"
              data-ad-format="fluid"
            />
          </div>
          
          {/* Right Column - Conditionally Rendered */}
          {isRightColExpanded && (
            <div className="transition-all duration-300">
              <RightCol
                title={pageTitle}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}