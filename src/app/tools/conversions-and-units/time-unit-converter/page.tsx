import { ToolDescription, ToolNameLists } from '@/constants/tools';
import { TimeUnitConverter } from './time-unit-converter';

export const metadata = {
    title: ToolNameLists.TimeUnitConverter,
    description: ToolDescription[ToolNameLists.TimeUnitConverter],
};

export default function TimeUnitConverterPage() {
  return <TimeUnitConverter />;
}