const { pool } = require("../config/db");

// GET all doctors
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
          FullName,
          Specialization,
          ZoneName,
          Region,
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
    const {
      EnrollID,
      FullName,
      Specialization,
      ZoneName,
      Region,
      ServiceTarget,
      IsActive,
    } = req.body;

    await pool.request()
      .input("EnrollID", EnrollID)
      .input("FullName", FullName)
      .input("Specialization", Specialization)
      .input("ZoneName", ZoneName)
      .input("Region", Region || null)
      .input("ServiceTarget", ServiceTarget || 0)
      .input("IsActive", IsActive ?? true)
      .query(`
        INSERT INTO farm.Doctors
        (
          EnrollID,
          FullName,
          Specialization,
          ZoneName,
          Region,
          ServiceTarget,
          IsActive
        )
        VALUES
        (
          @EnrollID,
          @FullName,
          @Specialization,
          @ZoneName,
          @Region,
          @ServiceTarget,
          @IsActive
        )
      `);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
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

    const {
      FullName,
      Specialization,
      ZoneName,
      Region,
      ServiceTarget,
      IsActive,
    } = req.body;

    const result = await pool.request()
      .input("EnrollID", enroll)
      .input("FullName", FullName)
      .input("Specialization", Specialization)
      .input("ZoneName", ZoneName)
      .input("Region", Region || null)
      .input("ServiceTarget", ServiceTarget || 0)
      .input("IsActive", IsActive)
      .query(`
        UPDATE farm.Doctors
        SET
          FullName=@FullName,
          Specialization=@Specialization,
          ZoneName=@ZoneName,
          Region=@Region,
          ServiceTarget=@ServiceTarget,
          IsActive=@IsActive
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
      message: "Doctor updated successfully",
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