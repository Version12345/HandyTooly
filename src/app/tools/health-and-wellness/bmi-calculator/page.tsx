import { ToolDescription, ToolNameLists } from '@/constants/tools';
import BMICalculator from './bmi-caculator';

export const metadata = {
    title: ToolNameLists.BMICalculator,
    description: ToolDescription[ToolNameLists.BMICalculator],
};

export default function BMICalculatorPage() {
    return (
        <BMICalculator />
    );
};