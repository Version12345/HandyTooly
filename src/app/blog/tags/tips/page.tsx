import { canonicalUrl } from '@/utils/canonicalUrl';
import TagLayout from '../tagLayout';

export const metadata = {
  title: 'Showing posts tagged "tips"',
  description: 'Discover the latest tips from HandyTooly, your home for fast and free online tools.',
  keywords: 'HandyTooly blog, tool updates, tips, insights',
  openGraph: {
    title: 'Showing posts tagged "tips" - HandyTooly Blog',
    description: 'Discover the latest tips from HandyTooly, your home for fast and free online tools.',
    type: 'website',
    url: canonicalUrl('/blog/tags/tips', true),
  },
  alternates: {
    canonical: canonicalUrl('/blog/tags/tips'),
  },
};

export default function TipsTag() {
  return (
    <TagLayout 
      tag="tips"
    />
  );
}