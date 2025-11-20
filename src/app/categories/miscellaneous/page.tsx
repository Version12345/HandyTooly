import { ToolCategory, Tools } from '@/constants/tools';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

import CategoryLayout from '../categoryLayout';
import ToolCard from '@/components/toolCard';

export const metadata: Metadata = {
  title: 'Miscellaneous Tools - Free Online Utility Tools & Digital Helpers',
  description: 'Our utility tools cover essential digital tasks including data conversion, text processing, image manipulation, code formatting, and network diagnostics. Each tool is web-based, requiring no downloads or installations, and works seamlessly across all devices and browsers.',
  keywords: [
    'utility tools',
    'online tools',
    'digital tools',
    'data conversion',
    'text processing',
    'image manipulation',
    'code formatting',
    'network diagnostics',
    'web tools',
    'random text generator',
    'lorem ipsum generator',
    'password generator',
    'username generator',
    'sample data generator',
    'placeholder text',
    'fake data generator',
    'development tools',
    'testing tools',
    'mockup tools',
    'free online utilities'
  ],
  openGraph: {
    title: 'Miscellaneous Tools - Free Online Utility Tools & Digital Helpers',
    description: 'Our utility tools cover essential digital tasks including data conversion, text processing, image manipulation, code formatting, and network diagnostics. Each tool is web-based, requiring no downloads or installations, and works seamlessly across all devices and browsers.',
    type: 'website',
    url: canonicalUrl(`/categories/miscellaneous`, true),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miscellaneous Tools - Free Online Utility Tools & Digital Helpers',
    description: 'Our utility tools cover essential digital tasks including data conversion, text processing, image manipulation, code formatting, and network diagnostics. Each tool is web-based, requiring no downloads or installations, and works seamlessly across all devices and browsers.',
  },
  alternates: {
    canonical: canonicalUrl(`/categories/miscellaneous`),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function MiscellaneousCategory() {
  const miscellaneousTools = Tools[ToolCategory.Miscellaneous] || [];

  return (
    <CategoryLayout 
      pageTitle="Miscellaneous Tools" 
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <p>
            Our utility tools cover essential digital tasks including data conversion, text processing, image manipulation, 
            code formatting, and network diagnostics. Each tool is web-based, requiring no downloads or installations, 
            and works seamlessly across all devices and browsers.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {miscellaneousTools.map((tool, index) => (
            <ToolCard 
              key={index} 
              tool={tool}
              category="Miscellaneous"
              className="p-6"
            />
          ))}
        </div>

        {/* Category Description */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Why Use Digital Utility Tools?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Development & Testing</h3>
              <p className="text-sm">
                Essential tools for developers, designers, and testers who need placeholder content, 
                sample data, and various text formats for mockups and application testing.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Content Creation</h3>
              <p className="text-sm">
                Generate random text, usernames, passwords, and sample data instantly for content 
                creation, design projects, and database population without manual effort.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Cross-Platform Access</h3>
              <p className="text-sm">
                All tools are browser-based and work seamlessly across desktop, tablet, and mobile 
                devices without requiring downloads, installations, or account creation.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Privacy & Security</h3>
              <p className="text-sm">
                Generate secure passwords and sample data locally in your browser with no data 
                transmission to servers, ensuring your information remains private and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
}