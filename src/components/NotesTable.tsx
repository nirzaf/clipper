import React from 'react';
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
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">No notes yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first note!</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid gap-4 grid-cols-1">
        {notes.map((note) => (
          <div
            key={note.id}
            className="group relative bg-white dark:bg-gray-800/50 rounded-lg shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                    {note.content}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => onDelete(note.id)}
                    className="px-2 py-1 text-sm rounded-md text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-opacity duration-200"
                    title="Delete note"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Note #{note.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
