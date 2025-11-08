import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { RomanNumeralsConverter } from './roman-numerals-converter';

export const metadata = {
  title: ToolNameLists.RomanNumeralsConverter,
  description: ToolDescription[ToolNameLists.RomanNumeralsConverter],
  alternates: {
    canonical: ToolUrls[ToolNameLists.RomanNumeralsConverter],
  },
};

export default function RomanNumeralsConverterPage() {
  return <RomanNumeralsConverter />;
}