'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Categories, Tools } from '@/constants/tools';

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Always start with Tools
    breadcrumbs.push({
      label: 'Tools',
      href: '/',
      isLast: false
    });

    // If we're on the home page, return just Tools
    if (pathSegments.length === 0) {
      breadcrumbs[0].isLast = true;
      return breadcrumbs;
    }

    // Handle different URL patterns
    if (pathSegments[0] === 'categories') {
      // /categories/health pattern
      if (pathSegments.length >= 2) {
        const categorySlug = pathSegments[1];
        const categoryKey = Object.keys(Categories).find(key => 
          Categories[key].slug === categorySlug
        );
        
        if (categoryKey) {
          breadcrumbs.push({
            label: Categories[categoryKey].name,
            href: `/categories/${categorySlug}`,
            isLast: true
          });
        }
      }
    } else if (pathSegments[0] === 'tools') {
      // /tools or /tools/category/tool-name pattern
      if (pathSegments.length === 1) {
        // Just /tools
        breadcrumbs.push({
          label: 'Tools',
          href: '/tools',
          isLast: true
        });
      } else if (pathSegments.length >= 2) {
        // /tools/health/bmi-calculator pattern
        const categorySlug = pathSegments[1];
        const categoryKey = Object.keys(Categories).find(key => 
          Categories[key].slug === categorySlug
        );
        
        if (categoryKey) {
          // Add category breadcrumb linking to category page
          breadcrumbs.push({
            label: Categories[categoryKey].name,
            href: `/categories/${categorySlug}`,
            isLast: pathSegments.length === 2
          });
          
          // If there's a tool name, add it
          if (pathSegments.length >= 3) {
            const fullToolPath = '/' + pathSegments.join('/');
            let toolName = '';
            let foundTool = false;
            
            // Find the tool name from constants
            Object.values(Tools).forEach(toolsList => {
              toolsList.forEach(tool => {
                if (tool.link === fullToolPath) {
                  toolName = tool.name;
                  foundTool = true;
                }
              });
            });
            
            if (!foundTool) {
              // Fallback: convert kebab-case to Title Case
              toolName = pathSegments.slice(2).join('/')
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            }
            
            breadcrumbs.push({
              label: toolName,
              href: fullToolPath,
              isLast: true
            });
          }
        } else {
          // Fallback for unknown categories
          breadcrumbs.push({
            label: 'Tools',
            href: '/tools',
            isLast: pathSegments.length === 1
          });
          
          if (pathSegments.length >= 2) {
            breadcrumbs.push({
              label: pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1),
              href: `/tools/${pathSegments[1]}`,
              isLast: pathSegments.length === 2
            });
          }
        }
      }
    } else {
      // Handle other paths (like direct tool paths /resume-cover-letter-converter)
      let currentPath = '';
      
      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        currentPath += `/${segment}`;
        const isLast = i === pathSegments.length - 1;
        
        // Try to find if this is a tool
        let label = segment;
        let foundTool = false;
        
        Object.values(Tools).forEach(toolsList => {
          toolsList.forEach(tool => {
            if (tool.link === currentPath) {
              label = tool.name;
              foundTool = true;
            }
          });
        });
        
        if (!foundTool) {
          // Convert kebab-case to Title Case
          label = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
        
        breadcrumbs.push({
          label,
          href: currentPath,
          isLast
        });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-xs text-gray-600 mb-2" aria-label="Breadcrumb">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index > 0 && (
            <svg 
              className="w-4 h-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          
          {breadcrumb.isLast ? (
            <span className="text-gray-900 font-medium">
              {breadcrumb.label}
            </span>
          ) : (
            <Link 
              href={breadcrumb.href}
              className="hover:text-orange-500 transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}