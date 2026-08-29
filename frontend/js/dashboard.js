// export function renderDashboard(target, metrics=[]){target.innerHTML=metrics.map(({label,value})=>`<article class="card"><strong>${value}</strong><span>${label}</span></article>`).join('')}


import { api } from "./api";

export async function getDashboardStats(role) {
  return api.get(`/dashboard/${role}`);
}

export async function getGovernmentDashboard() {
  return getDashboardStats("government");
}

export async function getStartupDashboard() {
  return getDashboardStats("startup");
}

export async function getEvaluatorDashboard() {
  return getDashboardStats("evaluator");
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(
    Number(value || 0)
  );
}