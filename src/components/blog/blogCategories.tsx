import { tags } from '@/constants/posts';

interface BlogCategoriesProps {
  currentTags?: string[];
  showTitle?: boolean;
  className?: string;
}

export default function BlogCategories({ currentTags: categories, showTitle = true, className }: BlogCategoriesProps) {
  const currentCategories = categories && categories.length > 0 ? categories : tags;

  const handleClick = (tag: string) => {
    window.location.href = `/blog/tags/${encodeURIComponent(tag.toLowerCase())}`;
  }

  return (
    <div className={className ? className : "bg-white rounded-lg shadow-md p-6"}>
      {
        showTitle && (
          <h2 className="text-xl font-bold mb-4">
            Categories
          </h2>
        )
      }
      <div className="flex flex-wrap gap-2">
        {currentCategories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => handleClick(cat)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-800 rounded-full transition-colors"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};