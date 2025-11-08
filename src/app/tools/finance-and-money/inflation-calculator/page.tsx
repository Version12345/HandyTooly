import { Metadata } from 'next';
import { ToolDescription, ToolNameLists, ToolUrls} from '@/constants/tools';
import InflationCalculator from './inflation-calculator';

export const metadata: Metadata = {
  title: ToolNameLists.InflationCalculator,
  description: ToolDescription[ToolNameLists.InflationCalculator],
  alternates: {
    canonical: ToolUrls[ToolNameLists.InflationCalculator],
  },
};

export default function InflationCalculatorPage() {
  return <InflationCalculator />;
}