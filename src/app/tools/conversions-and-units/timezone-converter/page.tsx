import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import TimeZoneConverter from './timezone-converter';

export const metadata: Metadata = {
    title: ToolNameLists.TimeZoneConverter,
    description: ToolDescription[ToolNameLists.TimeZoneConverter],
    keywords: "time zone converter, world clock, time zone difference, convert time zones, daylight saving time, popular time zones",
    openGraph: {
      title: ToolNameLists.TimeZoneConverter,
      description: ToolDescription[ToolNameLists.TimeZoneConverter],
      type: "website",
      url: canonicalUrl(ToolUrls[ToolNameLists.TimeZoneConverter], true),
    },
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.TimeZoneConverter]),
    },
};


export default function Page() {
  return <TimeZoneConverter />;
}