// const API_BASE = '/api';
// export async function apiRequest(path, options = {}) { const response = await fetch(`${API_BASE}${path}`, { headers: {'Content-Type':'application/json', ...(options.headers || {})}, ...options }); if (!response.ok) throw new Error(`API request failed: ${response.status}`); return response.json(); }

const API_BASE = "/api";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `API Error: ${response.status}`);
  }

  return data;
}

export const api = {
  get: (path) => apiRequest(path),

  post: (path, body) =>
    apiRequest(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (path, body) =>
    apiRequest(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (path) =>
    apiRequest(path, {
      method: "DELETE",
    }),
};