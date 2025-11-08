import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { UTCTimeZoneConverter } from './utc-time-zone-converter';

export const metadata: Metadata = {
    title: ToolNameLists.UTCTimeZoneConverter,
    description: ToolDescription[ToolNameLists.UTCTimeZoneConverter],
    keywords: "UTC converter, timezone converter, time zone conversion, UTC time, GMT converter, world time converter",
    openGraph: {
      title: ToolNameLists.UTCTimeZoneConverter,
      description: ToolDescription[ToolNameLists.UTCTimeZoneConverter],
      type: "website",
      url: canonicalUrl(ToolUrls[ToolNameLists.UTCTimeZoneConverter], true),
    },
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.UTCTimeZoneConverter]),
    },
};

export default function UTCTimeZoneConverterPage() {
  return <UTCTimeZoneConverter />;
}