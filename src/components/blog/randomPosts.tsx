import { POSTS } from '@/constants/posts';
import { formatDate } from '@/utils/dateUtils';
import Link from 'next/link';
import { useMemo } from 'react';

export default function RandomPosts() {
  const randomPosts = useMemo(() => {
    const shuffled = [...Object.values(POSTS)].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Random Posts</h3>
      <div className="space-y-4">
        {randomPosts.length ? (
          randomPosts.map((post, i) => (
            <article key={`r-${i}`} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
              <h4 className="font-medium text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                <Link href={`/blog/posts/${post.slug}`} className="line-clamp-2">{post.title}</Link>
              </h4>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.description}</p>
              <div className="text-xs text-gray-500">{formatDate(post.date)}</div>
            </article>
          ))
        ) : (
          <p className="text-sm text-gray-600">No additional posts available</p>
        )}
      </div>
    </div>
  );
}