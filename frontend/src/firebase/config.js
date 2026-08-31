import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Firebase configuration for document & file storage
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);

/**
 * Upload a document file to Firebase Storage.
 * @param {File} file - The file object to upload
 * @param {string} path - Storage path prefix (e.g., 'milestone_evidence/milestone-123')
 * @returns {Promise<string>} - Download URL of the uploaded file
 */
export async function uploadDocument(file, path) {
  const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const fileRef = ref(storage, `${path}/${fileName}`);
  const snapshot = await uploadBytes(fileRef, file);
  return await getDownloadURL(snapshot.ref);
}

/**
 * Get download URL for an existing file in Firebase Storage.
 * @param {string} fullPath - Full path in the storage bucket
 * @returns {Promise<string>}
 */
export async function getDocumentUrl(fullPath) {
  const fileRef = ref(storage, fullPath);
  return await getDownloadURL(fileRef);
}

export default firebaseApp;