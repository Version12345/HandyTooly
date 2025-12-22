import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { SplitText } from './split-text';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.SplitText,
  description: ToolDescription[ToolNameLists.SplitText],
  keywords: 'split text, text splitter, string split, text chunks, divide text, text processor, regex split, character split, text manipulation, data processing',
  openGraph: {
    title: ToolNameLists.SplitText,
    description: ToolDescription[ToolNameLists.SplitText],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.SplitText], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.SplitText]),
  },
};

export default function SplitTextPage() {
  return <SplitText />;
}