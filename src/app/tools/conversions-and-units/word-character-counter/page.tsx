import type { Metadata } from 'next';
import { WordCharacterCounter } from './word-character-counter';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { SITE_NAME } from '@/constants/site-info';

export const metadata: Metadata = {
  title: ToolNameLists.WordCharacterCounter,
  description: ToolDescription[ToolNameLists.WordCharacterCounter],
  keywords: [
    'word counter',
    'character counter',
    'text counter',
    'word count tool',
    'character count tool',
    'text analysis',
    'writing tool',
    'content writing',
    'text statistics',
    'paragraph counter',
    'sentence counter',
    'readability analysis',
    'reading time calculator',
    'text length checker',
    'word frequency',
    'content analysis',
    'writing statistics',
    'document analysis',
    'text metrics',
    'content optimization',
    'seo text analysis',
    'blog post counter',
    'essay word count',
    'article analysis',
    'copywriting tool',
    'content creator tool',
    'manuscript analysis',
    'academic writing tool',
    'social media text counter'
  ],
  authors: [{ name: 'HandyTooly Team' }],
  creator: 'HandyTooly',
  publisher: 'HandyTooly',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: canonicalUrl(ToolUrls[ToolNameLists.WordCharacterCounter], true),
    siteName: SITE_NAME,
    title: ToolNameLists.WordCharacterCounter,
    description: ToolDescription[ToolNameLists.WordCharacterCounter]
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.WordCharacterCounter]),
  },
  category: 'Text Analysis',
}

export default function WordCharacterCounterPage() {
  return <WordCharacterCounter />
}