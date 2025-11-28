import HomeAffordabilityCalculator from './mortgage-affordability-calculator';
import { Metadata } from 'next';
import { ToolDescription, ToolNameLists, ToolUrls} from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.MortgageAffordabilityCalculator,
  description: ToolDescription[ToolNameLists.MortgageAffordabilityCalculator],
  keywords: "mortgage affordability calculator, home affordability calculator, mortgage calculator, home loan calculator, mortgage payment calculator, home buying calculator",
  openGraph: {
    title: ToolNameLists.MortgageAffordabilityCalculator,
    description: ToolDescription[ToolNameLists.MortgageAffordabilityCalculator],
    type: "website",
    url: canonicalUrl(`${ToolUrls[ToolNameLists.MortgageAffordabilityCalculator]}`, true),
  },
  alternates: {
    canonical: canonicalUrl(`${ToolUrls[ToolNameLists.MortgageAffordabilityCalculator]}`, true),
  },
};

export default function Page() {
  return <HomeAffordabilityCalculator />;
}