const express = require("express");
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:id", authMiddleware, updateExpense);   
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
