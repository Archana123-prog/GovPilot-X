import { MOCK_STARTUPS } from './mockData';

const delay = (ms = 1200) => new Promise((r) => setTimeout(r, ms));

export const matchStartups = async (challengeId) => {
  await delay();
  // Mock: return all startups sorted by match_score
  return MOCK_STARTUPS.sort((a, b) => b.match_score - a.match_score).map((s) => ({
    ...s,
    match_rationale: `Strong alignment on tech stack and prior civic deployments. Similarity score: ${(s.match_score * 100).toFixed(0)}%`,
  }));
};
