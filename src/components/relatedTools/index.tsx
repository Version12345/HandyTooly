'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import ToolCard from '@/components/toolCard';
import { Tools, ToolCategory, ToolCategorySlug } from '@/constants/tools';

interface RelatedToolsProps {
  className?: string;
}

export default function RelatedTools({ className = "" }: RelatedToolsProps) {
  const pathname = usePathname();

  const relatedTools = useMemo(() => {
    // Determine current category from pathname
    let currentCategory: string | null = null;
    let currentToolLink: string | null = null;

    if (pathname.includes(ToolCategorySlug.Health)) {
      currentCategory = ToolCategory.Health;
    } else if (pathname.includes(ToolCategorySlug.Finance)) {
      currentCategory = ToolCategory.Finance;
    } else if (pathname.includes(ToolCategorySlug.Conversions)) {
      currentCategory = ToolCategory.Conversions;
    } else if (pathname.includes(ToolCategorySlug.Jobs)) {
      currentCategory = ToolCategory.Jobs;
    } else if (pathname.includes(ToolCategorySlug.Miscellaneous)) {
      currentCategory = ToolCategory.Miscellaneous;
    } else if (pathname.includes(ToolCategorySlug.Mathematics)) {
      currentCategory = ToolCategory.Mathematics;
    } 

    // If no category found, return empty array
    if (!currentCategory) {
      return [];
    }

    // Get current tool link for exclusion
    currentToolLink = pathname;

    // Get tools from the same category, excluding current tool
    const categoryTools = Tools[currentCategory] || [];
    const filteredTools = categoryTools.filter(tool => tool.link !== currentToolLink);

    // If we have 3 or fewer tools (excluding current), return all
    if (filteredTools.length <= 3) {
      return filteredTools;
    }

    // Randomly select 3 tools
    return [...filteredTools]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [pathname]);

  // Don't render if no related tools
  if (relatedTools.length === 0) {
    return null;
  }

  return (
    <div className={`bg-slate-200 rounded-lg p-6 mb-10 ${className}`}>
      <h3 className="flex items-center">
        <svg className="w-5 h-5 mr-1 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
        Related Tools
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedTools.map((tool, index) => (
          <ToolCard 
            key={`${tool.name}-${index}`}
            tool={tool}
          />
        ))}
      </div>
    </div>
  );
}