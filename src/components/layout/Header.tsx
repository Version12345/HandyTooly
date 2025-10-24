'use client'
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const HEADER_LINKS = [
  { href: '/tools', label: 'Tools' },
  { href: '/tools/resume-cover-letter-convertor', label: 'Resume/Cover Letter Converter' },
  { href: '/donate', label: 'Donate' }
];

export default function Header() {
  const pathname = usePathname();

  const setLinkClass = (href: string) => {
    const baseClass = 'transition-colors font-medium';

    // change if router.pathname starts with the href
    const routeClass = pathname === href ? 
      'text-orange-600 hover:text-orange-400' : 
      'text-gray-600 hover:text-gray-400';

    return `${baseClass} ${routeClass}`;
  };

  return (
    <header className="p-4 bg-white">
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
              className={setLinkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}