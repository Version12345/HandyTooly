import { Metadata } from 'next';
import { Base64Converter } from './base64-converter';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: 'Base64 Text Converter - Encode & Decode Text to Base64 | HandyTooly',
  description: 'Convert text to Base64 format or decode Base64 strings back to readable text. Perfect for encoding configuration data, API tokens, and secure text transmission.',
  keywords: [
    'base64 text converter',
    'base64 encoder',
    'base64 decoder',
    'text to base64',
    'base64 to text',
    'base64 encoding',
    'base64 decoding',
    'text encoding tool',
    'web development',
    'data encoding',
    'api tokens',
    'base64 generator',
    'encode decode base64',
    'configuration data',
    'programming tools',
    'developer tools',
    'data conversion',
    'string encoding',
    'secure text transmission'
  ],
  openGraph: {
    title: 'Base64 Text Converter - Encode & Decode Text to Base64',
    description: 'Convert text to Base64 format or decode Base64 strings back to readable text. Perfect for encoding configuration data, API tokens, and secure text transmission.',
    type: 'website',
    url: canonicalUrl('/tools/conversions-and-units/base64-converter', true),
  },
  alternates: {
    canonical: canonicalUrl('/tools/conversions-and-units/base64-converter'),
  },
};

export default function Page() {
  return <Base64Converter />;
}