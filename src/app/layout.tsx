import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Link from "next/link";
import Image from 'next/image'

import "./globals.scss";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const HEADER_LINKS = [
  { href: '/tools/resume-cover-letter-convertor', label: 'Resume/Cover Letter Converter' },
  { href: '/donate', label: 'Donate' }
];

const FOOTER_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' }
];

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
          <header className="p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <Link 
                className="inline-block"
                href="/"
              >
                <Image 
                  src="/images/handy-tooly-logo.svg" 
                  alt="HandyTooly Logo" 
                  className="h-8 w-auto"
                  width={300}
                  height={100}
                />
              </Link>
              
              {/* Navigation Menu */}
              <nav className="flex items-center space-x-6">
                {HEADER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors font-medium text-gray-700 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          {/* Page Content */}
          {children}

          {/* Footer */}
          <footer className="border-t border-gray-300 py-8 px-8 mt-16">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <Image 
                src="/images/handy-tooly-logo.svg" 
                alt="HandyTooly Logo" 
                className="h-6 w-auto"
                width={300}
                height={100}
              />
              <div className="flex space-x-8">
                {FOOTER_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
