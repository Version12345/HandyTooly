import { Metadata } from 'next';
import GenerationFinder from './generation-finder';

export const metadata: Metadata = {
  title: 'What Generation Am I? - Generation Calculator | HandyTooly',
  description: 'Discover your generation based on your birth year. Learn about generations from 1900 to now including Greatest Generation, Baby Boomers, Gen X, Millennials, Gen Z, and Gen Alpha.',
  keywords: [
    'generation calculator',
    'what generation am i',
    'baby boomer',
    'generation x',
    'millennial',
    'generation z',
    'generation alpha',
    'birth year generator',
    'generational cohort',
    'generation finder'
  ],
  openGraph: {
    title: 'What Generation Am I? - Generation Calculator',
    description: 'Discover your generation based on your birth year. Learn about different generations and their defining characteristics.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Generation Am I? - Generation Calculator',
    description: 'Discover your generation based on your birth year. Learn about different generations and their defining characteristics.',
  },
};

export default function GenerationFinderPage() {
  return <GenerationFinder />;
}