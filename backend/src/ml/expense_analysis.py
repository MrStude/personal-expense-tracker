import json
import math
import re
import sys
from collections import defaultdict
from datetime import datetime

CATEGORIES = ["Food", "Rent", "Shopping", "Transport", "Utilities", "Others"]
MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def parse_date(value):
    if not value:
        return None

    text = str(value).replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(text)
    except ValueError:
        try:
            return datetime.strptime(str(value)[:10], "%Y-%m-%d")
        except ValueError:
            return None


def amount_of(expense):
    try:
        return float(expense.get("amount") or 0)
    except (TypeError, ValueError):
        return 0.0


def month_index(date):
    return date.year * 12 + date.month - 1


def month_label(index):
    year = index // 12
    month = index % 12
    return f"{MONTH_NAMES[month]} {year}"


def tokenize(text):
    return [word for word in re.sub(r"[^a-z0-9\s]", " ", str(text).lower()).split() if len(word) > 2]


def monthly_totals(expenses):
    totals = {}
    for expense in expenses:
        date = parse_date(expense.get("date"))
        if not date:
            continue

        key = month_index(date)
        if key not in totals:
            totals[key] = {
                "month": month_label(key),
                "sortValue": key,
                "amount": 0,
                "count": 0,
            }

        totals[key]["amount"] += amount_of(expense)
        totals[key]["count"] += 1

    return [totals[key] for key in sorted(totals)]


def predict_next_month(expenses):
    totals = monthly_totals(expenses)
    if not totals:
        return {
            "predictedAmount": 0,
            "nextMonthLabel": "",
            "trendPercentage": 0,
            "confidence": 0,
            "pointsUsed": 0,
            "message": "Add expenses across a few months to unlock next-month prediction.",
        }

    next_month = totals[-1]["sortValue"] + 1
    if len(totals) == 1:
        return {
            "predictedAmount": max(0, totals[0]["amount"]),
            "nextMonthLabel": month_label(next_month),
            "trendPercentage": 0,
            "confidence": 35,
            "pointsUsed": 1,
            "message": "Prediction uses your latest month until more history is available.",
        }

    n = len(totals)
    xs = list(range(n))
    ys = [item["amount"] for item in totals]
    sum_x = sum(xs)
    sum_y = sum(ys)
    sum_xy = sum(x * y for x, y in zip(xs, ys))
    sum_x2 = sum(x * x for x in xs)
    denominator = n * sum_x2 - sum_x * sum_x
    slope = (n * sum_xy - sum_x * sum_y) / denominator if denominator else 0
    intercept = (sum_y - slope * sum_x) / n
    predicted = max(0, intercept + slope * n)
    average = sum_y / n if n else 0
    trend = ((predicted - average) / average) * 100 if average else 0
    variance = sum((y - (intercept + slope * x)) ** 2 for x, y in zip(xs, ys))
    volatility = (math.sqrt(variance / n) / average) if average else 1
    history_score = min(40, n * 8)
    stability_score = max(0, 60 - volatility * 60)

    return {
        "predictedAmount": predicted,
        "nextMonthLabel": month_label(next_month),
        "trendPercentage": trend,
        "confidence": round(min(92, history_score + stability_score)),
        "pointsUsed": n,
        "message": "Linear regression based on monthly spending history.",
    }


def analyze_categories(expenses, reference_date):
    current_month = month_index(reference_date)
    current_totals = defaultdict(float)
    history_totals = defaultdict(lambda: defaultdict(float))
    total_by_category = defaultdict(float)
    current_total = 0
    grand_total = 0

    for expense in expenses:
        date = parse_date(expense.get("date"))
        if not date:
            continue

        category = expense.get("category") or "Others"
        amount = amount_of(expense)
        expense_month = month_index(date)
        total_by_category[category] += amount
        grand_total += amount

        if expense_month == current_month:
            current_totals[category] += amount
            current_total += amount
        elif current_month - 3 <= expense_month < current_month:
            history_totals[category][expense_month] += amount

    analysis = []
    for category in CATEGORIES:
        history_values = list(history_totals[category].values())
        historical_average = sum(history_values) / len(history_values) if history_values else 0
        current_amount = current_totals[category]
        change_percentage = ((current_amount - historical_average) / historical_average) * 100 if historical_average else 0
        status = "normal"
        if historical_average > 0 and change_percentage > 15:
            status = "overspending"
        elif historical_average > 0 and change_percentage < -15:
            status = "improving"

        analysis.append({
            "category": category,
            "currentAmount": current_amount,
            "historicalAverage": historical_average,
            "changePercentage": change_percentage,
            "totalAmount": total_by_category[category],
            "sharePercentage": (total_by_category[category] / grand_total) * 100 if grand_total else 0,
            "currentSharePercentage": (current_amount / current_total) * 100 if current_total else 0,
            "status": status,
        })

    return sorted(analysis, key=lambda item: (item["currentAmount"], item["totalAmount"]), reverse=True)


def predict_category(expenses, input_expense=None):
    trained = [expense for expense in expenses if expense.get("category")]
    if not trained:
        return {
            "category": "",
            "confidence": 0,
            "reason": "Add categorized expenses to train the classifier.",
            "alternatives": [],
        }

    input_expense = input_expense or {}
    stats = {
        category: {
            "count": 0,
            "amountTotal": 0,
            "keywordCounts": defaultdict(int),
            "lastSeen": 0,
        }
        for category in CATEGORIES
    }

    for expense in trained:
        category = expense.get("category") or "Others"
        if category not in stats:
            category = "Others"

        date = parse_date(expense.get("date"))
        stats[category]["count"] += 1
        stats[category]["amountTotal"] += amount_of(expense)
        stats[category]["lastSeen"] = max(stats[category]["lastSeen"], int(date.timestamp()) if date else 0)

        for word in tokenize(f"{expense.get('title', '')} {expense.get('notes', '')}"):
            stats[category]["keywordCounts"][word] += 1

    input_tokens = tokenize(f"{input_expense.get('title', '')} {input_expense.get('notes', '')}")
    input_amount = amount_of(input_expense)
    latest_seen = max(item["lastSeen"] for item in stats.values())
    scores = []

    for category in CATEGORIES:
        item = stats[category]
        average_amount = item["amountTotal"] / item["count"] if item["count"] else 0
        prior_score = item["count"] / len(trained)
        keyword_score = sum(item["keywordCounts"][word] / max(1, item["count"]) for word in input_tokens)
        amount_score = max(0, 1 - abs(input_amount - average_amount) / max(input_amount, average_amount)) if input_amount and average_amount else 0
        recency_score = max(0, 1 - (latest_seen - item["lastSeen"]) / (60 * 60 * 24 * 120)) if latest_seen and item["lastSeen"] else 0

        scores.append({
            "category": category,
            "score": prior_score * 0.45 + keyword_score * 0.35 + amount_score * 0.12 + recency_score * 0.08,
        })

    scores.sort(key=lambda item: item["score"], reverse=True)
    total_score = sum(item["score"] for item in scores)
    best = scores[0]
    confidence = round((best["score"] / total_score) * 100) if total_score else 0

    return {
        "category": best["category"],
        "confidence": max(1, min(95, confidence)),
        "reason": "Classification uses matching words, amount similarity, frequency, and recency.",
        "alternatives": scores[1:3],
    }


def smart_suggestions(category_analysis):
    suggestions = []

    for item in category_analysis:
        if item["status"] == "overspending":
            percentage = round(item["changePercentage"])
            suggestions.append({
                "type": "warning",
                "category": item["category"],
                "severity": percentage,
                "text": f"You are overspending on {item['category'].lower()} by {percentage}% this month.",
            })

    top_category = max(category_analysis, key=lambda item: item["totalAmount"], default=None)
    if top_category and top_category["totalAmount"] > 0:
        share = round(top_category["sharePercentage"])
        suggestions.append({
            "type": "insight",
            "category": top_category["category"],
            "severity": share,
            "text": f"{top_category['category']} is your largest category at {share}% of total spending.",
        })

    improving = next((item for item in category_analysis if item["status"] == "improving"), None)
    if improving:
        drop = abs(round(improving["changePercentage"]))
        suggestions.append({
            "type": "success",
            "category": improving["category"],
            "severity": drop,
            "text": f"{improving['category']} spending is down {drop}% versus your recent average.",
        })

    if not suggestions:
        suggestions.append({
            "type": "neutral",
            "category": "",
            "severity": 0,
            "text": "Add this month's expenses to receive spending alerts and category suggestions.",
        })

    weights = {"warning": 3, "insight": 2, "success": 1, "neutral": 0}
    return sorted(suggestions, key=lambda item: (weights.get(item["type"], 0), item["severity"]), reverse=True)


def summarize(expenses):
    amounts = [amount_of(expense) for expense in expenses]
    total = sum(amounts)
    category_breakdown = defaultdict(float)
    monthly_trend = defaultdict(float)

    for expense in expenses:
        category = expense.get("category") or "Uncategorized"
        date = parse_date(expense.get("date"))
        category_breakdown[category] += amount_of(expense)
        if date:
            monthly_trend[date.strftime("%Y-%m")] += amount_of(expense)

    return {
        "totalExpense": total,
        "averageExpense": total / len(amounts) if amounts else 0,
        "maxExpense": max(amounts) if amounts else 0,
        "minExpense": min(amounts) if amounts else 0,
        "expenseCount": len(expenses),
        "categoryBreakdown": dict(category_breakdown),
        "monthlyTrend": dict(sorted(monthly_trend.items())),
    }


def main():
    payload = json.load(sys.stdin)
    expenses = payload.get("expenses") if isinstance(payload.get("expenses"), list) else []
    input_expense = payload.get("inputExpense") or {}
    reference_date = parse_date(payload.get("referenceDate")) or datetime.now()
    category_analysis = analyze_categories(expenses, reference_date)

    result = {
        "summary": summarize(expenses),
        "prediction": predict_next_month(expenses),
        "categoryAnalysis": category_analysis,
        "suggestions": smart_suggestions(category_analysis),
        "classifier": predict_category(expenses, input_expense),
    }

    print(json.dumps(result))


if __name__ == "__main__":
    main()
