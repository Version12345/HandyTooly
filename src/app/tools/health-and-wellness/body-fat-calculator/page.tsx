import { Metadata } from 'next';
import BodyFatCalculator from './body-fat-calculator';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: 'Body Fat Calculator - US Navy Method & BMI-Based Estimation | HandyTooly',
  description: 'Calculate your body fat percentage using the accurate US Navy method and BMI-based estimation. Get detailed body composition analysis, ideal fat ranges, and health metrics.',
  keywords: 'body fat calculator, US Navy method, body fat percentage, body composition, circumference measurements, fitness calculator, health assessment, lean body mass',
  openGraph: {
    title: 'Body Fat Calculator - US Navy Method & BMI-Based Estimation',
    description: 'Calculate your body fat percentage using the accurate US Navy method and BMI-based estimation. Get detailed body composition analysis, ideal fat ranges, and health metrics.',
    type: 'website',
    url: canonicalUrl('/tools/health-and-wellness/body-fat-calculator', true),
  },
  alternates: {
    canonical: canonicalUrl('/tools/health-and-wellness/body-fat-calculator'),
  },
};

export default function BodyFatCalculatorPage() {
  return <BodyFatCalculator />;
}