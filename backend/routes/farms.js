const express = require("express");
const router = express.Router();

const farmsController = require("../controllers/farmsController");

router.get("/", farmsController.getFarms);
router.get("/:id", farmsController.getFarmById);

module.exports = router;