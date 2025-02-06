import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import { FiSend } from 'react-icons/fi';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-1">
        <RichTextEditor
          content={value}
          onChange={onChange}
          placeholder="Type your note here..."
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="button button-primary"
        >
          <FiSend className={disabled ? 'animate-pulse' : ''} />
          {disabled ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};
