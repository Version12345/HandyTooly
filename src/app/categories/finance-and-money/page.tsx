import { ToolCategory, Tools } from '@/constants/tools';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';
import CategoryLayout from '../categoryLayout';
import FinancialDisclaimer from '@/components/disclaimers/financialDisclaimer';
import ToolCard from '@/components/toolCard';

export const metadata: Metadata = {
  title: 'Finance Tools - Financial Calculators & Planning Tools',
  description: 'Financial planning and assessment tools including income-to-debt calculator, budget planners, and other financial health tools.',
  keywords: 'financial calculator, debt to income calculator, salary calculator, compound interest calculator, inflation calculator, budget planner, financial planning tools',
  openGraph: {
    title: 'Finance Tools - Financial Calculators & Planning Tools',
    description: 'Financial planning and assessment tools including income-to-debt calculator, budget planners, and other financial health tools.',
    type: 'website',
    url: canonicalUrl(`/categories/finance-and-money`, true),
  },
  alternates: {
    canonical: canonicalUrl(`/categories/finance-and-money`),
  },
};

export default function FinanceCategory() {
  const financeTools = Tools[ToolCategory.Finance] || [];

  return (
    <CategoryLayout 
      pageTitle="Finance & Money Tools"
      disclaimer={<FinancialDisclaimer />}
    >
      {/* Page Header */}
      <div className="space-y-4">
        <p>
          Take control of your financial health with our comprehensive financial calculators. 
          Assess your income-to-debt ratio, plan budgets, and make informed financial decisions.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {financeTools.map((tool, index) => (
          <ToolCard 
            key={index} 
            tool={tool}
            category="Finance"
            className="p-6"
          />
        ))}
      </div>

      {/* Category Description */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Why Use Financial Planning Tools?
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Better Decision Making</h3>
            <p className="text-sm">
              Understanding your financial ratios and metrics helps you make informed decisions 
              about loans, investments, and major purchases.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Loan Approval</h3>
            <p className="text-sm">
              Know your income-to-debt ratio before applying for mortgages or loans. 
              Improve your chances of approval by understanding lender requirements.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Budget Planning</h3>
            <p className="text-sm">
              Calculate how much you can afford to spend on housing, cars, and other expenses 
              while maintaining healthy financial ratios.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Financial Health</h3>
            <p className="text-sm">
              Regular financial assessment helps you maintain healthy spending habits 
              and avoid over-leveraging your income.
            </p>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
}