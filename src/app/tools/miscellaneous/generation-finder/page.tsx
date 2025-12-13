import { Metadata } from 'next';
import GenerationFinder from './generation-finder';
import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.GenerationFinder,
  description: ToolDescription[ToolNameLists.GenerationFinder],
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
    title: ToolNameLists.AnnualizedReturnCalculator,
    description: ToolDescription[ToolNameLists.AnnualizedReturnCalculator],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.AnnualizedReturnCalculator]),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.AnnualizedReturnCalculator]),
  },
};

export default function GenerationFinderPage() {
  return <GenerationFinder />;
}