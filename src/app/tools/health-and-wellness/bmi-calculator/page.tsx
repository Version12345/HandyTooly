import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import BMICalculator from './bmi-caculator';

export const metadata: Metadata = {
    title: ToolNameLists.BMICalculator,
    description: ToolDescription[ToolNameLists.BMICalculator],
    keywords: "BMI calculator, body mass index, BMI chart, weight calculator, health calculator, obesity calculator, fitness calculator",
    openGraph: {
      title: ToolNameLists.BMICalculator,
      description: ToolDescription[ToolNameLists.BMICalculator],
      type: "website",
      url: canonicalUrl(ToolUrls[ToolNameLists.BMICalculator], true),
    },
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.BMICalculator]),
    },
};

export default function BMICalculatorPage() {
    return (
        <BMICalculator />
    );
};