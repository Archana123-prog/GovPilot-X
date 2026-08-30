import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    `Missing Supabase environment variables: ${
      !SUPABASE_URL ? 'VITE_SUPABASE_URL' : ''
    } ${!SUPABASE_KEY ? 'VITE_SUPABASE_KEY' : ''}`
  )
}

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('sb_token') || null
}

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('sb_token', token)
  } else {
    localStorage.removeItem('sb_token')
  }
}

// Helper function for API calls with authentication
export const fetchAPI = async (endpoint, options = {}) => {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${endpoint}`,
    {
      ...options,
      headers,
    }
  )

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export default supabase
