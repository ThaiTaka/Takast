# 📚 Thư Viện Sách Việt Nam - Vietnamese Book Reader

Ứng dụng web đọc sách Việt Nam với AI, hỗ trợ tìm kiếm thông minh bằng giọng nói và text-to-speech.

## ✨ Tính năng chính

- 📖 **Hơn 10,000 cuốn sách Việt Nam** - Kho tàng sách phong phú
- 🤖 **AI Search thông minh** - Tìm kiếm bằng Deep Learning (Vietnamese SBERT)
- 🎤 **Voice Search** - Tìm kiếm bằng giọng nói tiếng Việt
- 🔊 **Text-to-Speech** - Nghe sách với giọng nam/nữ, highlight từng dòng
- ⏸️ **Pause/Resume Training** - Dừng và tiếp tục training AI bất cứ lúc nào
- 📱 **Responsive Design** - Hoạt động mượt mà trên mọi thiết bị
- 💾 **Auto Checkpoint** - Tự động lưu tiến độ training

## 🏗️ Kiến trúc

```
bookweb/
├── backend/          # Flask API + Socket.IO
├── frontend/         # React + Vite + Tailwind CSS
├── ml_model/         # Deep Learning model (Sentence Transformers)
├── data/
│   └── checkpoints/  # Training checkpoints & embeddings
└── download_dataset.py
```

## 🚀 Cài đặt

### 1. Clone repository
```bash
cd d:\bookweb
```

### 2. Cài đặt Backend (Python)

```powershell
# Tạo virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1

# Cài đặt dependencies
pip install -r backend/requirements.txt
```

### 3. Download Dataset

```powershell
python download_dataset.py
```

### 4. Cài đặt Frontend (Node.js)

```powershell
cd frontend
npm install
```

## 🎯 Chạy ứng dụng

### Chạy Backend
```powershell
# Từ thư mục gốc
cd backend
D:/bookweb/.venv/Scripts/python.exe app.py
```

Backend sẽ chạy tại: `http://localhost:5000`

### Chạy Frontend
```powershell
# Terminal mới
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 📖 Hướng dẫn sử dụng

### 1. Training AI Model

1. Truy cập: `http://localhost:3000/training`
2. Nhấn **"Bắt đầu Training"**
3. Đợi AI học hết 10,000+ cuốn sách (có thể mất vài giờ)
4. **Tạm dừng** bất cứ lúc nào, dữ liệu sẽ được lưu tự động
5. **Tiếp tục** training từ nơi đã dừng

### 2. Tìm kiếm sách

#### A. Tìm kiếm bằng giọng nói:
1. Nhấn vào icon **🎤 Microphone**
2. Nói tên sách hoặc nội dung bạn muốn tìm
3. Hệ thống sẽ tự động tìm các sách liên quan

#### B. Tìm kiếm bằng text:
1. Nhập tên sách hoặc keywords vào ô tìm kiếm
2. Nhấn **"Tìm kiếm"**
3. Xem kết quả với độ liên quan (%)

### 3. Đọc và nghe sách

1. Click vào sách trong kết quả tìm kiếm
2. Chọn giọng đọc: **Nam** hoặc **Nữ**
3. Nhấn **▶️ Play** để bắt đầu nghe
4. Dòng đang đọc sẽ được **highlight màu vàng**
5. Click vào bất kỳ dòng nào để nhảy đến vị trí đó

## 🔧 Công nghệ sử dụng

### Backend
- **Flask** - Web framework
- **Flask-SocketIO** - Real-time communication
- **PyTorch** - Deep Learning framework
- **Sentence Transformers** - Vietnamese SBERT model
- **NumPy, Pandas** - Data processing

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - API calls
- **Socket.IO Client** - Real-time updates
- **Web Speech API** - Voice recognition & TTS

### AI/ML
- **Model**: keepitreal/vietnamese-sbert
- **Technique**: Semantic search with embeddings
- **Storage**: FAISS-compatible (NumPy arrays)

## 📁 Cấu trúc dữ liệu

### Dataset
- Nguồn: Kaggle (iambestfeeder/10000-vietnamese-books)
- Format: .txt files
- Số lượng: 10,415 cuốn sách

### Checkpoints
```
data/checkpoints/
├── latest_checkpoint.pkl  # Training state
├── embeddings.npy         # Book embeddings
└── metadata.json          # Book metadata
```

## 🎨 Screenshots

### Trang chủ
- Tìm kiếm bằng giọng nói
- Tìm kiếm bằng text
- Duyệt danh sách sách

### Trang đọc sách
- Highlight dòng đang đọc
- Chọn giọng nam/nữ
- Play/Pause controls

### Trang Training
- Progress bar real-time
- Pause/Resume functionality
- Training statistics

## 🐛 Xử lý lỗi

### Lỗi khi cài đặt PyTorch
```powershell
# Cài đặt CPU version
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

### Lỗi Voice Recognition không hoạt động
- Đảm bảo sử dụng **Chrome** hoặc **Edge**
- Cho phép quyền truy cập microphone
- Kiểm tra ngôn ngữ trình duyệt là tiếng Việt

### Lỗi Text-to-Speech không có giọng Việt
- Cài đặt gói ngôn ngữ tiếng Việt cho Windows
- Settings → Time & Language → Language → Add Vietnamese

## 📝 API Endpoints

### Books
- `POST /api/books/search` - Search books
- `GET /api/books/<filename>` - Get book content
- `GET /api/books/list` - List books with pagination

### Training
- `POST /api/training/start` - Start/resume training
- `POST /api/training/pause` - Pause training
- `GET /api/training/status` - Get training status

### Socket.IO Events
- `training_status` - Real-time training updates
- `training_complete` - Training finished
- `training_error` - Training error

## 🔐 Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
DATASET_PATH=C:\Users\karin\.cache\kagglehub\datasets\iambestfeeder\10000-vietnamese-books\versions\1\output
CHECKPOINT_DIR=../data/checkpoints
FLASK_ENV=development
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📄 License

MIT License

## 👨‍💻 Tác giả

Được xây dựng với ❤️ bởi AI Assistant

---

**Lưu ý**: Project này sử dụng dataset từ Kaggle và các model AI mở. Vui lòng tuân thủ các quy định về bản quyền khi sử dụng.
