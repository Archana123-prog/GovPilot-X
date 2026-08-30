/**
 * DEPRECATED: Firebase has been replaced with Supabase
 * 
 * This file is no longer used. All backend services now use Supabase.
 * 
 * Update your imports:
 * OLD: import { auth, db, storage } from '@/firebase/config'
 * NEW: import { supabase, fetchAPI } from '@/services/supabase'
 * 
 * See /services/supabase.js for the new Supabase client configuration.
 */

console.warn(
  '⚠️  Firebase config is deprecated. Use supabase.js instead: import { supabase } from "@/services/supabase"'
);

// Export null as fallback to prevent crashes in old code
export const auth = null;
export const db = null;
export const storage = null;
export default null;