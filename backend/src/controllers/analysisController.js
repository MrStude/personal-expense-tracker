// backend/src/controllers/analysisController.js
const axios = require("axios");

exports.analyzeExpenses = async (req, res) => {
  try {
    const { expenses } = req.body;

    const response = await axios.post(
      "http://127.0.0.1:7000/analyze",
      { expenses }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Analysis error:", error.message);
    res.status(500).json({ message: "Analysis failed" });
  }
};
