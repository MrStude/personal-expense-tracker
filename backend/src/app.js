const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

// ALLOW ALL ORIGINS (DEV SAFE)
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/analysis", analysisRoutes);

module.exports = app;
