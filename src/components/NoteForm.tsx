import React from 'react';

interface NoteFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="note" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              New Note
            </label>
            <button
              type="button"
              onClick={handlePaste}
              disabled={disabled}
              className="text-sm font-medium rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Paste from Clipboard
            </button>
          </div>
          <div className="mt-2">
            <textarea
              rows={4}
              name="note"
              id="note"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800/50 sm:text-sm sm:leading-6"
              placeholder="Type or paste your note here..."
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Add Note
          </button>
        </div>
      </div>
    </form>
  );
};
