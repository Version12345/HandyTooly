import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { TimeUnitConverter } from './time-unit-converter';

export const metadata: Metadata = {
    title: ToolNameLists.TimeUnitConverter,
    description: ToolDescription[ToolNameLists.TimeUnitConverter],
    keywords: "time converter, seconds to minutes, hours to days, time unit conversion, duration calculator, time conversion tool",
    openGraph: {
      title: ToolNameLists.TimeUnitConverter,
      description: ToolDescription[ToolNameLists.TimeUnitConverter],
      type: "website",
      url: canonicalUrl(ToolUrls[ToolNameLists.TimeUnitConverter], true),
    },
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.TimeUnitConverter]),
    },
};

export default function TimeUnitConverterPage() {
  return <TimeUnitConverter />;
}