# GovPilot-X Supabase Backend Setup Guide

## Overview
GovPilot-X backend ab **Supabase** use karta hai - Firebase ke bajaye.

### Kya use hota hai:
- **Supabase PostgreSQL** - Database (SQLAlchemy + AsyncPG)
- **Supabase Auth** - User authentication
- **Supabase Storage** - File uploads (documents, avatars)

---

## Setup Steps

### 1. Supabase Project Create Karo
- [app.supabase.com](https://app.supabase.com) par ja
- "New Project" click karo
- Organization select kro
- Project name: `govpilot-x` (ya koi aur)
- Database password set karo (strong password!)
- Region select karo (apne country ke close)
- "Create new project" click kro

Wait karenge 2-3 minutes project create hone ke liye...

### 2. Environment Variables Set Karo

Supabase project dashboard se ye values copy kro:

```bash
# Settings > API
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJhbGc...  (anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  (service role key)

# Settings > Database
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=<tum jab project create kiya tab set kiya tha>
SUPABASE_DB_HOST=xxxx.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
```

`.env` file mein ye daalo:

```bash
# backend/.env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your_password_here
SUPABASE_DB_HOST=xxxx.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres

CORS_ORIGINS=http://localhost:5173
```

### 3. Database Tables Create Karo

Supabase Dashboard > SQL Editor > chalo isko run kro:

```sql
-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'startup',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create challenges table
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'open',
    budget DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES users(id),
    challenge_id UUID REFERENCES challenges(id),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS policies (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
```

### 4. Storage Bucket Create Karo

Supabase Dashboard > Storage > chalo:

1. "New Bucket" click kro
2. Name: `govpilot-files`
3. Make it public
4. Create kro

### 5. Backend Dependencies Install Kro

```bash
cd backend
pip install -r requirements.txt
```

### 6. Backend Start Kro

```bash
python -m uvicorn main:app --reload
```

Server start hojayega: `http://localhost:8000`

---

## API Examples

### Login (Supabase Auth)
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### File Upload (Supabase Storage)
```bash
curl -X POST http://localhost:8000/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf" \
  -F "folder=documents"
```

---

## Database Connection

Agar local PostgreSQL use karna hai (development):

```bash
# .env mein ye set kro
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/govpilotx
```

Backend automatically detect karega aur local DB use karega.

---

## Useful Commands

### Database Migrations (Alembic)
```bash
# New migration create kro
alembic revision --autogenerate -m "add users table"

# Apply migrations
alembic upgrade head
```

### Check Supabase Connection
```python
from backend.db.supabase import get_supabase_client

client = get_supabase_client()
result = client.table('users').select("*").execute()
print(result.data)
```

---

## Troubleshooting

### "SUPABASE_URL not found"
- Check `.env` file mein SUPABASE_URL set hai
- Terminal restart kro

### "Connection refused"
- Check SUPABASE_DB_HOST sahi hai
- Firewall allow kare network connections

### "Invalid token"
- Service Role Key use kro admin operations ke liye
- Anon key frontend ke liye

---

## Next Steps

1. ✅ Models update kro (`backend/models/`)
2. ✅ Routes implement kro (`backend/routers/`)
3. ✅ Auth middleware add kro
4. ✅ Real-time subscriptions add kro (Supabase RealtimeDB)

Happy coding! 🚀
