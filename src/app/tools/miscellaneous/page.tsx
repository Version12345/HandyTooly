import ToolCategoryComponent from '../../toolCategory';
import { ToolCategory } from '@/constants/tools';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Miscellaneous Tools - Free Online Utility Tools | HandyTooly',
  description: 'Our utility tools cover essential digital tasks including data conversion, text processing, image manipulation, code formatting, and network diagnostics. Each tool is web-based, requiring no downloads or installations, and works seamlessly across all devices and browsers.',
  keywords: 'utility tools, online tools, digital tools, data conversion, text processing, image manipulation, code formatting, network diagnostics, web tools',
  openGraph: {
    title: 'Miscellaneous Tools - Free Online Utility Tools',
    description: 'Our utility tools cover essential digital tasks including data conversion, text processing, image manipulation, code formatting, and network diagnostics. Each tool is web-based, requiring no downloads or installations, and works seamlessly across all devices and browsers.',
    type: 'website',
  },
};

export default function MiscellaneousToolsPage() {
  return <ToolCategoryComponent category={ToolCategory.Miscellaneous} />;
}