import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { JoinText } from './join-text';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.JoinText,
  description: ToolDescription[ToolNameLists.JoinText],
  keywords: 'join text, text joiner, combine text, merge text, text concatenation, text combining, string join, text merger, data combining, text assembly',
  openGraph: {
    title: ToolNameLists.JoinText,
    description: ToolDescription[ToolNameLists.JoinText],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.JoinText], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.JoinText]),
  },
};

export default function JoinTextPage() {
  return <JoinText />;
}