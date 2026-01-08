import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useExpenseContext } from "../hooks/useExpenseContext.js";
import { CATEGORY_COLORS } from "../types/expense.js";

/* CATEGORY PIE CHART */
export function CategoryPieChart() {
  const { categoryBreakdown = [] } = useExpenseContext();

  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // SAFETY CHECK (prevents crash)
  if (!Array.isArray(categoryBreakdown) || categoryBreakdown.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No expense data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-card p-6">
      <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* PIE CHART */}
        <div className="w-full lg:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {categoryBreakdown.map((item) => (
                  <Cell
                    key={item.category}
                    fill={CATEGORY_COLORS[item.category] || "#8884d8"}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LEGEND */}
        <div className="w-full lg:w-1/2 space-y-3">
          {categoryBreakdown.map((item) => (
            <div
              key={item.category}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[item.category] || "#8884d8",
                  }}
                />
                <span>{item.category}</span>
              </div>

              <div className="text-right">
                <span className="font-medium">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-xs ml-2 text-muted-foreground">
                  (
                  {Number(item.percentage ?? 0).toFixed(1)}
                  %)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/*  MONTHLY LINE CHART  */
export function MonthlyLineChart() {
  const { monthlyData = [] } = useExpenseContext();

  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  // SAFETY CHECK
  if (!Array.isArray(monthlyData) || monthlyData.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold mb-4">
          Monthly Spending Trend
        </h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No monthly data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-card p-6">
      <h3 className="text-lg font-semibold mb-4">
        Monthly Spending Trend
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `₹${v}`} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
