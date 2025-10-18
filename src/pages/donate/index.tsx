import Layout from '../_layout';

export default function Donate() {
  return (
    <Layout>
      {/* Main Content */}
      <main className="px-8 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Support Our Mission
          </h1>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-orange-800 mb-4">
              Help Us Help You
            </h2>
            <p className="text-orange-700 leading-relaxed">
              Our platform helps job seekers create better resumes and cover letters. 
              Your donations help us keep this service free and continuously improve our AI-powered tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
              <h3 className="text-xl font-semibold mb-2">$5</h3>
              <p className="text-gray-600">Buy us a coffee</p>
              <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition-colors">
                Donate $5
              </button>
            </div>
            
            <div className="bg-white border-2 border-orange-500 rounded-lg p-6 transform scale-105">
              <div className="bg-orange-500 text-white text-xs font-bold py-1 px-3 rounded-full inline-block mb-2">
                POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-2">$25</h3>
              <p className="text-gray-600">Support development</p>
              <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition-colors">
                Donate $25
              </button>
            </div>
            
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
              <h3 className="text-xl font-semibold mb-2">$50</h3>
              <p className="text-gray-600">Be a sponsor</p>
              <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition-colors">
                Donate $50
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-4">Custom Amount</h3>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-lg">$</span>
              <input 
                type="number" 
                placeholder="Enter amount" 
                className="border border-gray-300 rounded px-4 py-2 w-32 text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="1"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded transition-colors">
                Donate
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500 space-y-2">
            <p>✓ Secure payment processing</p>
            <p>✓ 100% of donations go to development</p>
            <p>✓ Tax-deductible receipts available</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 py-8 px-8 mt-16">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="bg-gray-400 inline-block px-6 py-2 text-black font-bold text-sm">
            LOGO
          </div>
          <div className="flex space-x-8 text-gray-500">
            <span>Lorem ipsum</span>
            <span>Lorem ipsum</span>
            <span>Lorem ipsum</span>
          </div>
        </div>
      </footer>
    </Layout>
  );
}