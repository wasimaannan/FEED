// backend/server.js
require("dotenv").config();
const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");

const doctorsRouter = require("./routes/doctors");
const farmsRouter   = require("./routes/farms");
const visitsRouter  = require("./routes/visits");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "FEED API is running", time: new Date().toISOString() });
});

app.use("/api/doctors", doctorsRouter);
app.use("/api/farms",   farmsRouter);
app.use("/api/visits",  visitsRouter);

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ── Error handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

// ── Connect to MongoDB then start server ─────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅  MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅  Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  });
