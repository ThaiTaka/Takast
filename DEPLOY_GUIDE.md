# 🎯 HƯỚNG DẪN DEPLOY - Cho Developer

## 📋 Chuẩn bị trước khi deploy

### 1. Train AI Model OFFLINE (1 lần duy nhất)

```powershell
# Chạy script training trong VSCode
D:/bookweb/.venv/Scripts/python.exe train_offline.py
```

**Quá trình:**
- ⏱️ Thời gian: 5-8 giờ cho 10,000+ sách
- 💾 Auto-save mỗi 50 sách
- ⏸️ Có thể dừng (Ctrl+C) và chạy lại để tiếp tục
- ✅ Chạy xong 1 lần, không cần train lại

**Kết quả:**
```
data/checkpoints/
├── latest_checkpoint.pkl  # Training state
├── embeddings.npy         # AI embeddings
└── metadata.json          # Book metadata
```

### 2. Test locally

```powershell
.\run.ps1
```

Kiểm tra:
- ✅ Search hoạt động (không cần train trên web)
- ✅ Voice search hoạt động
- ✅ Text-to-speech hoạt động
- ✅ Đọc sách + highlight

### 3. Chuẩn bị files để deploy

```
bookweb/
├── backend/              # Deploy này
│   ├── app.py
│   ├── requirements.txt
│   └── ...
├── frontend/             # Build rồi deploy
│   └── dist/            # After npm run build
├── ml_model/            # Deploy này
│   ├── book_embedding.py
│   └── ...
├── data/                # Deploy này (QUAN TRỌNG!)
│   └── checkpoints/     # Trained model
│       ├── embeddings.npy    # ~500MB
│       ├── metadata.json
│       └── latest_checkpoint.pkl
```

## 🚀 Deploy lên Production

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend (Vercel):
```powershell
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

#### Backend (Railway/Render):
```bash
# Đảm bảo có các file:
backend/
├── app.py
├── requirements.txt
├── Procfile (for Heroku/Railway)
data/checkpoints/  # Upload trained model!
ml_model/
```

**Procfile:**
```
web: python backend/app.py
```

### Option 2: Docker (Full Stack)

#### Dockerfile:
```dockerfile
FROM python:3.11

WORKDIR /app

# Copy backend
COPY backend/ ./backend/
COPY ml_model/ ./ml_model/
COPY data/ ./data/

# Install dependencies
RUN pip install -r backend/requirements.txt

# Copy frontend build
COPY frontend/dist/ ./frontend/dist/

EXPOSE 5000

CMD ["python", "backend/app.py"]
```

### Option 3: VPS (Ubuntu/Linux)

```bash
# 1. Upload code
scp -r bookweb/ user@server:/var/www/

# 2. Setup server
ssh user@server
cd /var/www/bookweb

# 3. Install Python deps
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# 4. Install Node & build frontend
npm install
npm run build

# 5. Setup Nginx
# Point to frontend/dist/ and proxy /api to :5000

# 6. Run with PM2
pm2 start backend/app.py --name bookweb
pm2 startup
pm2 save
```

## ⚠️ QUAN TRỌNG khi Deploy

### 1. Bắt buộc phải có trained model!

```
❌ KHÔNG deploy nếu chưa có:
data/checkpoints/embeddings.npy
data/checkpoints/metadata.json

✅ Phải train xong trước khi deploy
```

### 2. Update backend config

```python
# backend/app.py
DATASET_PATH = os.getenv('DATASET_PATH', '/app/data/books')
CHECKPOINT_DIR = os.getenv('CHECKPOINT_DIR', '/app/data/checkpoints')
```

### 3. Environment variables

```env
DATASET_PATH=/app/data/books
CHECKPOINT_DIR=/app/data/checkpoints
FLASK_ENV=production
PORT=5000
```

### 4. Frontend API URL

```javascript
// frontend/src/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend.com';
```

## 📊 Checklist trước khi deploy

- [ ] ✅ Đã train AI model offline (train_offline.py)
- [ ] ✅ File embeddings.npy tồn tại (~500MB)
- [ ] ✅ File metadata.json tồn tại
- [ ] ✅ Test search locally hoạt động
- [ ] ✅ Frontend build thành công (npm run build)
- [ ] ✅ Backend requirements.txt đầy đủ
- [ ] ✅ Environment variables đã set
- [ ] ✅ CORS configured đúng
- [ ] ✅ File size check (embeddings có thể lớn)

## 🎯 Workflow Deploy

```
1. Developer (You):
   └─→ Run train_offline.py (1 lần)
   └─→ Commit trained model (data/checkpoints/)
   └─→ Push to git/server

2. Production Server:
   └─→ Pull code + trained model
   └─→ Install dependencies
   └─→ Run backend
   └─→ Users access web → No training needed! ✅
```

## 📝 Notes

### Tại sao phải train offline?
- ⏱️ Training 10,000 sách mất nhiều giờ
- 💰 Server costs cao nếu train trên production
- 🚀 Users muốn dùng ngay, không đợi training
- ✅ Train 1 lần, deploy nhiều lần

### Dataset storage
- 📦 Dataset gốc: ~541MB (10,000 files .txt)
- 🧠 Embeddings: ~500MB (numpy array)
- 📄 Metadata: ~5MB (JSON)
- **Total: ~1GB cần upload lên server**

### Alternatives nếu server storage nhỏ:
1. Dùng S3/Cloud Storage cho dataset
2. Load embeddings từ remote
3. Compress embeddings (lossy)

## 🆘 Troubleshooting

### "No embeddings found"
```bash
# Check files exist
ls data/checkpoints/
# Should see: embeddings.npy, metadata.json

# If missing, run train_offline.py
python train_offline.py
```

### "Memory error loading embeddings"
```python
# Use memory mapping for large files
embeddings = np.load('embeddings.npy', mmap_mode='r')
```

### "Search not working"
```python
# Check model initialized
curl http://localhost:5000/api/training/status
# Should show: embeddings_count > 0
```

---

## ✅ Summary

1. **Train once offline:** `python train_offline.py`
2. **Commit trained model:** `data/checkpoints/`
3. **Deploy everything:** Backend + Frontend + Data
4. **Users enjoy:** No training needed!

🎉 Ready to deploy!
