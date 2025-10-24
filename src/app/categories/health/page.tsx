import { ToolCategory, Tools } from '@/constants/tools';
import Link from 'next/link';
import { Metadata } from 'next';

import MedicalDisclaimer from '@/components/disclaimers/medicalDisclaimer';
import CategoryLayout from '../categoryLayout';

export const metadata: Metadata = {
  title: 'Health Tools - BMI Calculator & Wellness Tools',
  description: 'Health and wellness calculators including BMI calculator, body fat estimation, and other health assessment tools.',
};

export default function HealthCategory() {
  const healthTools = Tools[ToolCategory.Health] || [];

  return (
    <CategoryLayout 
      pageTitle="Health & Wellness Tools" 
      disclaimer={<MedicalDisclaimer />}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <p>
            Track your health metrics and make informed decisions about your wellness journey. 
            Calculate BMI, monitor body composition, and assess your overall health status.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {healthTools.map((tool, index) => (
            <Link 
              key={index} 
              href={tool.link}
              className="block bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-orange-600 group-hover:text-orange-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {tool.description}
                </p>
                <div className="flex items-center text-orange-500 text-sm font-medium">
                  <span>Calculate now</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Category Description */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Why Track Your Health Metrics?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Monitor Progress</h3>
              <p className="text-sm">
                Regular health tracking helps you understand trends in your wellness journey 
                and make data-driven decisions about your lifestyle.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Set Realistic Goals</h3>
              <p className="text-sm">
                Understanding your current health status helps you set achievable, 
                science-based goals for improvement.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Early Detection</h3>
              <p className="text-sm">
                Regular monitoring can help identify potential health concerns early, 
                allowing for timely intervention and prevention.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Healthcare Communication</h3>
              <p className="text-sm">
                Having accurate health metrics makes conversations with healthcare providers 
                more productive and informed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
}