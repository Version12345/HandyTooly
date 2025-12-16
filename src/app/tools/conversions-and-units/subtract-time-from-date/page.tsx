import { Metadata } from 'next';
import { SubtractTimeFromDate } from './subtract-time-from-date';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';

export const metadata: Metadata = {
  title: ToolNameLists.SubtractTimeFromDate,
  description: ToolDescription[ToolNameLists.SubtractTimeFromDate],
  keywords: 'subtract time from date, past date calculator, date subtraction calculator, subtract days from date, reverse date planning, historical date finder',
  openGraph: {
    title: ToolNameLists.SubtractTimeFromDate,
    description: ToolDescription[ToolNameLists.SubtractTimeFromDate],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.SubtractTimeFromDate], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.SubtractTimeFromDate]),
  },
};

export default function SubtractTimeFromDatePage() {
  return <SubtractTimeFromDate />;
}