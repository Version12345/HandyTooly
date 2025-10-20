import Link from "next/link";
import Image from 'next/image';

const FOOTER_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' }
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-300 py-8 px-8 mt-16">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link 
          className="inline-block"
          href="/"
        >
            <Image 
                src="/images/handy-tooly-logo.svg" 
                alt="HandyTooly Logo" 
                className="h-6 w-auto"
                width={300}
                height={100}
            />
        </Link>
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
  );
}