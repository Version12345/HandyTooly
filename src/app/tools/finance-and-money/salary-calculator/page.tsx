import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { SalaryCalculator } from './salary-calculator';

export const metadata = {
    title: ToolNameLists.SalaryCalculator,
    description: ToolDescription[ToolNameLists.SalaryCalculator],
    alternates: {
        canonical: ToolUrls[ToolNameLists.SalaryCalculator],
    },
};

export default function SalaryCalculatorPage() {
  return <SalaryCalculator />;
}