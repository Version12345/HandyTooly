import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { FindAndReplace } from './find-and-replace';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.FindAndReplace,
  description: ToolDescription[ToolNameLists.FindAndReplace],
  keywords: 'find replace text, find and replace tool, text editor, search replace, regex find replace, text processing, bulk text editing, pattern matching, string replacement, text manipulation',
  openGraph: {
    title: ToolNameLists.FindAndReplace,
    description: ToolDescription[ToolNameLists.FindAndReplace],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.FindAndReplace], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.FindAndReplace]),
  },
};

export default function FindAndReplacePage() {
  return <FindAndReplace />;
}