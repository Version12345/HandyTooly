import { Metadata } from 'next';
import { Base64Converter } from './base64-converter';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.Base64Converter,
  description: ToolDescription[ToolNameLists.Base64Converter],
  keywords: [
    'base64 converter',
    'base64 encoder',
    'base64 decoder',
    'text to base64',
    'base64 to text',
    'image to base64',
    'base64 encoding',
    'base64 decoding',
    'online base64 tool',
    'web development',
    'data encoding',
    'file to base64',
    'base64 generator',
    'encode decode base64',
    'base64 translator',
    'programming tools',
    'developer tools',
    'data conversion',
    'string encoding',
    'binary to base64'
  ],
  openGraph: {
    title: ToolNameLists.Base64Converter,
    description: ToolDescription[ToolNameLists.Base64Converter],
    type: 'website',
    url: ToolUrls[ToolNameLists.Base64Converter],
    siteName: 'HandyTooly',
  },
  twitter: {
    card: 'summary_large_image',    
    title: ToolNameLists.Base64Converter,
    description: ToolDescription[ToolNameLists.Base64Converter],    
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.Base64Converter]),
  },
};

export default function Page() {
  return <Base64Converter />;
}