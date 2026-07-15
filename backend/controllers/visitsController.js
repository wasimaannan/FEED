const { pool } = require("../config/db");
const { getAdminToken } = require("../utils/externalApi");

// ================= FIELD MAPPING HELPERS =================

function mapDbToFrontend(d) {
  return {
    // Standard DB Columns
    VisitID: d.VisitID,
    DoctorID: d.DoctorID,
    FarmID: d.FarmID,
    UserID: d.UserID,
    DoctorEnrollID: d.DoctorEnrollID,
    DoctorName: d.DoctorName,
    ZoneName: d.ZoneName,
    ZoneCode: d.ZoneCode,
    VisitDate: d.VisitDate,
    WeekNumber: d.WeekNumber,
    Specialization: d.Specialization,
    FarmType: d.FarmType,
    ActiveFarmsBroiler: d.ActiveFarmsBroiler,
    ActiveFarmsLayer: d.ActiveFarmsLayer,
    ActiveFarmsSonali: d.ActiveFarmsSonali,
    ActiveFarmsTotal: d.ActiveFarmsTotal,
    UnderService: d.UnderService,
    VisitTargetTotal: d.VisitTargetTotal,
    VisitAchievedTotal: d.VisitAchievedTotal,
    NewVisitTarget: d.NewVisitTarget,
    NewVisitAchieved: d.NewVisitAchieved,
    RepVisitTarget: d.RepVisitTarget,
    RepVisitAchieved: d.RepVisitAchieved,
    ProblemSolveTarget: d.ProblemSolveTarget,
    ProblemSolvedAchieved: d.ProblemSolvedAchieved,
    NewFarmOnboardTarget: d.NewFarmOnboardTarget,
    NewFarmOnboardBroiler: d.NewFarmOnboardBroiler,
    NewFarmOnboardLayer: d.NewFarmOnboardLayer,
    NewFarmOnboardSonali: d.NewFarmOnboardSonali,
    NewFarmOnboardBeef: d.NewFarmOnboardBeef,
    NewFarmOnboardDairy: d.NewFarmOnboardDairy,
    NewFarmOnboardMixed: d.NewFarmOnboardMixed,
    NewFarmOnboardFish: d.NewFarmOnboardFish,
    SalesInfluencedMT: d.SalesInfluencedMT,
    SalesInfluencedCrore: d.SalesInfluencedCrore,
    SalesInfluencedTarget: d.SalesInfluencedTarget,
    FarmConversionMT: d.FarmConversionMT,
    FarmConversionCrore: d.FarmConversionCrore,
    MortalityBroiler: d.MortalityBroiler,
    MortalityLayer: d.MortalityLayer,
    MortalitySonali: d.MortalitySonali,
    MortalityBeef: d.MortalityBeef,
    MortalityDairy: d.MortalityDairy,
    MortalityMixed: d.MortalityMixed,
    MortalityFish: d.MortalityFish,
    MortalityLevel: d.MortalityLevel,
    RepeatCustomerRetention: d.RepeatCustomerRetention,
    ComplaintReceived: d.ComplaintReceived,
    ComplaintClosure: d.ComplaintClosure,
    FeedQuality: d.FeedQuality,
    FeedIntake: d.FeedIntake,
    DiseaseStatus: d.DiseaseStatus,
    DiseaseObserved: d.DiseaseObserved,
    MainIssues: d.MainIssues,
    NewProductUpdate: d.NewProductUpdate,
    Achievement: d.Achievement,
    Challenges: d.Challenges,
    NextWeekPlan: d.NextWeekPlan,
    IsDeleted: d.IsDeleted,
    CreatedAt: d.CreatedAt,

    // Old Frontend Key Mappings (to ensure React Native screens work out-of-the-box)
    enroll: d.DoctorEnrollID,
    intEnroll: d.DoctorEnrollID,
    name_of_doctor: d.DoctorName,
    zone: d.ZoneName,
    strFirmType: d.FarmType,
    date: d.VisitDate ? new Date(d.VisitDate).toISOString().split('T')[0] : null,
    strDate: d.VisitDate ? new Date(d.VisitDate).toISOString().split('T')[0] : null,
    week: d.WeekNumber,
    intWeek: d.WeekNumber,
    intVisitTarget: d.VisitTargetTotal,
    intNewVisitTarget: d.NewVisitTarget,
    intRepVisitTarget: d.RepVisitTarget,
    intProblemSolveTarget: d.ProblemSolveTarget,
    intNewFirmOnboardTarget: d.NewFarmOnboardTarget,
    strMortality: d.MortalityLevel,
    strFeedQuality: d.FeedQuality,
    strDisease: d.DiseaseObserved,
    intRetention: d.RepeatCustomerRetention,
    salesMT: d.SalesInfluencedMT,
    salesCr: d.SalesInfluencedCrore,
    strAchievement: d.Achievement,
    strChallenges: d.Challenges,
    strNextPlan: d.NextWeekPlan
  };
}

// ================= EXTERNAL API SYNC HELPER =================

async function syncVisitsFromExternalApi() {
  try {
    const token = await getAdminToken();
    const res = await fetch("https://arlapi.ibos.io/api/v1/farm-visits", {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.error(`[Sync] Failed to fetch visits from external API: ${res.statusText}`);
      return;
    }

    const visits = await res.json();
    console.log(`[Sync] Fetched ${visits.length} visits from external API.`);

    for (const visit of visits) {
      // Check if this VisitID already exists in local DB
      const checkRes = await pool.request()
        .input("VisitID", visit.VisitID)
        .query("SELECT VisitID FROM farm.VisitTransactions WHERE VisitID = @VisitID");

      if (checkRes.recordset.length === 0) {
        console.log(`[Sync] Inserting missing VisitID ${visit.VisitID} into VisitTransactions...`);

        const dbFields = {
          VisitID: visit.VisitID,
          DoctorID: visit.DoctorID,
          FarmID: visit.FarmID,
          UserID: visit.UserID,
          DoctorEnrollID: visit.DoctorEnrollID,
          DoctorName: visit.DoctorName,
          ZoneName: visit.ZoneName,
          ZoneCode: visit.ZoneCode ? Number(visit.ZoneCode) : null,
          VisitDate: visit.VisitDate ? new Date(visit.VisitDate) : null,
          WeekNumber: visit.WeekNumber,
          Specialization: visit.Specialization,
          FarmType: visit.FarmType,
          ActiveFarmsBroiler: visit.ActiveFarmsBroiler,
          ActiveFarmsLayer: visit.ActiveFarmsLayer,
          ActiveFarmsSonali: visit.ActiveFarmsSonali,
          ActiveFarmsTotal: visit.ActiveFarmsTotal,
          UnderService: visit.UnderService,
          VisitTargetTotal: visit.VisitTargetTotal,
          VisitAchievedTotal: visit.VisitAchievedTotal,
          NewVisitTarget: visit.NewVisitTarget,
          NewVisitAchieved: visit.NewVisitAchieved,
          RepVisitTarget: visit.RepVisitTarget,
          RepVisitAchieved: visit.RepVisitAchieved,
          ProblemSolveTarget: visit.ProblemSolveTarget,
          ProblemSolvedAchieved: visit.ProblemSolvedAchieved,
          NewFarmOnboardTarget: visit.NewFarmOnboardTarget,
          NewFarmOnboardBroiler: visit.NewFarmOnboardBroiler,
          NewFarmOnboardLayer: visit.NewFarmOnboardLayer,
          NewFarmOnboardSonali: visit.NewFarmOnboardSonali,
          NewFarmOnboardBeef: visit.NewFarmOnboardBeef,
          NewFarmOnboardDairy: visit.NewFarmOnboardDairy,
          NewFarmOnboardMixed: visit.NewFarmOnboardMixed,
          NewFarmOnboardFish: visit.NewFarmOnboardFish ? String(visit.NewFarmOnboardFish) : null,
          SalesInfluencedMT: visit.SalesInfluencedMT,
          SalesInfluencedCrore: visit.SalesInfluencedCrore,
          SalesInfluencedTarget: visit.SalesInfluencedTarget,
          FarmConversionMT: visit.FarmConversionMT,
          FarmConversionCrore: visit.FarmConversionCrore,
          MortalityBroiler: visit.MortalityBroiler,
          MortalityLayer: visit.MortalityLayer,
          MortalitySonali: visit.MortalitySonali,
          MortalityBeef: visit.MortalityBeef,
          MortalityDairy: visit.MortalityDairy,
          MortalityMixed: visit.MortalityMixed,
          MortalityFish: visit.MortalityFish ? String(visit.MortalityFish) : null,
          MortalityLevel: visit.MortalityLevel,
          RepeatCustomerRetention: visit.RepeatCustomerRetention,
          ComplaintReceived: visit.ComplaintReceived,
          ComplaintClosure: visit.ComplaintClosure,
          FeedQuality: visit.FeedQuality,
          FeedIntake: visit.FeedIntake,
          DiseaseStatus: visit.DiseaseStatus,
          DiseaseObserved: visit.DiseaseObserved,
          MainIssues: visit.MainIssues,
          NewProductUpdate: visit.NewProductUpdate,
          Achievement: visit.Achievement,
          Challenges: visit.Challenges,
          NextWeekPlan: visit.NextWeekPlan,
          IsDeleted: visit.IsDeleted ? 1 : 0,
          CreatedAt: visit.CreatedAt ? new Date(visit.CreatedAt) : new Date()
        };

        const reqInsert = pool.request();
        const cols = [];
        const vals = [];
        
        Object.entries(dbFields).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            cols.push(k);
            vals.push(`@${k}`);
            reqInsert.input(k, v);
          }
        });

        try {
          const insertQuery = `
            SET IDENTITY_INSERT farm.VisitTransactions ON;
            INSERT INTO farm.VisitTransactions (${cols.join(", ")})
            VALUES (${vals.join(", ")});
            SET IDENTITY_INSERT farm.VisitTransactions OFF;
          `;
          await reqInsert.query(insertQuery);
        } catch (insertErr) {
          console.warn(`[Sync] Failed to insert VisitID ${visit.VisitID} locally:`, insertErr.message);
        }
      }
    }
    console.log("[Sync] Visits sync completed.");
  } catch (err) {
    console.error("[Sync] Error syncing visits:", err);
  }
}

// ================= GET ALL VISITS =================

exports.getVisits = async (req, res) => {
  try {
    // Run external API synchronization first
    await syncVisitsFromExternalApi();

    const result = await pool.request().query(`
      SELECT *
      FROM farm.VisitTransactions
      WHERE IsDeleted = 0 OR IsDeleted IS NULL
      ORDER BY VisitDate DESC, VisitID DESC
    `);

    const mappedData = result.recordset.map(r => mapDbToFrontend(r));

    res.json({
      success: true,
      count: mappedData.length,
      data: mappedData,
    });

  } catch (err) {
    console.error("Error in getVisits:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= GET VISIT BY ID =================

exports.getVisitById = async (req, res) => {
  try {
    const result = await pool.request()
      .input("VisitID", req.params.id)
      .query(`
        SELECT *
        FROM farm.VisitTransactions
        WHERE VisitID=@VisitID
      `);

    if (!result.recordset.length) {
      return res.status(404).json({
        success: false,
        error: "Visit not found",
      });
    }

    res.json({
      success: true,
      data: mapDbToFrontend(result.recordset[0]),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= CREATE VISIT =================

exports.createVisit = async (req, res) => {
  try {
    const f = req.body;
    const enroll = Number(f.enroll || f.intEnroll || f.DoctorEnrollID || 0);

    // 1. Resolve UserID from local database
    let UserID = null;
    try {
      const userRes = await pool.request()
        .input("EnrollID", enroll)
        .query("SELECT TOP 1 UserID FROM farm.Users WHERE EnrollID = @EnrollID");
      if (userRes.recordset.length > 0) {
        UserID = userRes.recordset[0].UserID;
      }
    } catch (e) {
      console.warn("Could not resolve UserID:", e.message);
    }
    if (!UserID) UserID = 1; // Default fallback

    // 2. Resolve FarmID from local database
    let FarmID = null;
    try {
      const farmRes = await pool.request()
        .input("DoctorID", enroll)
        .query("SELECT TOP 1 FarmID FROM farm.Farms WHERE DoctorID = @DoctorID");
      if (farmRes.recordset.length > 0) {
        FarmID = farmRes.recordset[0].FarmID;
      }
    } catch (e) {
      console.warn("Could not resolve FarmID:", e.message);
    }
    if (!FarmID) FarmID = 50001; // Default fallback

    // 3. Resolve Specialization dynamically
    const Specialization = f.Specialization || "Poultry";

    // 4. Construct payload matching external API's VisitCreateDTO format
    const payload = {
      DoctorID: enroll,
      FarmID: FarmID,
      UserID: UserID,
      DoctorEnrollID: enroll,
      DoctorName: f.name_of_doctor || f.DoctorName || "",
      ZoneName: f.zone || f.ZoneName || "",
      ZoneCode: f.ZoneCode ? String(f.ZoneCode) : "101",
      VisitDate: f.date || f.VisitDate || new Date().toISOString().split("T")[0],
      WeekNumber: Number(f.week || f.WeekNumber || 1),
      Specialization: Specialization,
      FarmType: f.strFirmType || f.FarmType || "Broiler",
      ActiveFarmsBroiler: Number(f.ActiveFarmsBroiler || 0),
      ActiveFarmsLayer: Number(f.ActiveFarmsLayer || 0),
      ActiveFarmsSonali: Number(f.ActiveFarmsSonali || 0),
      ActiveFarmsTotal: Number(f.ActiveFarmsTotal || 0),
      UnderService: Number(f.UnderService || 0),
      VisitTargetTotal: Number(f.intVisitTarget || f.VisitTargetTotal || 0),
      VisitAchievedTotal: Number(f.intVisitTarget || f.VisitAchievedTotal || 0),
      NewVisitTarget: Number(f.intNewVisitTarget || f.NewVisitTarget || 0),
      NewVisitAchieved: Number(f.intNewVisitTarget || f.NewVisitAchieved || 0),
      RepVisitTarget: Number(f.intRepVisitTarget || f.RepVisitTarget || 0),
      RepVisitAchieved: Number(f.intRepVisitTarget || f.RepVisitAchieved || 0),
      ProblemSolveTarget: Number(f.intProblemSolveTarget || f.ProblemSolveTarget || 0),
      ProblemSolvedAchieved: Number(f.intProblemSolveTarget || f.ProblemSolvedAchieved || 0),
      NewFarmOnboardTarget: Number(f.intNewFirmOnboardTarget || f.NewFarmOnboardTarget || 0),
      NewFarmOnboardBroiler: Number(f.NewFarmOnboardBroiler || 0),
      NewFarmOnboardLayer: Number(f.NewFarmOnboardLayer || 0),
      NewFarmOnboardSonali: Number(f.NewFarmOnboardSonali || 0),
      NewFarmOnboardBeef: Number(f.NewFarmOnboardBeef || 0),
      NewFarmOnboardDairy: Number(f.NewFarmOnboardDairy || 0),
      NewFarmOnboardMixed: Number(f.NewFarmOnboardMixed || 0),
      NewFarmOnboardFish: f.NewFarmOnboardFish ? String(f.NewFarmOnboardFish) : "0",
      SalesInfluencedMT: Number(f.salesMT || f.SalesInfluencedMT || 0),
      SalesInfluencedCrore: Number(f.salesCr || f.SalesInfluencedCrore || 0),
      SalesInfluencedTarget: Number(f.SalesInfluencedTarget || 0),
      FarmConversionMT: Number(f.FarmConversionMT || 0),
      FarmConversionCrore: Number(f.FarmConversionCrore || 0),
      MortalityBroiler: Number(f.MortalityBroiler || 0),
      MortalityLayer: Number(f.MortalityLayer || 0),
      MortalitySonali: Number(f.MortalitySonali || 0),
      MortalityBeef: Number(f.MortalityBeef || 0),
      MortalityDairy: Number(f.MortalityDairy || 0),
      MortalityMixed: Number(f.MortalityMixed || 0),
      MortalityFish: f.MortalityFish ? String(f.MortalityFish) : "0",
      MortalityLevel: f.strMortality || f.MortalityLevel || "Low",
      RepeatCustomerRetention: Number(f.intRetention || f.RepeatCustomerRetention || 0),
      ComplaintReceived: Number(f.ComplaintReceived || 0),
      ComplaintClosure: Number(f.ComplaintClosure || 0),
      FeedQuality: f.strFeedQuality || f.FeedQuality || "Good",
      FeedIntake: f.FeedIntake || "Normal",
      DiseaseStatus: f.DiseaseStatus || "Healthy",
      DiseaseObserved: f.strDisease || f.DiseaseObserved || "None",
      MainIssues: f.MainIssues || "None",
      NewProductUpdate: f.NewProductUpdate || "None",
      Achievement: f.strAchievement || f.Achievement || "",
      Challenges: f.strChallenges || f.Challenges || "",
      NextWeekPlan: f.strNextPlan || f.NextWeekPlan || "",
      IsDeleted: f.IsDeleted || false
    };

    // 5. Submit new visit log to external API
    const token = await getAdminToken();
    const apiRes = await fetch("https://arlapi.ibos.io/api/v1/farm-visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      throw new Error(`External API creation failed: ${errText || apiRes.statusText}`);
    }

    const apiJson = await apiRes.json();

    res.status(201).json({
      success: true,
      message: "Visit created successfully",
      data: apiJson
    });

  } catch (err) {
    console.error("Error creating visit:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= UPDATE VISIT =================

exports.updateVisit = async (req, res) => {
  try {
    const visitId = Number(req.params.id);
    const f = req.body;

    const token = await getAdminToken();
    const apiRes = await fetch(`https://arlapi.ibos.io/api/v1/farm-visits/${visitId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(f)
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      throw new Error(`External API update failed: ${errText || apiRes.statusText}`);
    }

    // Update in local DB
    const request = pool.request();
    request.input("VisitID", visitId);

    const updates = [];
    Object.entries(f).forEach(([key, value]) => {
      request.input(key, value);
      updates.push(`${key}=@${key}`);
    });

    await request.query(`
      UPDATE farm.VisitTransactions
      SET ${updates.join(", ")}
      WHERE VisitID=@VisitID
    `);

    res.json({
      success: true,
      message: "Visit updated successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= DELETE VISIT =================

exports.deleteVisit = async (req, res) => {
  try {
    const visitId = Number(req.params.id);

    const token = await getAdminToken();
    const apiRes = await fetch(`https://arlapi.ibos.io/api/v1/farm-visits/${visitId}`, {
      method: "DELETE",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      throw new Error(`External API deletion failed: ${errText || apiRes.statusText}`);
    }

    // Delete in local DB
    await pool.request()
      .input("VisitID", visitId)
      .query(`
        DELETE FROM farm.VisitTransactions
        WHERE VisitID=@VisitID
      `);

    res.json({
      success: true,
      message: "Visit deleted successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};