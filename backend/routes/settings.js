// backend/routes/settings.js
const express = require("express");
const router = express.Router();

router.get("/zones", async (req, res) => {
  try {
    const response = await fetch("https://arlapi.ibos.io/api/v1/settings/zones");
    if (!response.ok) {
      throw new Error(`Failed to fetch zones: ${response.statusText}`);
    }
    const json = await response.json();
    res.json({ success: true, data: json });
  } catch (err) {
    console.error("Error fetching zones settings:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/farm-types", async (req, res) => {
  try {
    const response = await fetch("https://arlapi.ibos.io/api/v1/settings/farm-types");
    if (!response.ok) {
      throw new Error(`Failed to fetch farm types: ${response.statusText}`);
    }
    const json = await response.json();
    res.json({ success: true, data: json });
  } catch (err) {
    console.error("Error fetching farm types settings:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
