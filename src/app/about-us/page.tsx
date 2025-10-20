import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Our platform helps job seekers create better resumes and cover letters. Your donations help us keep this service free and continuously improve our AI-powered tools.",
};

export default function ContactUs() {
    return (
    <main className="px-8 py-16">
      <div className="max-w-6xl mx-auto text-left">
        <h1>
          About HandyTooly
        </h1>
        <p>HandyTooly is a free online platform that offers fast, reliable calculators, converters, and practical web tools. It is built by a small team of experienced developers based in the United States. We believe in clean and functional design. Whether you are solving a quick math problem, calculating a mortgage, or formatting text for work, HandyTooly helps you get it done without distractions. Every tool runs smoothly in your browser, with no downloads or sign ups required.</p>

        <h1>
          Our Mission
        </h1>

        <p>We are developers, not marketers. Our team builds tools we actually use, paying attention to every detail. HandyTooly runs on a modern tech stack that includes TypeScript, Vue.js, and Nuxt, optimized for speed and accessibility across all devices. We respect your privacy and only use essential cookies to keep the site free and simple. No tracking, no data selling. Our goal is to keep expanding our library with accurate, useful tools for  anyone who wants quick answers without the clutter!</p>
      </div>
    </main>
    );
};