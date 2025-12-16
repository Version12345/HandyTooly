import { Metadata } from 'next';
import { FindWeekday } from './find-weekday';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';

export const metadata: Metadata = {
  title: ToolNameLists.FindWeekday,
  description: ToolDescription[ToolNameLists.FindWeekday],
  keywords: 'find weekday, day of week calculator, date weekday finder, what day calculator, weekday checker, day name finder',
  openGraph: {
    title: ToolNameLists.FindWeekday,
    description: ToolDescription[ToolNameLists.FindWeekday],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.FindWeekday], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.FindWeekday]),
  },
};

export default function FindWeekdayPage() {
  return <FindWeekday />;
}