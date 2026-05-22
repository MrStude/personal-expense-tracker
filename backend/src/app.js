const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const otpRoutes = require("./routes/otpRoutes");

const path = require('path');
const userPhotoUpload = require('../routes/userPhotoUpload');
const app = express();
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ✅ ALLOW ALL ORIGINS (DEV SAFE)
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/users", userPhotoUpload);

module.exports = app;
