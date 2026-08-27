import { MOCK_STARTUPS } from './mockData';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export const getStartups = async () => {
  await delay();
  return MOCK_STARTUPS;
};

export const getStartupById = async (id) => {
  await delay(300);
  return MOCK_STARTUPS.find((s) => s.id === id) || null;
};

export const registerStartup = async (data) => {
  await delay(1000);
  return { id: `st-${Date.now()}`, ...data, verified_status: false, created_at: new Date().toISOString() };
};
