import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { CompoundInterestCalculator } from './compound-interest-calculator';

export const metadata = {
    title: ToolNameLists.CompoundInterestCalculator,
    description: ToolDescription[ToolNameLists.CompoundInterestCalculator],
    alternates: {
        canonical: ToolUrls[ToolNameLists.CompoundInterestCalculator],
    },
};

export default function Page() {
  return <CompoundInterestCalculator />;
}