const express = require("express");
const router = express.Router();
const { analyzeExpenses } = require("../controllers/analysisController");
const protect = require("../middleware/authMiddleware");

router.post("/analyze", protect, analyzeExpenses);

module.exports = router;
