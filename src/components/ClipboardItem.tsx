import React, { memo, useMemo } from 'react';
import { ClipboardItem as ClipboardItemType } from '../types/clipboard';
import { useClipboard } from '../hooks/useClipboard';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { FiCopy, FiTrash2, FiClock } from 'react-icons/fi';

// Array of Tailwind gradient classes
const borderGradients = [
  'from-pink-500 via-purple-500 to-indigo-500',
  'from-purple-500 via-blue-500 to-cyan-500',
  'from-cyan-500 via-teal-500 to-emerald-500',
  'from-emerald-500 via-green-500 to-lime-500',
  'from-yellow-500 via-orange-500 to-red-500',
  'from-rose-500 via-pink-500 to-purple-500',
  'from-blue-500 via-indigo-500 to-violet-500'
];

interface ClipboardItemProps {
  item: ClipboardItemType;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const ClipboardItemBase: React.FC<ClipboardItemProps> = ({
  item,
  onDelete,
  loading
}) => {
  const { copyToClipboard, copiedId } = useClipboard();
  const isCopied = copiedId === item.id;

  const handleCopy = async () => {
    try {
      await copyToClipboard(item.content, item.id);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate a consistent gradient based on item id
  const borderGradient = useMemo(() => {
    const index = Math.abs(item.id) % borderGradients.length;
    return borderGradients[index];
  }, [item.id]);

  const timeAgo = React.useMemo(() => {
    try {
      if (!item.created_at) return 'Just now';
      
      let date;
      try {
        date = parseISO(item.created_at);
      } catch (err) {
        date = new Date(item.created_at);
      }

      if (isNaN(date.getTime())) return 'Just now';

      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Just now';
    }
  }, [item.created_at]);

  return (
    <div className="group relative">
      {/* Gradient border container */}
      <div className={`absolute -inset-[0.5px] rounded-xl bg-gradient-to-r ${borderGradient} opacity-75 blur-[1px] transition duration-300 group-hover:opacity-100 group-hover:blur-0`} />
      
      {/* Content container */}
      <div className="relative bg-white rounded-xl overflow-hidden">
        {/* Time badge */}
        <div className="flex items-center text-sm text-gray-500 px-5 pt-4">
          <FiClock className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span>{timeAgo}</span>
        </div>

        {/* Main content */}
        <div className="p-5">
          <div
            className="prose prose-sm max-w-none text-gray-700 min-h-[50px] max-h-[300px] overflow-y-auto custom-scrollbar"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end items-center p-4 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100">
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            className={`inline-flex items-center justify-center w-14 h-14 rounded-lg text-sm font-medium transition-all duration-200 ${
              isCopied 
                ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            {isCopied ? (
              <svg className="w-8 h-8 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <FiCopy className="w-8 h-8" />
            )}
          </button>

          <div className="w-8" /> {/* Reduced spacer for larger buttons */}

          <button
            onClick={() => onDelete(item.id)}
            title="Delete item"
            className="inline-flex items-center justify-center w-14 h-14 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <FiTrash2 className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ClipboardItem = memo(ClipboardItemBase);
