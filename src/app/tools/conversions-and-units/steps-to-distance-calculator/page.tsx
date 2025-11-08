import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { StepsToMilesCalculator } from './steps-to-distance-calculator';

export const metadata: Metadata = {
    title: ToolNameLists.StepsToDistanceCalculator,
    description: ToolDescription[ToolNameLists.StepsToDistanceCalculator],
    keywords: "steps to distance, steps to miles, steps to kilometers, walking distance calculator, pedometer converter, fitness tracker",
    openGraph: {
      title: ToolNameLists.StepsToDistanceCalculator,
      description: ToolDescription[ToolNameLists.StepsToDistanceCalculator],
      type: "website",
      url: canonicalUrl(ToolUrls[ToolNameLists.StepsToDistanceCalculator], true),
    },
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.StepsToDistanceCalculator]),
    },
};

export default function StepsToMilesCalculatorPage() {
  return <StepsToMilesCalculator />;
}