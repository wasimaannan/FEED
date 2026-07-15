const express = require("express");
const router = express.Router();

const visitsController = require("../controllers/visitsController");

router.get("/", visitsController.getVisits);
router.get("/list", visitsController.getVisits);
router.get("/:id", visitsController.getVisitById);

router.post("/", visitsController.createVisit);
router.post("/create", visitsController.createVisit);
router.put("/:id", visitsController.updateVisit);
router.delete("/:id", visitsController.deleteVisit);

module.exports = router;