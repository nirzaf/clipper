import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  FiBold, 
  FiItalic, 
  FiCode, 
  FiLink,
  FiList,
} from 'react-icons/fi';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-white rounded-t-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          editor.isActive('bold') ? 'bg-gray-100 text-blue-600' : 'text-gray-600'
        }`}
        title="Bold"
      >
        <FiBold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          editor.isActive('italic') ? 'bg-gray-100 text-blue-600' : 'text-gray-600'
        }`}
        title="Italic"
      >
        <FiItalic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          editor.isActive('bulletList') ? 'bg-gray-100 text-blue-600' : 'text-gray-600'
        }`}
        title="Bullet List"
      >
        <FiList className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          editor.isActive('codeBlock') ? 'bg-gray-100 text-blue-600' : 'text-gray-600'
        }`}
        title="Code Block"
      >
        <FiCode className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded hover:bg-gray-100 transition-colors ${
          editor.isActive('link') ? 'bg-gray-100 text-blue-600' : 'text-gray-600'
        }`}
        title="Add Link"
      >
        <FiLink className="w-4 h-4" />
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
          class: 'text-blue-600 hover:underline',
        },
      }),
      CodeBlock,
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[500px] px-4 py-3',
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <MenuBar editor={editor} />
      <div className="editor-wrapper">
        <EditorContent 
          editor={editor} 
          className="editor-content min-h-[500px] overflow-y-auto"
        />
      </div>
    </div>
  );
};
