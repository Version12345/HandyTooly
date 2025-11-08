import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { CompoundInterestCalculator } from './compound-interest-calculator';

export const metadata: Metadata = {
    title: ToolNameLists.CompoundInterestCalculator,
    description: ToolDescription[ToolNameLists.CompoundInterestCalculator],
    keywords: "compound interest calculator, investment calculator, savings calculator, interest rate calculator, financial calculator, retirement planning",
    openGraph: {
      title: ToolNameLists.CompoundInterestCalculator,
      description: ToolDescription[ToolNameLists.CompoundInterestCalculator],
      type: "website",
      url: canonicalUrl(ToolUrls[ToolNameLists.CompoundInterestCalculator], true),
    },
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.CompoundInterestCalculator]),
    },
};

export default function Page() {
  return <CompoundInterestCalculator />;
}