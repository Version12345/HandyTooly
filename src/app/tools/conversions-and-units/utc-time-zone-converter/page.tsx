import { ToolDescription, ToolNameLists } from '@/constants/tools';
import { UTCTimeZoneConverter } from './utc-time-zone-converter';

export const metadata = {
    title: ToolNameLists.UTCTimeZoneConverter,
    description: ToolDescription[ToolNameLists.UTCTimeZoneConverter],
};

export default function UTCTimeZoneConverterPage() {
  return <UTCTimeZoneConverter />;
}