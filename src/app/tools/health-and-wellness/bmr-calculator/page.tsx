import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { BMRCalculator } from "./bmr-calculator";

export const metadata: Metadata = {
  title: ToolNameLists.BMRCalculator,
  description: ToolDescription[ToolNameLists.BMRCalculator],
  keywords: "BMR calculator, basal metabolic rate, daily calorie needs, TDEE calculator, calorie maintenance, weight loss calories, macronutrient breakdown, Harris Benedict, Mifflin St Jeor",
  openGraph: {
    title: ToolNameLists.BMRCalculator,
    description: ToolDescription[ToolNameLists.BMRCalculator],
    type: "website",
    url: canonicalUrl(ToolUrls[ToolNameLists.BMRCalculator], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.BMRCalculator]),
  },
};

export default function BMRCalculatorPage() {
  return <BMRCalculator />;
}