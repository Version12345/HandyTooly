import { Metadata } from 'next';
import { ToolDescription, ToolNameLists, ToolUrls} from '@/constants/tools';
import InflationCalculator from './inflation-calculator';

export const metadata: Metadata = {
  title: ToolNameLists.InflationCalculator,
  description: ToolDescription[ToolNameLists.InflationCalculator],
  keywords: "inflation calculator, purchasing power calculator, cost of living calculator, inflation rate, money value calculator, economic calculator",
  openGraph: {
    title: ToolNameLists.InflationCalculator,
    description: ToolDescription[ToolNameLists.InflationCalculator],
    type: "website",
    url: `https://handytooly.com${ToolUrls[ToolNameLists.InflationCalculator]}`,
  },
  alternates: {
    canonical: ToolUrls[ToolNameLists.InflationCalculator],
  },
};

export default function InflationCalculatorPage() {
  return <InflationCalculator />;
}