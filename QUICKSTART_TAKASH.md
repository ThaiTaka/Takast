# 🚀 HƯỚNG DẪN KHỞI CHẠY - TAKASH NEXT.JS

## ✅ Bạn đã có Docker Desktop → Làm theo các bước sau:

### BƯỚC 1: Mở Project trong Dev Container

1. Mở VS Code
2. Nhấn `Ctrl+Shift+P` (hoặc `Cmd+Shift+P` trên Mac)
3. Gõ: **"Dev Containers: Reopen in Container"**
4. Chờ container build (lần đầu mất 3-5 phút)

### BƯỚC 2: Setup Database

Container sẽ tự động chạy `npm install`. Sau khi xong, chạy:

```bash
# Push schema to database
npx prisma db push

# Seed test data
npm run prisma:seed
```

### BƯỚC 3: Start Dev Server

```bash
npm run dev
```

Truy cập: **http://localhost:3000**

### BƯỚC 4: Test Login

Dùng tài khoản test:
- **Author:** `author@takash.com` / `author123`
- **Reader:** `reader@takash.com` / `reader123`

---

## 📝 Các lệnh hữu ích

```bash
# Xem database trong Prisma Studio
npm run prisma:studio

# Generate Prisma Client (sau khi sửa schema)
npm run prisma:generate

# Push schema changes
npm run prisma:push

# Restart dev server
npm run dev
```

---

## 🎯 Test các tính năng

### 1. Test Audio Player (Giọng đọc tiếng Việt)
- Vào trang sách: `/book/[bookId]`
- Bấm nút Play
- Thử pause/resume
- Thử điều chỉnh tốc độ

### 2. Test Writing Studio
- Login với tài khoản Author
- Vào: `/studio/write/[bookId]`
- Thử gõ văn bản
- Chờ 2s → Sẽ tự động lưu

### 3. Test Middleware
- Login với tài khoản Reader
- Thử truy cập `/studio` → Sẽ bị chặn

---

## ❗ Troubleshooting

### Container không start?
```bash
# Xóa container và volumes cũ
docker-compose -f docker-compose.dev.yml down -v

# Rebuild
Ctrl+Shift+P → "Dev Containers: Rebuild Container"
```

### Database connection error?
```bash
# Check PostgreSQL container
docker ps

# Restart database
docker-compose -f docker-compose.dev.yml restart db
```

### Prisma errors?
```bash
# Regenerate client
npx prisma generate

# Reset database
npx prisma db push --force-reset
npm run prisma:seed
```

---

**Chúc bạn code vui vẻ! 🎉**
