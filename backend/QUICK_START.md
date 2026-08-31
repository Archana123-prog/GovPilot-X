# GovPilot-X Supabase Backend - Quick Start 🚀

## ✅ Kya Setup Ho Gaya?

### New Files Created:

1. **`backend/db/supabase.py`** - Supabase connection + PostgreSQL config
2. **`backend/services/supabase_auth_service.py`** - Auth (signup, login, token verify)
3. **`backend/services/supabase_storage_service.py`** - File uploads
4. **`backend/services/auth_middleware.py`** - JWT verification + role checks
5. **`backend/routers/auth_example.py`** - Example auth endpoints
6. **`backend/models/db_models.py`** - SQLAlchemy models
7. **`backend/SUPABASE_SETUP.md`** - Detailed setup guide
8. **`backend/requirements.txt`** - Updated with supabase

---

## 🔧 Backend Setup (5 min)

### Step 1: Supabase Account
```bash
# https://app.supabase.com
1. Sign up or login
2. Create new project
3. Copy these values:
   - SUPABASE_URL
   - SUPABASE_KEY (anon key)
   - SUPABASE_SERVICE_ROLE_KEY
```

### Step 2: Environment Variables
```bash
# backend/.env file mein ye paste kro:

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your-password
SUPABASE_DB_HOST=your-project.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres

CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 3: Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 4: Database Tables
```bash
# Supabase Dashboard > SQL Editor mein run kro:

-- Copy from backend/models/db_models.py ke comments
-- Ya automatic via Alembic:
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

### Step 5: Run Backend
```bash
python -m uvicorn main:app --reload
```

✅ Live: `http://localhost:8000`
📚 Docs: `http://localhost:8000/docs`

---

## 📡 Frontend Integration

### Install Supabase Client
```bash
cd frontend
npm install @supabase/supabase-js
```

### Create Frontend Client
```javascript
// frontend/src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
```

### Frontend .env
```bash
# frontend/.env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your_anon_key_here
VITE_API_URL=http://localhost:8000
```

### Example: Login Flow
```javascript
import { supabase } from './services/supabase'

async function handleLogin(email, password) {
  // Option 1: Direct Supabase auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  // Option 2: Via backend API
  const response = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  const { access_token } = await response.json()
  
  // Store token
  localStorage.setItem('token', access_token)
}
```

---

## 🔐 API Authentication

### Add Auth Header
```javascript
const token = localStorage.getItem('token')

fetch('http://localhost:8000/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Protected Endpoints Example
```python
# backend/routers/startups.py
from fastapi import APIRouter, Depends
from ..services.auth_middleware import verify_token

router = APIRouter(prefix="/startups", tags=["startups"])

@router.get("/me")
async def get_my_startup(current_user: dict = Depends(verify_token)):
    # current_user automatically verified
    return {
        "startup": "data for " + current_user["email"]
    }
```

---

## 📁 File Uploads

### Backend
```python
from backend.services.supabase_storage_service import supabase_storage

url = await supabase_storage.upload_file(
    file_path="proposal_123.pdf",
    file_content=file_bytes,
    folder="proposals"
)
# Returns: {"public_url": "https://..."}
```

### Frontend
```javascript
async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'documents')
  
  const response = await fetch('http://localhost:8000/documents/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  })
  
  const { public_url } = await response.json()
  return public_url
}
```

---

## 🗂️ Project Structure

```
backend/
├── db/
│   ├── connection.py (updated - Supabase support)
│   ├── supabase.py (NEW - Supabase config)
│   └── ...
├── services/
│   ├── supabase_auth_service.py (NEW)
│   ├── supabase_storage_service.py (NEW)
│   ├── auth_middleware.py (NEW)
│   └── ...
├── models/
│   ├── db_models.py (NEW - SQLAlchemy models)
│   └── ...
├── routers/
│   ├── auth_example.py (NEW - Example endpoints)
│   └── ...
├── main.py (updated - Supabase message)
├── requirements.txt (updated - supabase library)
└── SUPABASE_SETUP.md (NEW - Detailed guide)
```

---

## ✨ Features Ready

- ✅ User registration (Supabase Auth)
- ✅ Login/logout (JWT tokens)
- ✅ Token refresh
- ✅ Role-based access control (admin, startup, government)
- ✅ File uploads (Supabase Storage)
- ✅ PostgreSQL database (Supabase)
- ✅ Real-time subscriptions (ready to use)

---

## 🚀 Next: Database Models

Edit `backend/models/db_models.py` for your schema:

```python
class Challenge(Base):
    __tablename__ = "challenges"
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="open")
    # Add more fields...
```

Then run migration:
```bash
alembic revision --autogenerate -m "Add challenge model"
alembic upgrade head
```

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| `SUPABASE_URL not found` | Check `.env` file, restart terminal |
| `Connection refused` | Verify SUPABASE_DB_HOST, check firewall |
| `Invalid token` | Use Service Role Key for admin ops |
| `Auth endpoint 404` | Import router in main.py |

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL AsyncPG](https://github.com/MagicStack/asyncpg)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/en/20/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

---

**Status**: ✅ Backend ready for development!

Next: Connect frontend to backend API 🎯
