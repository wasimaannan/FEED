const express = require("express");
const router = express.Router();

const doctorsController = require("../controllers/doctorsController");

router.get("/", doctorsController.getDoctors);
router.get("/search", doctorsController.getDoctors);
router.get("/:id", doctorsController.getDoctorById);

router.post("/", doctorsController.createDoctor);
router.post("/create", doctorsController.createDoctor);
router.put("/:id", doctorsController.updateDoctor);
router.put("/edit/:id", doctorsController.updateDoctor);
router.delete("/:id", doctorsController.deleteDoctor);

module.exports = router;