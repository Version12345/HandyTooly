import { Metadata } from 'next';
import { BusinessDaysCalculator } from './business-days-calculator';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';

export const metadata: Metadata = {
  title: ToolNameLists.BusinessDaysCalculator,
  description: ToolDescription[ToolNameLists.BusinessDaysCalculator],
  keywords: 'business days calculator, working days calculator, weekdays between dates, business day counter, work days calculator, project timeline',
  openGraph: {
    title: ToolNameLists.BusinessDaysCalculator,
    description: ToolDescription[ToolNameLists.BusinessDaysCalculator],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.BusinessDaysCalculator], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.BusinessDaysCalculator]),
  },
};

export default function BusinessDaysCalculatorPage() {
  return <BusinessDaysCalculator />;
}