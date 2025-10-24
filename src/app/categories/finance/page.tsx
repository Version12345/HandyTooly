import { ToolCategory, Tools } from '@/constants/tools';
import Link from 'next/link';
import { Metadata } from 'next';
import CategoryLayout from '../categoryLayout';
import FinancialDisclaimer from '@/components/disclaimers/financialDisclaimer';

export const metadata: Metadata = {
  title: 'Finance Tools - Financial Calculators & Planning Tools',
  description: 'Financial planning and assessment tools including debt-to-income calculator, budget planners, and other financial health tools.',
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
          Assess your debt-to-income ratio, plan budgets, and make informed financial decisions.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {financeTools.map((tool, index) => (
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
              Know your debt-to-income ratio before applying for mortgages or loans. 
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