'use client';

import Breadcrumb from '@/components/breadcrumb';
import React from 'react';

interface LayoutProps {
  pageTitle: string;
  featuredImageUrl?: string;
  children: React.ReactNode;
}

export default function BlogLayout({ pageTitle, featuredImageUrl, children }: LayoutProps) {
  return (
    <main className="p-8 pt-4 blog-layout"> 
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb />
        <div className={`grid grid-cols-1 gap-8 lg:grid-cols-[75%_28%]`}>
          {/* Left Column */}
          <div className="rounded overflow-hidden shadow-lg bg-white">
            <div 
              className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" 
              style={{ backgroundImage: `url(${featuredImageUrl})` }} 
              title={pageTitle}
            >
            </div>
            <div className="px-6 py-4">
              <h1 className="mb-0">
                {pageTitle}
              </h1>
              {children}
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
            </div>
          </div>
          <div className="rounded overflow-hidden shadow-lg bg-white p-6">
            {/* Right Column */}
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}