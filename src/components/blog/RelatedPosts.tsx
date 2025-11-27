'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { POSTS, IPost } from '@/constants/posts';
import BlogCategories from './blogCategories';

interface IPostWithSharedTags extends IPost {
  sharedTags?: string[];
}

interface RelatedPostsProps {
  currentPost: IPost;
  maxPosts?: number;
}

export default function RelatedPosts({ currentPost, maxPosts = 3 }: RelatedPostsProps) {
  const relatedPosts = useMemo(() => {
    const allPosts = Object.values(POSTS);
    
    // Filter out the current post
    const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);
    
    if (otherPosts.length === 0) return [];
    
    // Calculate relevance scores for each post
    const scoredPosts = otherPosts.map(post => {
      let score = 0;
      
      // Score based on shared tags (highest weight)
      if (currentPost.tags && post.tags) {
        const sharedTags = currentPost.tags.filter(tag => 
          post.tags?.includes(tag)
        );
        score += sharedTags.length * 10; // 10 points per shared tag
      }
      
      // Score based on title similarity (medium weight)
      const currentTitleWords = currentPost.title.toLowerCase().split(' ')
        .filter(word => word.length > 3); // Only consider words longer than 3 chars
      const postTitleWords = post.title.toLowerCase().split(' ')
        .filter(word => word.length > 3);
      
      const sharedWords = currentTitleWords.filter(word => 
        postTitleWords.includes(word)
      );
      score += sharedWords.length * 5; // 5 points per shared word
      
      // Score based on description similarity (lower weight)
      if (currentPost.description && post.description) {
        const currentDescWords = currentPost.description.toLowerCase().split(' ')
          .filter(word => word.length > 4);
        const postDescWords = post.description.toLowerCase().split(' ')
          .filter(word => word.length > 4);
        
        const sharedDescWords = currentDescWords.filter(word => 
          postDescWords.includes(word)
        );
        score += sharedDescWords.length * 2; // 2 points per shared description word
      }
      
      // Boost score for same author
      if (currentPost.author === post.author) {
        score += 3;
      }
      
      return {
        post,
        score,
        sharedTags: currentPost.tags?.filter(tag => post.tags?.includes(tag)) || []
      };
    });
    
    // Sort by score (highest first) and take top results
    return scoredPosts
      .filter(item => item.score > 0) // Only include posts with some relevance
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPosts)
      .map(item => ({ ...item.post, sharedTags: item.sharedTags } as IPostWithSharedTags));
  }, [currentPost, maxPosts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8 related-posts-container">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Related Posts</h3>
      
      <div className="space-y-6">
        {relatedPosts.map((post) => (
          
          <article 
            key={post.slug}
            className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            {/* Featured Image */}
            {post.featuredImage && (
              <a href={`/blog/${post.slug}`}>
                <div className="w-24 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={200}
                    height={96}
                    className="h-full w-auto"
                  />
                </div>
              </a>
            )}
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors line-clamp-2">
                <a href={`/blog/${post.slug}`}>
                  {post.title}
                </a>
              </h4>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {post.description}
              </p>
              
              {/* Shared Tags */}
              <BlogCategories currentTags={post.sharedTags} showTitle={false} className='mb-2 text-sm' />
              
              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span>{formatDate(post.date)}</span>
                  {post.readTime && (
                    <>
                      <span>•</span>
                      <span>{post.readTime} min read</span>
                    </>
                  )}
                </div>
                {post.author && (
                  <span className="text-gray-600">By {post.author}</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {/* View More Link */}
      <div className="text-center mt-6">
        <a 
          href="/blog"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
        >
          View all posts
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}