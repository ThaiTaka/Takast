'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Save chapter content (Auto-save từ Editor)
 */
export async function saveChapterContent(
  chapterId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.chapter.update({
      where: { id: chapterId },
      data: { 
        content,
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/studio/write`);
    
    return { success: true };
  } catch (error) {
    console.error('Save chapter error:', error);
    return { 
      success: false, 
      error: 'Không thể lưu nội dung. Vui lòng thử lại.' 
    };
  }
}

/**
 * Create new chapter
 */
export async function createChapter(
  bookId: string,
  title: string
): Promise<{ success: boolean; chapterId?: string; error?: string }> {
  try {
    // Get max orderIndex
    const lastChapter = await prisma.chapter.findFirst({
      where: { bookId },
      orderBy: { orderIndex: 'desc' },
    });

    const newOrderIndex = (lastChapter?.orderIndex ?? -1) + 1;

    const chapter = await prisma.chapter.create({
      data: {
        title,
        content: '',
        orderIndex: newOrderIndex,
        bookId,
      },
    });

    revalidatePath(`/studio/write/${bookId}`);

    return { success: true, chapterId: chapter.id };
  } catch (error) {
    console.error('Create chapter error:', error);
    return { 
      success: false, 
      error: 'Không thể tạo chương mới.' 
    };
  }
}

/**
 * Delete chapter
 */
export async function deleteChapter(
  chapterId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.chapter.delete({
      where: { id: chapterId },
    });

    revalidatePath(`/studio/write`);

    return { success: true };
  } catch (error) {
    console.error('Delete chapter error:', error);
    return { 
      success: false, 
      error: 'Không thể xóa chương.' 
    };
  }
}
