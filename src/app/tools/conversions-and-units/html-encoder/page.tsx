import { Metadata } from 'next';
import { HtmlEncoder } from './html-encoder';

export const metadata: Metadata = {
  title: 'HTML Encoder/Decoder | HTML Entity Encode & Decode Online',
  description: 'Free online HTML encoder and decoder. Convert HTML to entities, decode HTML entities to text, and safely encode special characters like <, >, &, quotes for web development.',
  keywords: [
    'html encoder',
    'html decoder',
    'html entity encoder',
    'html entity decoder',
    'html escape',
    'html unescape',
    'html entities',
    'encode html',
    'decode html',
    'html special characters',
    'html character encoding',
    'web development tools',
    'html sanitizer',
    'html converter',
    'html entity converter',
    'escape html',
    'unescape html',
    'html character entities',
    'html encoding online',
    'html decoding online'
  ],
  openGraph: {
    title: 'HTML Encoder/Decoder - HTML Entity Encode & Decode Online',
    description: 'Convert HTML to entities and decode HTML entities to text. Free online tool for web developers to safely encode special characters.',
    type: 'website',
    url: 'https://handytooly.com/tools/conversions-and-units/html-encoder',
    siteName: 'HandyTooly',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML Encoder/Decoder - HTML Entity Encode & Decode Online',
    description: 'Convert HTML to entities and decode HTML entities to text. Free online tool for web developers to safely encode special characters.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://handytooly.com/tools/conversions-and-units/html-encoder',
  },
};

export default function Page() {
  return <HtmlEncoder />;
}