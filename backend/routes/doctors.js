const express = require("express");
const router = express.Router();

const doctorsController = require("../controllers/doctorsController");

router.get("/", doctorsController.getDoctors);
router.get("/:id", doctorsController.getDoctorById);

module.exports = router;