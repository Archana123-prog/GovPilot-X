# Frontend: Firebase → Supabase Migration 🔄

## ✅ Changes Made

### Removed
- ❌ `firebase` npm package (from package.json)
- ❌ All Firebase imports in config.js

### Added
- ✅ `@supabase/supabase-js` npm package
- ✅ `frontend/src/services/supabase.js` - Supabase client configuration
- ✅ `frontend/.env.example` - Environment template

### Updated
- 📝 `frontend/src/firebase/config.js` - Marked as deprecated, exports null

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Create .env.local
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with your Supabase credentials:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_KEY=your_anon_key_here
# VITE_API_URL=http://localhost:8000
```

### Step 3: Update Imports in Components

#### OLD (Firebase)
```javascript
import { auth, db, storage } from '@/firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
```

#### NEW (Supabase)
```javascript
import { supabase, fetchAPI } from '@/services/supabase'
```

---

## 🔐 Authentication Examples

### Login
```javascript
import { fetchAPI, setAuthToken } from '@/services/supabase'

async function handleLogin(email, password) {
  const response = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  
  const { access_token } = response
  setAuthToken(access_token)
  
  localStorage.setItem('user_email', email)
}
```

### Get Current User
```javascript
import { fetchAPI } from '@/services/supabase'

async function getCurrentUser() {
  const user = await fetchAPI('/auth/me')
  return user
}
```

### Logout
```javascript
import { fetchAPI, setAuthToken } from '@/services/supabase'

async function handleLogout() {
  await fetchAPI('/auth/logout', { method: 'POST' })
  setAuthToken(null)
  localStorage.removeItem('user_email')
}
```

### File Upload
```javascript
import { fetchAPI } from '@/services/supabase'

async function uploadProposal(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'proposals')
  
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/documents/upload`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sb_token')}`
      },
      body: formData
    }
  )
  
  return response.json()
}
```

---

## 📁 File Structure

```
frontend/
├── src/
│   ├── services/
│   │   └── supabase.js (NEW - Supabase client)
│   ├── firebase/
│   │   └── config.js (DEPRECATED - null exports)
│   ├── App.jsx
│   └── ...
├── .env.example (NEW)
├── package.json (UPDATED - firebase removed, supabase added)
└── ...
```

---

## 🔧 Component Migration Pattern

### Before (Firebase)
```javascript
import React, { useState, useEffect } from 'react'
import { auth } from '@/firebase/config'
import { onAuthStateChanged, signOut } from 'firebase/auth'

export function Dashboard() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return unsubscribe
  }, [])
  
  return <div>Welcome {user?.email}</div>
}
```

### After (Supabase)
```javascript
import React, { useState, useEffect } from 'react'
import { fetchAPI, setAuthToken } from '@/services/supabase'

export function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function getUser() {
      try {
        const userData = await fetchAPI('/auth/me')
        setUser(userData)
      } catch (error) {
        console.error('Failed to load user:', error)
        setAuthToken(null)
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
  }, [])
  
  if (loading) return <div>Loading...</div>
  return <div>Welcome {user?.email}</div>
}
```

---

## 🛠️ API Endpoints Available

All endpoints require `Authorization: Bearer <token>` header (except login/signup).

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Authenticate user |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/logout` | Sign out |
| GET | `/auth/me` | Get current user |
| PUT | `/auth/profile` | Update user profile |
| POST | `/auth/password-reset` | Send reset email |

---

## ✨ Next Steps

1. **Update all component auth** - Replace Firebase imports with Supabase calls
2. **Test login/logout** - Verify auth flow works
3. **Test data fetching** - Ensure API calls work with Supabase backend
4. **Add error handling** - Handle 401/403 auth errors
5. **Setup TypeScript** (optional) - Add type definitions for better DX

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| `VITE_SUPABASE_URL is undefined` | Check `.env.local` file exists and has correct values |
| `401 Unauthorized` | Token might be expired, call `/auth/refresh` |
| `CORS error` | Make sure backend has correct CORS_ORIGINS set |
| `API call fails` | Check backend is running: `python -m uvicorn main:app --reload` |

---

## 📚 Useful Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

**Status**: ✅ Frontend cleaned! Ready for component updates 🎯
