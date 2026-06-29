const { pool } = require("../config/db");

exports.getComplaints = async (req, res) => {

  try {

    const result = await pool.request().query(`
      SELECT
        ComplaintID,
        RaisedByUserID,
        RaisedByName,
        DoctorID,
        DoctorName,
        FarmID,
        FarmName,
        ZoneName,
        Category,
        Subject,
        Description,
        Priority,
        Status,
        CreatedAt
      FROM farm.Complaints
      ORDER BY CreatedAt DESC
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

exports.getComplaintById = async (req, res) => {

  try {

    const result = await pool
      .request()
      .input("ComplaintID", req.params.id)
      .query(`
        SELECT *
        FROM farm.Complaints
        WHERE ComplaintID=@ComplaintID
      `);

    if (result.recordset.length === 0) {

      return res.status(404).json({
        success: false,
        error: "Complaint not found",
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