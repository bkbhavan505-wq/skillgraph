const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`);
  } catch (networkErr) {
    throw new ApiError("Can't reach the SkillGraph API. Is the backend running?", 0);
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.message) message = body.message;
    } catch {
      // ignore parse errors, keep default message
    }
    throw new ApiError(message, res.status);
  }
  return res.json();
}

export const api = {
  listCandidates: () => request("/api/candidates"),
  getCandidate: (id) => request(`/api/candidates/${encodeURIComponent(id)}`),
  listJobs: () => request("/api/jobs"),
  getJob: (id) => request(`/api/jobs/${encodeURIComponent(id)}`),
  listSkills: () => request("/api/skills"),
  relatedSkills: (name) => request(`/api/skills/${encodeURIComponent(name)}/related`),
  skillPath: (from, to) =>
    request(`/api/skills/path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`),
  listCompanies: () => request("/api/companies"),
  health: () => request("/api/health"),
};

export { ApiError };
