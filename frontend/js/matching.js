// import { apiRequest } from './api.js';
// export const runMatching = (payload) => apiRequest('/match/startups',{method:'POST',body:JSON.stringify(payload)});


import { api } from "./api";

export async function findMatches(challengeId) {
  return api.get(`/matching/challenge/${challengeId}`);
}

export async function getStartupMatches(startupId) {
  return api.get(`/matching/startup/${startupId}`);
}

export async function calculateMatch(challengeId, startupId) {
  return api.post("/matching/calculate", {
    challengeId,
    startupId,
  });
}

export function getMatchLabel(score) {
  if (score >= 85) return "Excellent Match";
  if (score >= 70) return "Strong Match";
  if (score >= 50) return "Potential Match";

  return "Low Match";
}