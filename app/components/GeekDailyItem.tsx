import { GeekDailyItem } from '@/app/types/geekdaily';
import Link from 'next/link';
import HighlightText from './HighlightText';
import ExpandableText from './ExpandableText';
import BookmarkButton from './BookmarkButton';
import ShareButton from './ShareButton';
import { useBookmarks } from '@/app/hooks/useBookmarks';

interface GeekDailyItemProps {
  item: GeekDailyItem;
  searchQuery?: string;
}

export default function GeekDailyItemComponent({ item, searchQuery = '' }: GeekDailyItemProps) {
  const { attributes } = item;
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const formattedDate = new Date(attributes.time).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const shareData = {
    title: attributes.title,
    url: attributes.url,
    description: attributes.introduce,
    author: attributes.author
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span className="font-mono">
            <HighlightText text={attributes.episode} searchQuery={searchQuery} />
          </span>
          <div className="flex items-center gap-1">
            <time dateTime={attributes.time}>{formattedDate}</time>
            <ShareButton
              shareData={shareData}
              size="sm"
            />
            <BookmarkButton
              isBookmarked={isBookmarked(item.id)}
              onToggle={() => toggleBookmark(item.id)}
              size="sm"
            />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          <Link 
            href={attributes.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
          >
            <ExpandableText 
              text={attributes.title}
              searchQuery={searchQuery}
              maxLines={2}
              className="flex-1"
            />
            <svg className="w-4 h-4 opacity-50 group-hover:opacity-75 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </h2>
        
        {attributes.introduce && (
          <ExpandableText 
            text={attributes.introduce}
            searchQuery={searchQuery}
            maxLines={2}
            className="text-gray-600 dark:text-gray-300"
          />
        )}
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            作者: <HighlightText 
              text={attributes.author} 
              searchQuery={searchQuery} 
              className="font-medium text-gray-700 dark:text-gray-300"
            />
          </span>
        </div>
      </div>
    </article>
  );
}