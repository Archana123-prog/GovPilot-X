import { apiRequest } from './api.js';
export const listEvaluations = () => apiRequest('/evaluations/');
