import { Metadata } from 'next';
import { AddTimeToDate } from './add-time-to-date';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';

export const metadata: Metadata = {
  title: ToolNameLists.AddTimeToDate,
  description: ToolDescription[ToolNameLists.AddTimeToDate],
  keywords: 'add time to date, future date calculator, date addition calculator, add days to date, date planning tool, future date finder',
  openGraph: {
    title: ToolNameLists.AddTimeToDate,
    description: ToolDescription[ToolNameLists.AddTimeToDate],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.AddTimeToDate], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.AddTimeToDate]),
  },
};

export default function AddTimeToDatePage() {
  return <AddTimeToDate />;
}