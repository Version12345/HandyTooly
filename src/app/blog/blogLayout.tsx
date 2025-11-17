'use client';

import BlogCategories from '@/components/blog/blogCategories';
import BlogNameCard from '@/components/blog/blogNameCard';
import Breadcrumb from '@/components/breadcrumb';
import { RightCol } from '@/components/rightCol';
import { IPost } from '@/constants/posts';
import React from 'react';

interface LayoutProps {
  post: IPost;
  children: React.ReactNode;
}

export default function BlogLayout({ post, children }: LayoutProps) {
  return (
    <main className="p-8 pt-4 blog-layout"> 
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb />
        <div className={`grid grid-cols-1 gap-8 lg:grid-cols-[75%_28%]`}>
          {/* Left Column */}
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
              <hr className="mb-8" />
              <BlogCategories currentTags={post.tags} showTitle={false} className="mt-4" />
            </div>
          </div>
          <div>
            {/* Right Column */}
            <RightCol title={post.title} />

            <BlogCategories />
          </div>
        </div>
      </div>
    </main>
  );
}