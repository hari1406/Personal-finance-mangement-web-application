const express = require("express");
const {
  categorySummary,
  timeBasedReport,
} = require("../controllers/reportController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/category-summary", categorySummary);
router.get("/time-report", timeBasedReport);

module.exports = router;
