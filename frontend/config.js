// src/config.js
const DEV_IP = '10.10.4.82'  // ← your Mac's IP from

export const API_URL = __DEV__
  ? `http://${DEV_IP}:3001/api`
  : 'https://your-app.railway.app/api';