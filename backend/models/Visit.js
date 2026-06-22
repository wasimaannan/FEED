// backend/models/Visit.js
const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema(
  {
    enroll:                  { type: Number, required: true },
    name_of_doctor:          { type: String, required: true, trim: true },
    zone:                    { type: String, required: true, trim: true },
    strFirmType:             { type: String, default: "", trim: true },
    date:                    { type: Date,   required: true },
    week:                    { type: Number, required: true },
    intVisitTarget:          { type: Number, default: 0 },
    intNewVisitTarget:       { type: Number, default: 0 },
    intRepVisitTarget:       { type: Number, default: 0 },
    intProblemSolveTarget:   { type: Number, default: 0 },
    intNewFirmOnboardTarget: { type: Number, default: 0 },
  },
  { timestamps: true }  // createdAt = entry timestamp
);

module.exports = mongoose.model("Visit", VisitSchema);
