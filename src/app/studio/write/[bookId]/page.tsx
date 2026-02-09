import WritingEditor from '@/components/WritingEditor';
import { saveChapterContent } from '@/app/actions/chapter';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function WritingStudioPage({
  params,
  searchParams,
}: {
  params: { bookId: string };
  searchParams: { chapterId?: string };
}) {
  const { bookId } = params;
  const { chapterId } = searchParams;

  // Fetch book
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      chapters: {
        orderBy: { orderIndex: 'asc' },
      },
    },
  });

  if (!book) {
    notFound();
  }

  // Fetch current chapter if specified
  const currentChapter = chapterId
    ? await prisma.chapter.findUnique({
        where: { id: chapterId },
      })
    : null;

  const handleSave = async (content: string) => {
    'use server';
    if (!chapterId) return;
    await saveChapterContent(chapterId, content);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
            <p className="text-sm text-gray-600">
              {currentChapter ? currentChapter.title : 'Chọn chương để chỉnh sửa'}
            </p>
          </div>
          <a
            href={`/book/${bookId}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Xem trước
          </a>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Chapter List */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Danh sách chương</h2>
          <ul className="space-y-2">
            {book.chapters.map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`/studio/write/${bookId}?chapterId=${chapter.id}`}
                  className={`block px-3 py-2 rounded hover:bg-gray-100 ${
                    chapter.id === chapterId ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                >
                  {chapter.orderIndex + 1}. {chapter.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Editor */}
        <main className="flex-1">
          {currentChapter ? (
            <WritingEditor
              bookId={bookId}
              chapterId={currentChapter.id}
              initialContent={currentChapter.content}
              onSave={handleSave}
            />
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p>Chọn một chương từ danh sách bên trái để bắt đầu viết</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
