const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

function buildUserResponse(user, token) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    photo: user.photo,
    token,
  };
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      user: buildUserResponse(user, token),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      user: buildUserResponse(user, token),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, photo } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });

      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.photo = typeof photo === "string" ? photo : user.photo;
    await user.save();

    const token = req.headers.authorization?.split(" ")[1] || generateToken(user._id);
    res.json({ user: buildUserResponse(user, token) });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ message: "Email, OTP, and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ message: "OTP not found. Please request again." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.password = password;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpLastSentAt = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
