import { tags } from '@/constants/posts';

export default function BlogCategories({ handleSearch }: { handleSearch: (category: string) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((cat) => (
          <button key={cat} onClick={() => handleSearch(cat)} className="px-3 py-1 text-sm bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-800 rounded-full transition-colors">
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};