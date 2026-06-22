 // backend/models/Farm.js
const mongoose = require("mongoose");

const FarmSchema = new mongoose.Schema(
  {
    enroll:               { type: Number, required: true },
    name_of_doctor:       { type: String, required: true, trim: true },
    zone:                 { type: String, required: true, trim: true },
    strFirmType:          { type: String, required: true, trim: true },
    intActiveFarm:        { type: Number, default: 0 },
    intUnderService:      { type: Number, default: 0 },
    intUnderServiceTarget:{ type: Number, default: 0 },
  },
  { timestamps: true }
);

// One farm record per doctor+firmType combination
FarmSchema.index({ enroll: 1, strFirmType: 1 }, { unique: true });

module.exports = mongoose.model("Farm", FarmSchema);
