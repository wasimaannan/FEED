// backend/routes/visits.js
const express = require("express");
const router  = express.Router();
const Visit   = require("../models/Visit");

// GET /api/visits — all visits
router.get("/", async (req, res) => {
  try {
    const visits = await Visit.find().sort({ createdAt: -1 });
    res.json({ success: true, data: visits });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/visits/:enroll — all visits for one doctor
router.get("/:enroll", async (req, res) => {
  try {
    const visits = await Visit.find({ enroll: Number(req.params.enroll) }).sort({ createdAt: -1 });
    res.json({ success: true, data: visits });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/visits — always insert a new visit entry row
router.post("/", async (req, res) => {
  try {
    const {
      enroll, name_of_doctor, zone, strFirmType,
      date, week,
      intVisitTarget, intNewVisitTarget, intRepVisitTarget,
      intProblemSolveTarget, intNewFirmOnboardTarget,
    } = req.body;

    if (!enroll || !date || !week) {
      return res.status(400).json({ success: false, error: "enroll, date and week are required" });
    }

    // Business rule: sub-targets must not exceed total visit target
    const subTotal = (Number(intNewVisitTarget) || 0)
                   + (Number(intRepVisitTarget)  || 0)
                   + (Number(intProblemSolveTarget) || 0);
    const total = Number(intVisitTarget) || 0;

    if (total > 0 && subTotal > total) {
      return res.status(400).json({
        success: false,
        error: `New + Rep + Problem (${subTotal}) exceeds Visit Target (${total})`,
      });
    }

    const visit = await Visit.create({
      enroll:                  Number(enroll),
      name_of_doctor:          name_of_doctor || "",
      zone:                    zone           || "",
      strFirmType:             strFirmType    || "",
      date:                    new Date(date),
      week:                    Number(week),
      intVisitTarget:          total,
      intNewVisitTarget:       Number(intNewVisitTarget)       || 0,
      intRepVisitTarget:       Number(intRepVisitTarget)       || 0,
      intProblemSolveTarget:   Number(intProblemSolveTarget)   || 0,
      intNewFirmOnboardTarget: Number(intNewFirmOnboardTarget) || 0,
    });

    res.json({ success: true, data: visit });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
