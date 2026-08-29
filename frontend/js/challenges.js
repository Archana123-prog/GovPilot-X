// import { apiRequest } from './api.js';
// export const listChallenges = (query='') => apiRequest(`/challenges/?${query}`);
// export const createChallenge = (payload) => apiRequest('/challenges/create',{method:'POST',body:JSON.stringify(payload)});


import { api } from "./api";

export async function getChallenges(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value);
    }
  });

  const query = params.toString();

  return api.get(
    `/challenges${query ? `?${query}` : ""}`
  );
}

export async function getChallenge(id) {
  return api.get(`/challenges/${id}`);
}

export async function createChallenge(challenge) {
  return api.post("/challenges", challenge);
}

export async function updateChallenge(id, data) {
  return api.put(`/challenges/${id}`, data);
}

export async function submitChallenge(challengeId) {
  return api.post(`/challenges/${challengeId}/submit`);
}