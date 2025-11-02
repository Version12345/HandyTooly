import { ToolDescription, ToolNameLists } from '@/constants/tools';
import { CompoundInterestCalculator } from './compound-interest-calculator';

export const metadata = {
    title: ToolNameLists.CompoundInterestCalculator,
    description: ToolDescription[ToolNameLists.CompoundInterestCalculator],
};

export default function Page() {
  return <CompoundInterestCalculator />;
}