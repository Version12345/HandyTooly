import { canonicalUrl } from '@/utils/canonicalUrl';
import TagLayout from '../tagLayout';

export const metadata = {
  title: 'Showing posts tagged "updates"',
  description: 'Stay up to date with the latest HandyTooly updates and new free online tools.',
  keywords: 'HandyTooly blog, tool updates, tips, insights',
  openGraph: {
    title: 'Showing posts tagged "updates"',
    description: 'Stay up to date with the latest HandyTooly updates and new free online tools.',
    type: 'website',
    url: canonicalUrl('/blog/tags/updates', true),
  },
  alternates: {
    canonical: canonicalUrl('/blog/tags/updates'),
  },
};

export default function UpdatesTag() {
  return (
    <TagLayout 
      tag="updates"
    />
  );
}