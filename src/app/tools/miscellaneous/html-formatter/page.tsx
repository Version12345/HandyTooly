import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import HtmlFormatter from './html-formatter';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.HtmlFormatter,
  description: ToolDescription[ToolNameLists.HtmlFormatter],
  keywords: 'HTML formatter, HTML beautifier, format HTML, HTML indentation, code formatter, web development, HTML cleanup, HTML validator, code beautifier, HTML structure',
  openGraph: {
    title: ToolNameLists.HtmlFormatter,
    description: ToolDescription[ToolNameLists.HtmlFormatter],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.HtmlFormatter], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.HtmlFormatter]),
  },
};

export default function HtmlFormatterPage() {
  return <HtmlFormatter />;
}