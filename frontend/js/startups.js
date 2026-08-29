import { apiRequest } from './api.js';
export const listStartups = () => apiRequest('/startups/');
