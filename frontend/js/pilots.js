import { apiRequest } from './api.js';
export const listPilots = () => apiRequest('/milestones/');
