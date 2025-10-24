import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Link from "next/link";
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import "./globals.scss";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | HandyTooly',
    default: 'HandyTooly | A collection of online tools for fast, free, and built for everyone.',
  },
  description: "A collection of online tools for fast, free, and built for everyone.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >
        <div className="min-h-screen bg-white relative main-layout font-[Roboto]">
          {/* Red Corner Flag */}
          <div className="fixed -top-1 -right-1 z-50">
            <div className="relative">
              <Link href="/donate" className="block">
                <div className="bg-red-600 text-white text-xs font-bold py-2 px-8 transform rotate-45 translate-x-6 translate-y-4 shadow-lg cursor-pointer hover:bg-red-700 transition-colors">
                  DONATE
                </div>
              </Link>
            </div>
          </div>
          
          {/* Header */}
          <Header />

          {/* Page Content */}
          <div className="bg-slate-100 pb-10">
            {children}
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
