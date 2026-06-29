const { pool } = require("../config/db");

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT
        UserID,
        Username,
        FullName,
        Role,
        ZoneName,
        Phone,
        IsActive,
        EnrollID
      FROM farm.Users
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

exports.getUserById = async (req, res) => {
  try {
    const result = await pool
      .request()
      .input("UserID", req.params.id)
      .query(`
        SELECT
          UserID,
          Username,
          FullName,
          Role,
          ZoneName,
          Phone,
          IsActive,
          EnrollID
        FROM farm.Users
        WHERE UserID = @UserID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
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