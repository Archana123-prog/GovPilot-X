/**
 * Supabase client — used for Storage uploads and direct DB queries if needed.
 * Auth is handled by the FastAPI backend (JWT). Supabase is the storage layer.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// ─── Auth token helpers (JWT from FastAPI backend) ────────────────────────────

/** Get the stored JWT access token */
export const getAuthToken = () => localStorage.getItem("govpilot_token") || null;

/** Store JWT access token after login */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("govpilot_token", token);
  } else {
    localStorage.removeItem("govpilot_token");
  }
};

// ─── Authenticated fetch helper ───────────────────────────────────────────────

/**
 * Make an authenticated API call to the FastAPI backend.
 * @param {string} endpoint  - e.g. '/auth/me'
 * @param {RequestInit} options
 */
export const fetchAPI = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE || "http://localhost:8000"}${endpoint}`,
    { ...options, headers }
  );

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export default supabase;
