const express = require("express");
const router = express.Router();

const complaintsController = require("../controllers/complaintsController");

router.get("/", complaintsController.getComplaints);
router.get("/:id", complaintsController.getComplaintById);

module.exports = router;