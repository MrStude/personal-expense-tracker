const User = require("../models/User");
const jwt = require("jsonwebtoken");

//  Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    // IMPORTANT: response format expected by frontend
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token, //  frontend stores this
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Validate credentials
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    // IMPORTANT: response format expected by frontend
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token, // frontend stores this
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
