import { Metadata } from 'next';
import BodyFatCalculator from './body-fat-calculator';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';

export const metadata: Metadata = {
  title: ToolNameLists.BodyFatCalculator,
  description: ToolDescription[ToolNameLists.BodyFatCalculator],
  keywords: 'body fat calculator, US Navy method, body fat percentage, body composition, circumference measurements, fitness calculator, health assessment, lean body mass',
  openGraph: {
    title: ToolNameLists.BodyFatCalculator,
    description: ToolDescription[ToolNameLists.BodyFatCalculator],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.BodyFatCalculator], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.BodyFatCalculator], true),
  },
};

export default function BodyFatCalculatorPage() {
  return <BodyFatCalculator />;
}