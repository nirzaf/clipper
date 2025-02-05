import React, { useState } from 'react';

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
  const [isFocused, setIsFocused] = useState(false);

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
      <div className="rounded-md border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700">
        <div 
          className={`
            relative transition-all duration-200
            ${isFocused ? 'bg-gray-50/80 dark:bg-gray-800/30' : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/20'}
          `}
        >
          <div className="px-4 py-3">
            <textarea
              rows={1}
              name="note"
              id="note"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              className="block w-full resize-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-0 border-0 p-0 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Type your note here..."
              style={{ minHeight: '2.5rem' }}
            />
            <div className="mt-2 flex items-center justify-end space-x-1">
              <button
                type="button"
                onClick={handlePaste}
                disabled={disabled}
                className="p-1.5 text-base rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                title="Paste from clipboard"
              >
                📋
              </button>
              {value.trim() && (
                <button
                  type="submit"
                  disabled={disabled}
                  className="p-1.5 text-base rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Save note"
                >
                  💾
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
