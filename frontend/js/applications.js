import { apiRequest } from './api.js';
export const listApplications = () => apiRequest('/applications/');
