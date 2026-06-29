require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { poolConnect } = require("./config/db");
const doctorsRouter = require("./routes/doctors");
const farmsRouter = require("./routes/farms");
const visitsRouter = require("./routes/visits");
const usersRouter = require("./routes/users");
const complaintsRouter = require("./routes/complaints");

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

app.use("/api/doctors", doctorsRouter);
app.use("/api/farms", farmsRouter);
app.use("/api/visits", visitsRouter);
app.use("/api/users", usersRouter);
app.use("/api/complaints", complaintsRouter);


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