/**
 * Supabase Storage client — replaces Firebase Storage.
 * Used for uploading pilot agreements, milestone evidence, and validation reports.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Single shared Supabase client instance
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Default storage bucket name for all GovPilot-X documents
const BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "govpilot-documents";

/**
 * Upload a document file to Supabase Storage.
 * @param {File} file       - The file object to upload
 * @param {string} path     - Storage path prefix (e.g., 'milestone_evidence/milestone-123')
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export async function uploadDocument(file, path) {
  if (!supabase) {
    console.warn("[Storage] Supabase not configured. Returning mock URL.");
    return `https://placeholder.storage/${path}/${file.name}`;
  }

  const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const storagePath = `${path}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return getDocumentUrl(storagePath);
}

/**
 * Get public URL for an existing file in Supabase Storage.
 * @param {string} storagePath - Full path inside the bucket
 * @returns {string} - Public URL
 */
export function getDocumentUrl(storagePath) {
  if (!supabase) return `https://placeholder.storage/${storagePath}`;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export default supabase;
