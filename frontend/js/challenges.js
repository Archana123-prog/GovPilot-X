import { apiRequest } from './api.js';
export const listChallenges = (query='') => apiRequest(`/challenges/?${query}`);
export const createChallenge = (payload) => apiRequest('/challenges/create',{method:'POST',body:JSON.stringify(payload)});
