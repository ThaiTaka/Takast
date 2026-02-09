# Takash - Nền tảng Đọc & Sáng tác truyện

Dự án Next.js 14 với TypeScript, Prisma, PostgreSQL và Docker Dev Containers.

## 🚀 KHỞI CHẠY DỰ ÁN

### Yêu cầu
- Docker Desktop đã cài đặt
- VS Code với Extension "Dev Containers"

### Cách 1: Dùng Dev Containers (KHUYÊN DÙNG)

1. **Mở dự án trong Dev Container:**
   ```
   Ctrl+Shift+P → "Dev Containers: Reopen in Container"
   ```

2. **Container sẽ tự động:**
   - Cài đặt Node.js dependencies (`npm install`)
   - Generate Prisma Client (`npx prisma generate`)
   - Start Next.js dev server (`npm run dev`)

3. **Truy cập:**
   - App: http://localhost:3000
   - Prisma Studio: `npm run prisma:studio` (trong container)

### Cách 2: Chạy Local (không dùng Docker)

1. **Cài dependencies:**
   ```bash
   npm install
   ```

2. **Setup database:**
   ```bash
   # Start PostgreSQL container
   docker-compose -f docker-compose.dev.yml up -d db

   # Push schema to database
   npx prisma db push

   # Generate Prisma Client
   npx prisma generate
   ```

3. **Chạy dev server:**
   ```bash
   npm run dev
   ```

## 📂 CẤU TRÚC DỰ ÁN

```
takash/
├── .devcontainer/
│   └── devcontainer.json         # Cấu hình Dev Container
├── src/
│   ├── app/
│   │   ├── api/auth/[...nextauth]/  # NextAuth API routes
│   │   ├── studio/write/[bookId]/   # Writing Studio
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/
│   │   ├── AudioPlayer.tsx       # Global Audio Player
│   │   └── WritingEditor.tsx     # Tiptap Editor
│   ├── hooks/
│   │   └── useTTS.ts             # Vietnamese TTS Hook
│   ├── stores/
│   │   └── audioStore.ts         # Zustand Audio Store
│   └── lib/
│       ├── auth.ts               # NextAuth config
│       ├── prisma.ts             # Prisma client
│       └── utils.ts              # Utility functions
├── prisma/
│   └── schema.prisma             # Database schema
├── docker-compose.dev.yml        # Docker Compose for development
├── Dockerfile.dev                # Development Dockerfile
└── package.json
```

## 🎯 TÍNH NĂNG CHÍNH

### 1. **Audio Player với TTS tiếng Việt**
- ✅ **Fix lỗi giọng đọc:** Bắt buộc sử dụng giọng `vi-VN`
- ✅ **Fix lỗi pause:** Dừng ngay lập tức bằng `speechSynthesis.cancel()`
- ✅ **Persistent Player:** Zustand store giữ trạng thái khi chuyển trang
- ✅ **Controls:** Play, Pause, Resume, Stop, Speed (0.5x - 2.0x)

**Cách sử dụng:**
```tsx
import { useTTS } from '@/hooks/useTTS';

const { play, pause, resume, cancel } = useTTS();

// Play text
play("Xin chào, đây là giọng đọc tiếng Việt");

// Pause
pause();

// Resume
resume();
```

### 2. **Writing Studio**
- ✅ **Tiptap Editor:** Bold, Italic, Heading 1/2, Blockquote
- ✅ **Auto-Save:** Debounce 2000ms, hiển thị trạng thái "Đang lưu..." / "Đã lưu"
- ✅ **Server Actions:** Lưu nội dung vào database

**Route:** `/studio/write/[bookId]?chapterId=xxx`

### 3. **Authentication & Authorization**
- ✅ **NextAuth v5:** Email/Password với bcrypt
- ✅ **Role-based:** READER, AUTHOR
- ✅ **Middleware:** Bảo vệ route `/studio` chỉ cho AUTHOR

### 4. **Minimalist Reader UI**
- ✅ **Background:** Cream (#F9F7F1)
- ✅ **Font:** Merriweather, Lora (Google Fonts)
- ✅ **Layout:** Max-width 700px, line-height 1.8
- ✅ **Responsive:** Mobile-first design

## 🗄️ DATABASE SCHEMA

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed
  role      UserRole @default(READER)
  books     Book[]
}

model Book {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      BookStatus @default(DRAFT)
  authorId    String
  author      User       @relation(...)
  chapters    Chapter[]
}

model Chapter {
  id         String   @id @default(cuid())
  title      String
  content    String   @db.Text
  orderIndex Int
  audioUrl   String?
  bookId     String
  book       Book     @relation(...)
}
```

## 🛠️ SCRIPTS

```bash
# Development
npm run dev                # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Prisma
npm run prisma:generate    # Generate Prisma Client
npm run prisma:push        # Push schema to database
npm run prisma:studio      # Open Prisma Studio

# Linting
npm run lint               # Run ESLint
```

## 🔐 ENVIRONMENT VARIABLES

Tạo file `.env`:

```env
DATABASE_URL="postgresql://takash:takash_password@localhost:5432/takash_db?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## 📝 TODO / ROADMAP

- [ ] Implement Google TTS API fallback
- [ ] Add user registration page
- [ ] Create book listing page
- [ ] Add search functionality
- [ ] Implement audio file generation (để lưu vào `audioUrl`)
- [ ] Add social features (comments, ratings)

## 🐛 KNOWN ISSUES & FIXES

### ❌ Issue 1: Giọng đọc sai ngôn ngữ
**Fix:** `useTTS.ts` - Function `findBestVietnameseVoice()` với 3 mức độ ưu tiên:
1. Giọng có `lang === 'vi-VN'`
2. Giọng có `lang.startsWith('vi')`
3. Giọng có tên chứa "Vietnamese" hoặc "Việt"

### ❌ Issue 2: Không dừng được khi pause
**Fix:** `useTTS.ts` - Function `pause()` và `cancel()`:
```ts
window.speechSynthesis.pause();
window.speechSynthesis.cancel();
```

## 🤝 CONTRIBUTING

Dự án này được xây dựng bởi Senior Full Stack Engineer. Mọi góp ý xin gửi về GitHub Issues.

## 📄 LICENSE

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.
