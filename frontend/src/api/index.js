const API_URL = "http://10.10.4.82:3000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || "Request failed");
  }

  return json;
}

// ===================== DOCTORS =====================

export async function getAllDoctors() {
  const res = await request("/doctors");
  return res.data;
}

export async function getDoctor(id) {
  const res = await request(`/doctors/${id}`);
  return res.data;
}

/**
 * Save doctor directly to external API
 * @param {Object} data - Doctor data
 * @param {string} mode - 'new' or 'edit'
 */
export async function saveDoctor(data, mode = "new") {
  const isEdit = mode === "edit";
  const enroll = data.intEnroll || data.EnrollID;
  const endpoint = isEdit ? `/doctors/edit/${enroll}` : "/doctors/create";
  const method = isEdit ? "PUT" : "POST";

  // Map Specialization to valid API values
  let apiSpecialization = data.strSpecialization || data.Specialization || "";
  if (apiSpecialization) {
    const specLower = apiSpecialization.toLowerCase();
    if (specLower === "broiler" || specLower === "layer" || specLower === "sonali" || specLower === "poultry") {
      apiSpecialization = "Poultry";
    } else if (specLower === "cattle") {
      apiSpecialization = "Cattle";
    } else if (specLower === "fish") {
      apiSpecialization = "Fish";
    }
  }

  // Construct payload for external API
  const payload = {
    EnrollID: Number(enroll),
    FullName: data.strDoctorName || data.FullName || "",
    Specialization: apiSpecialization,
    ZoneName: data.strZone || data.ZoneName || "",
    ZoneID: data.ZoneID || 0, // Should be passed from UI
    ActiveFarm: Number(data.ActiveFarm) || (Number(data.intBroiler || 0) + Number(data.intLayer || 0) + Number(data.intSonali || 0)) || 0,
    UnderService: Number(data.intUnderService || data.UnderService || 0),
    ServiceTarget: Number(data.intServiceTarget || data.ServiceTarget || 0),
    IsActive: data.IsActive ?? true,
    CreatedByUserID: Number(data.CreatedByUserID || 0)
  };

  return await authRequest(endpoint, {
    method,
    body: JSON.stringify(payload),
    prefix: ""
  });
}

// ===================== USERS =====================

export async function getUsers() {
  const res = await request("/users");
  return res.data;
}

// ===================== FARMS =====================

export async function getAllFarms() {
  const res = await request("/farms");
  return res.data;
}

export async function getFarmsByEnroll(enroll) {
  const res = await request(`/farms/${enroll}`);
  return res.data;
}

// Temporary until backend POST is ready
export async function saveFarm(data) {
  return request("/farms", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ===================== VISITS =====================

export async function getAllVisits() {
  const res = await request("/visits");
  return res.data;
}

// Temporary until backend POST is ready
export async function saveVisit(data) {
  return request("/visits", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ===================== COMPLAINTS =====================

export async function getAllComplaints() {
  const res = await request("/complaints");
  return res.data;
}

// ===================== HELPERS =====================

export function calcWeek(dateString) {
  const date = new Date(dateString);

  const firstDay = new Date(date.getFullYear(), 0, 1);

  const days = Math.floor(
    (date - firstDay) / (24 * 60 * 60 * 1000)
  );

  return Math.ceil((days + firstDay.getDay() + 1) / 7);
}

// ===================== AUTH =====================
const EXTERNAL_API_BASE = "https://arlapi.ibos.io/api/v1";

async function authRequest(endpoint, options = {}) {
  const { prefix = "/auth", ...fetchOptions } = options;
  const url = `${EXTERNAL_API_BASE}${prefix}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "accept": "application/json",
    },
    ...fetchOptions,
  });

  const text = await response.text();
  let json = {};
  if (text) {
    try {
      json = JSON.parse(text);
    } catch (e) {
      json = { message: text };
    }
  }

  if (!response.ok) {
    // Handle complex error objects from API
    let errorMsg = json.message || json.error || "Authentication request failed";
    if (json.detail) {
      if (typeof json.detail === "string") errorMsg = json.detail;
      else if (Array.isArray(json.detail)) errorMsg = json.detail.map(d => d.msg).join(", ");
    }
    throw new Error(errorMsg);
  }

  return json;
}

export async function registerUser({ enrollId, username, fullName, password, zoneName }) {
  return await authRequest("/register", {
    method: "POST",
    body: JSON.stringify({
      EnrollID: Number(enrollId),
      Username: username,
      FullName: fullName,
      Password: password,
      ZoneName: zoneName || "HQ",
    }),
  });
}

export async function loginUser({ enrollId, password }) {
  return await authRequest("/login", {
    method: "POST",
    body: JSON.stringify({
      EnrollID: Number(enrollId),
      Password: password,
    }),
  });
}

export async function changeUserPassword({ enrollId, oldPassword, newPassword }) {
  return await authRequest("/change-password", {
    method: "POST",
    body: JSON.stringify({
      EnrollID: Number(enrollId),
      OldPassword: oldPassword,
      NewPassword: newPassword,
    }),
  });
}

export async function forgotUserPassword({ enrollId, phone }) {
  return await authRequest("/forgot-password", {
    method: "POST",
    body: JSON.stringify({
      EnrollID: Number(enrollId),
      Phone: phone,
    }),
  });
}

export async function getUserProfile(enrollId) {
  return await authRequest(`/profile?EnrollID=${enrollId}`, {
    method: "GET",
  });
}

export async function logoutUser(enrollId) {
  return await authRequest(`/logout?EnrollID=${enrollId}`, {
    method: "POST",
  });
}

export async function getSettingsZones() {
  return await authRequest("/zones", { prefix: "/settings", method: "GET" });
}

export async function getSettingsFarmTypes() {
  return await authRequest("/farm-types", { prefix: "/settings", method: "GET" });
}

export async function updateUserPhone({ enrollId, phone }) {
  return await request("/users/update-phone", {
    method: "POST",
    body: JSON.stringify({
      EnrollID: Number(enrollId),
      Phone: phone,
    }),
  });
}