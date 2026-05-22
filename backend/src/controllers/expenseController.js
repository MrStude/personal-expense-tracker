const Expense = require("../models/Expense");
const User = require("../models/User");
const { sendEmail } = require("../utils/notification");

function formatExpenseAmount(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function buildExpenseMessage(action, expense) {
  const amount = formatExpenseAmount(expense.amount);
  const date = new Date(expense.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return [
    `Your expense was ${action}.`,
    "",
    `Title: ${expense.title}`,
    `Amount: ${amount}`,
    `Category: ${expense.category || "Uncategorized"}`,
    `Date: ${date}`,
    expense.notes ? `Notes: ${expense.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendExpenseNotification(userId, subject, message) {
  try {
    const user = await User.findById(userId);

    if (!user?.email) return;

    await sendEmail(user.email, subject, message);
  } catch (error) {
    console.error("Expense email notification failed:", error.message);
  }
}

// SEND monthly goal notification
exports.sendGoalNotification = async (req, res) => {
  try {
    const { threshold, monthlyGoal, thisMonthTotal } = req.body;
    const user = await User.findById(req.user._id);
    const thresholdNumber = Number(threshold);
    const goalAmount = Number(monthlyGoal);
    const totalAmount = Number(thisMonthTotal);

    if (!user?.email) {
      return res.status(400).json({ message: "User email is missing" });
    }

    if (![25, 50, 75, 100].includes(thresholdNumber)) {
      return res.status(400).json({ message: "Invalid goal threshold" });
    }

    if (!Number.isFinite(goalAmount) || goalAmount <= 0) {
      return res.status(400).json({ message: "Invalid monthly goal" });
    }

    if (!Number.isFinite(totalAmount) || totalAmount < 0) {
      return res.status(400).json({ message: "Invalid monthly expense total" });
    }

    const formattedGoal = formatExpenseAmount(goalAmount);
    const formattedTotal = formatExpenseAmount(totalAmount);
    const subject =
      thresholdNumber >= 100
        ? "Expense Goal Reached"
        : `${thresholdNumber}% Expense Goal Used`;
    const messageLines =
      thresholdNumber >= 100
        ? [
            `Hi ${user.name},`,
            "",
            `You have reached 100% of your monthly expense goal.`,
            "",
            `Current monthly expenses: ${formattedTotal}`,
            `Monthly goal: ${formattedGoal}`,
          ]
        : [
            `Hi ${user.name},`,
            "",
            `You have used ${thresholdNumber}% of your monthly expense goal.`,
            "",
            `Current monthly expenses: ${formattedTotal}`,
            `Monthly goal: ${formattedGoal}`,
          ];
    const message = messageLines.join("\n");
    const html = messageLines
      .map((line) => (line ? `<p>${line}</p>` : "<br />"))
      .join("");

    await sendEmail(user.email, subject, message, html);

    res.json({
      message: "Goal notification email sent",
      threshold: thresholdNumber,
      email: user.email,
    });
  } catch (error) {
    console.error("Goal email notification failed:", error.message);
    res.status(500).json({
      message: "Goal notification email failed",
      error: error.message,
    });
  }
};

// GET all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE expense
exports.createExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      user: req.user._id,
    });

    await sendExpenseNotification(
      req.user._id,
      "New Expense Added",
      buildExpenseMessage("added", expense)
    );

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE expense
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await sendExpenseNotification(
      req.user._id,
      "Expense Updated",
      buildExpenseMessage("updated", expense)
    );

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
