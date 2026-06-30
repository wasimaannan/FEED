const { pool } = require("../config/db");

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

// GET all doctors
exports.getDoctors = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT
        DoctorID,
        EnrollID,
        EnrollID AS intEnroll,
        FullName,
        FullName AS strDoctorName,
        Specialization,
        Specialization AS strSpecialization,
        ZoneName,
        ZoneName AS strZone,
        ServiceTarget,
        IsActive
      FROM farm.Doctors
      ORDER BY FullName
    `);

    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// GET doctor by EnrollID
exports.getDoctorById = async (req, res) => {
  try {
    const enroll = req.params.id;

    const result = await pool
      .request()
      .input("EnrollID", enroll)
      .query(`
        SELECT
          DoctorID,
          EnrollID,
          EnrollID AS intEnroll,
          FullName,
          FullName AS strDoctorName,
          Specialization,
          Specialization AS strSpecialization,
          ZoneName,
          ZoneName AS strZone,
          ServiceTarget,
          IsActive
        FROM farm.Doctors
        WHERE EnrollID = @EnrollID
      `);

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        error: "Doctor not found",
      });
    }

    res.json({
      success: true,
      data: result.recordset[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// CREATE doctor
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

    // Map input Specialization choice to valid external API specialization ('Poultry', 'Cattle', 'Fish')
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

    // Resolve ZoneID dynamically
    let ZoneID = 0;
    try {
      const zonesRes = await fetch("https://arlapi.ibos.io/api/v1/settings/zones");
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

    // Static mapping fallback if dynamic resolve failed
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
        "accept": "application/json"
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


// UPDATE doctor
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

    // Map input Specialization choice to valid external API specialization ('Poultry', 'Cattle', 'Fish')
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

    // Resolve ZoneID dynamically
    let ZoneID = 0;
    try {
      const zonesRes = await fetch("https://arlapi.ibos.io/api/v1/settings/zones");
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

    // Static mapping fallback if dynamic resolve failed
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
        "accept": "application/json"
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


// DELETE doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const result = await pool.request()
      .input("EnrollID", req.params.id)
      .query(`
        DELETE FROM farm.Doctors
        WHERE EnrollID=@EnrollID
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        error: "Doctor not found",
      });
    }

    res.json({
      success: true,
      message: "Doctor deleted successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};