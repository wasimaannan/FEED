require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { poolConnect } = require("./config/db");
const doctorsRouter = require("./routes/doctors");
const farmsRouter = require("./routes/farms");
const visitsRouter = require("./routes/visits");
const usersRouter = require("./routes/users");
const complaintsRouter = require("./routes/complaints");
const settingsRouter = require("./routes/settings");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "FEED API is running",
    time: new Date().toISOString(),
  });
});

// Generic Proxy Handler to forward authentication and other external routes
const proxyRequest = (targetBaseUrl) => {
  return async (req, res) => {
    try {
      const url = `${targetBaseUrl}${req.path}`;
      const method = req.method;
      const headers = { ...req.headers };
      
      // Prevent host header from causing TLS/SSL handshake validation errors
      delete headers.host;
      
      const options = {
        method,
        headers,
      };

      if (method !== "GET" && method !== "HEAD") {
        options.body = JSON.stringify(req.body);
        options.headers["content-type"] = "application/json";
      }

      if (!options.headers["accept"]) {
        options.headers["accept"] = "application/json";
      }

      const queryStr = new URLSearchParams(req.query).toString();
      const finalUrl = queryStr ? `${url}?${queryStr}` : url;

      console.log(`[Proxy] ${method} ${req.originalUrl} -> ${finalUrl}`);

      const response = await fetch(finalUrl, options);
      const text = await response.text();

      res.status(response.status);
      const resContentType = response.headers.get("content-type");
      if (resContentType) {
        res.set("content-type", resContentType);
      }
      res.send(text);
    } catch (err) {
      console.error(`[Proxy Error] ${req.method} ${req.originalUrl}:`, err);
      res.status(500).json({ success: false, error: err.message });
    }
  };
};

app.use("/api/auth", proxyRequest("https://arlapi.ibos.io/api/v1/auth"));
app.use("/api/auth-farm", proxyRequest("https://arlapi.ibos.io/api/v1/auth-farm"));

app.use("/api/doctors", doctorsRouter);
app.use("/api/farms", farmsRouter);
app.use("/api/visits", visitsRouter);
app.use("/api/users", usersRouter);
app.use("/api/complaints", complaintsRouter);
app.use("/api/settings", settingsRouter);



app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

poolConnect
  .then(() => {
    console.log("✅ SQL Server connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ SQL Server connection failed");
    console.error(err);
    process.exit(1);
  });