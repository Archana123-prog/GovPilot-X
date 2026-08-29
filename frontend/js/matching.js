import { apiRequest } from './api.js';
export const runMatching = (payload) => apiRequest('/match/startups',{method:'POST',body:JSON.stringify(payload)});
