// const SESSION_KEY = 'govpilot-user';
// export function getCurrentUser(){return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}
// export function setCurrentUser(user){localStorage.setItem(SESSION_KEY,JSON.stringify(user))}
// export function logout(){localStorage.removeItem(SESSION_KEY)}
// export function initAuth(){document.dispatchEvent(new CustomEvent('govpilot:auth-ready',{detail:getCurrentUser()}))}


import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export { onAuthStateChanged };

export default app;