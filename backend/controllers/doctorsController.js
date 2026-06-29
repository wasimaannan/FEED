const { pool } = require("../config/db");

exports.getDoctors = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT
        DoctorID,
        EnrollID,
        FullName,
        Specialization,
        ZoneName,
        Region,
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

exports.getDoctorById = async (req, res) => {
  try {
    const result = await pool
      .request()
      .input("DoctorID", req.params.id)
      .query(`
        SELECT
          DoctorID,
          EnrollID,
          FullName,
          Specialization,
          ZoneName,
          Region,
          ServiceTarget,
          IsActive
        FROM farm.Doctors
        WHERE DoctorID = @DoctorID
      `);

    if (result.recordset.length === 0) {
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