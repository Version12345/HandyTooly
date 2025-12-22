'use client';
import { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";

export default function SupportUs({ searchParams }: { searchParams: Promise<{ isreturning: string }> }) {
  const [isReturning, setIsReturning] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = (text: string, buttonId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [buttonId]: true }));
    
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [buttonId]: false }));
    }, 1500);
  };

  useEffect(() => {
    searchParams.then(params => {
      const returningParam = params.isreturning;
      if (returningParam === 'true') {
        setIsReturning(true);
      }
    });
  }, [searchParams]);
  
  return (
    <main className="p-3">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Support Our Mission
        </h1>

        {
          isReturning ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-green-800 mb-1">
                Thank you very much for your continued support!
              </h2>
              <p className="text-green-700 pb-4">
                Your generosity enables us to keep improving and providing valuable tools for free.
              </p>
              <div className="p-4">
                <Link href="/" className="text-sm text-green-700 border border-green-200 p-4 m-4 bg-white hover:bg-green-100 rounded-lg">Return to Homepage</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="">
                Your support keeps our service <strong>free and continuously improve our tools</strong>.
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-white rounded-lg p-6">
                  <h2>Support via PayPal</h2>
                  <p className="text-sm text-gray-500">Your payment will be securely processed through PayPal. You’ll be redirected to PayPal to complete your transaction.</p>

                    <Link href="https://www.paypal.com/ncp/payment/STE5LVWF8XS46" target="_blank" rel="noopener noreferrer">
                      <div className="border border-gray-300 rounded-md p-4 mt-4 hover:border-orange-300 hover:cursor-pointer transition-colors">
                        <form 
                          action="https://www.paypal.com/ncp/payment/STE5LVWF8XS46" 
                          method="post" 
                          target="_blank" 
                          style={{ 
                            display: 'inline-grid', 
                            justifyItems: 'center', 
                            alignContent: 'start', 
                            gap: '0.5rem'
                          }}
                        >
                          <input className="pp-STE5LVWF8XS46 mt-5" type="submit" value="Support Now" />
                          <Image 
                            src="https://www.paypalobjects.com/images/Debit_Credit_APM.svg" 
                            alt="cards" 
                            height={20}
                            width={140}
                          />
                          <section style={{ fontSize: '0.75rem' }}> 
                            Powered by 
                            <Image 
                              src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg" 
                              alt="paypal" 
                              style={{ height: '0.875rem', verticalAlign: 'middle', display: 'inline-block' }} 
                              className="pl-1"
                              height={14}
                              width={39}
                            />
                          </section>
                        </form>
                      </div>
                    </Link>

                    <h2 className="text-sm text-gray-500 space-y-2 text-center mx-auto my-4">
                      &mdash; OR &mdash;
                    </h2>

                    <Image 
                      src="https://zosi0vn2uecxzezz.public.blob.vercel-storage.com/qrcode.png" 
                      alt="Stripe Logo" 
                      className="mx-auto my-4"
                      height={40}
                      width={150}
                    />

                    <div className="text-sm text-gray-500 space-y-2">
                      <span className="text-green-500">✓</span> Secure payment processing
                      <br/>
                      <span className="text-green-500">✓</span> 100% of support go to development
                    </div>
                  </div>
                  
                <div className="bg-white rounded-lg p-6 ">
                  <h2>Support via Cryptocurrencies</h2>
                  <p className="text-sm text-gray-500">You can also support us using Bitcoin or Solana.</p>

                  <div className="mt-4 space-y-4 text-sm border border-gray-300 rounded-lg p-4">
                    <h3 className="font-medium">Bitcoin (BTC)</h3>
                    <div 
                      className="px-3 py-2 bg-orange-100 hover:bg-orange-200 rounded-lg hover:cursor-pointer"
                      onClick={() => copyToClipboard(bitcoinAddress, 'bitcoin')}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[80%_15%] gap-3 items-center">
                        <div>
                            <span className='text-sm wrap-break-word text-left'>{bitcoinAddress}</span>
                        </div>
                        <button
                            className="px-2 py-1 text-[10px] bg-orange-300 hover:bg-gray-400 text-white rounded transition-colors"
                            title="Copy to clipboard"
                        >
                            {copiedStates['bitcoin'] ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-4 text-sm border border-gray-300 rounded-lg p-4">
                    <h3 className="font-medium">Solana (SOL)</h3>
                    <div 
                      className="px-3 py-2 bg-orange-100 hover:bg-orange-200 rounded-lg hover:cursor-pointer"
                      onClick={() => copyToClipboard(solanaAddress, 'solana')}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[80%_15%] gap-3 items-center">
                        <div>
                            <span className='text-sm wrap-break-word text-left'>{solanaAddress}</span>
                        </div>
                        <button
                            className="px-2 py-1 text-[10px] bg-orange-300 hover:bg-gray-400 text-white rounded transition-colors"
                            title="Copy to clipboard"
                        >
                            {copiedStates['solana'] ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }
      </div>
    </main>
  );
}

const bitcoinAddress = "3HtNUiVqmExZWCKdo2ztLT32ZK1VUVKQEs";
const solanaAddress = "HwenNBRuTAq7HZvPPZmt9TikRaD5QtGMePvdBK78NTBE";