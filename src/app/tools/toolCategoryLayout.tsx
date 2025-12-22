'use client';

import AdBanner from '@/components/adsBanner/adBanner';
import Breadcrumb from '@/components/breadcrumb';
import React from 'react';

interface LayoutProps {
  pageTitle: string;
  children: React.ReactNode;
  disclaimer?: React.ReactNode;
}

export default function ToolCategoryLayout({ pageTitle, children, disclaimer }: LayoutProps) {
  return (
    <main className="p-3 pt-4 tool-layout"> 
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Heading with Toggle Button */}
          <div className="flex justify-between items-center mb-2">
            <h1 className="mb-0">
              {pageTitle}
            </h1>
          </div>

          <div className={`grid grid-cols-1 gap-8 lg:grid-cols-1`}>
            <div>
              {/* Left Column */}
              {children}
              {disclaimer}

              <div className="mt-8">
                <AdBanner
                  data-ad-slot="1993929346"
                  data-full-width-responsive="true"
                  data-ad-format="auto"
                />
              </div>
            </div>
          </div>
        </div>
    </main>
  );
}