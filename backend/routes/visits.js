const express = require("express");
const router = express.Router();

const visitsController = require("../controllers/visitsController");

router.get("/", visitsController.getVisits);
router.get("/:id", visitsController.getVisitById);

module.exports = router;