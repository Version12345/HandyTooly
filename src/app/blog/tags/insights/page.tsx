import { canonicalUrl } from '@/utils/canonicalUrl';
import TagLayout from '../tagLayout';

export const metadata = {
  title: 'Showing posts tagged "insights"',
  description: 'Find helpful insights from HandyTooly and see how our fast and free tools simplify your life.',
  keywords: 'blog tag insights, HandyTooly blog, insights posts',
  openGraph: {
    title: 'Showing posts tagged "insights" - HandyTooly Blog',
    description: 'Find helpful insights from HandyTooly and see how our fast and free tools simplify your life.',
    type: 'website',
    url: canonicalUrl('/blog/tags/insights', true),
  },
  alternates: {
    canonical: canonicalUrl('/blog/tags/insights'),
  },
};

export default function InsightsTag() {
  return (
    <TagLayout 
      tag="insights"
    />
  );
}