// src/api/index.js
export const API_URL = "http://10.10.4.82:3001";

async function api(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res  = await fetch(`${API_URL}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const getAllDoctors     = ()       => api("GET",  "/api/doctors");
export const getDoctorById     = (enroll) => api("GET",  `/api/doctors/${enroll}`);
export const saveDoctor        = (payload)=> api("POST", "/api/doctors", payload);
export const getAllFarms        = ()       => api("GET",  "/api/farms");
export const getFarmsByEnroll  = (enroll) => api("GET",  `/api/farms/${enroll}`);
export const saveFarm          = (payload)=> api("POST", "/api/farms", payload);
export const getAllVisits       = ()       => api("GET",  "/api/visits");
export const getVisitsByEnroll = (enroll) => api("GET",  `/api/visits/${enroll}`);
export const saveVisit         = (payload)=> api("POST", "/api/visits", payload);

const ANCHOR = new Date(2026, 3, 26);
export function calcWeek(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  const diffMs    = weekStart - ANCHOR;
  const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  return 19 + diffWeeks;
}
