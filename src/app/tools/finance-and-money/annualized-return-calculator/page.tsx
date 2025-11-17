import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { AnnualizedReturnCalculator } from './annualized-return-calculator';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';

export const metadata: Metadata = {
  title: ToolNameLists.AnnualizedReturnCalculator,
  description: ToolDescription[ToolNameLists.AnnualizedReturnCalculator],
  keywords: 'annualized return calculator, CAGR calculator, investment performance, compound annual growth rate, investment returns, ROI calculator',
  openGraph: {
    title: ToolNameLists.AnnualizedReturnCalculator,
    description: ToolDescription[ToolNameLists.AnnualizedReturnCalculator],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.AnnualizedReturnCalculator]),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.AnnualizedReturnCalculator]),
  },
};

export default function Page() {
  return <AnnualizedReturnCalculator />;
}