const { pool } = require("../config/db");
const { getAdminToken } = require("../utils/externalApi");

// ================= GET ALL COMPLAINTS =================

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

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// ================= GET COMPLAINT BY ID =================

exports.getComplaintById = async (req, res) => {
  try {

    const result = await pool.request()
      .input("ComplaintID", req.params.id)
      .query(`
        SELECT *
        FROM farm.Complaints
        WHERE ComplaintID=@ComplaintID
      `);

    if (!result.recordset.length) {
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

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// ================= CREATE COMPLAINT =================

exports.createComplaint = async (req, res) => {
  try {

    const data = req.body;

    const columns = Object.keys(data).join(", ");
    const params = Object.keys(data).map(key => `@${key}`).join(", ");

    const request = pool.request();

    Object.entries(data).forEach(([key, value]) => {
      request.input(key, value);
    });

    await request.query(`
      INSERT INTO farm.Complaints
      (${columns}, CreatedAt)
      VALUES
      (${params}, GETDATE())
    `);

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// ================= UPDATE COMPLAINT =================

exports.updateComplaint = async (req, res) => {
  try {

    const complaintId = req.params.id;
    const data = req.body;

    const request = pool.request();

    request.input("ComplaintID", complaintId);

    const updates = [];

    Object.entries(data).forEach(([key, value]) => {
      request.input(key, value);
      updates.push(`${key}=@${key}`);
    });

    await request.query(`
      UPDATE farm.Complaints
      SET ${updates.join(", ")}
      WHERE ComplaintID=@ComplaintID
    `);

    res.json({
      success: true,
      message: "Complaint updated successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// ================= DELETE COMPLAINT =================

exports.deleteComplaint = async (req, res) => {
  try {

    await pool.request()
      .input("ComplaintID", req.params.id)
      .query(`
        DELETE FROM farm.Complaints
        WHERE ComplaintID=@ComplaintID
      `);

    res.json({
      success: true,
      message: "Complaint deleted successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};

// ================= GET ROOT CAUSES FROM EXTERNAL API =================

exports.getRootCauses = async (req, res) => {
  try {
    const token = await getAdminToken();
    const response = await fetch("https://arlapi.ibos.io/api/v1/complaints/root-causes", {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch root causes: ${response.statusText}`);
    }
    const json = await response.json();
    res.json(json);
  } catch (err) {
    console.error("Error fetching root causes:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};