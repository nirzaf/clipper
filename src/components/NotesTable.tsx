import React, { useState } from 'react';
import { ClipboardItem } from '../types/clipboard';

interface NotesTableProps {
  notes: ClipboardItem[];
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const NotesTable: React.FC<NotesTableProps> = ({
  notes,
  onDelete,
  loading = false
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (content: string, id: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No notes yet. Start typing to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr,auto] gap-4 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
      </div>
      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className="group relative rounded-md border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-200"
          >
            <div className="px-4 py-3 grid grid-cols-[1fr,auto] gap-4 items-start">
              <div className="text-base text-gray-900 dark:text-white whitespace-pre-wrap break-words min-h-[2rem]">
                {note.content}
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleCopy(note.content, note.id)}
                  className={`
                    p-1.5 rounded-md transition-all duration-200 text-base
                    ${copiedId === note.id
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }
                    focus:opacity-100 focus:outline-none
                  `}
                  title={copiedId === note.id ? 'Copied!' : 'Copy to clipboard'}
                >
                  {copiedId === note.id ? '✅' : '📋'}
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:opacity-100 focus:outline-none transition-all duration-200 text-base"
                  title="Delete note"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
