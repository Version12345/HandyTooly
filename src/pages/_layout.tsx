import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

const HEADER_LINKS = [
  { href: '/tools/resume-cover-letter-convertor', label: 'Resume/Cover Letter Converter' },
  { href: '/donate', label: 'Donate' }
];

const FOOTER_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' }
];

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const setLinkClass = (href: string) => {
    const baseClass = 'transition-colors font-medium';

    // change if router.pathname starts with the href
    const routeClass = router.pathname.startsWith(href) ? 
      'text-orange-500 hover:text-orange-700' : 
      'text-gray-700 hover:text-gray-900';

    return `${baseClass} ${routeClass}`;
  };

  return (
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
            <img 
              src="/images/handy-tooly-logo.svg" 
              alt="HandyTooly Logo" 
              className="h-8 w-auto"
            />
          </Link>
          
          {/* Navigation Menu */}
          <nav className="flex items-center space-x-6">
            {HEADER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={setLinkClass(link.href)}
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
          <img 
            src="/images/handy-tooly-logo.svg" 
            alt="HandyTooly Logo" 
            className="h-6 w-auto"
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
  );
}