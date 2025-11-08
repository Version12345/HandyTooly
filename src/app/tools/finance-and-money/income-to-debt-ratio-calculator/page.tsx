import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { IncomeToDebtCalculator } from './income-to-debt-calculator';

export const metadata = {
    title: ToolNameLists.IncomeToDebtRatioCalculator,
    description: ToolDescription[ToolNameLists.IncomeToDebtRatioCalculator],
    alternates: {
        canonical: ToolUrls[ToolNameLists.IncomeToDebtRatioCalculator],
    },
};

export default function DebtToIncomeCalculatorPage() {
  return <IncomeToDebtCalculator />;
}