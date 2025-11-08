import { ToolCategory, Tools } from '@/constants/tools';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';
import CategoryLayout from '../categoryLayout';
import ToolCard from '@/components/toolCard';

export const metadata: Metadata = {
  title: 'Jobs Tools - Resume & Career Tools',
  description: 'Professional job search and career development tools including resume builders, cover letter generators, and career planning resources.',
  keywords: 'resume builder, cover letter generator, job search tools, career development, resume optimizer, job application tools, career planning, AI resume builder',
  openGraph: {
    title: 'Jobs Tools - Resume & Career Tools',
    description: 'Professional job search and career development tools including resume builders, cover letter generators, and career planning resources.',
    type: 'website',
    url: canonicalUrl(`/categories/jobs-and-career`, true),
  },
  alternates: {
    canonical: canonicalUrl(`/categories/jobs-and-career`),
  },
};

export default function JobsCategory() {
  const jobsTools = Tools[ToolCategory.Jobs] || [];

  return (
    <CategoryLayout pageTitle="Jobs & Career Tools">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-4">
          <p>
            Professional tools to help you succeed in your job search and career development. 
            Create tailored resumes, write compelling cover letters, and optimize your job applications.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {jobsTools.map((tool, index) => (
            <ToolCard 
              key={index} 
              tool={tool}
              category="Jobs"
              className="p-6"
            />
          ))}
        </div>

        {/* Category Description */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Why Use Our Job Search Tools?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Save Time</h3>
              <p className="text-sm">
                Stop spending hours rewriting resumes for every job. Our tools help you quickly customize 
                your application materials to match specific job requirements.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Increase Success</h3>
              <p className="text-sm">
                Tailored resumes and cover letters significantly improve your chances of getting interviews. 
                Match your skills to what employers are looking for.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Professional Results</h3>
              <p className="text-sm">
                Generate polished, professional documents that highlight your strengths and 
                align with industry standards and best practices.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-sm">
                Simple, step-by-step process that guides you through creating compelling 
                job application materials without the complexity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
}