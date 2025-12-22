import { canonicalUrl } from '@/utils/canonicalUrl';
import BlogHomeLayout from './blogHomeLayout';

export const metadata = {
  title: 'Welcome to the HandyTooly Blog',
  description: 'Discover the latest updates, tips, and insights from HandyTooly.',
  keywords: 'HandyTooly blog, tool updates, tips, insights',
  openGraph: {
    title: 'Welcome to the HandyTooly Blog',
    description: 'Discover the latest updates, tips, and insights from HandyTooly.',
    type: 'website',
    url: canonicalUrl('/blog', true),
  },
  alternates: {
    canonical: canonicalUrl('/blog'),
  },
};

export default function BlogHome() {
  return (
    <div className="p-3 pt-4 blog-layout"> 
      <BlogHomeLayout />
    </div>
  )
}