import { Metadata } from 'next';
import ChristmasCountdown from './christmas-countdown';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
    title: ToolNameLists.ChristmasCountdown,
    description: ToolDescription[ToolNameLists.ChristmasCountdown],
    keywords: "Christmas countdown, holiday countdown, days until Christmas, Christmas timer, festive countdown",
    openGraph: {
      title: ToolNameLists.ChristmasCountdown,
      description: ToolDescription[ToolNameLists.ChristmasCountdown],
      type: "website",
      url: canonicalUrl(ToolUrls[ToolNameLists.ChristmasCountdown], true),
    },
    alternates: {
        canonical: canonicalUrl(ToolUrls[ToolNameLists.ChristmasCountdown]),
    },
};

export default function Page() {
  return <ChristmasCountdown />;
}