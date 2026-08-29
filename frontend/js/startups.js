// import { apiRequest } from './api.js';
// export const listStartups = () => apiRequest('/startups/');



import { api } from "./api";

export async function getStartups(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  const query = params.toString();

  return api.get(
    `/startups${query ? `?${query}` : ""}`
  );
}

export async function getStartup(id) {
  return api.get(`/startups/${id}`);
}

export async function createStartup(data) {
  return api.post("/startups", data);
}

export async function updateStartup(id, data) {
  return api.put(`/startups/${id}`, data);
}

export async function submitSolution(challengeId, data) {
  return api.post(
    `/challenges/${challengeId}/solutions`,
    data
  );
}