const { pool } = require("../config/db");

// ================= GET ALL FARMS =================

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
        OnboardedAt,
        OnboardedByUserID
      FROM farm.Farms
      ORDER BY FarmName
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

// ================= GET FARM BY ID =================

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

    if (!result.recordset.length) {
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

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// ================= CREATE FARM =================

exports.createFarm = async (req, res) => {
  try {

    const {
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
      OnboardedByUserID
    } = req.body;

    await pool
      .request()
      .input("DoctorID", DoctorID)
      .input("FarmName", FarmName)
      .input("OwnerName", OwnerName)
      .input("FarmType", FarmType)
      .input("ZoneName", ZoneName)
      .input("Address", Address)
      .input("Phone", Phone)
      .input("ActiveFarmCount", ActiveFarmCount)
      .input("UnderServiceCount", UnderServiceCount)
      .input("CapacityBirds", CapacityBirds)
      .input("Status", Status)
      .input("OnboardedByUserID", OnboardedByUserID)
      .query(`
        INSERT INTO farm.Farms
        (
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
          OnboardedAt,
          OnboardedByUserID
        )
        VALUES
        (
          @DoctorID,
          @FarmName,
          @OwnerName,
          @FarmType,
          @ZoneName,
          @Address,
          @Phone,
          @ActiveFarmCount,
          @UnderServiceCount,
          @CapacityBirds,
          @Status,
          GETDATE(),
          @OnboardedByUserID
        )
      `);

    res.status(201).json({
      success: true,
      message: "Farm created successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// ================= UPDATE FARM =================

exports.updateFarm = async (req, res) => {
  try {

    const {
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
      Status
    } = req.body;

    await pool
      .request()
      .input("FarmID", req.params.id)
      .input("DoctorID", DoctorID)
      .input("FarmName", FarmName)
      .input("OwnerName", OwnerName)
      .input("FarmType", FarmType)
      .input("ZoneName", ZoneName)
      .input("Address", Address)
      .input("Phone", Phone)
      .input("ActiveFarmCount", ActiveFarmCount)
      .input("UnderServiceCount", UnderServiceCount)
      .input("CapacityBirds", CapacityBirds)
      .input("Status", Status)
      .query(`
        UPDATE farm.Farms
        SET
          DoctorID = @DoctorID,
          FarmName = @FarmName,
          OwnerName = @OwnerName,
          FarmType = @FarmType,
          ZoneName = @ZoneName,
          Address = @Address,
          Phone = @Phone,
          ActiveFarmCount = @ActiveFarmCount,
          UnderServiceCount = @UnderServiceCount,
          CapacityBirds = @CapacityBirds,
          Status = @Status
        WHERE FarmID = @FarmID
      `);

    res.json({
      success: true,
      message: "Farm updated successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// ================= DELETE FARM =================

exports.deleteFarm = async (req, res) => {
  try {

    await pool
      .request()
      .input("FarmID", req.params.id)
      .query(`
        DELETE FROM farm.Farms
        WHERE FarmID = @FarmID
      `);

    res.json({
      success: true,
      message: "Farm deleted successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};