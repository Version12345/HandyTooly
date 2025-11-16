import WelcomePost from "@/app/blog/page";

export const tags = [
  "Updates",
  "Tips",
  "Insights",
  "HandyTooly",
];

export interface IPost {
  title: string;
  description: string;
  slug: string;
  date: string;
  content: React.ReactNode;
  tags: string[];
  author: string;
  readTime: number;
  featuredImage: string;
};

export const POSTS: Record<string, IPost> = {
  'Welcome': {
    title: "Welcome to the HandyTooly Blog",
    description: "Discover the latest updates, tips, and insights from HandyTooly.",
    slug: "welcome",
    date: "2024-06-15",
    content: <WelcomePost />,
    tags: ["Updates"],
    author: "HandyTooly Team",
    readTime: 5,
    featuredImage: "https://v1.tailwindcss.com/img/card-left.jpg",
  },
  'Welcome2': {
    title: "Welcome to the HandyTooly Blog",
    description: "Discover the latest updates, tips, and insights from HandyTooly.",
    slug: "welcome",
    date: "2024-06-15",
    content: <WelcomePost />,
    tags: ["Updates"],
    author: "HandyTooly Team",
    readTime: 5,
    featuredImage: "https://v1.tailwindcss.com/img/card-left.jpg",
  },
};