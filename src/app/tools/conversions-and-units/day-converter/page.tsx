import { ToolDescription, ToolNameLists } from '@/constants/tools';
import { DayConverter } from './day-converter';

export const metadata = {
    title: ToolNameLists.DayConverterDateCalculator,
    description: ToolDescription[ToolNameLists.DayConverterDateCalculator],
};

export default function DayConverterPage() {
  return <DayConverter />;
}