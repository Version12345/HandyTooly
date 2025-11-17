import { IPost } from "@/constants/posts"
import { formatDate } from "@/utils/dateUtils";

export default function BlogNameCard({ post }: { post: IPost }) {
  return (
    <div>
      {/* Author and Date */}
      <div className="flex items-center">
        {/* Author Avatar */}
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-3">
          <div
            className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold"
          >
            {(post.author || 'A').charAt(0).toUpperCase()}
          </div>
        </div>
      
        {/* Author Info */}
        <div>
          <div className="font-medium text-gray-900 text-sm">
            {post.author || 'HandyTooly Team'}
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(post.date)}
          </div>
        </div>
      </div>
    </div>
  );
}