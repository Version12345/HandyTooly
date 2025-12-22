'use client';

import AdBanner from '@/components/adsBanner/adBanner';
import BlogCategories from '@/components/blog/blogCategories';
import BlogNameCard from '@/components/blog/blogNameCard';
import RandomPosts from '@/components/blog/randomPosts';
import RelatedPosts from '@/components/blog/RelatedPosts';
import Breadcrumb from '@/components/breadcrumb';
import { RightCol } from '@/components/rightCol';
import { IPost } from '@/constants/posts';
import React from 'react';

interface LayoutProps {
  post: IPost;
  children: React.ReactNode;
}

export default function BlogPostLayout({ post, children }: LayoutProps) {
  return (
    <main className="p-3 pt-4 blog-post-layout"> 
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Left - Posts in Two Columns */}
          <div className="lg:col-span-3">
            <div className="rounded overflow-hidden shadow-lg bg-white">
              <div 
                className="h-48 w-full flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden background-contain" 
                style={{ backgroundImage: `url(${post.featuredImage})` }} 
                title={post.title}
              >
              </div>
              <div className="px-6 py-4">
                <h1>
                  {post.title}
                </h1>
                <div className="mb-4">
                  <BlogNameCard post={post} />
                </div>
                {children}
                <hr className="my-8" />
                <BlogCategories currentTags={post.tags} showTitle={false} className="mt-4" />
              </div>
            </div>

            <div>
              {/* Related Posts */}
              <RelatedPosts currentPost={post} maxPosts={3} />
            </div>
          </div>
          <div>
            {/* Right Column */}
            <RightCol title={post.title} />

            <AdBanner
              data-ad-slot="5786184730"
              data-full-width-responsive="true"
              data-ad-format="auto"
            />
            
            <RandomPosts />

            <BlogCategories />
          </div>
        </div>
      </div>
    </main>
  );
}