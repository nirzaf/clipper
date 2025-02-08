import React, { memo, useMemo } from 'react';
import { ClipboardItem as ClipboardItemType } from '../types/clipboard';
import { useClipboard } from '../hooks/useClipboard';

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

  return (
    <div className={`relative group animate-fade-in`}>
      {/* Subtle gradient border */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${borderGradient} opacity-20 group-hover:opacity-30 transition-all duration-300 blur-[2px]`}
      />
      
      {/* Main card */}
      <div className="relative backdrop-blur-sm bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
        {/* Content container */}
        <div className="p-6">
          {/* Content area with subtle background */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="prose max-w-none mb-4 text-gray-800 dark:text-white" 
                 dangerouslySetInnerHTML={{ __html: item.content }} 
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-4 mt-2">
            <button
              onClick={handleCopy}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 relative group"
              title={isCopied ? 'Copied!' : 'Copy to clipboard'}
            >
              <img 
                src="/copy.png" 
                alt="Copy" 
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isCopied ? 'opacity-75' : ''
                }`}
              />
              {isCopied && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Copied!
                </div>
              )}
            </button>
            <button
              onClick={() => onDelete(item.id)}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 group"
              title="Delete"
            >
              <img 
                src="/delete.png" 
                alt="Delete" 
                className="w-5 h-5 transition-transform group-hover:scale-110"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ClipboardItem = memo(ClipboardItemBase);
