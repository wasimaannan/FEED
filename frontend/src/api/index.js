// src/api/index.js
// ─────────────────────────────────────────────────────────────
//  All HTTP calls to the Express backend.
//
//  DEV:  your Mac's IP on the local WiFi network
//        Find it: System Settings → Wi-Fi → Details → IP Address
//        e.g. http://192.168.1.42:3000
//
//  PROD: your deployed backend URL
//        e.g. https://feed-backend.onrender.com
//
//  ⚠️  IMPORTANT: Your phone and Mac must be on the SAME WiFi
//     for Expo Go to reach your local backend.
// ─────────────────────────────────────────────────────────────

export const API_URL = "http://172.17.6.140"; // ← change this

// ── Generic fetch wrapper ─────────────────────────────────────
async function api(method, path, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);

  const res  = await fetch(`${API_URL}${path}`, opts);
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data.data;
}

// ── Doctors ───────────────────────────────────────────────────
export const getAllDoctors  = ()         => api("GET",  "/api/doctors");
export const getDoctorById  = (enroll)  => api("GET",  `/api/doctors/${enroll}`);
export const saveDoctor     = (payload) => api("POST", "/api/doctors", payload);

// ── Farms ─────────────────────────────────────────────────────
export const getAllFarms    = ()         => api("GET",  "/api/farms");
export const getFarmsByEnroll = (enroll)=> api("GET",  `/api/farms/${enroll}`);
export const saveFarm       = (payload) => api("POST", "/api/farms", payload);

// ── Visits ────────────────────────────────────────────────────
export const getAllVisits   = ()         => api("GET",  "/api/visits");
export const getVisitsByEnroll = (enroll)=> api("GET", `/api/visits/${enroll}`);
export const saveVisit      = (payload) => api("POST", "/api/visits", payload);

// ── Week calculator ───────────────────────────────────────────
// Anchor: Sunday April 26 2026 = Week 19
// Weeks run Sunday → Saturday
const ANCHOR = new Date(2026, 3, 26);

export function calcWeek(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay()); // roll to Sunday
  const diffMs    = weekStart - ANCHOR;
  const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  return 19 + diffWeeks;
}
