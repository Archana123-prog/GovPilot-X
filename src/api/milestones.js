import { MOCK_MILESTONES } from './mockData';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

let milestones = [...MOCK_MILESTONES];

export const getMilestones = async () => {
  await delay();
  return milestones;
};

export const getMilestonesByChallenge = async (challengeId) => {
  await delay(300);
  return milestones.filter((m) => m.challenge_id === challengeId);
};

export const updateMilestoneStatus = async (id, status) => {
  await delay(600);
  milestones = milestones.map((m) =>
    m.id === id ? { ...m, status, completed_at: status === 'COMPLETED' ? new Date().toISOString() : m.completed_at } : m
  );
  return milestones.find((m) => m.id === id);
};

export const createMilestone = async (data) => {
  await delay(800);
  const newMs = { id: `ms-${Date.now()}`, ...data, status: 'PENDING', completed_at: null };
  milestones = [...milestones, newMs];
  return newMs;
};
