# GovPilot-X Backend Setup Guide 🚀

Complete step-by-step instructions to get the backend running locally.

---

## 📋 Prerequisites

- **Python 3.11+** (Required)
- **pip** (Python package manager - comes with Python)
- **PowerShell** or **Command Prompt**
- **Git** (optional, for cloning)

---

## ✅ Step 1: Check Python Version

Open PowerShell and run:

```powershell
python --version
```

**Expected output:** `Python 3.11.x` or higher

### ❌ If Python is not installed or version is too old:

1. Download Python 3.11+ from https://www.python.org/downloads/
2. During installation, **CHECK THE BOX**: "Add Python to PATH"
3. Restart your terminal
4. Verify again: `python --version`

---

## 📁 Step 2: Navigate to Backend Folder

```powershell
cd c:\Users\kensb\OneDrive\Desktop\sih2026\GovPilot-X\backend
```

Or replace the path with your actual project location.

---

## 🔧 Step 3: Create Virtual Environment

A virtual environment isolates project dependencies from system Python.

```powershell
python -m venv venv
```

**What it does:** Creates a `venv` folder with isolated Python installation.

---

## ⚡ Step 4: Activate Virtual Environment

### For Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

### For Windows Command Prompt:

```cmd
.\venv\Scripts\activate.bat
```

**Expected:** Your terminal prompt should now show `(venv)` at the start, like:
```
(venv) PS C:\Users\kensb\OneDrive\Desktop\sih2026\GovPilot-X\backend>
```

---

## 📦 Step 5: Install Dependencies

With virtual environment activated, install all required packages:

```powershell
pip install -r requirements.txt
```

**What it installs:**
- FastAPI (web framework)
- Uvicorn (server)
- SQLAlchemy (database ORM)
- Pydantic (data validation)
- Supabase (backend service)
- Google Generative AI (for embeddings)
- And 10+ more packages

**Time:** ~2-5 minutes depending on your internet speed

---

## 🔐 Step 6: Configure Environment Variables

### Create `.env` file:

```powershell
Copy-Item .env.example .env
```

### Edit the `.env` file with your credentials:

```env
# Database (Supabase)
DATABASE_URL=postgresql+asyncpg://postgres:PASSWORD@HOST:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Google AI (for embeddings & RAG)
GEMINI_API_KEY=your-api-key-from-google-ai-studio

# Security
SECRET_KEY=your-secret-key-for-jwt-signing

# Redis (for Celery workers - optional for basic testing)
REDIS_URL=redis://localhost:6379/0

# Storage
SUPABASE_STORAGE_BUCKET=govpilot-documents

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**How to get these values:**
- Go to [Supabase Dashboard](https://app.supabase.com)
- Create a new project or use existing one
- Copy connection string from Project Settings > Database > Connection string
- Copy API URL and Service Role Key

---

## 🚀 Step 7: Run the Backend Server

With virtual environment still activated, run:

```powershell
python -m uvicorn main:app --reload
```

### Expected output:

```
INFO:     Will watch for changes in these directories: ['C:\\Users\\kensb\\OneDrive\\Desktop\\sih2026\\GovPilot-X\\backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [XXXX] using WatchFiles
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
[GovPilot-X] Starting up API service...
INFO:     Application startup complete.
```

✅ **Backend is now running!**

---

## 📚 Step 8: Access API Documentation

Open your browser and go to:

- **API Docs (Swagger UI):** http://localhost:8000/docs
- **Alternative Docs (ReDoc):** http://localhost:8000/redoc
- **Raw OpenAPI JSON:** http://localhost:8000/openapi.json

Here you can:
- View all API endpoints
- Test endpoints directly from browser
- See request/response formats

---

## 🛑 Step 9: Stopping the Server

When you want to stop the backend:

1. Press `CTRL + C` in the terminal
2. To deactivate virtual environment: `deactivate`

---

## 🔄 Restarting the Server

Next time you want to run the backend:

```powershell
# Navigate to backend folder
cd c:\Users\kensb\OneDrive\Desktop\sih2026\GovPilot-X\backend

# Activate venv
.\venv\Scripts\Activate.ps1

# Run server
python -m uvicorn main:app --reload
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "python command not found"
```
Solution: Python not in PATH. Reinstall Python and check "Add Python to PATH"
```

### Issue 2: "Module not found: email_validator"
```
Solution: Run: pip install email-validator
Or update requirements.txt with: email-validator>=2.0.0
```

### Issue 3: "Cannot find module 'uvicorn'"
```
Solution: Make sure venv is activated (see step 4)
Then run: pip install -r requirements.txt
```

### Issue 4: "Port 8000 already in use"
```
Solution: Run on different port:
python -m uvicorn main:app --reload --port 8001
```

### Issue 5: "Database connection refused"
```
Solution: Check DATABASE_URL in .env file
Make sure Supabase project is active
Verify PostgreSQL server is running
```

---

## ✨ Quick Reference Commands

```powershell
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install/update dependencies
pip install -r requirements.txt

# Add new package
pip install package-name

# See installed packages
pip list

# Run server
python -m uvicorn main:app --reload

# Run tests (if available)
pytest

# Deactivate virtual environment
deactivate
```

---

## 📖 Additional Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Uvicorn Docs:** https://www.uvicorn.org/
- **Supabase Setup:** See `SUPABASE_SETUP.md` in this folder
- **Quick Start:** See `QUICK_START.md` in this folder

---

## ✅ Checklist

- [ ] Python 3.11+ installed
- [ ] Virtual environment created (`venv` folder exists)
- [ ] Virtual environment activated (prompt shows `(venv)`)
- [ ] Dependencies installed (no errors from `pip install -r requirements.txt`)
- [ ] `.env` file created with credentials
- [ ] Server running on `http://localhost:8000`
- [ ] API docs accessible at `http://localhost:8000/docs`

**If all checkboxes are ✅, your backend is ready to go!**

---

Need help? Check the error messages in terminal or refer to the "Common Issues & Solutions" section above.
