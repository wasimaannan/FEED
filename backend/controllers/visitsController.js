const { pool } = require("../config/db");

// ================= GET ALL VISITS =================

exports.getVisits = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT
        VisitID,
        DoctorID,
        FarmID,
        UserID,
        DoctorEnrollID,
        DoctorName,
        ZoneName,
        ZoneCode,
        VisitDate,
        WeekNumber,
        Specialization,
        FarmType,
        ActiveFarmsBroiler,
        ActiveFarmsLayer,
        ActiveFarmsSonali,
        ActiveFarmsTotal,
        UnderService,
        VisitTargetTotal,
        VisitAchievedTotal,
        NewVisitTarget,
        NewVisitAchieved,
        RepVisitTarget,
        RepVisitAchieved,
        ProblemSolveTarget,
        ProblemSolvedAchieved,
        NewFarmOnboardTarget,
        NewFarmOnboardBroiler,
        NewFarmOnboardLayer,
        NewFarmOnboardSonali,
        NewFarmOnboardBeef,
        NewFarmOnboardDairy,
        NewFarmOnboardMixed,
        NewFarmOnboardFish,
        SalesInfluencedMT,
        SalesInfluencedCrore,
        SalesInfluencedTarget,
        FarmConversionMT,
        FarmConversionCrore,
        MortalityBroiler,
        MortalityLayer,
        MortalitySonali,
        MortalityBeef,
        MortalityDairy,
        MortalityMixed,
        MortalityFish,
        MortalityLevel,
        RepeatCustomerRetention,
        ComplaintReceived,
        ComplaintClosure,
        FeedQuality,
        FeedIntake,
        DiseaseStatus,
        DiseaseObserved,
        MainIssues,
        NewProductUpdate,
        Achievement,
        Challenges,
        NextWeekPlan,
        IsDeleted,
        CreatedAt
      FROM farm.VisitTransactions
      ORDER BY VisitDate DESC
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

// ================= CREATE VISIT =================

exports.createVisit = async (req, res) => {
  try {

    const data = req.body;

    const columns = Object.keys(data).join(", ");
    const params = Object.keys(data).map(k => `@${k}`).join(", ");

    const request = pool.request();

    Object.entries(data).forEach(([key, value]) => {
      request.input(key, value);
    });

    await request.query(`
      INSERT INTO farm.VisitTransactions
      (${columns}, IsDeleted, CreatedAt)
      VALUES
      (${params}, 0, GETDATE())
    `);

    res.status(201).json({
      success: true,
      message: "Visit created successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ================= UPDATE VISIT =================

exports.updateVisit = async (req, res) => {
  try {

    const visitId = req.params.id;
    const data = req.body;

    const request = pool.request();
    request.input("VisitID", visitId);

    const updates = [];

    Object.entries(data).forEach(([key, value]) => {
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

    await pool.request()
      .input("VisitID", req.params.id)
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