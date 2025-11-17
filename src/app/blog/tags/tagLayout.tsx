'use client';

import { useState, useMemo } from 'react';
import { POSTS } from '@/constants/posts';
import BlogCategories from '@/components/blog/blogCategories';
import RandomPosts from '@/components/blog/randomPosts';
import { formatDate } from '@/utils/dateUtils';
import Breadcrumb from '@/components/breadcrumb';

const POSTS_PER_PAGE = 6; // Increased for better two-column layout

export default function TagLayout({ tag }: { tag: string }) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return Object.values(POSTS).filter((post) =>
      (post.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase()))
    );
  }, [tag]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="p-8 pt-4 blog-layout"> 
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {`Show posts for "${tag}"`}
          </h1>
          <p className="text-lg text-gray-600">
            {tag.trim()
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
                  <a href={`/blog/${post.slug}`} key={`${post.slug}-${i}`}>
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

                          {/* Author and Date */}
                          <div className="flex items-center">
                            {/* Author Avatar */}
                            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-3">
                              <div 
                                className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold"
                              >
                                  {(post.author || 'A').charAt(0).toUpperCase()}
                                </div>
                            </div>
                            
                            {/* Author Info */}
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {post.author || 'HandyTooly Team'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(post.date)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </a>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-600">{tag.trim() ? 'Try different search terms.' : 'Check back later for new content.'}</p>
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
            <RandomPosts />

            <BlogCategories />
          </aside>
        </div>
      </div>
    </div>
  );
}