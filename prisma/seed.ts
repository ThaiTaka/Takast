import { PrismaClient, UserRole, BookStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const authorPassword = await bcrypt.hash('author123', 10);
  const readerPassword = await bcrypt.hash('reader123', 10);

  const author = await prisma.user.upsert({
    where: { email: 'author@takash.com' },
    update: {},
    create: {
      email: 'author@takash.com',
      password: authorPassword,
      name: 'Tác giả Test',
      role: UserRole.AUTHOR,
    },
  });

  const reader = await prisma.user.upsert({
    where: { email: 'reader@takash.com' },
    update: {},
    create: {
      email: 'reader@takash.com',
      password: readerPassword,
      name: 'Độc giả Test',
      role: UserRole.READER,
    },
  });

  console.log('✓ Created users:', { author: author.email, reader: reader.email });

  // Create test book
  const book = await prisma.book.create({
    data: {
      title: 'Truyện Test - Giọng Đọc Tiếng Việt',
      description:
        'Đây là một cuốn sách test để kiểm tra tính năng Text-to-Speech với giọng đọc tiếng Việt tự nhiên.',
      status: BookStatus.PUBLISHED,
      authorId: author.id,
    },
  });

  console.log('✓ Created book:', book.title);

  // Create test chapters
  const chapters = [
    {
      title: 'Chương 1: Giới thiệu',
      content: `
        <h1>Chương 1: Giới thiệu</h1>
        <p>Xin chào các bạn! Đây là chương đầu tiên của truyện test.</p>
        <p>Trong chương này, chúng ta sẽ cùng nhau khám phá tính năng Text-to-Speech với giọng đọc tiếng Việt tự nhiên.</p>
        <blockquote>
          "Đọc sách là mở cửa sổ tri thức, nghe đọc là mở rộng chân trời tư duy."
        </blockquote>
        <p>Hãy thử bấm nút Play và nghe giọng đọc nhé!</p>
      `,
      orderIndex: 0,
      bookId: book.id,
    },
    {
      title: 'Chương 2: Tính năng',
      content: `
        <h1>Chương 2: Các tính năng nổi bật</h1>
        <h2>1. Giọng đọc tiếng Việt</h2>
        <p>Hệ thống tự động phát hiện và sử dụng giọng đọc tiếng Việt có sẵn trong trình duyệt của bạn.</p>
        <h2>2. Điều chỉnh tốc độ</h2>
        <p>Bạn có thể thay đổi tốc độ đọc từ 0.5x đến 2.0x tùy theo sở thích.</p>
        <h2>3. Pause và Resume</h2>
        <p>Dừng và tiếp tục đọc bất cứ lúc nào mà không bị mất vị trí.</p>
      `,
      orderIndex: 1,
      bookId: book.id,
    },
    {
      title: 'Chương 3: Kết thúc',
      content: `
        <h1>Chương 3: Lời kết</h1>
        <p>Cảm ơn bạn đã dùng thử tính năng Text-to-Speech của Takash!</p>
        <p>Đây là một nền tảng đọc và sáng tác truyện hiện đại với nhiều tính năng hữu ích.</p>
        <blockquote>
          "Công nghệ phát triển để phục vụ con người, không phải để thay thế con người."
        </blockquote>
        <p>Hẹn gặp lại bạn trong những chương tiếp theo!</p>
      `,
      orderIndex: 2,
      bookId: book.id,
    },
  ];

  for (const chapterData of chapters) {
    const chapter = await prisma.chapter.create({
      data: chapterData,
    });
    console.log('✓ Created chapter:', chapter.title);
  }

  console.log('✅ Seeding completed!');
  console.log('\n📝 Test credentials:');
  console.log('   Author: author@takash.com / author123');
  console.log('   Reader: reader@takash.com / reader123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
