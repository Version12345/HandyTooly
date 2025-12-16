import { Metadata } from 'next';
import { DateDifference } from './date-difference';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';

export const metadata: Metadata = {
  title: ToolNameLists.DateDifference,
  description: ToolDescription[ToolNameLists.DateDifference],
  keywords: 'date difference calculator, days between dates, date span calculator, time difference, date range calculator, duration calculator',
  openGraph: {
    title: ToolNameLists.DateDifference,
    description: ToolDescription[ToolNameLists.DateDifference],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.DateDifference], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.DateDifference]),
  },
};

export default function DateDifferencePage() {
  return <DateDifference />;
}