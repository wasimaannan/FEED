// backend/models/Doctor.js
const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    intEnroll:     { type: Number, required: true, unique: true },
    strDoctorName: { type: String, required: true, trim: true },
    strZone:       { type: String, required: true, trim: true },
  },
  { timestamps: true }   // adds createdAt, updatedAt automatically
);

module.exports = mongoose.model("Doctor", DoctorSchema);
