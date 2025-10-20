import React from 'react';

interface LayoutProps {
  pageTitle: string;
  children: React.ReactNode;
}

export default function ToolLayout({ pageTitle, children }: LayoutProps) {
  return (
    <main className="pt-x-8 py-8 tool-layout"> 
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <h1>
            {pageTitle || 'HandyTooly'}
          </h1>

          {/* Page Content */}
          {children}
        </div>
    </main>
  );
}