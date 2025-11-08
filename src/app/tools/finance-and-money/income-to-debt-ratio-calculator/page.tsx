import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { IncomeToDebtCalculator } from './income-to-debt-calculator';

export const metadata: Metadata = {
    title: ToolNameLists.IncomeToDebtRatioCalculator,
    description: ToolDescription[ToolNameLists.IncomeToDebtRatioCalculator],
    keywords: "debt to income ratio, DTI calculator, debt ratio calculator, income debt calculator, mortgage qualification, financial health",
    openGraph: {
      title: ToolNameLists.IncomeToDebtRatioCalculator,
      description: ToolDescription[ToolNameLists.IncomeToDebtRatioCalculator],
      type: "website",
      url: canonicalUrl(ToolUrls[ToolNameLists.IncomeToDebtRatioCalculator], true),
    },
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.IncomeToDebtRatioCalculator]),
    },
};

export default function DebtToIncomeCalculatorPage() {
  return <IncomeToDebtCalculator />;
}