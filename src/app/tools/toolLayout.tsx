import { RightCol } from '@/components/rightCol';
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
            {pageTitle}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[75%_25%] gap-8">
            <div>
              {/* Left Column */}
              {children}
            </div>
            <div>
              <RightCol
                title={pageTitle}
              />
            </div>
          </div>
        </div>
    </main>
  );
}