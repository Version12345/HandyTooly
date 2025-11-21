import ToolCard from '@/components/toolCard';
import ToolCategoryLayout from '../toolCategoryLayout';
import { ToolCategory, Tools } from '@/constants/tools';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: ToolCategory.Miscellaneous,
  description: 'Our utility tools cover essential digital tasks including data conversion, text processing, image manipulation, code formatting, and network diagnostics. Each tool is web-based, requiring no downloads or installations, and works seamlessly across all devices and browsers.',
  keywords: 'utility tools, online tools, digital tools, data conversion, text processing, image manipulation, code formatting, network diagnostics, web tools',
  openGraph: {
    title: 'Miscellaneous Tools - Free Online Utility Tools',
    description: 'Our utility tools cover essential digital tasks including data conversion, text processing, image manipulation, code formatting, and network diagnostics. Each tool is web-based, requiring no downloads or installations, and works seamlessly across all devices and browsers.',
    type: 'website',
  },
};

export default function MathematicsToolsPage() {
  const mathematicsTools = Tools[ToolCategory.Mathematics] || [];
  
  return <ToolCategoryLayout pageTitle="Mathematics Tools" >
    {/* Page Header */}
    <div className="space-y-4">
      <p>
        Our utility tools cover essential digital tasks including data conversion, text processing, formatting, and network diagnostics. Each tool is web-based, requiring no downloads or installations, and works seamlessly across all devices and browsers.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {mathematicsTools.map((tool, index) => (
        <ToolCard 
          key={index} 
          tool={tool}
          category="Mathematics"
          className="p-6"
        />
      ))}
    </div>
  </ToolCategoryLayout>;
}