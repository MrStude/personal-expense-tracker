const express = require("express");
const router = express.Router();
const { register, login, resetPassword, updateProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
