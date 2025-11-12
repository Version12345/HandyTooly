import { ToolList } from '@/components/toolList';
import { canonicalUrl } from '@/utils/canonicalUrl';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The handy tools for every tasks',
  description: 'A collection of online tools for fast, free, and built for everyone.',
  alternates: {
    canonical: canonicalUrl(`/categories/jobs-and-career`),
  },
};

export default function Home() {
  return (
    <main className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-6">
          <h1>
            The handy tools for every tasks
          </h1>
          <p className="leading-relaxed">
            A collection of online tools for fast, free, and built for everyone.
          </p>

          <ToolList />

          <div>
            <h2>
              HandyTooly: Your One-Stop Hub for Everyday Tools
            </h2>
            <p className="mb-4">
              HandyTooly takes the hassle out of searching for reliable calculators and online helpers. Whether you&apos;re planning a mortgage, splitting a dinner bill, or picking the perfect color palette, we&apos;ve got you covered. From budget calculators and unit converters to QR code makers and color pickers, everything works right in your browser. No downloads. No sign-ups. Just quick, accurate results when you need them.
            </p>
            <p className="mb-4">
              We build tools that solve real problems for real people. Need help planning your savings or tracking your health goals? Our finance and wellness tools make it easy. Want stronger passwords, clean text, or a quick design helper? Our productivity suite delivers in seconds. Every feature is tested for accuracy and built for speed, so you get answers you can trust—anytime, anywhere. HandyTooly keeps growing with you, adding smarter tools that make everyday tasks simpler and faster.
            </p>
            <h2>
              Take the Stress Out of Job Applications
            </h2>
            <p>
              Job searching can be frustrating. You spend hours rewriting your resume and cover letter for every role. Our tool fixes that. It matches your resume and cover letter to the job description in minutes. No guessing what to change or where to start. HandyTooly also helps you plan your savings, track health goals, and stay productive. Every tool is tested, reliable, and built to give you clear answers quickly and simply.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
