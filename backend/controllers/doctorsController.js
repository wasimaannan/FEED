const { pool } = require("../config/db");

async function getAdminToken() {
  const details = {
    'grant_type': 'password',
    'username': '306007',
    'password': '@dp702UK'
  };
  const formBody = Object.keys(details)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
    .join('&');

  const res = await fetch("https://arlapi.ibos.io/api/v1/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "accept": "application/json"
    },
    body: formBody
  });

  if (!res.ok) {
    throw new Error("Failed to authenticate with external API as administrator");
  }

  const json = await res.json();
  return json.access_token || json.token || json.Token;
}

function getApiErrorMessage(apiJson, fallback) {
  if (apiJson.detail) {
    if (typeof apiJson.detail === "string") {
      return apiJson.detail;
    } else if (Array.isArray(apiJson.detail) && apiJson.detail.length > 0) {
      return apiJson.detail.map(d => d.msg + (d.input ? ` (input: ${d.input})` : "")).join(", ");
    }
  }
  return apiJson.message || apiJson.error || fallback;
}

// GET all/searched doctors from external API
exports.getDoctors = async (req, res) => {
  try {
    const q = req.query.q || " ";
    const limit = req.query.limit || 500;
    const token = await getAdminToken();

    const apiRes = await fetch(`https://arlapi.ibos.io/api/v1/doctors/search?q=${encodeURIComponent(q)}&limit=${limit}`, {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      let apiJson = {};
      try { apiJson = JSON.parse(errText); } catch(e) { apiJson = { message: errText }; }
      throw new Error(getApiErrorMessage(apiJson, "Failed to fetch doctors from external API"));
    }

    const doctorsList = await apiRes.json();

    const mapped = doctorsList.map(d => ({
      DoctorID: d.EnrollID,
      EnrollID: d.EnrollID,
      intEnroll: d.EnrollID,
      FullName: d.FullName,
      strDoctorName: d.FullName,
      Specialization: d.Specialization,
      strSpecialization: d.Specialization,
      ZoneName: d.ZoneName,
      strZone: d.ZoneName,
      ActiveFarm: d.ActiveFarm,
      UnderService: d.UnderService,
      ServiceTarget: d.ServiceTarget,
      IsActive: d.IsActive
    }));

    res.json({
      success: true,
      count: mapped.length,
      data: mapped,
    });

  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// GET doctor by EnrollID from external API
exports.getDoctorById = async (req, res) => {
  try {
    const enroll = req.params.id;
    const token = await getAdminToken();

    const apiRes = await fetch(`https://arlapi.ibos.io/api/v1/doctors/${enroll}`, {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (apiRes.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Doctor not found",
      });
    }

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      let apiJson = {};
      try { apiJson = JSON.parse(errText); } catch(e) { apiJson = { message: errText }; }
      throw new Error(getApiErrorMessage(apiJson, "Failed to fetch doctor by id from external API"));
    }

    const d = await apiRes.json();

    const mapped = {
      DoctorID: d.EnrollID,
      EnrollID: d.EnrollID,
      intEnroll: d.EnrollID,
      FullName: d.FullName,
      strDoctorName: d.FullName,
      Specialization: d.Specialization,
      strSpecialization: d.Specialization,
      ZoneName: d.ZoneName,
      strZone: d.ZoneName,
      ActiveFarm: d.ActiveFarm,
      UnderService: d.UnderService,
      ServiceTarget: d.ServiceTarget,
      IsActive: d.IsActive
    };

    res.json({
      success: true,
      data: mapped,
    });

  } catch (err) {
    console.error("Error fetching doctor by id:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// CREATE doctor via external API
exports.createDoctor = async (req, res) => {
  try {
    const EnrollID = Number(req.body.EnrollID || req.body.intEnroll) || 0;
    const FullName = req.body.FullName || req.body.strDoctorName || "";
    const Specialization = req.body.Specialization || req.body.strSpecialization || "";
    const ZoneName = req.body.ZoneName || req.body.strZone || "";
    const ActiveFarm = req.body.ActiveFarm || (Number(req.body.intBroiler || 0) + Number(req.body.intLayer || 0) + Number(req.body.intCattle || 0) + Number(req.body.intSonali || 0)) || 0;
    const UnderService = req.body.UnderService || req.body.intUnderService || 0;
    const ServiceTarget = req.body.ServiceTarget || req.body.intServiceTarget || 0;
    const IsActive = req.body.IsActive ?? true;
    const CreatedByUserID = req.body.CreatedByUserID || 0;

    let apiSpecialization = Specialization;
    if (Specialization) {
      const specLower = Specialization.toLowerCase();
      if (specLower === "broiler" || specLower === "layer" || specLower === "sonali" || specLower === "poultry") {
        apiSpecialization = "Poultry";
      } else if (specLower === "cattle") {
        apiSpecialization = "Cattle";
      } else if (specLower === "fish") {
        apiSpecialization = "Fish";
      }
    }

    // Resolve ZoneID dynamically using admin token
    let ZoneID = 0;
    const token = await getAdminToken();
    try {
      const zonesRes = await fetch("https://arlapi.ibos.io/api/v1/settings/zones", {
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (zonesRes.ok) {
        const zonesList = await zonesRes.json();
        const match = zonesList.find(z => String(z.Zone || z.ZoneName || "").toLowerCase() === String(ZoneName || "").toLowerCase());
        if (match) {
          ZoneID = match.ZoneID;
        }
      }
    } catch (e) {
      console.warn("Failed to retrieve ZoneID from settings API, using static mapping fallback", e);
    }

    if (!ZoneID && ZoneName) {
      const lower = ZoneName.toLowerCase();
      if (lower.includes("north")) ZoneID = 101;
      else if (lower.includes("central")) ZoneID = 102;
      else if (lower.includes("east")) ZoneID = 103;
      else if (lower.includes("south")) ZoneID = 104;
    }

    const payload = {
      EnrollID,
      FullName,
      Specialization: apiSpecialization,
      ZoneName,
      ZoneID,
      ActiveFarm,
      UnderService,
      ServiceTarget,
      IsActive,
      CreatedByUserID
    };

    const apiRes = await fetch("https://arlapi.ibos.io/api/v1/doctors/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const resText = await apiRes.text();
    let apiJson = {};
    if (resText) {
      try {
        apiJson = JSON.parse(resText);
      } catch (err) {
        apiJson = { message: resText };
      }
    }

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({
        success: false,
        error: getApiErrorMessage(apiJson, "Failed to create doctor via external API")
      });
    }

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: apiJson
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// UPDATE doctor via external API
exports.updateDoctor = async (req, res) => {
  try {
    const enroll = req.params.id;
    const FullName = req.body.FullName || req.body.strDoctorName || "";
    const Specialization = req.body.Specialization || req.body.strSpecialization || "";
    const ZoneName = req.body.ZoneName || req.body.strZone || "";
    const ActiveFarm = req.body.ActiveFarm || (Number(req.body.intBroiler || 0) + Number(req.body.intLayer || 0) + Number(req.body.intCattle || 0) + Number(req.body.intSonali || 0)) || 0;
    const UnderService = req.body.UnderService || req.body.intUnderService || 0;
    const ServiceTarget = req.body.ServiceTarget || req.body.intServiceTarget || 0;
    const IsActive = req.body.IsActive ?? true;

    let apiSpecialization = Specialization;
    if (Specialization) {
      const specLower = Specialization.toLowerCase();
      if (specLower === "broiler" || specLower === "layer" || specLower === "sonali" || specLower === "poultry") {
        apiSpecialization = "Poultry";
      } else if (specLower === "cattle") {
        apiSpecialization = "Cattle";
      } else if (specLower === "fish") {
        apiSpecialization = "Fish";
      }
    }

    // Resolve ZoneID dynamically using admin token
    let ZoneID = 0;
    const token = await getAdminToken();
    try {
      const zonesRes = await fetch("https://arlapi.ibos.io/api/v1/settings/zones", {
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (zonesRes.ok) {
        const zonesList = await zonesRes.json();
        const match = zonesList.find(z => String(z.Zone || z.ZoneName || "").toLowerCase() === String(ZoneName || "").toLowerCase());
        if (match) {
          ZoneID = match.ZoneID;
        }
      }
    } catch (e) {
      console.warn("Failed to retrieve ZoneID from settings API, using static mapping fallback", e);
    }

    if (!ZoneID && ZoneName) {
      const lower = ZoneName.toLowerCase();
      if (lower.includes("north")) ZoneID = 101;
      else if (lower.includes("central")) ZoneID = 102;
      else if (lower.includes("east")) ZoneID = 103;
      else if (lower.includes("south")) ZoneID = 104;
    }

    const payload = {
      FullName,
      Specialization: apiSpecialization,
      ZoneName,
      ZoneID,
      ActiveFarm,
      UnderService,
      ServiceTarget,
      IsActive
    };

    const apiRes = await fetch(`https://arlapi.ibos.io/api/v1/doctors/edit/${enroll}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const resText = await apiRes.text();
    let apiJson = {};
    if (resText) {
      try {
        apiJson = JSON.parse(resText);
      } catch (err) {
        apiJson = { message: resText };
      }
    }

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({
        success: false,
        error: getApiErrorMessage(apiJson, "Failed to update doctor via external API")
      });
    }

    res.json({
      success: true,
      message: "Doctor updated successfully",
      data: apiJson
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// DELETE doctor (Mocked)
exports.deleteDoctor = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Doctor deleted successfully (Mocked)",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};