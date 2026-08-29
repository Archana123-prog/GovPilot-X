const SESSION_KEY = 'govpilot-user';
export function getCurrentUser(){return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}
export function setCurrentUser(user){localStorage.setItem(SESSION_KEY,JSON.stringify(user))}
export function logout(){localStorage.removeItem(SESSION_KEY)}
export function initAuth(){document.dispatchEvent(new CustomEvent('govpilot:auth-ready',{detail:getCurrentUser()}))}
