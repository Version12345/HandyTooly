import Link from 'next/link';

interface Tool {
  name: string;
  description: string;
  link: string;
}

interface ToolCardProps {
  tool: Tool;
  category?: string;
  showCategoryLabel?: boolean;
  className?: string;
}

export default function ToolCard({ 
  tool, 
  category, 
  showCategoryLabel = false, 
  className = "" 
}: ToolCardProps) {
  return (
    <Link 
      href={tool.link}
      className={`block bg-white border border-gray-200 rounded-lg p-4 pb-1 hover:border-gray-300 hover:shadow-md transition-all duration-200 group tool-list-item ${className}`}
    >
      <div className="space-y-3">
        {showCategoryLabel && category && (
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {category}
          </div>
        )}
        
        <h3 className="transition-colors">
          {tool.name}
        </h3>
        
        <p className="text-sm leading-relaxed hidden md:block">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}