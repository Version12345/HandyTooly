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
  'grow-your-money-smarter': {
    title: "Grow Your Money Smarter From Pennies to Profits: Understanding Annualized Returns",
    description: "Learn smart strategies to grow your money effectively. Discover tips and insights to make informed financial decisions and maximize your savings.",
    slug: "grow-your-money-smarter",
    date: "2025-12-11",
    tags: ["Insights", "Updates"],
    author: "HandyTooly Team",
    readTime: 3,
    featuredImage: "https://zosi0vn2uecxzezz.public.blob.vercel-storage.com/grow-your-money-smarter.jpg",
  }, 
  'christmas-is-coming': {
    title: "Tick Tock, Santa's Watching the Clock Too",
    description: "Get ready for the holidays with our Christmas countdown timer. Find out how many days are left until Christmas Day and start planning your festive activities!",
    slug: "christmas-is-coming",
    date: "2025-12-02",
    tags: ["Insights", "Updates"],
    author: "HandyTooly Team",
    readTime: 3,
    featuredImage: "https://zosi0vn2uecxzezz.public.blob.vercel-storage.com/christmas-is-coming.jpg",
  }, 
  'daily-steps-into-distance': {
    title: "Turn Your Daily Steps Into Real Distance",
    description: "Learn how a steps to distance calculator uses stride, pace, and weight to show miles, calories, and real progress you can trust.",
    slug: "daily-steps-into-distance",
    date: "2025-11-23",
    tags: ["Updates"],
    author: "HandyTooly Team",
    readTime: 2,
    featuredImage: "https://zosi0vn2uecxzezz.public.blob.vercel-storage.com/daily-steps-into-distance.jpg",
  }, 
  'time-zone-conversion': {
    title: "Time Zone Conversion Made Easy",
    description: "Easily convert time zones with between UTC and your local time. Get accurate time zone information and make scheduling a breeze.",
    slug: "time-zone-conversion",
    date: "2025-11-17",
    tags: ["Updates"],
    author: "HandyTooly Team",
    readTime: 2,
    featuredImage: "https://zosi0vn2uecxzezz.public.blob.vercel-storage.com/time-zone-conversion.jpg",
  }, 
  'welcome': {
    title: "Welcome to the HandyTooly",
    description: "Get updates, tips, and guides for HandyTooly’s free online tools. Learn new features and smart ways to save time.",
    slug: "welcome",
    date: "2025-11-16",
    tags: ["Updates"],
    author: "HandyTooly Team",
    readTime: 2,
    featuredImage: "https://zosi0vn2uecxzezz.public.blob.vercel-storage.com/welcome-to-HandyTooly.jpg",
  }, 
  
};