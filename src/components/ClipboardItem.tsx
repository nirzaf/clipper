import React from 'react';
import { Button } from './ui/Button';
import { ClipboardItem as ClipboardItemType } from '../types/clipboard';

interface ClipboardItemProps {
  item: ClipboardItemType;
  onDelete: (id: number) => void;
  loading?: boolean;
}

/**
 * Individual clipboard item component with copy and delete actions
 */
export const ClipboardItem: React.FC<ClipboardItemProps> = ({
  item,
  onDelete,
  loading
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.content);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <tr className="group hover:bg-gray-50">
      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
        {item.created_at}
      </td>
      <td className="px-3 py-2 text-sm text-gray-900">
        <div className="whitespace-pre-wrap text-sm">{item.content}</div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            }
            title="Copy to clipboard"
          />
          <Button
            onClick={() => onDelete(item.id)}
            variant="ghost"
            size="sm"
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
            disabled={loading}
            className="text-red-600 hover:text-red-900 hover:bg-red-50"
          />
        </div>
      </td>
    </tr>
  );
};
