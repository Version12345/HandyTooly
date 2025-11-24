export const TAGS = [
  "Updates",
  "Tips",
  "Insights"
];

export interface IPost {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags: typeof TAGS[number][];
  author: string;
  readTime: number;
  featuredImage: string;
};

export const POSTS: Record<string, IPost> = {
  'daily-steps-into-distance': {
    title: "Turn Your Daily Steps Into Real Distance",
    description: "Learn how a steps to distance calculator uses stride, pace, and weight to show miles, calories, and real progress you can trust.",
    slug: "daily-steps-into-distance",
    date: "2025-11-23",
    tags: ["Updates"],
    author: "HandyTooly Team",
    readTime: 2,
    featuredImage: "/images/blogs/daily-steps-into-distance.jpg",
  }, 
  'time-zone-conversion': {
    title: "Time Zone Conversion Made Easy",
    description: "Easily convert time zones with between UTC and your local time. Get accurate time zone information and make scheduling a breeze.",
    slug: "time-zone-conversion",
    date: "2025-11-17",
    tags: ["Updates"],
    author: "HandyTooly Team",
    readTime: 2,
    featuredImage: "/images/blogs/time-zone-conversion.jpg",
  }, 
  'welcome': {
    title: "Welcome to the HandyTooly",
    description: "Get updates, tips, and guides for HandyTooly’s free online tools. Learn new features and smart ways to save time.",
    slug: "welcome",
    date: "2025-11-16",
    tags: ["Updates"],
    author: "HandyTooly Team",
    readTime: 2,
    featuredImage: "/images/blogs/welcome-to-HandyTooly.jpg",
  }, 
  
};