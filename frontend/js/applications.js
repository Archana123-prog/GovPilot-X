// import { apiRequest } from './api.js';
// export const listApplications = () => apiRequest('/applications/');


import { api } from "./api";

export async function getApplications(filters = {}) {
  const params = new URLSearchParams(filters);
  const query = params.toString();

  return api.get(
    `/applications${query ? `?${query}` : ""}`
  );
}

export async function getApplication(id) {
  return api.get(`/applications/${id}`);
}

export async function createApplication(data) {
  return api.post("/applications", data);
}

export async function updateApplication(id, data) {
  return api.put(`/applications/${id}`, data);
}

export async function withdrawApplication(id) {
  return api.post(`/applications/${id}/withdraw`);
}