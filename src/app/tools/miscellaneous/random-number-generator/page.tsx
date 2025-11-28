import { ToolDescription, ToolNameLists, ToolUrls } from '@/constants/tools';
import RandomNumberGenerator from './random-number-generator';
import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';

export const metadata: Metadata = {
  title: ToolNameLists.RandomNumberGenerator,
  description: ToolDescription[ToolNameLists.RandomNumberGenerator],
  keywords: 'random number generator, random numbers, unique random numbers, number generator, random number picker, random number tool, generate random numbers, random number generator online, random number generator app',
  openGraph: {
    title: ToolNameLists.RandomNumberGenerator,
    description: ToolDescription[ToolNameLists.RandomNumberGenerator],
    type: 'website',
    url: canonicalUrl(ToolUrls[ToolNameLists.RandomNumberGenerator], true),
  },
  alternates: {
    canonical: canonicalUrl(ToolUrls[ToolNameLists.RandomNumberGenerator]),
  },
};

export default function Page() {
  return <RandomNumberGenerator />;
}