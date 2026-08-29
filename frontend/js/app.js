// // Shared frontend bootstrap. Page modules can register their own controllers here.
// import { initAuth } from './auth.js';
// initAuth();


import { onAuthStateChanged } from "./firebase";
import { auth } from "./firebase";

const appState = {
  user: null,
  role: null,
  initialized: false,
};

export function getAppState() {
  return { ...appState };
}

export function setUser(user) {
  appState.user = user;
}

export function setRole(role) {
  appState.role = role;
}

export function isAuthenticated() {
  return !!appState.user;
}

export function initializeAppState(callback) {
  return onAuthStateChanged(auth, (user) => {
    appState.user = user;
    appState.initialized = true;

    if (typeof callback === "function") {
      callback(user);
    }
  });
}

export function requireAuth() {
  if (!isAuthenticated()) {
    throw new Error("Authentication required");
  }

  return appState.user;
}