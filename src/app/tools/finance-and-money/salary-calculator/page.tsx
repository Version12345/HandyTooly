import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { SalaryCalculator } from './salary-calculator';

export const metadata: Metadata = {
    title: ToolNameLists.SalaryCalculator,
    description: ToolDescription[ToolNameLists.SalaryCalculator],
    keywords: "salary calculator, take home pay calculator, net pay calculator, payroll calculator, tax calculator, salary conversion",
    openGraph: {
      title: ToolNameLists.SalaryCalculator,
      description: ToolDescription[ToolNameLists.SalaryCalculator],
      type: "website",
      url: canonicalUrl(ToolUrls[ToolNameLists.SalaryCalculator], true),
    },
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.SalaryCalculator]),
    },
};

export default function SalaryCalculatorPage() {
  return <SalaryCalculator />;
}