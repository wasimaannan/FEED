import AsyncStorage from "@react-native-async-storage/async-storage";

console.log("API Layer Loading...");

const API_URL = "https://arlapi.ibos.io/api/v1";
const STORAGE_KEY = "@feed_user_session";

// Admin credentials provided by your senior for database access
const ADMIN_ID = "306007";
const ADMIN_PASS = "@dp702UK"; // Update this if incorrect
const CLIENT_ID = "306007";
const CLIENT_SECRET = "@dp702UK"; // Set to actual client secret to match admin credentials

function base64Encode(str) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let out = '';
  for (let i = 0, len = str.length; i < len; i += 3) {
    const c1 = str.charCodeAt(i) & 0xff;
    const c2 = i + 1 < len ? str.charCodeAt(i + 1) & 0xff : NaN;
    const c3 = i + 2 < len ? str.charCodeAt(i + 2) & 0xff : NaN;
    out += chars.charAt(c1 >> 2);
    if (!isNaN(c2)) {
      out += chars.charAt(((c1 & 0x3) << 4) | (c2 >> 4));
      if (!isNaN(c3)) {
        out += chars.charAt(((c2 & 0xF) << 2) | (c3 >> 6));
        out += chars.charAt(c3 & 0x3F);
      } else {
        out += chars.charAt((c2 & 0xF) << 2);
        out += '=';
      }
    } else {
      out += chars.charAt((c1 & 0x3) << 4);
      out += '==';
    }
  }
  return out;
}

function base64Decode(str) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  str = str.replace(/=+$/, '');
  let out = '';
  for (let i = 0, len = str.length; i < len; i += 4) {
    const c1 = chars.indexOf(str.charAt(i));
    const c2 = i + 1 < len ? chars.indexOf(str.charAt(i + 1)) : 0;
    const c3 = i + 2 < len ? chars.indexOf(str.charAt(i + 2)) : 64;
    const c4 = i + 3 < len ? chars.indexOf(str.charAt(i + 3)) : 64;
    
    const byte1 = (c1 << 2) | (c2 >> 4);
    const byte2 = ((c2 & 15) << 4) | (c3 >> 2);
    const byte3 = ((c3 & 3) << 6) | c4;
    
    out += String.fromCharCode(byte1);
    if (c3 !== 64) out += String.fromCharCode(byte2);
    if (c4 !== 64) out += String.fromCharCode(byte3);
  }
  return out;
}

function isTokenAdmin(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payload = jsonParseSafe(base64Decode(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload && (payload.role === 'Admin' || payload.Role === 'Admin');
  } catch (e) {
    return false;
  }
}

function jsonParseSafe(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

let cachedSystemAdminToken = null;

async function getAdminToken() {
  if (cachedSystemAdminToken && isTokenAdmin(cachedSystemAdminToken)) return cachedSystemAdminToken;
  
  const details = {
    'grant_type': 'password',
    'username': ADMIN_ID,
    'password': ADMIN_PASS,
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET
  };
  const formBody = Object.keys(details)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
    .join('&');

  const basicAuth = base64Encode(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const response = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "accept": "application/json",
      "Authorization": basicAuth ? `Basic ${basicAuth}` : undefined
    },
    body: formBody,
  });
  
  const json = await response.json();
  if (json.access_token || json.token || json.Token) {
    cachedSystemAdminToken = json.access_token || json.token || json.Token;
    return cachedSystemAdminToken;
  }
 
  // Improved error reporting for admin token
  let errorMsg = "Admin authentication failed";
  if (json.detail) {
    if (typeof json.detail === "string") errorMsg = json.detail;
    else if (Array.isArray(json.detail)) errorMsg = json.detail.map(d => `${d.loc ? d.loc.join('.') : 'field'}: ${d.msg}`).join(", ");
  }
  throw new Error(errorMsg);
}

async function adminAuthRequest(endpoint, options = {}) {
  const token = await getAdminToken();
  if (!token) throw new Error("Failed to obtain administrative authorization");
  
  options.headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`
  };
  return authRequest(endpoint, options);
}

async function authRequest(endpoint, options = {}) {
  const { prefix = "/auth", ...fetchOptions } = options;
  const url = `${API_URL}${prefix}${endpoint}`;

  // Try to get current user token from storage for non-admin requests
  let token = null;
  try {
    const session = await AsyncStorage.getItem(STORAGE_KEY);
    if (session) {
      const parsed = JSON.parse(session);
      token = parsed.access_token || parsed.token || parsed.Token || null;
    }
  } catch (e) {}

  const headers = {
    "Content-Type": "application/json",
    "accept": "application/json",
    ...fetchOptions.headers,
  };

  const hasAuthorization = Object.keys(headers).some(k => k.toLowerCase() === 'authorization');
  if (token && !hasAuthorization) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
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
    let errorMsg = json.message || json.error || "Request failed";
    if (json.detail) {
      if (typeof json.detail === "string") errorMsg = json.detail;
      else if (Array.isArray(json.detail)) errorMsg = json.detail.map(d => `${d.loc ? d.loc.join('.') : 'field'}: ${d.msg}`).join(", ");
    }
    throw new Error(errorMsg);
  }

  return json;
}

// ===================== DOCTORS =====================

export async function getAllDoctors() {
  try {
    // Standard list fetch using admin privileges for broader search. Use % as wildcard to match all.
    const res = await adminAuthRequest("/search?q=%25&limit=500", { prefix: "/doctors", method: "GET" });
    const list = res.data || res.Data || res.payload || res.Payload || res.doctors || (Array.isArray(res) ? res : null);

    if (list && Array.isArray(list)) {
      return list.map(d => ({
        ...d,
        EnrollID: d.EnrollID || d.enrollID || d.intEnroll || d.EnrollId || d.enrollId,
        FullName: d.FullName || d.strDoctorName || d.fullName || "Unknown Doctor",
        strDoctorName: d.FullName || d.strDoctorName || d.fullName || "Unknown Doctor",
        strZone: d.ZoneName || d.strZone || d.zoneName || "Unassigned",
        strSpecialization: d.Specialization || d.strSpecialization || d.specialization || "Cattle"
      }));
    }
    return [];
  } catch (e) {
    return [];
  }
}

export async function getDoctor(id) {
  try {
    const res = await adminAuthRequest(`/${id}`, { prefix: "/doctors", method: "GET" });
    const found = res.data || res.Data || res.payload || res.Payload || res;
    if (found && typeof found === "object" && !Array.isArray(found)) {
      return {
        ...found,
        EnrollID: found.EnrollID || found.enrollID || found.intEnroll || found.EnrollId || found.enrollId,
        FullName: found.FullName || found.strDoctorName || found.fullName || "Unknown Doctor",
        strDoctorName: found.FullName || found.strDoctorName || found.fullName,
        strZone: found.ZoneName || found.strZone,
        strSpecialization: found.Specialization || found.strSpecialization
      };
    }
    const all = await getAllDoctors();
    return all.find(d => String(d.EnrollID) === String(id));
  } catch (e) {
    throw e;
  }
}

export async function saveDoctor(data, mode = "new") {
  const isEdit = mode === "edit";
  const enroll = data.intEnroll || data.EnrollID;
  const endpoint = isEdit ? `/edit/${enroll}` : "/create";
  const method = isEdit ? "PUT" : "POST";

  // Map Specialization to valid API values based on user requirements:
  // "sonali broiler layer and cattle andfish"
  const validSpecs = ["Sonali", "Broiler", "Layer", "Cattle", "Fish"];
  let spec = data.strSpecialization || data.Specialization || "Cattle";

  // Basic normalization
  if (spec.toLowerCase() === "poultry") spec = "Broiler"; // Default poultry to Broiler if not specific

  // Find match case-insensitively
  const match = validSpecs.find(s => s.toLowerCase() === spec.toLowerCase());
  const finalSpec = match || "Cattle";

  const payload = {
    FullName: data.strDoctorName || data.FullName || "",
    Specialization: finalSpec,
    ZoneName: data.strZone || data.ZoneName || "",
    ZoneID: Number(data.ZoneID) || 0,
    ActiveFarm: Number(data.ActiveFarm) || (Number(data.intBroiler || 0) + Number(data.intLayer || 0) + Number(data.intSonali || 0)) || 0,
    UnderService: Number(data.intUnderService || data.UnderService || 0),
    ServiceTarget: Number(data.intServiceTarget || data.ServiceTarget || 0),
    IsActive: data.IsActive ?? true
  };

  if (!isEdit) {
    payload.EnrollID = Number(enroll);
    payload.CreatedByUserID = Number(data.CreatedByUserID || 0);
  }

  return await adminAuthRequest(endpoint, {
    prefix: "/doctors",
    method,
    body: JSON.stringify(payload)
  });
}

// ===================== USERS =====================

export async function getUsers() {
  try {
    const res = await authRequest("/list", { prefix: "/users", method: "GET" });
    return res.data || res.payload || (Array.isArray(res) ? res : []);
  } catch (e) {
    return [];
  }
}

// ===================== FARMS =====================

export async function getAllFarms() {
  try {
    const res = await authRequest("/list", { prefix: "/farms", method: "GET" });
    const list = res.data || res.Data || res.payload || res.Payload || res.farms || (Array.isArray(res) ? res : null);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

export async function saveFarm(data) {
  return authRequest("/create", {
    prefix: "/farms",
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ===================== VISITS =====================

export async function getAllVisits() {
  try {
    const res = await adminAuthRequest("", { prefix: "/farm-visits", method: "GET" });
    if (res && Array.isArray(res)) {
      return res.map(v => ({
        ...v,
        enroll: v.DoctorEnrollID,
        intEnroll: v.DoctorEnrollID,
        name_of_doctor: v.DoctorName,
        zone: v.ZoneName,
        strFirmType: v.FarmType,
        date: v.VisitDate ? v.VisitDate.split('T')[0] : null,
        strDate: v.VisitDate ? v.VisitDate.split('T')[0] : null,
        week: v.WeekNumber,
        intWeek: v.WeekNumber,
        intVisitTarget: v.VisitTargetTotal,
        intNewVisitTarget: v.NewVisitTarget,
        intRepVisitTarget: v.RepVisitTarget,
        intProblemSolveTarget: v.ProblemSolveTarget,
        intNewFirmOnboardTarget: v.NewFarmOnboardTarget,
        strMortality: v.MortalityLevel,
        strFeedQuality: v.FeedQuality,
        strDisease: v.DiseaseObserved,
        intRetention: v.RepeatCustomerRetention,
        salesMT: v.SalesInfluencedMT,
        salesCr: v.SalesInfluencedCrore,
        strAchievement: v.Achievement,
        strChallenges: v.Challenges,
        strNextPlan: v.NextWeekPlan
      }));
    }
    return [];
  } catch (e) {
    console.warn("getAllVisits failed:", e);
    return [];
  }
}

export async function saveVisit(data) {
  const payload = {
    DoctorID: Number(data.enroll),
    FarmID: Number(data.FarmID || 50001),
    UserID: Number(data.UserID || 1),
    DoctorEnrollID: Number(data.enroll),
    DoctorName: data.name_of_doctor || "",
    ZoneName: data.zone || "",
    ZoneCode: "101",
    VisitDate: data.date || new Date().toISOString().split("T")[0],
    WeekNumber: Number(data.week || 1),
    Specialization: "Broiler", // "Poultry" was invalid, defaulting to "Broiler"
    FarmType: data.strFirmType || "Broiler",
    ActiveFarmsBroiler: 0,
    ActiveFarmsLayer: 0,
    ActiveFarmsSonali: 0,
    ActiveFarmsTotal: 0,
    UnderService: 0,
    VisitTargetTotal: Number(data.intVisitTarget || 0),
    VisitAchievedTotal: Number(data.intVisitTarget || 0),
    NewVisitTarget: Number(data.intNewVisitTarget || 0),
    NewVisitAchieved: Number(data.intNewVisitTarget || 0),
    RepVisitTarget: Number(data.intRepVisitTarget || 0),
    RepVisitAchieved: Number(data.intRepVisitTarget || 0),
    ProblemSolveTarget: Number(data.intProblemSolveTarget || 0),
    ProblemSolvedAchieved: Number(data.intProblemSolveTarget || 0),
    NewFarmOnboardTarget: Number(data.intNewFirmOnboardTarget || 0),
    NewFarmOnboardBroiler: 0,
    NewFarmOnboardLayer: 0,
    NewFarmOnboardSonali: 0,
    NewFarmOnboardBeef: 0,
    NewFarmOnboardDairy: 0,
    NewFarmOnboardMixed: 0,
    NewFarmOnboardFish: "0",
    SalesInfluencedMT: Number(data.salesMT || 0),
    SalesInfluencedCrore: Number(data.salesCr || 0),
    SalesInfluencedTarget: 0,
    FarmConversionMT: 0,
    FarmConversionCrore: 0,
    MortalityBroiler: 0,
    MortalityLayer: 0,
    MortalitySonali: 0,
    MortalityBeef: 0,
    MortalityDairy: 0,
    MortalityMixed: 0,
    MortalityFish: "0",
    MortalityLevel: data.strMortality || "Low",
    RepeatCustomerRetention: Number(data.intRetention || 0),
    ComplaintReceived: 0,
    ComplaintClosure: 0,
    FeedQuality: data.strFeedQuality || "Good",
    FeedIntake: "Normal",
    DiseaseStatus: "Healthy",
    DiseaseObserved: data.strDisease || "None",
    MainIssues: "None",
    NewProductUpdate: "None",
    Achievement: data.strAchievement || "",
    Challenges: data.strChallenges || "",
    NextWeekPlan: data.strNextPlan || "",
    IsDeleted: false
  };

  return await adminAuthRequest("", {
    prefix: "/farm-visits",
    method: "POST",
    body: JSON.stringify(payload)
  });
}


// ===================== COMPLAINTS =====================

export async function getAllComplaints() {
  const endpoints = ["/all", "/list", "/search?q=%25&limit=1000", ""];
  console.log("API: getAllComplaints starting search across endpoints (preferring /all)...");

  let combinedData = [];
  const seenIds = new Set();

  for (const ep of endpoints) {
    try {
      const res = await adminAuthRequest(ep, { prefix: "/complaints", method: "GET" });
      if (!res) continue;

      const list = res.data || res.Data || res.payload || res.Payload || res.complaints || res.Complaints || (Array.isArray(res) ? res : null);

      if (list && Array.isArray(list)) {
        console.log(`API: getAllComplaints found ${list.length} records on ${ep || 'base'}`);
        list.forEach(item => {
          const id = item.intAutoID || item.ComplaintID || item.id || Math.random();
          if (!seenIds.has(id)) {
            seenIds.add(id);
            combinedData.push(item);
          }
        });
      }
    } catch (e) {
      console.warn(`API: getAllComplaints for ${ep || 'base'} failed:`, e.message);
    }
  }

  // Also try explicitly fetching resolved ones if there's a pattern
  const filterEndpoints = ["/all?IsActive=0", "/all?Status=Resolved", "/all?IsActive=false"];
  for (const fep of filterEndpoints) {
    try {
      const res = await adminAuthRequest(fep, { prefix: "/complaints", method: "GET" });
      const list = res.data || res.Data || res.payload || res.Payload || res.complaints || res.Complaints || (Array.isArray(res) ? res : null);
      if (list && Array.isArray(list)) {
        console.log(`API: getAllComplaints found ${list.length} records on filter ${fep}`);
        list.forEach(item => {
          const id = item.intAutoID || item.ComplaintID || item.id || Math.random();
          if (!seenIds.has(id)) {
            seenIds.add(id);
            combinedData.push(item);
          }
        });
      }
    } catch (e) {}
  }

  if (combinedData.length > 0) {
    console.log("API: getAllComplaints total combined count:", combinedData.length);
    const resolvedCount = combinedData.filter(c =>
      c.IsActive === false || c.IsActive === 0 || c.IsActive === '0' ||
      String(c.IsActive).toLowerCase() === 'false' ||
      c.Status === "Resolved" || (c.Resolution && c.Resolution !== "")
    ).length;
    console.log("API: Combined list contains", resolvedCount, "resolved items");
    return combinedData;
  }

  console.warn("API: getAllComplaints failed on all known endpoints.");
  return [];
}

export async function getComplaintRootCauses() {
  return await adminAuthRequest("/root-causes", { prefix: "/complaints", method: "GET" });
}

export async function saveComplaint(data) {
  const payload = {
    ComplaintDate: data.dtReported || new Date().toISOString().split("T")[0],
    DoctorID: Number(data.intEnroll),
    DoctorName: data.strDoctorName || "",
    ZoneName: data.strZoneName || null,
    FarmTypeName: data.strFarmType || null,
    FarmID: Number(data.FarmID || 0),
    ComplaintSegment: data.strSegment || null,
    ComplaintType: data.strCategory || null,
    Category: data.strCategory || null,
    ComplaintName: data.strComplaint || null,
    Subject: data.strComplaint || null,
    RootCause: data.strRootCause || null,
    ComplaintDescription: data.strDescription || null,
    Description: data.strDescription || null,
    OpenDate: data.dtReported ? `${data.dtReported}T00:00:00` : new Date().toISOString(),
    IsActive: 1,
    Is_Active: 1,
    CreatedBy: Number(data.intEnroll),
    RaisedByUserID: Number(data.intEnroll),
    RaisedByName: data.strDoctorName || "",
    Status: "Open",
    Priority: "Medium"
  };

  console.log("API: saveComplaint payload:", payload);

  try {
    // Try base endpoint first (like visits)
    return await adminAuthRequest("", {
      prefix: "/complaints",
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn("API: saveComplaint base failed, trying /create:", e);
    return await adminAuthRequest("/create", {
      prefix: "/complaints",
      method: "POST",
      body: JSON.stringify({ ...payload, ComplaintID: data.id || `COMP${Date.now()}` }),
    });
  }
}

export async function updateComplaint(id, data) {
  // Map resolution to 'Resolution' (capitalized) and set IsActive to 0 (resolved)
  // Some APIs use 'Resolution' while others use 'resolve'
  const payload = {
    ...data,
    Status: "Resolved", // Add explicit status update
    IsActive: 0,        // Ensure it's numeric 0
    Is_Active: 0,
  };

  if (data.resolution !== undefined) {
    payload.Resolution = data.resolution;
    payload.resolve = data.resolution;
    delete payload.resolution;
  }

  console.log(`API: updateComplaint starting for ID ${id}...`);

  try {
    // 1. First, fetch ALL complaints to find the record and its correct primary key
    const all = await getAllComplaints();
    const found = all.find(c => c.ComplaintID === id || c.id === id || String(c.ComplaintID).includes(String(id).replace(/^\D+/g, '')));

    if (!found) {
      console.warn("API: Could not find complaint in the list to identify its primary key.");
    } else {
      console.log("API: Found complaint record for update:", found);

      // 2. Try every potential ID field found in the record
      // The error "Input should be a valid integer" suggests it wants a numeric primary key
      const keysToTry = [];
      // Prioritize intAutoID based on user logs
      const internalIds = [found.intAutoID, found.auto_id, found.id, found.StatusID, found.ComplaintID]
        .filter(v => v !== undefined && v !== null && !isNaN(v));

      for (const nid of internalIds) {
        keysToTry.push(`/update/${nid}`);
        keysToTry.push(`/edit/${nid}`);
        keysToTry.push(`/${nid}`);
      }

      console.log("API: Update paths to try based on record:", keysToTry);

      for (const endpoint of keysToTry) {
        try {
          // Try both PUT and PATCH as some APIs are picky
          for (const method of ["PUT", "PATCH"]) {
            try {
              const res = await adminAuthRequest(endpoint, {
                prefix: "/complaints",
                method,
                body: JSON.stringify({ ...payload, intAutoID: found.intAutoID, ComplaintID: found.ComplaintID }),
              });
              console.log(`API: updateComplaint success using ${method} at ${endpoint}`);
              return res;
            } catch (innerErr) {
              if (method === "PATCH") throw innerErr;
            }
          }
        } catch (e) {
          console.warn(`API: updateComplaint failed at ${endpoint}:`, e.message);
        }
      }

      // 3. Try sending ID in body to a generic update endpoint
      try {
        const res = await adminAuthRequest("/update", {
          prefix: "/complaints",
          method: "POST",
          body: JSON.stringify({ ...payload, intAutoID: found.intAutoID, ComplaintID: found.ComplaintID }),
        });
        console.log("API: updateComplaint success using POST to /update");
        return res;
      } catch (e) {}
    }

    // 4. Last resort fallbacks with the original ID
    const fallbacks = [`/update/${id}`, `/edit/${id}`, `/${id}`];
    for (const fb of fallbacks) {
      try {
        const res = await adminAuthRequest(fb, {
          prefix: "/complaints",
          method: "PUT",
          body: JSON.stringify(payload),
        });
        console.log(`API: updateComplaint success on fallback ${fb}`);
        return res;
      } catch (err) {}
    }

    throw new Error(`Server did not recognize complaint ID: ${id}. Verified intAutoID was ${found?.intAutoID}.`);
  } catch (globalErr) {
    console.error("API: updateComplaint terminal failure:", globalErr.message);
    throw globalErr;
  }
}

// ===================== AUTH =====================

export async function registerUser(data) {
  // Defensive mapping to ensure keys match backend requirement exactly
  const payload = {
    EnrollID: Number(data.enrollId || data.EnrollID || 0),
    Username: String(data.username || data.Username || ""),
    FullName: String(data.fullName || data.FullName || ""),
    Password: String(data.password || data.Password || ""),
    ZoneName: String(data.zoneName || data.ZoneName || "HQ"),
  };

  // Local validation to catch "field required" before the server does
  if (!payload.Username) throw new Error("Username is required for registration");
  if (!payload.FullName) throw new Error("Full Name is required for registration");
  if (!payload.Password) throw new Error("Password is required for registration");

  return await adminAuthRequest("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser({ enrollId, password }) {
  // Per provided curl: JSON POST to /auth/login
  return await authRequest("/login", {
    method: "POST",
    body: JSON.stringify({
      Username: String(enrollId),
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

export async function getUserProfile(enrollId, token = null) {
  const options = {
    method: "GET",
  };
  if (token) {
    options.headers = { "Authorization": `Bearer ${token}` };
  }
  return await authRequest(`/profile?EnrollID=${enrollId}`, options);
}

export async function createDatabaseUser({ enrollId, username, fullName, password, zoneName, phone }) {
  return await authRequest("/create-user", {
    prefix: "/auth-farm",
    method: "POST",
    body: JSON.stringify({
      EnrollID: Number(enrollId),
      Username: username,
      FullName: fullName,
      Password: password,
      Role: "FieldUser",
      ZoneName: zoneName || "HQ",
      Phone: phone || null,
    }),
  });
}

export async function logoutUser(enrollId) {
  return await authRequest(`/logout?EnrollID=${enrollId}`, {
    method: "POST",
  });
}

export async function getSettingsZones() {
  return await adminAuthRequest("/zones", { prefix: "/settings", method: "GET" });
}

export async function getSettingsFarmTypes() {
  return await adminAuthRequest("/farm-types", { prefix: "/settings", method: "GET" });
}

export function calcWeek(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstDay.getDay() + 1) / 7);
}
