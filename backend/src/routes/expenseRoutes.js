const express = require("express");
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  sendGoalNotification,
} = require("../controllers/expenseController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.get("/", getExpenses);
router.post("/", createExpense);
router.post("/goal-notification", sendGoalNotification);
router.put("/:id", authMiddleware, updateExpense);   
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
