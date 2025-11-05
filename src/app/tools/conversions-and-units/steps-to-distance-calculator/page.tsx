import { ToolDescription, ToolNameLists } from '@/constants/tools';
import { StepsToMilesCalculator } from './steps-to-distance-calculator';

export const metadata = {
    title: ToolNameLists.TimeUnitConverter,
    description: ToolDescription[ToolNameLists.TimeUnitConverter],
};

export default function StepsToMilesCalculatorPage() {
  return <StepsToMilesCalculator />;
}