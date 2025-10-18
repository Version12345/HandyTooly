import Layout from "./_layout";
import Link from 'next/link';

export default function Home() {

  return (
    <Layout>
      {/* Main Content */}
      <main className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Hero Image Section */}
            <div className="bg-gray-400 h-64 lg:h-96 flex items-center justify-center text-black font-bold text-2xl">
              HERO IMAGE
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <p className="text-gray-800 leading-relaxed">
                Job searching can be frustrating. You spend hours rewriting your resume and cover letter for each role. Our tool fixes that. It matches your resume and cover letter to the job description in minutes. No more guessing what to change or where to start. You get clear, tailored documents that fit the job. Save time, stay focused, and make your search less stressful. Start your next application with confidence.
              </p>
              
              {/* Start Button */}
              <Link 
                href="/resume-cover-letter-convertor"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-12 rounded-full text-lg transition-colors duration-200 text-center"
              >
                Start
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
