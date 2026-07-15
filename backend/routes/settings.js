// backend/routes/settings.js
const express = require("express");
const router = express.Router();

async function getAdminToken() {
  const details = {
    'grant_type': 'password',
    'username': '306007',
    'password': '@dp702UK'
  };
  const formBody = Object.keys(details)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key]))
    .join('&');

  const res = await fetch("https://arlapi.ibos.io/api/v1/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "accept": "application/json"
    },
    body: formBody
  });

  if (!res.ok) {
    throw new Error("Failed to authenticate with external API as administrator");
  }

  const json = await res.json();
  return json.access_token || json.token || json.Token;
}

router.get("/zones", async (req, res) => {
  try {
    const token = await getAdminToken();
    const response = await fetch("https://arlapi.ibos.io/api/v1/settings/zones", {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
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
    const token = await getAdminToken();
    const response = await fetch("https://arlapi.ibos.io/api/v1/settings/farm-types", {
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
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
