import { MOCK_CHALLENGES } from './mockData';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export const getChallenges = async () => {
  await delay();
  return MOCK_CHALLENGES;
};

export const getChallengeById = async (id) => {
  await delay(300);
  return MOCK_CHALLENGES.find((c) => c.id === id) || null;
};

export const createChallenge = async (data) => {
  await delay(800);
  return { id: `ch-${Date.now()}`, ...data, status: 'ACTIVE', applications: 0, match_count: 0, created_at: new Date().toISOString() };
};
