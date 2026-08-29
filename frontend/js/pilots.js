// import { apiRequest } from './api.js';
// export const listPilots = () => apiRequest('/milestones/');


import { api } from "./api";

export async function getPilots(filters = {}) {
  const params = new URLSearchParams(filters);
  const query = params.toString();

  return api.get(
    `/pilots${query ? `?${query}` : ""}`
  );
}

export async function getPilot(id) {
  return api.get(`/pilots/${id}`);
}

export async function createPilot(data) {
  return api.post("/pilots", data);
}

export async function updatePilot(id, data) {
  return api.put(`/pilots/${id}`, data);
}

export async function updatePilotKPI(id, kpiData) {
  return api.post(`/pilots/${id}/kpi`, kpiData);
}

export async function completePilot(id) {
  return api.post(`/pilots/${id}/complete`);
}