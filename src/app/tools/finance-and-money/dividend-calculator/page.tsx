import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import DividendCalculator from './dividend-calculator';


export const metadata: Metadata = {
  title: ToolNameLists.DividendCalculator,
  description: ToolDescription[ToolNameLists.DividendCalculator],
  keywords: "dividend calculator, dividend income, investment calculator, dividend growth, portfolio value, reinvestment strategy, financial planning, investment analysis",
  openGraph: {
    title: ToolNameLists.DividendCalculator,
    description: ToolDescription[ToolNameLists.DividendCalculator],
    type: "website",
    url: canonicalUrl(ToolUrls[ToolNameLists.DividendCalculator], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.DividendCalculator]),
  },
};

export default function DividendCalculatorPage() {
  return <DividendCalculator />;
}