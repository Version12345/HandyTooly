import { canonicalUrl } from '@/utils/canonicalUrl';
import TagLayout from '../tagLayout';

export const metadata = {
  title: 'Showing posts tagged "updates"',
  description: 'Discover the latest updates, tips, and insights from HandyTooly.',
  keywords: 'HandyTooly blog, tool updates, tips, insights',
  openGraph: {
    title: 'Showing posts tagged "updates" - HandyTooly Blog',
    description: 'Discover the latest updates, tips, and insights from HandyTooly.',
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