import type { Metadata } from 'next';
import { HexToDecimalConverter } from './hex-to-decimal-converter';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: 'Hex to Decimal Converter - Convert Hexadecimal to Decimal & More | HandyTooly',
  description: 'Convert hexadecimal (hex) numbers to decimal, binary, octal & more. Perfect for programming, web development & computer science calculations. Free online tool.',
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
    title: 'Hex to Decimal Converter - Convert Hexadecimal Numbers | HandyTooly',
    description: 'Convert hexadecimal (hex) numbers to decimal, binary, octal & more. Perfect for programming, web development & computer science calculations.',
    type: 'website',
    url: canonicalUrl('/tools/conversions-and-units/hex-to-decimal-converter'),
  },
  alternates: {
    canonical: canonicalUrl('/tools/conversions-and-units/hex-to-decimal-converter'),
  },
};

export default function HexToDecimalConverterPage() {
  return <HexToDecimalConverter />;
}