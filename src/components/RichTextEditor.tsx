import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import { FiBold } from 'react-icons/fi';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
          editor.isActive('bold') ? 'bg-gray-100 dark:bg-gray-800' : ''
        }`}
        title="Bold"
      >
        <FiBold />
      </button>
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Write something...',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-500 hover:underline',
        },
      }),
      CodeBlock,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm hover:border-primary-500 dark:hover:border-primary-500 focus-within:border-primary-500 dark:focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
      <MenuBar editor={editor} />
      <div className="border-t border-gray-200 dark:border-gray-700">
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none"
        />
      </div>
    </div>
  );
};
