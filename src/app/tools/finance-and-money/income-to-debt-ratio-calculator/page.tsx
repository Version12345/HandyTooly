import { IncomeToDebtCalculator } from './income-to-debt-calculator';

export const metadata = {
    title: 'Income-to-Debt Ratio Calculator',
    description: 'Calculate your Income-to-Debt Ratio quickly and easily with our free calculator. Determine if you are in a healthy financial position.',
};

export default function DebtToIncomeCalculatorPage() {
  return <IncomeToDebtCalculator />;
}