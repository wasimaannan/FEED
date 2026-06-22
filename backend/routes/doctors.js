 // backend/routes/doctors.js
const express = require("express");
const router  = express.Router();
const Doctor  = require("../models/Doctor");

// GET /api/doctors — get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ intEnroll: 1 });
    res.json({ success: true, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/doctors/:enroll — get one doctor by enroll ID
router.get("/:enroll", async (req, res) => {
  try {
    const doc = await Doctor.findOne({ intEnroll: Number(req.params.enroll) });
    if (!doc) return res.status(404).json({ success: false, error: "Doctor not found" });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/doctors — create or update a doctor (upsert by intEnroll)
router.post("/", async (req, res) => {
  try {
    const { intEnroll, strDoctorName, strZone } = req.body;

    if (!intEnroll || !strDoctorName || !strZone) {
      return res.status(400).json({
        success: false,
        error: "intEnroll, strDoctorName and strZone are required",
      });
    }

    const doc = await Doctor.findOneAndUpdate(
      { intEnroll: Number(intEnroll) },
      { strDoctorName: strDoctorName.trim(), strZone: strZone.trim() },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
