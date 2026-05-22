const path = require("path");
const { spawn } = require("child_process");

function getPythonCommand() {
  if (process.env.PYTHON_BIN) {
    return {
      command: process.env.PYTHON_BIN,
      args: [],
    };
  }

  if (process.platform === "win32") {
    return {
      command: "py",
      args: ["-3"],
    };
  }

  return {
    command: "python3",
    args: [],
  };
}

function runPythonAnalysis(payload) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../ml/expense_analysis.py");
    const python = getPythonCommand();
    const child = spawn(python.command, [...python.args, scriptPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `Python analysis exited with code ${code}`));
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch (error) {
        reject(new Error(`Invalid Python analysis response: ${error.message}`));
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

exports.analyzeExpenses = async (req, res) => {
  try {
    const { expenses = [], inputExpense = null, referenceDate = null } = req.body;
    const expenseList = Array.isArray(expenses) ? expenses : [];

    const result = await runPythonAnalysis({
      expenses: expenseList,
      inputExpense,
      referenceDate,
    });

    res.json(result);
  } catch (error) {
    console.error("Python analysis error:", error.message);
    res.status(500).json({
      message: "Analysis failed",
      detail: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }
};
