from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze_expenses():
    data = request.json.get("expenses", [])

    if not data:
        return jsonify({"message": "No expenses provided"}), 400

    df = pd.DataFrame(data)

    amounts = np.array(df["amount"])

    analysis = {
        "total_expense": float(np.sum(amounts)),
        "average_expense": float(np.mean(amounts)),
        "max_expense": float(np.max(amounts)),
        "min_expense": float(np.min(amounts)),
        "category_breakdown": (
            df.groupby("category")["amount"].sum().to_dict()
        ),
        "monthly_trend": (
            df.groupby(df["date"].str[:7])["amount"].sum().to_dict()
        )
    }

    return jsonify(analysis)


if __name__ == "__main__":
    app.run(port=7000, debug=True)
