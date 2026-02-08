# Hướng Dẫn Sử Dụng Các Tính Năng Mới

## 📋 Mục Lục
1. [Giám sát đào tạo AI (Training Dashboard)](#training-dashboard)
2. [Sách yêu thích (Favorites)](#favorites)
3. [Cài đặt đọc sách (Reading Settings)](#reading-settings)
4. [Terminal Controls](#terminal-controls)

---

## 🚀 Training Dashboard

### Chạy đào tạo offline
```powershell
# Kích hoạt môi trường ảo
.\.venv\Scripts\Activate.ps1

# Chạy training
python train_offline.py
```

### Tính năng
✅ **Real-time Progress Bar**
- Hiển thị tiến độ với thanh loading trực quan
- Số lượng sách đã xử lý / tổng số sách
- Phần trăm hoàn thành

✅ **Metrics Tracking**
- Thời gian đã trôi qua (elapsed time)
- Thời gian còn lại (ETA)
- Tốc độ xử lý (books/second)

✅ **Auto-save**
- Tự động lưu checkpoint mỗi 50 cuốn sách
- Tối thiểu 30 giây giữa các lần save

✅ **Progress Persistence**
- Lưu tiến độ vào `./data/training_progress.json`
- Lưu metrics vào `./data/training_metrics.json`

### Dừng đào tạo an toàn
```
Nhấn Ctrl+C trong terminal
```

Khi nhấn Ctrl+C:
1. ⏸️ Training sẽ dừng ngay lập tức
2. 💾 Checkpoint được lưu tự động
3. 📊 Progress được cập nhật vào file JSON
4. ✅ Thoát chương trình an toàn

### Tiếp tục đào tạo
```powershell
# Chạy lại lệnh training
python train_offline.py
```

Hệ thống sẽ:
1. 🔍 Tìm checkpoint gần nhất
2. ✅ Kiểm tra tiến độ đã lưu
3. 🎯 Hỏi bạn có muốn tiếp tục hay train lại từ đầu
4. ⏩ Resume từ điểm dừng nếu chọn tiếp tục

### Output Files
```
./data/
├── checkpoints/
│   ├── checkpoint.json          # Model checkpoint
│   ├── embeddings.npy           # AI embeddings
│   └── books_metadata.json      # Books data
├── training_progress.json       # Real-time progress
└── training_metrics.json        # Final metrics
```

---

## ❤️ Favorites (Sách Yêu Thích)

### Thêm sách vào yêu thích
1. **Từ trang chủ**: Click vào icon ❤️ trên mỗi BookCard
2. **Từ trang đọc sách**: Click vào icon ❤️ ở góc trên phải

### Xem danh sách yêu thích
1. Click "Sách yêu thích" ở thanh navigation
2. Hoặc truy cập: `http://localhost:3000/favorites`

### Tính năng trang Favorites

#### 🔍 Tìm kiếm
- Tìm kiếm theo tên sách
- Tìm kiếm theo nội dung tóm tắt
- Real-time filtering

#### 📚 Quản lý
- Grid view với 1-4 cột (responsive)
- Click vào sách để đọc
- Click vào icon ❤️ để xóa khỏi yêu thích

#### 🏷️ Phân loại (nếu có metadata)
- Filter theo thể loại
- Dropdown selector

#### 💾 Lưu trữ
- Tự động lưu vào localStorage
- Persistent giữa các session
- Không cần đăng nhập

---

## ⚙️ Reading Settings (Cài Đặt Đọc Sách)

### Mở panel cài đặt
1. Vào trang đọc sách
2. Click vào icon ⚙️ (Settings) ở góc trên phải
3. Hoặc phím tắt: `Shift + S` (coming soon)

### 🔤 Cỡ chữ (Font Size)
- **Range**: 12px - 32px
- **Slider**: Kéo thanh trượt để điều chỉnh
- **Preview**: Xem trước ngay lập tức
- **Default**: 18px

### 🎨 Màu chữ (Font Color)
- **Color Picker**: Chọn màu từ bảng màu
- **Hex Input**: Nhập mã màu trực tiếp (vd: #000000)
- **Default**: Đen (#000000)

### ✨ Màu Highlight
- **Color Picker**: Chọn màu highlight khi đọc
- **Preview**: Xem mẫu văn bản được highlight
- **Default**: Vàng (#FFFF00)

### 🌗 Chế độ nền (Theme)
Chọn 1 trong 3 theme:

#### 1. Light Mode (Sáng)
- Nền: Trắng
- Chữ: Đen
- Phù hợp: Ban ngày, môi trường sáng

#### 2. Dark Mode (Tối)
- Nền: Xám đậm (#1a1a1a)
- Chữ: Trắng
- Phù hợp: Ban đêm, giảm ánh sáng xanh

#### 3. Sepia Mode
- Nền: Vàng nhạt (sepia)
- Chữ: Nâu
- Phù hợp: Đọc lâu, giống sách giấy

### 💾 Lưu cài đặt
- **Auto-save**: Mọi thay đổi được lưu tự động
- **Persistent**: Giữ nguyên khi đóng trình duyệt
- **Sync**: Áp dụng cho tất cả sách

### 🔄 Đặt lại mặc định
Click button "Đặt lại mặc định" để reset về:
- Font size: 18px
- Font color: #000000 (đen)
- Highlight: #FFFF00 (vàng)
- Theme: Light

---

## 💻 Terminal Controls

### Commands Overview

#### 1. Khởi động ứng dụng
```powershell
# Cách 1: Script tự động (Recommended)
.\run.ps1

# Cách 2: Batch file
.\start.bat

# Cách 3: Manual
# Terminal 1 - Backend
.\.venv\Scripts\Activate.ps1
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### 2. Training Commands
```powershell
# Bắt đầu training
python train_offline.py

# Dừng training (Ctrl+C)
# → Checkpoint tự động lưu

# Tiếp tục training
python train_offline.py
# → Hỏi: Continue from checkpoint? (Y/n)

# Train lại từ đầu
python train_offline.py
# → Khi hỏi, chọn: Retrain from scratch? (y/N)
# → Type 'y' và Enter
```

#### 3. Kiểm tra progress
```powershell
# View progress file
Get-Content ./data/training_progress.json | ConvertFrom-Json

# View metrics
Get-Content ./data/training_metrics.json | ConvertFrom-Json

# Watch progress (real-time)
Get-Content ./data/training_progress.json -Wait
```

#### 4. Clean/Reset
```powershell
# Xóa checkpoint (train lại từ đầu)
Remove-Item -Recurse -Force ./data/checkpoints/*

# Xóa progress files
Remove-Item ./data/training_progress.json
Remove-Item ./data/training_metrics.json
```

---

## 🔧 Troubleshooting

### Training không resume
```powershell
# Kiểm tra checkpoint tồn tại
Test-Path ./data/checkpoints/checkpoint.json

# Xem nội dung checkpoint
Get-Content ./data/checkpoints/checkpoint.json

# Nếu checkpoint lỗi, xóa và train lại
Remove-Item -Recurse -Force ./data/checkpoints/*
python train_offline.py
```

### Favorites không lưu
1. Mở DevTools (F12)
2. Console → Check localStorage
```javascript
localStorage.getItem('bookweb-storage')
```
3. Nếu lỗi, clear storage:
```javascript
localStorage.clear()
```

### Settings không áp dụng
1. Kiểm tra store state (React DevTools)
2. Clear localStorage và thử lại
3. Hard refresh: `Ctrl + Shift + R`

---

## 📱 Responsive Design

### Mobile (< 640px)
- Settings panel: Full screen modal
- Favorites grid: 1 column
- Reading controls: Stack vertically

### Tablet (640px - 1024px)
- Favorites grid: 2 columns
- Settings panel: 80% width
- Reading controls: Wrap khi cần

### Desktop (> 1024px)
- Favorites grid: 3-4 columns
- Settings panel: Max 28rem width
- Reading controls: Full horizontal

---

## 🎯 Best Practices

### Training
1. ✅ Chạy training 1 lần duy nhất offline
2. ✅ Để training hoàn thành (có thể mất vài giờ)
3. ✅ Sử dụng Ctrl+C nếu cần dừng
4. ⚠️ Không xóa folder checkpoints khi đang training
5. ⚠️ Đảm bảo đủ dung lượng ổ cứng (~2GB)

### Reading Settings
1. ✅ Chọn theme phù hợp với thời gian trong ngày
2. ✅ Font size 16-20px tối ưu cho màn hình
3. ✅ Sử dụng Dark mode ban đêm
4. ⚠️ Tránh highlight color quá sáng/chói

### Favorites
1. ✅ Thêm sách vào favorites khi tìm thấy sách hay
2. ✅ Định kỳ dọn dẹp danh sách
3. ✅ Sử dụng search để tìm nhanh
4. ⚠️ Không spam thêm quá nhiều sách

---

## 🚀 Performance Tips

### Training
- Sử dụng batch_size=32 (default) cho RAM 8GB+
- Giảm batch_size xuống 16 nếu RAM < 8GB
- Save_interval=50 cân bằng giữa performance và safety

### Frontend
- Favorites cache trong memory sau lần load đầu
- Settings apply real-time không làm giật lag
- Theme switching sử dụng CSS transitions

### Storage
- localStorage limit: ~10MB (đủ cho 1000+ favorites)
- Checkpoint size: ~1-2GB cho 10,000 sách
- Progress files: <1KB (JSON)

---

## ❓ FAQ

**Q: Training bị dừng giữa chừng, có mất dữ liệu không?**  
A: Không, checkpoint tự động lưu mỗi 50 sách. Chạy lại script để tiếp tục.

**Q: Có thể training trên web không?**  
A: Không nên. Training rất nặng (10,000+ sách), phải chạy offline.

**Q: Favorites có giới hạn số lượng không?**  
A: localStorage cho phép ~1000+ sách. Thực tế đủ dùng.

**Q: Dark mode có tiết kiệm pin không?**  
A: Có, với màn hình OLED. LCD thì không khác biệt nhiều.

**Q: Settings có đồng bộ giữa các thiết bị không?**  
A: Chưa có. Hiện tại chỉ lưu local. Có thể thêm sync sau.

---

## 📝 Version History

### v2.0.0 - Current
- ✅ Training dashboard với real-time progress
- ✅ Graceful shutdown (Ctrl+C)
- ✅ Favorites system với localStorage
- ✅ Reading settings (font, colors, themes)
- ✅ Removed AI/TTS training from web UI

### v1.0.0 - Previous
- Basic book reader
- Voice search
- TTS with Web Speech API
- Search functionality

---

## 🤝 Support

Nếu gặp vấn đề:
1. Check console logs (F12)
2. Check backend terminal
3. Clear cache và thử lại
4. Contact developer

**Happy Reading! 📚**
