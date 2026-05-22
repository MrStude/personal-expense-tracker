// backend/src/utils/notification.js
// Utility for sending SMS and email notifications

const nodemailer = require("nodemailer");

function hasRealValue(value, placeholder) {
  return Boolean(value && value.trim() && value !== placeholder);
}

async function sendSMS() {
  throw new Error("SMS is disabled. Configure an SMS provider before calling sendSMS.");
}

// --- Email Setup (Nodemailer) ---
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const isEmailConfigured =
  hasRealValue(emailUser, "your_email@gmail.com") &&
  hasRealValue(emailPass, "your_email_password_or_app_password");

const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })
  : null;

async function sendEmail(to, subject, text, html) {
  if (!transporter) throw new Error("Email is not configured");
  if (!to) throw new Error("Recipient email is missing");

  return transporter.sendMail({
    from: emailUser,
    to,
    subject,
    text,
    html,
  });
}

module.exports = {
  sendSMS,
  sendEmail,
};
