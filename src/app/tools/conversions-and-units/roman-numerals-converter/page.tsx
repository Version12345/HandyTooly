import { Metadata } from "next";
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { RomanNumeralsConverter } from './roman-numerals-converter';

export const metadata: Metadata = {
  title: ToolNameLists.RomanNumeralsConverter,
  description: ToolDescription[ToolNameLists.RomanNumeralsConverter],
  keywords: "roman numerals converter, numbers to roman numerals, roman to arabic numbers, roman numeral calculator, ancient numbers",
  openGraph: {
    title: ToolNameLists.RomanNumeralsConverter,
    description: ToolDescription[ToolNameLists.RomanNumeralsConverter],
    type: "website",
    url: canonicalUrl(ToolUrls[ToolNameLists.RomanNumeralsConverter], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.RomanNumeralsConverter]),
  },
};

export default function RomanNumeralsConverterPage() {
  return <RomanNumeralsConverter />;
}