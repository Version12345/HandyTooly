import { ToolDescription, ToolNameLists } from '@/constants/tools';
import { IncomeToDebtCalculator } from './income-to-debt-calculator';

export const metadata = {
    title: ToolNameLists.IncomeToDebtRatioCalculator,
    description: ToolDescription[ToolNameLists.IncomeToDebtRatioCalculator],
};

export default function DebtToIncomeCalculatorPage() {
  return <IncomeToDebtCalculator />;
}