import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { DayConverter } from './day-converter';

export const metadata: Metadata = {
  title: ToolNameLists.DayConverterDateCalculator,
  description: ToolDescription[ToolNameLists.DayConverterDateCalculator],
  keywords: "day converter, date calculator, days between dates, weekday calculator, date difference calculator, calendar calculator",
  openGraph: {
    title: ToolNameLists.DayConverterDateCalculator,
    description: ToolDescription[ToolNameLists.DayConverterDateCalculator],
    type: "website",
    url: canonicalUrl(ToolUrls[ToolNameLists.DayConverterDateCalculator], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.DayConverterDateCalculator]),
  },
};

export default function DayConverterPage() {
  return <DayConverter />;
}