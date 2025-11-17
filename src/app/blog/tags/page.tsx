import { Metadata } from 'next';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { IPost, POSTS } from '@/constants/posts';
import { RightCol } from '@/components/rightCol';
import Breadcrumb from '@/components/breadcrumb';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog Tags',
  description: 'Browse all tags and topics covered in the HandyTooly blog.',
  keywords: 'blog tags, categories, topics, HandyTooly',
  openGraph: {
    title: 'Blog Tags',
    description: 'Browse all tags and topics covered in the HandyTooly blog.',
    type: 'website',
    url: canonicalUrl('/blog/tags', true),
  },
  alternates: {
    canonical: canonicalUrl('/blog/tags'),
  },
};

export default function BlogTagsPage() {
  // Extract all tags with their counts
  const tagCounts: Record<string, number> = {};
  
  Object.values(POSTS).forEach((post: IPost) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  const allTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({
      name: tag,
      count,
    }))
    .sort((a, b) => b.count - a.count);



  const getTagColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-orange-100 text-orange-800',
    ];
    return colors[index % colors.length];
  };

  return (
    <main className="p-8 pt-4 blog-layout"> 
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <Breadcrumb />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Tags</h1>
          <p className="text-lg text-gray-600">
            All tags and topics covered in our blog posts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left - Tags Grid */}
          <div className="lg:col-span-3 shadow-sm rounded-lg p-6 bg-white">
            {/* Tags Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTags.length > 0 ? (
                allTags.map((tag, index) => (
                  <Link key={tag.name} href={`/blog/tags/${encodeURIComponent(tag.name.toLowerCase())}`}>
                    <div
                      className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTagColor(index)}`}>
                          #{tag.name}
                        </span>
                        <span className="text-sm text-gray-500 font-semibold">
                          {tag.count} post{tag.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tags found</h3>
                  <p className="text-gray-600">No blog posts have been tagged yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            <RightCol title="Blog Tags" />

            {/* Quick Actions */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <a
                  href="/blog"
                  className="block w-full px-4 py-2 text-sm text-center bg-orange-500 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  View All Posts
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}