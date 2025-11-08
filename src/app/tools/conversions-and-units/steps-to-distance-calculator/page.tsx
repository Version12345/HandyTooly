import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { StepsToMilesCalculator } from './steps-to-distance-calculator';

export const metadata = {
    title: ToolNameLists.StepsToDistanceCalculator,
    description: ToolDescription[ToolNameLists.StepsToDistanceCalculator],
    alternates: {
        canonical: ToolUrls[ToolNameLists.StepsToDistanceCalculator],
    },
};

export default function StepsToMilesCalculatorPage() {
  return <StepsToMilesCalculator />;
}