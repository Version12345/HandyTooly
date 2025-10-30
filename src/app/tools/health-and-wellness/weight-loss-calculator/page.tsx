import { ToolDescription, ToolNameLists } from '@/constants/tools';
import { WeightLossCalculator } from './weight-loss-calculator';

export const metadata = {
    title: ToolNameLists.WeightLossCalculator,
    description: ToolDescription[ToolNameLists.WeightLossCalculator],
};

export default function WeightLossCalculatorPage() {
  return <WeightLossCalculator />;
}