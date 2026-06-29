const { pool } = require("../config/db");

exports.getFarms = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT
        FarmID,
        DoctorID,
        FarmName,
        OwnerName,
        FarmType,
        ZoneName,
        Address,
        Phone,
        ActiveFarmCount,
        UnderServiceCount,
        CapacityBirds,
        Status,
        OnboardedAt
      FROM farm.Farms
      ORDER BY FarmName
    `);

    res.json({
      success: true,
      count: result.recordset.length,
      data: result.recordset,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.getFarmById = async (req, res) => {
  try {

    const result = await pool
      .request()
      .input("FarmID", req.params.id)
      .query(`
        SELECT *
        FROM farm.Farms
        WHERE FarmID = @FarmID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Farm not found",
      });
    }

    res.json({
      success: true,
      data: result.recordset[0],
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};