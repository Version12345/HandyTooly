import { ToolList } from "@/components/toolList";
import { canonicalUrl } from "@/utils/canonicalUrl";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'The handy tools for every tasks',
    description: 'A collection of online tools for fast, free, and built for everyone.',
    alternates: {
        canonical: canonicalUrl('/tools'),
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
        </div>
      </div>
    </main>
  );
}
