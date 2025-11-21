import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import { RandomTextGenerator } from './random-text-generator';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.RandomTextGenerator,
  description: ToolDescription[ToolNameLists.RandomTextGenerator],
  keywords: 'random text generator, placeholder text generator, lorem ipsum generator, password generator, username generator, sample data, placeholder text, fake data generator, text tools',
  openGraph: {
    title: ToolNameLists.RandomTextGenerator,
    description: ToolDescription[ToolNameLists.RandomTextGenerator],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.RandomTextGenerator], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.RandomTextGenerator]),
  },
};

export default function RandomTextGeneratorPage() {
  return <RandomTextGenerator />;
}