// backend/routes/farms.js
const express = require("express");
const router  = express.Router();
const Farm    = require("../models/Farm");

// GET /api/farms — all farms
router.get("/", async (req, res) => {
  try {
    const farms = await Farm.find().sort({ enroll: 1 });
    res.json({ success: true, data: farms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/farms/:enroll — all farm records for one doctor
router.get("/:enroll", async (req, res) => {
  try {
    const farms = await Farm.find({ enroll: Number(req.params.enroll) });
    if (!farms.length) {
      return res.status(404).json({ success: false, error: "No farm records found for this Enrol ID" });
    }
    res.json({ success: true, data: farms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/farms — create or update farm record (upsert by enroll+strFirmType)
router.post("/", async (req, res) => {
  try {
    const {
      enroll, name_of_doctor, zone, strFirmType,
      intActiveFarm, intUnderService, intUnderServiceTarget,
    } = req.body;

    if (!enroll || !strFirmType) {
      return res.status(400).json({ success: false, error: "enroll and strFirmType are required" });
    }

    // Business rule: under service cannot exceed active farms
    if (intActiveFarm > 0 && intUnderService > intActiveFarm) {
      return res.status(400).json({
        success: false,
        error: `Under Service (${intUnderService}) cannot exceed Active Farms (${intActiveFarm})`,
      });
    }
    if (intActiveFarm > 0 && intUnderServiceTarget > intActiveFarm) {
      return res.status(400).json({
        success: false,
        error: `Under Service Target (${intUnderServiceTarget}) cannot exceed Active Farms (${intActiveFarm})`,
      });
    }

    const farm = await Farm.findOneAndUpdate(
      { enroll: Number(enroll), strFirmType: strFirmType.trim() },
      {
        name_of_doctor: name_of_doctor || "",
        zone: zone || "",
        intActiveFarm:         Number(intActiveFarm)         || 0,
        intUnderService:       Number(intUnderService)       || 0,
        intUnderServiceTarget: Number(intUnderServiceTarget) || 0,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: farm });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
