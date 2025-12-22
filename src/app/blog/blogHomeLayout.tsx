'use client';

import { useState, useMemo } from 'react';
import { POSTS } from '@/constants/posts';
import BlogCategories from '@/components/blog/blogCategories';
import RandomPosts from '@/components/blog/randomPosts';
import BlogNameCard from '@/components/blog/blogNameCard';
import Link from 'next/link';
import Breadcrumb from '@/components/breadcrumb';
import AdBanner from '@/components/adsBanner/adBanner';

const POSTS_PER_PAGE = 6; // Increased for better two-column layout

export default function BlogHomeLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const postsArray = Object.values(POSTS);
    if (!q) return postsArray;
    return postsArray.filter((post) =>
      (post.title || '').toLowerCase().includes(q) ||
      (post.description || '').toLowerCase().includes(q) ||
      ((post.tags || []).some((t: string) => t.toLowerCase().includes(q)))
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const pageTitle = searchQuery.trim() ? `Searching for "${searchQuery}"` : 'Welcome to the HandyTooly Blog';

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
        <p className="text-lg text-gray-600">
          {searchQuery.trim()
            ? `Found ${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''}`
            : 'Discover the latest updates, tips, and insights from HandyTooly.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Left - Posts in Two Columns */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-6">
            {paginatedPosts.length ? (
              paginatedPosts.map((post, i) => (
                <Link href={`/blog/${post.slug}`} key={`${post.slug}-${i}`}>
                  <article 
                    key={`${post.slug}-${i}`} 
                    className="w-full lg:max-w-full lg:flex shadow-md rounded"
                  >
                    <div 
                      className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" style={{ backgroundImage: `url(${post.featuredImage})` }} 
                      title={post.title}
                    >
                    </div>
                    <div className="bg-white p-4 leading-normal w-full">
                      {/* Post Content */}
                      <div className="p-6">
                        {/* Title */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                            {post.title}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>

                        <BlogNameCard post={post} />
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">{searchQuery.trim() ? 'Try different search terms.' : 'Check back later for new content.'}</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === page 
                        ? 'bg-orange-600 text-white shadow-sm' 
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>

        {/* Right - Search & Random */}
        <aside className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Posts</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors text-sm"
              />
              <div className="absolute right-3 top-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {searchQuery.trim() && (
              <button onClick={() => handleSearch('')} className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
                Clear search
              </button>
            )}
          </div>

          <AdBanner
            data-ad-slot="5786184730"
            data-full-width-responsive="true"
            data-ad-format="auto"
          />

          <RandomPosts />

          <BlogCategories />
        </aside>
      </div>
    </div>
  );
}