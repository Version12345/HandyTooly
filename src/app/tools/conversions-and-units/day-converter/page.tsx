import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { DayConverter } from './day-converter';

export const metadata = {
  title: ToolNameLists.DayConverterDateCalculator,
  description: ToolDescription[ToolNameLists.DayConverterDateCalculator],
  alternates: {
    canonical: ToolUrls[ToolNameLists.DayConverterDateCalculator],
  },
};

export default function DayConverterPage() {
  return <DayConverter />;
}