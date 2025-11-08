import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { WeightLossCalculator } from './weight-loss-calculator';

export const metadata: Metadata = {
    title: ToolNameLists.WeightLossCalculator,
    description: ToolDescription[ToolNameLists.WeightLossCalculator],
    keywords: "weight loss calculator, weight loss percentage, BMI calculator, fitness tracker, health calculator, diet calculator",
    openGraph: {
      title: ToolNameLists.WeightLossCalculator,
      description: ToolDescription[ToolNameLists.WeightLossCalculator],
      type: "website",
      url: canonicalUrl(ToolUrls[ToolNameLists.WeightLossCalculator], true),
    },
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.WeightLossCalculator]),
    },
};

export default function WeightLossCalculatorPage() {
  return <WeightLossCalculator />;
}