import { canonicalUrl } from "@/utils/canonicalUrl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'About Us - Learn About Our Mission',
  description: "HandyTooly is a free online platform offering reliable calculators, converters, and practical tools. Built by experienced developers in the United States.",
  keywords: 'about handytooly, free tools, online calculators, web tools, developer team, mission, privacy-focused, no tracking',
  openGraph: {
    title: 'About Us - Learn About Our Mission',
    description: "HandyTooly is a free online platform offering reliable calculators, converters, and practical tools. Built by experienced developers in the United States.",
    type: 'website',
    url: canonicalUrl('/about-us', true),
  },
  alternates: {
    canonical: canonicalUrl('/about-us'),
  },
};

export default function ContactUs() {
    return (
    <main className="px-8 py-16">
      <div className="max-w-6xl mx-auto text-left">
        <h1>
          About HandyTooly
        </h1>
        <p>HandyTooly is a free online platform that offers fast, reliable calculators, converters, and practical web tools. It is built by a small team of experienced developers based in the United States. We believe in clean and functional design. Whether you are solving a quick math problem, calculating a mortgage, or formatting text for work, HandyTooly helps you get it done without distractions. Every tool runs smoothly in your browser, with no downloads or sign ups required. if you appreciate our work, please consider supporting us. If you have any feedback or suggestions, feel free to reach out by email at <a href="mailto:handytooly@gmail.com" className="text-orange-500">handytooly@gmail.com</a>!</p>

        <h1>
          Our Mission
        </h1>

        <p>We are developers, not marketers. Our team builds tools we actually use, paying attention to every detail. HandyTooly runs on a modern tech stack that includes TypeScript, Vue.js, and Nuxt, optimized for speed and accessibility across all devices. We respect your privacy and only use essential cookies to keep the site free and simple. No tracking, no data selling. Our goal is to keep expanding our library with accurate, useful tools for anyone who wants quick answers without the clutter!</p>
      </div>
    </main>
    );
};