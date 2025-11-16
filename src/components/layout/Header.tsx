'use client'
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ToolCategorySlug } from '@/constants/tools';

const HEADER_LINKS = [
  { href: '/tools', label: 'Tools' },
  { href: `/tools/${ToolCategorySlug.Jobs}/resume-cover-letter-converter`, label: 'Resume/Cover Letter Converter' },
  { href: '/blog', label: 'Blog' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const setLinkClass = (href: string) => {
    const baseClass = 'transition-colors font-medium';

    // change if router.pathname starts with the href
    const routeClass = pathname === href ? 
      'text-orange-600 hover:text-orange-400' : 
      'text-gray-600 hover:text-gray-400';

    return `${baseClass} ${routeClass}`;
  };

  return (
    <header className="p-2 bg-white border-b border-gray-200 class-main-header">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <Link 
            className="inline-block"
            href="/"
          >
            <Image 
              src="/images/handy-tooly-logo.svg" 
              alt="HandyTooly Logo" 
              className="h-8 w-auto"
              width={200}
              height={100}
            />
          </Link>
          
          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center mr-15 w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className={`w-6 h-6 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              {HEADER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${setLinkClass(link.href)} block py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}