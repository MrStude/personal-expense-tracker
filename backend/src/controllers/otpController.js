const User = require("../models/User");
const { sendEmail } = require("../utils/notification");

const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/send-otp
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otpLastSentAt) {
      const elapsedMs = Date.now() - user.otpLastSentAt.getTime();
      const remainingMs = OTP_RESEND_COOLDOWN_MS - elapsedMs;

      if (remainingMs > 0) {
        const retryAfterSeconds = Math.ceil(remainingMs / 1000);

        res.set("Retry-After", retryAfterSeconds.toString());
        return res.status(429).json({
          message: `Please wait ${retryAfterSeconds} seconds before requesting another OTP.`,
          retryAfterSeconds,
        });
      }
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    const delivery = {
      email: { attempted: Boolean(user.email), sent: false, error: null },
    };

    // Send OTP via Email
    if (user.email) {
      try {
        await sendEmail(
          user.email,
          "Your OTP Code",
          `Your OTP is: ${otp}`
        );
        delivery.email.sent = true;
      } catch (e) {
        delivery.email.error = e.message;
        console.error("Email OTP failed:", e.message);
      }
    }

    const deliveredBy = Object.entries(delivery)
      .filter(([, result]) => result.sent)
      .map(([channel]) => channel);

    if (deliveredBy.length === 0) {
      return res.status(502).json({
        message: "OTP could not be sent",
        delivery,
      });
    }

    user.otp = otp;
    user.otpExpires = otpExpires;
    user.otpLastSentAt = new Date();
    await user.save();

    res.json({
      message: `OTP sent via ${deliveredBy.join(" and ")}`,
      delivery,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
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
    // Clear OTP after verification
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpLastSentAt = undefined;
    await user.save();
    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
