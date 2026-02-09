'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState, useCallback } from 'react';
import { debounce } from '@/lib/utils';

interface WritingEditorProps {
  bookId: string;
  chapterId?: string;
  initialContent?: string;
  onSave: (content: string) => Promise<void>;
}

export default function WritingEditor({ 
  bookId, 
  chapterId, 
  initialContent = '', 
  onSave 
}: WritingEditorProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6',
      },
    },
  });

  /**
   * Auto-save với debounce 2000ms
   */
  const debouncedSave = useCallback(
    debounce(async (content: string) => {
      setSaveStatus('saving');
      try {
        await onSave(content);
        setSaveStatus('saved');
        setLastSaved(new Date());
        
        // Reset về idle sau 2s
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Save error:', error);
        setSaveStatus('idle');
        alert('Lỗi khi lưu nội dung. Vui lòng thử lại.');
      }
    }, 2000),
    [onSave]
  );

  /**
   * Lắng nghe thay đổi editor
   */
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const html = editor.getHTML();
      debouncedSave(html);
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, debouncedSave]);

  if (!editor) {
    return <div className="text-center py-12">Đang tải editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Bold */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-2 rounded hover:bg-gray-100 font-bold ${
              editor.isActive('bold') ? 'bg-gray-200' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            B
          </button>

          {/* Italic */}
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-2 rounded hover:bg-gray-100 italic ${
              editor.isActive('italic') ? 'bg-gray-200' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            I
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Heading 1 */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-2 rounded hover:bg-gray-100 font-bold ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
            }`}
            title="Heading 1"
          >
            H1
          </button>

          {/* Heading 2 */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-2 rounded hover:bg-gray-100 font-bold ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
            }`}
            title="Heading 2"
          >
            H2
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Blockquote */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-2 rounded hover:bg-gray-100 ${
              editor.isActive('blockquote') ? 'bg-gray-200' : ''
            }`}
            title="Quote"
          >
            "
          </button>
        </div>

        {/* Save Status */}
        <div className="flex items-center space-x-4">
          {saveStatus === 'saving' && (
            <span className="text-sm text-blue-600 flex items-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang lưu...
            </span>
          )}
          
          {saveStatus === 'saved' && (
            <span className="text-sm text-green-600 flex items-center">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Đã lưu
              {lastSaved && (
                <span className="ml-1 text-gray-500">
                  ({lastSaved.toLocaleTimeString('vi-VN')})
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="bg-cream-100 min-h-screen">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
