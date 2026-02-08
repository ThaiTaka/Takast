# 🚀 Quick Start Guide - Version 3.0

## ✨ Cập nhật mới nhất:

### 🎤 Vietnamese TTS với giọng nói thật!
- ✅ Giọng nói tiếng Việt từ dataset VietSpeech
- ✅ Train được giọng nam và nữ
- ✅ Chất lượng cao, phát âm chuẩn
- ✅ Điều chỉnh tốc độ linh hoạt (0.5x - 2.0x)

## Ứng dụng đã sẵn sàng!

### ✅ Đã hoàn thành:
- ✅ Backend API: http://localhost:5000
- ✅ Frontend Web: http://localhost:3000
- ✅ Dataset: 10,415 cuốn sách
- ✅ **Vietnamese TTS Engine** 🆕

## 🚀 Chạy 1 lệnh duy nhất:

```powershell
cd D:\bookweb
start.bat
```

Hoặc:

```powershell
.\start.ps1
```

## 📋 Các bước sử dụng:

### 1. 🤖 Training AI (Tìm kiếm thông minh)
- Vào: http://localhost:3000/training
- Click: **"Bắt đầu Training"**
- AI sẽ học nội dung 10,000+ sách
- Có thể **Pause/Resume** bất cứ lúc nào

### 2. 🎤 Training TTS (Giọng nói tiếng Việt) 🆕
- Vào: http://localhost:3000/tts-training
- Click: **"Bắt đầu Training TTS"**
- Load VietSpeech dataset
- Giọng đọc sách sẽ là tiếng Việt chuẩn

### 3. 🔍 Tìm kiếm sách

**Giọng nói:** 🎤
- Click micro
- Nói: "Tìm sách về tình yêu"
- AI hiểu nội dung, không chỉ tên!

**Text:** ⌨️
- Gõ: "cuốn sách về một người yêu và 11 phút"
- Enter

### 4. 📖 Đọc và nghe sách

- Click vào sách
- Chọn:
  - 🎤 Giọng: **Nam** / **Nữ**
  - 🎚️ Tốc độ: **0.5x** - **2.0x**
- Click ▶️ Play
- **Highlight vàng** theo từng dòng
- **Auto scroll** mượt mà

### 🎯 Tính năng chính:

| Tính năng | Trạng thái | Mô tả |
|-----------|-----------|-------|
| 🎤 Voice Search | ✅ Hoàn thành | Tìm kiếm bằng giọng nói tiếng Việt |
| 🔊 Text-to-Speech | ✅ Hoàn thành | Nghe sách với giọng nam/nữ |
| 🤖 AI Search | ✅ Hoàn thành | Deep Learning semantic search |
| ⏸️ Pause/Resume | ✅ Hoàn thành | Dừng và tiếp tục training |
| 📱 Responsive | ✅ Hoàn thành | Hoạt động trên mobile & desktop |
| 💛 Highlight | ✅ Hoàn thành | Highlight dòng đang đọc |

### 🛠️ Troubleshooting:

**Nếu Voice Search không hoạt động:**
- Sử dụng Chrome hoặc Edge
- Cho phép quyền microphone
- Kiểm tra ngôn ngữ trình duyệt

**Nếu Text-to-Speech không có giọng Việt:**
- Cài đặt gói ngôn ngữ tiếng Việt cho Windows
- Settings → Language → Add Vietnamese

**Nếu Backend bị lỗi:**
```powershell
# Restart backend
cd backend
D:/bookweb/.venv/Scripts/python.exe app.py
```

**Nếu Frontend bị lỗi:**
```powershell
# Restart frontend
cd frontend
npm run dev
```

### 📊 Monitoring:

**Check Backend:**
http://localhost:5000/api/health

**Check Training Status:**
http://localhost:5000/api/training/status

### 💡 Tips:

1. **Training nên chạy qua đêm** - Xử lý 10,000+ sách mất vài giờ
2. **Pause Training an toàn** - Dữ liệu được lưu mỗi 50 sách
3. **Voice Search hoạt động tốt nhất sau khi training xong**
4. **Có thể duyệt sách ngay mà không cần training**

### 🎨 Demo Scenarios:

**Scenario 1: Tìm sách về tình yêu**
1. Nhấn 🎤 Microphone
2. Nói: "Tìm sách về tình yêu"
3. Xem kết quả: "11 phút", "Về Yêu Hoa Cúc"...

**Scenario 2: Nghe sách**
1. Click vào sách "11 phút - Paulo Coelho"
2. Chọn giọng Nữ
3. Nhấn Play ▶️
4. Nghe và xem highlight từng dòng

**Scenario 3: Training AI**
1. Vào /training
2. Start Training
3. Xem progress bar tăng dần
4. Pause khi muốn, Resume sau

---

## 📞 Support:

Nếu có lỗi, check console browser (F12) và terminal logs.

**Backend logs:** Terminal đang chạy `app.py`
**Frontend logs:** Browser DevTools Console (F12)

Chúc bạn trải nghiệm tốt! 🎉
