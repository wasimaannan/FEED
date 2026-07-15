const express = require("express");
const router = express.Router();

const complaintsController = require("../controllers/complaintsController");

router.get("/", complaintsController.getComplaints);
router.get("/list", complaintsController.getComplaints);
router.get("/root-causes", complaintsController.getRootCauses);
router.get("/:id", complaintsController.getComplaintById);

router.post("/", complaintsController.createComplaint);
router.post("/create", complaintsController.createComplaint);
router.put("/:id", complaintsController.updateComplaint);
router.delete("/:id", complaintsController.deleteComplaint);

module.exports = router;