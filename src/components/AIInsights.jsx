import { useEffect, useState } from "react";
import { AlertTriangle, Brain, Tags, TrendingUp } from "lucide-react";
import { useExpenseContext } from "../hooks/useExpenseContext.js";
import { analyzeExpenses } from "../lib/api.js";
import { CATEGORY_COLORS } from "../types/expense.js";

function formatCurrency(amount = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value = 0) {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

function SuggestionIcon({ type }) {
  if (type === "warning") return <AlertTriangle className="h-4 w-4 text-amber-600" />;
  if (type === "success") return <TrendingUp className="h-4 w-4 text-emerald-600" />;
  return <Brain className="h-4 w-4 text-primary" />;
}

function getEmptyInsights(message) {
  return {
    prediction: {
      predictedAmount: 0,
      nextMonthLabel: "",
      trendPercentage: 0,
      confidence: 0,
      message,
    },
    categoryAnalysis: [],
    suggestions: [
      {
        type: "neutral",
        category: "",
        severity: 0,
        text: message,
      },
    ],
    classifier: {
      category: "",
      confidence: 0,
    },
  };
}

function normalizeInsights(result, fallbackMessage) {
  const emptyInsights = getEmptyInsights(fallbackMessage);

  return {
    prediction: {
      ...emptyInsights.prediction,
      ...(result?.prediction || {}),
    },
    categoryAnalysis: Array.isArray(result?.categoryAnalysis)
      ? result.categoryAnalysis.slice(0, 4)
      : [],
    suggestions:
      Array.isArray(result?.suggestions) && result.suggestions.length
        ? result.suggestions.slice(0, 4)
        : emptyInsights.suggestions,
    classifier: {
      ...emptyInsights.classifier,
      ...(result?.classifier || {}),
    },
  };
}

export function AIInsights() {
  const { expenses = [] } = useExpenseContext();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadInsights() {
      if (!expenses.length) {
        setInsights(null);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const result = await analyzeExpenses(expenses);

        if (isCurrent) {
          setInsights(normalizeInsights(result, "Add this month's expenses to receive spending alerts and category suggestions."));
        }
      } catch (apiError) {
        if (isCurrent) {
          setError(apiError.message || "Unable to load AI insights");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadInsights();

    return () => {
      isCurrent = false;
    };
  }, [expenses]);

  const fallbackMessage =
    error ||
    (loading
      ? "Python ML analysis is running."
      : "Add expenses across a few months to unlock next-month prediction.");
  const safeInsights = normalizeInsights(insights, fallbackMessage);
  const prediction = safeInsights.prediction;
  const classifier = safeInsights.classifier;

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.4fr] gap-6">
      <div className="bg-card rounded-xl shadow-card p-6 min-w-0">
        <div className="flex items-center gap-2 mb-5">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Spending Forecast</h2>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">Predicted spending for {prediction.nextMonthLabel || "next month"}</p>
            <p className="text-3xl font-bold mt-1">
              {formatCurrency(prediction.predictedAmount)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {prediction.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Trend vs average</p>
              <p className="text-lg font-semibold">
                {formatPercent(prediction.trendPercentage)}
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="text-lg font-semibold">{prediction.confidence}%</p>
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Tags className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Next likely category</p>
            </div>
            <p className="text-xl font-semibold mt-2">
              {classifier.category || "Not enough data"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {classifier.confidence}% classifier confidence
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-card p-6 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h2 className="text-lg font-semibold">Smart Suggestions</h2>
          <span className="text-xs text-muted-foreground">Regression + classification</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-3">
            {safeInsights.suggestions.map((suggestion) => (
              <div key={`${suggestion.type}-${suggestion.category}-${suggestion.text}`} className="flex gap-3 rounded-lg border p-3">
                <div className="mt-0.5">
                  <SuggestionIcon type={suggestion.type} />
                </div>
                <p className="text-sm leading-6">{suggestion.text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {safeInsights.categoryAnalysis.map((item) => {
              const width = Math.min(100, Math.max(4, item.currentSharePercentage || item.sharePercentage));
              return (
                <div key={item.category} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[item.category] || "#8884d8" }}
                      />
                      <span className="font-medium truncate">{item.category}</span>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(item.currentAmount || item.totalAmount)}</span>
                  </div>

                  <div className="h-2 bg-secondary rounded-full overflow-hidden mt-3">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    {item.historicalAverage > 0
                      ? `${formatPercent(item.changePercentage)} vs recent average`
                      : `${Math.round(item.sharePercentage)}% of total spending`}
                  </p>
                </div>
              );
            })}
            {!safeInsights.categoryAnalysis.length && (
              <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                Category-wise analysis will appear after Python receives expense data.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
