const express = require("express");
const router = express.Router();

const farmsController = require("../controllers/farmsController");

router.get("/", farmsController.getFarms);
router.get("/:id", farmsController.getFarmById);

router.post("/", farmsController.createFarm);
router.put("/:id", farmsController.updateFarm);
router.delete("/:id", farmsController.deleteFarm);

module.exports = router;