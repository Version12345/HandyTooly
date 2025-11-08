import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { TimeUnitConverter } from './time-unit-converter';

export const metadata = {
    title: ToolNameLists.TimeUnitConverter,
    description: ToolDescription[ToolNameLists.TimeUnitConverter],
    alternates: {
        canonical: ToolUrls[ToolNameLists.TimeUnitConverter],
    },
};

export default function TimeUnitConverterPage() {
  return <TimeUnitConverter />;
}