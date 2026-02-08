# 🚀 Quick Start Guide - Version 2.0

## 📋 Prerequisites
- ✅ Dataset downloaded (10,415 books)
- ✅ Virtual environment activated
- ✅ All dependencies installed

## 🎯 Step-by-Step Startup

### Step 1: Train AI Model (One-time, Offline)

```powershell
# Kích hoạt môi trường ảo
.\.venv\Scripts\Activate.ps1

# Chạy training
python train_offline.py
```

**What happens:**
- 📚 Loading 10,415 Vietnamese books
- 🧠 Creating AI embeddings
- 💾 Auto-save mỗi 50 books
- ⏸️ Nhấn Ctrl+C để dừng (auto-save)
- ⏩ Chạy lại để tiếp tục

**Time required:** 2-4 giờ (tùy máy tính)

**Output:**
```
│████████████████████████████████████████████│ 100.0% (10415/10415)
✅ TRAINING COMPLETED!
   📚 Books: 10,415
   🧠 Embeddings: 10,415
   ⏱️  Time: 2h 35m 18s
   ⚡ Speed: 1.12 books/sec
```

---

### Step 2: Khởi động Web App

#### Cách 1: Tự động (Recommended) ⭐
```powershell
.\run.ps1
```

#### Cách 2: Batch File
```bat
.\start.bat
```

#### Cách 3: Manual (2 terminals)

**Terminal 1 - Backend:**
```powershell
.\.venv\Scripts\Activate.ps1
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

### Step 3: Truy cập Web App

🌐 **Frontend:** http://localhost:3000  
🔧 **Backend API:** http://localhost:5000

**Browser sẽ tự động mở** nếu dùng `run.ps1`

---

## 🎮 Features Usage

### 🔍 Tìm kiếm sách
1. **Text search**: Nhập từ khóa → Enter
2. **Voice search**: Click icon 🎤 → Nói tên sách

### 📖 Đọc sách
1. Click vào sách từ kết quả tìm kiếm
2. Sử dụng TTS:
   - ▶️ Play: Bắt đầu đọc
   - ⏸️ Pause: Tạm dừng
   - 🎚️ Tốc độ: 0.5x - 2.0x
   - 👤 Giọng: Nam/Nữ

### ❤️ Sách yêu thích
1. Click icon ❤️ trên BookCard hoặc trong BookReader
2. Xem tất cả: Menu → "Sách yêu thích"
3. Tìm kiếm trong favorites
4. Click để đọc

### ⚙️ Cài đặt đọc sách
1. Trong trang đọc sách → Click icon ⚙️
2. Điều chỉnh:
   - 📏 Cỡ chữ: 12-32px
   - 🎨 Màu chữ
   - ✨ Màu highlight
   - 🌗 Theme: Light/Dark/Sepia
3. Click "Xong" để đóng

---

## 🛑 Stopping the App

### Frontend:
- Nhấn `Ctrl+C` trong terminal frontend
- Hoặc đóng terminal

### Backend:
- Nhấn `Ctrl+C` trong terminal backend
- Checkpoint được lưu tự động

### Training:
- Nhấn `Ctrl+C` trong terminal training
- ⚠️ Đợi message "💾 Saving checkpoint before exit..."
- ✅ Safe to close sau khi thấy "Emergency checkpoint saved"

---

## 📁 Project Structure

```
bookweb/
├── backend/
│   ├── app.py              # Flask API
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── BookReader.jsx
│   │   │   └── Favorites.jsx    # NEW
│   │   ├── components/
│   │   │   ├── BookCard.jsx      # Updated
│   │   │   └── SettingsPanel.jsx # NEW
│   │   └── store.js              # Enhanced
│   └── ...
├── ml_model/
│   ├── book_embedding.py
│   └── vietnamese_tts.py
├── data/
│   ├── checkpoints/              # AI model
│   ├── training_progress.json    # NEW
│   └── training_metrics.json     # NEW
├── train_offline.py              # Rewritten
├── run.ps1                       # Auto-start
├── start.bat                     # Auto-start
├── NEW_FEATURES_GUIDE.md         # NEW
└── IMPLEMENTATION_SUMMARY.md     # NEW
```

---

## 🐛 Troubleshooting

### Training không chạy
```powershell
# Check dataset path
Test-Path "C:\Users\karin\.cache\kagglehub\datasets\iambestfeeder\10000-vietnamese-books\versions\1\output"

# Check Python environment
python --version
pip list | Select-String "torch"
```

### Backend lỗi 500
```powershell
# Check embeddings file
Test-Path "./data/checkpoints/embeddings.npy"

# Retrain nếu cần
python train_offline.py
```

### Frontend không load
```powershell
# Check backend running
Invoke-WebRequest http://localhost:5000/api/health

# Rebuild frontend
cd frontend
npm install
npm run dev
```

### Settings không lưu
1. Mở DevTools (F12)
2. Application → Local Storage
3. Check key: `bookweb-storage`
4. Clear nếu lỗi: `localStorage.clear()`

---

## 💡 Pro Tips

### Training
- ⏰ Chạy training ban đêm (lâu nhưng không cần giám sát)
- 💾 Checkpoint auto-save, an tâm Ctrl+C bất cứ lúc nào
- 🔄 Resume training rất nhanh (~5 giây)

### Reading
- 🌙 Dùng Dark mode ban đêm
- 📱 Responsive hoàn toàn trên mobile
- ⚡ Tốc độ đọc 1.0x-1.2x tốt nhất cho tiếng Việt

### Favorites
- ❤️ Add sách ngay khi tìm thấy sách hay
- 🔍 Search nhanh hơn scroll
- 📂 Organize bằng categories (nếu có)

### Performance
- 🚀 Embeddings load vào RAM → search siêu nhanh
- 💾 localStorage persistent → không mất data
- 🔄 Settings apply real-time → không reload

---

## 📊 System Requirements

### Minimum:
- CPU: 2 cores
- RAM: 4GB
- Storage: 5GB free
- Browser: Chrome/Edge/Firefox (latest)

### Recommended:
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 10GB free
- Browser: Chrome (best Web Speech API support)

---

## ✅ Checklist Before First Run

- [ ] Dataset downloaded (10,415 files)
- [ ] Virtual environment created
- [ ] Requirements installed: `pip install -r requirements.txt`
- [ ] Frontend dependencies: `cd frontend && npm install`
- [ ] Training completed: `python train_offline.py`
- [ ] Embeddings exist: `./data/checkpoints/embeddings.npy`

---

## 🎉 You're Ready!

```powershell
.\run.ps1
```

**Visit:** http://localhost:3000

**Enjoy reading 10,000+ Vietnamese books! 📚**

---

## 📞 Need Help?

1. Check `NEW_FEATURES_GUIDE.md` for detailed features
2. Check `IMPLEMENTATION_SUMMARY.md` for technical details
3. Check console logs (F12 in browser)
4. Check backend terminal for errors

**Happy Reading! 🎊**
