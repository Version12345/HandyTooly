import { ToolList } from "@/components/toolList";

export const metadata = {
    title: 'The handy tools for every tasks',
    description: 'A collection of online tools for fast, free, and built for everyone.',
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
