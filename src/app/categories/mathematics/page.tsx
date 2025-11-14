import { ToolCategory, Tools } from '@/constants/tools';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

import CategoryLayout from '../categoryLayout';
import ToolCard from '@/components/toolCard';

export const metadata: Metadata = {
  title: 'Mathematics Tools - Statistical Calculators & Math Tools',
  description: 'Mathematical calculators and statistical analysis tools including mean, median, mode calculator, data analysis, and advanced mathematical computations.',
  keywords: [
    'mathematics calculator',
    'statistical calculator',
    'mean median mode calculator',
    'data analysis tools',
    'math tools',
    'statistics calculator',
    'mathematical analysis',
    'descriptive statistics',
    'central tendency calculator',
    'quartiles calculator',
    'outliers detection',
    'statistical measures',
    'mathematical formulas',
    'data set analysis',
    'mathematical computing',
    'statistical computing',
    'math homework help',
    'statistics homework',
    'mathematical tools online',
    'free math calculator'
  ],
  openGraph: {
    title: 'Mathematics Tools - Statistical Calculators & Math Tools',
    description: 'Mathematical calculators and statistical analysis tools including mean, median, mode calculator, data analysis, and advanced mathematical computations.',
    type: 'website',
    url: canonicalUrl(`/categories/mathematics`, true),
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mathematics Tools - Statistical Calculators & Math Tools',
    description: 'Mathematical calculators and statistical analysis tools including mean, median, mode calculator, data analysis, and advanced mathematical computations.',
  },
  alternates: {
    canonical: canonicalUrl(`/categories/mathematics`),
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

export default function MathematicsCategory() {
  const mathematicsTools = Tools[ToolCategory.Mathematics] || [];

  return (
    <CategoryLayout 
      pageTitle="Mathematics Tools" 
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <p>
            Powerful mathematical calculators and statistical analysis tools for students, researchers, and professionals. 
            Analyze data sets, calculate statistical measures, and solve complex mathematical problems with precision and ease.
          </p>
        </div>

        {/* Tools Grid */}
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

        {/* Category Description */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Why Use Mathematical Analysis Tools?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Academic Excellence</h3>
              <p className="text-sm">
                Perfect for students working on statistics homework, research projects, 
                and mathematical assignments requiring accurate calculations and analysis.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Professional Research</h3>
              <p className="text-sm">
                Essential for researchers, analysts, and professionals who need reliable 
                statistical analysis and mathematical computations for their work.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Data-Driven Decisions</h3>
              <p className="text-sm">
                Transform raw data into meaningful insights through comprehensive statistical 
                analysis including central tendency, variability, and outlier detection.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Learning & Understanding</h3>
              <p className="text-sm">
                Interactive calculations with detailed explanations help you understand 
                mathematical concepts and verify your manual calculations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
}