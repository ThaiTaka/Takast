# 🎯 CÁC CÁCH CHẠY ỨNG DỤNG

## Cách 1: Đơn giản nhất (Khuyên dùng)
```powershell
.\run.ps1
```
→ Tự động mở 2 terminal và browser

## Cách 2: Batch file
```powershell
.\start.bat
```
→ Mở 2 cửa sổ cmd

## Cách 3: PowerShell với jobs
```powershell
.\start.ps1
```
→ Chạy cả 2 trong 1 terminal

## Cách 4: Manual (2 lệnh riêng)

**Terminal 1 - Backend:**
```powershell
cd backend
D:\bookweb\.venv\Scripts\python.exe app.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

## ⚠️ Lỗi thường gặp:

### Lỗi: "start.bat is not recognized"
**Sửa:**
```powershell
# Thay vì:
start.bat

# Dùng:
.\start.bat
# hoặc
.\run.ps1
```

### Lỗi: "cannot be loaded because running scripts is disabled"
**Sửa:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Lỗi: Port already in use
**Sửa:**
```powershell
# Kill process trên port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Kill process trên port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

## 🚀 Quick Start

```powershell
cd D:\bookweb
.\run.ps1
```

Xong! Browser sẽ tự mở tại http://localhost:3000

## 📱 URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health
- Training: http://localhost:3000/training
- TTS Training: http://localhost:3000/tts-training

## 🛑 Dừng servers

- **Cách 1:** Đóng các cửa sổ terminal
- **Cách 2:** Ctrl+C trong mỗi terminal
- **Cách 3:** 
```powershell
# Kill tất cả
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```
