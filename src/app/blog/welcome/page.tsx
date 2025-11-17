import { canonicalUrl } from "@/utils/canonicalUrl";
import BlogLayout from "../blogLayout";
import { POSTS } from "@/constants/posts";

const currentPost = POSTS['Welcome'];

export const metadata = {
  title: currentPost.title,
  description: currentPost.description,
  keywords: "HandyTooly blog, tool updates, tips, insights, new features, free tools",
  openGraph: {
    title: currentPost.title,
    description: currentPost.description,
    type: "website",
    url: canonicalUrl(`/blog/welcome`, true),
  },
  alternates: {
    canonical: canonicalUrl(`/blog/welcome`),
  },
};

export default function WelcomePost() {
  return (
    <BlogLayout 
      post={currentPost}
    >
      <article className="prose lg:prose-xl max-w-4xl mx-auto">
        <p>
          We&apos;re excited to launch our blog, where we&apos;ll be sharing the latest updates, tips, and insights about HandyTooly and our suite of free online tools. Whether you&apos;re a regular user or just discovering us, our blog is the perfect place to stay informed about new features, tool updates, and helpful guides.
        </p>
        <h3>What to Expect</h3>
        <p>
          In our blog, you&apos;ll find a variety of content including:
        </p>
        <ul>
          <li>Announcements about new tools and features</li>
          <li>Tips and tricks for getting the most out of HandyTooly</li>
          <li>Insights into how our tools can help with everyday tasks</li>
          <li>Behind-the-scenes looks at our development process</li>
        </ul>
        <h3>Stay Connected</h3>
        <p>
          We encourage you to subscribe to our newsletter and follow us on social media to stay updated on the latest blog posts and HandyTooly news. Your feedback and suggestions are always welcome!
        </p>
        <p>
          Thank you for being a part of the HandyTooly community. We look forward to sharing our journey with you through this blog!
        </p>
      </article>
    </BlogLayout>
  );
};