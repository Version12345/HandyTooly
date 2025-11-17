import { canonicalUrl } from "@/utils/canonicalUrl";
import BlogPostLayout from "../blogPostLayout";
import { POSTS } from "@/constants/posts";
import { SITE_EMAIL } from "@/constants/site-info";

const currentPost = POSTS['welcome'];

export const metadata = {
  title: currentPost.title,
  description: currentPost.description,
  keywords: "HandyTooly blog, tool updates, tips, insights, new features, free tools",
  openGraph: {
    title: currentPost.title,
    description: currentPost.description,
    type: "website",
    url: canonicalUrl(`/blog/${currentPost.slug}`, true),
  },
  alternates: {
    canonical: canonicalUrl(`/blog/${currentPost.slug}`),
  },
};

export default function WelcomePost() {
  return (
    <BlogPostLayout 
      post={currentPost}
    >
      <article className="prose lg:prose-xl max-w-4xl mx-auto">
        <p>
          We are excited to open our new blog and share fresh updates of our <a href="/tools">free online tools</a> with you. The space will hold simple tips, helpful guides, and fun notes about HandyTooly and our free online tools. New visitors can learn the basics. Long-time users can explore deeper features. Each post aims to teach something useful and save you time on daily tasks.
        </p>
        <h3>What You Will Find</h3>
        <p>
          Our blog will cover a wide mix of topics. You will see clear announcements on new tools and important upgrades. Read tips that help you get better results with tools you already use. Some posts will share real examples, short steps, and notes from our team. We will also show early ideas, test results, and small wins from our workroom. We want the space to feel open, friendly, and easy to explore.
        </p>
        <h3>How Our Tools Help</h3>
        <p>
          Many posts will explain how simple tools solve real problems. You may see short stories about people who use HandyTooly for school, work, or home tasks. One post may show how a time converter saves a meeting. Another post may explain how a date calculator speeds up a project plan. Each guide will offer clear value in a few steps.
        </p>
        <h3>Stay Connected</h3>
        <p>
          We invite you to follow our updates and enjoy each new post. You can send ideas or feedback to <a href={`mailto:${SITE_EMAIL}`} className="text-orange-500">{SITE_EMAIL}</a>. We love hearing from our users because your ideas help the tools grow.
        </p>
        <h3>Thank you</h3>
        <p>
          Thank you for being part of the HandyTooly community. We look forward to sharing this journey with you and building a friendly space that helps you each day.
        </p>
      </article>
    </BlogPostLayout>
  );
};