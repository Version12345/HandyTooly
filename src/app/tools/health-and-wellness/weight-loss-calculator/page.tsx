import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { WeightLossCalculator } from './weight-loss-calculator';

export const metadata = {
    title: ToolNameLists.WeightLossCalculator,
    description: ToolDescription[ToolNameLists.WeightLossCalculator],
    alternates: {
        canonical: ToolUrls[ToolNameLists.WeightLossCalculator],
    },
};

export default function WeightLossCalculatorPage() {
  return <WeightLossCalculator />;
}