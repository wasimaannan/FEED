const { pool } = require("../config/db");

exports.getVisits = async (req, res) => {

  try {

    const result = await pool.request().query(`
      SELECT *
      FROM farm.VisitTransactions
      ORDER BY VisitDate DESC
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

exports.getVisitById = async (req, res) => {

  try {

    const result = await pool
      .request()
      .input("VisitID", req.params.id)
      .query(`
        SELECT *
        FROM farm.VisitTransactions
        WHERE VisitID=@VisitID
      `);

    if (result.recordset.length === 0) {
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

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }

};