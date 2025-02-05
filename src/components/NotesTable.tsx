import React from 'react';
import { ClipboardItem as ClipboardItemType } from '../types/clipboard';
import { ClipboardItem } from './ClipboardItem';

interface NotesTableProps {
  notes: ClipboardItemType[];
  onDelete: (id: number) => void;
  loading: boolean;
}

/**
 * Table component for displaying clipboard items with loading and empty states
 */
export const NotesTable: React.FC<NotesTableProps> = ({
  notes,
  onDelete,
  loading
}) => {
  if (loading && notes.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-white/50 backdrop-blur-sm">
        <div className="inline-flex items-center text-sm text-gray-600">
          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading notes...
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 border rounded-lg bg-white/50 backdrop-blur-sm">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="mt-4 text-sm font-medium">No notes yet</h3>
        <p className="mt-1 text-sm text-gray-400">Add your first note using the form above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border rounded-lg bg-white/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50/50">
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th scope="col" className="relative px-3 py-2">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-gray-200">
            {notes.map((note) => (
              <ClipboardItem
                key={note.field_3420227}
                item={note}
                onDelete={onDelete}
                loading={loading}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-2 bg-gray-50/50 border-t">
        <p className="text-xs text-gray-600">
          Total notes: <span className="font-medium">{notes.length}</span>
        </p>
      </div>
    </div>
  );
};
