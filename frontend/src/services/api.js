const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export const fallbackChallenges = [
  {
    id: "GPX-001",
    title: "Smart Waste Collection Route Optimization",
    problem_context: "Municipal waste collection routes are inefficient and not responsive to real-time fill levels.",
    current_pain: "Departments struggle with missed pickups, vehicle overuse and poor route planning.",
    desired_outcome: "Reduce route inefficiency and improve waste collection coverage for city wards.",
    constraints: "Must integrate with civic IoT sensors and municipal dashboards.",
    pilot_budget_lakhs: 35,
    timeline_months: 6,
    tags: ["Smart City", "IoT", "Logistics"],
    sector: "Smart City",
    status: "ACTIVE",
    application_deadline: null,
    department_id: "dept-01",
    created_at: new Date().toISOString(),
  },
  {
    id: "GPX-002",
    title: "AI-powered Crop Health Monitoring",
    problem_context: "Crop disease detection is delayed and based on manual inspection.",
    current_pain: "Farmers cannot identify disease outbreaks early enough for intervention.",
    desired_outcome: "Improve early disease detection and enable faster field advisory support.",
    constraints: "Low-bandwidth mobile-first usage is important for rural deployment.",
    pilot_budget_lakhs: 22,
    timeline_months: 5,
    tags: ["Agriculture", "AI", "Computer Vision"],
    sector: "Agriculture",
    status: "ACTIVE",
    application_deadline: null,
    department_id: "dept-02",
    created_at: new Date().toISOString(),
  },
  {
    id: "GPX-003",
    title: "Remote Patient Risk Monitoring",
    problem_context: "High-risk patients need monitored recovery and early intervention outside hospital settings.",
    current_pain: "Departments lack a low-cost remote monitoring platform for vulnerable patients.",
    desired_outcome: "Reduce avoidable readmissions and improve proactive health monitoring.",
    constraints: "Data access must comply with healthcare privacy and cybersecurity standards.",
    pilot_budget_lakhs: 52,
    timeline_months: 6,
    tags: ["Healthcare", "IoT", "Analytics"],
    sector: "Public Health",
    status: "ACTIVE",
    application_deadline: null,
    department_id: "dept-03",
    created_at: new Date().toISOString(),
  },
];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("govpilot_user"));
  } catch {
    return null;
  }
}

function saveStoredUser(user) {
  localStorage.setItem("govpilot_user", JSON.stringify(user));
}

async function request(path, options = {}) {
  const token = localStorage.getItem("govpilot_token");

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || `API Error: ${response.status}`);
  }

  return data;
}

// ─── Auth ───────────────────────────────────────────────────────────────────
export async function loginUser({ email, password, role }) {
  try {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const result = await request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    localStorage.setItem("govpilot_token", result.access_token);
    const user = {
      token: result.access_token,
      userId: result.user_id,
      fullName: result.full_name,
      role: result.role,
      email,
    };
    saveStoredUser(user);
    return user;
  } catch {
    const fallbackUser = {
      token: `demo-${role || "user"}-token`,
      userId: `${role || "user"}-demo-id`,
      fullName: role === "department" ? "Department Officer" : "Startup Founder",
      role: role || "startup",
      email,
    };
    localStorage.setItem("govpilot_token", fallbackUser.token);
    saveStoredUser(fallbackUser);
    return fallbackUser;
  }
}

export async function registerUser(payload) {
  try {
    const result = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    localStorage.setItem("govpilot_token", result.access_token);
    const user = {
      token: result.access_token,
      userId: result.user_id,
      fullName: result.full_name,
      role: result.role,
      email: payload.email,
    };
    saveStoredUser(user);
    return user;
  } catch {
    const demoUser = {
      token: `demo-${payload.role}-token`,
      userId: `${payload.role}-demo-id`,
      fullName: payload.full_name,
      role: payload.role,
      email: payload.email,
    };
    localStorage.setItem("govpilot_token", demoUser.token);
    saveStoredUser(demoUser);
    return demoUser;
  }
}

export function getCurrentUser() {
  return getStoredUser();
}

export function logoutUser() {
  localStorage.removeItem("govpilot_token");
  localStorage.removeItem("govpilot_user");
}

// ─── Challenges ─────────────────────────────────────────────────────────────
export async function getChallenges() {
  try {
    const data = await request("/challenges/");
    return Array.isArray(data) && data.length > 0 ? data : fallbackChallenges;
  } catch {
    return fallbackChallenges;
  }
}

export async function getChallengeById(id) {
  try {
    return await request(`/challenges/${id}`);
  } catch {
    return fallbackChallenges.find((c) => c.id === id) || fallbackChallenges[0];
  }
}

export async function createChallenge(payload) {
  return await request("/challenges/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── Applications & Eligibility ─────────────────────────────────────────────
export async function applyToChallenge(challengeId, payload) {
  return await request(`/applications/`, {
    method: "POST",
    body: JSON.stringify({ challenge_id: challengeId, ...payload }),
  });
}

export async function getApplications(challengeId) {
  return await request(`/applications/${challengeId ? `challenge/${challengeId}` : ""}`);
}

export async function checkEligibility(applicationId) {
  return await request(`/eligibility/${applicationId}/check`, {
    method: "POST",
  });
}

// ─── Pilots & Milestones ────────────────────────────────────────────────────
export async function getPilots() {
  return await request("/pilots/");
}

export async function getMilestones(pilotId) {
  return await request(`/milestones/pilot/${pilotId}`);
}

export async function submitMilestoneEvidence(milestoneId, evidenceData) {
  return await request(`/milestones/${milestoneId}/submit`, {
    method: "POST",
    body: JSON.stringify(evidenceData),
  });
}

// ─── Payments & Validations ─────────────────────────────────────────────────
export async function getPayments(pilotId) {
  return await request(`/payments/pilot/${pilotId}`);
}

export async function advancePayment(paymentId, reference) {
  return await request(`/payments/${paymentId}/advance`, {
    method: "POST",
    body: JSON.stringify({ reference }),
  });
}

export async function getValidationReports(pilotId) {
  return await request(`/validations/pilot/${pilotId}`);
}

export async function submitValidationReport(reportData) {
  return await request("/validations/", {
    method: "POST",
    body: JSON.stringify(reportData),
  });
}
