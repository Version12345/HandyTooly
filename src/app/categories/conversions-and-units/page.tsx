import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

import ToolCard from '../../../components/toolCard';
import { Categories, Tools, ToolCategory } from '../../../constants/tools';
import CategoryLayout from '../categoryLayout';

export const metadata: Metadata = {
  title: 'Conversions and Units - Measurement Conversion Tools',
  description: 'A collection of tools for converting and working with various units of measurement.',
  keywords: 'unit converter, measurement conversion, length converter, weight converter, volume converter, time converter, conversion tools, metric conversion',
  openGraph: {
    title: 'Conversions and Units - Measurement Conversion Tools',
    description: 'A collection of tools for converting and working with various units of measurement.',
    type: 'website',
    url: canonicalUrl(`/categories/conversions-and-units`, true),
  },
  alternates: {
    canonical: canonicalUrl(`/categories/conversions-and-units`),
  },
};

export default function ConversionsAndUnitsPage() {
  const category = Categories[ToolCategory.Conversions];
  const categoryTools = Tools[ToolCategory.Conversions] || [];

  return (
    <CategoryLayout 
        pageTitle="Conversions and Units"
    >
        {/* Page Header */}
        <div className="space-y-4">
            <p>
                Explore our variety of conversion and unit tools to easily convert measurements
            </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {categoryTools.map((tool, index) => (
            <ToolCard
                key={`${tool.name}-${index}`}
                tool={tool}
                category={category.name}
                showCategoryLabel={false}
                className="transform hover:scale-105 transition-transform duration-200"
            />
            ))}
        </div>

        {/* Category Description */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Why Use Conversion Tools?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Save Time</h3>
              <p className="text-sm">
                Quickly convert between different units without manual calculations or searching 
                for conversion formulas online.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Accuracy</h3>
              <p className="text-sm">
                Get precise conversions with proper rounding and formatting, eliminating 
                human error from manual calculations.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Real-world Context</h3>
              <p className="text-sm">
                Understand measurements better with real-world comparisons and visual 
                representations that make abstract numbers meaningful.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Multiple Formats</h3>
              <p className="text-sm">
                View results in different formats (decimal, scientific notation, fractions) 
                and precision levels to suit your specific needs.
              </p>
            </div>
          </div>
        </div>

    </CategoryLayout>
  );
}