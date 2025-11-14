import type { Metadata } from 'next';
import { HexToDecimalConverter } from './hex-to-decimal-converter';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';

export const metadata: Metadata = {
  title: ToolNameLists.HexToDecimalConverter,
  description: ToolDescription[ToolNameLists.HexToDecimalConverter],
  keywords: [
    'hex to decimal converter',
    'hexadecimal converter',
    'hex to binary converter',
    'hex to octal converter',
    'programming converter',
    'base converter',
    'number system converter',
    'computer science calculator',
    'web development tool',
    'binary calculator',
    'octal calculator',
    'decimal to hex',
    'ASCII converter',
    'programmer calculator'
  ],
  openGraph: {
    title: ToolNameLists.HexToDecimalConverter,
    description: ToolDescription[ToolNameLists.HexToDecimalConverter],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.HexToDecimalConverter]),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.HexToDecimalConverter]),
  },
};

export default function HexToDecimalConverterPage() {
  return <HexToDecimalConverter />;
}