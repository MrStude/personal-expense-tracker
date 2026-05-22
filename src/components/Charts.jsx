import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useExpenseContext } from "../hooks/useExpenseContext.js";
import { CATEGORY_COLORS } from "../types/expense.js";

function formatCurrency(amount = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

// CATEGORY PIE CHART
export function CategoryPieChart() {
  const { categoryBreakdown = [] } = useExpenseContext();

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
    <div className="bg-card rounded-xl shadow-card p-6 min-w-0">
      <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>

      <div className="flex min-w-0 flex-col lg:flex-row gap-6">
        <div className="h-64 min-h-64 min-w-0 w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height={256} minWidth={1} minHeight={1}>
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

        <div className="min-w-0 w-full lg:w-1/2 space-y-3">
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
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// MONTHLY LINE CHART
export function MonthlyLineChart() {
  const { monthlyData = [] } = useExpenseContext();

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
    <div className="bg-card rounded-xl shadow-card p-6 min-w-0">
      <h3 className="text-lg font-semibold mb-4">
        Monthly Spending Trend
      </h3>

      <div className="h-64 min-h-64 min-w-0 w-full">
        <ResponsiveContainer width="100%" height={256} minWidth={1} minHeight={1}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => formatCurrency(value).replace(".00", "")} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
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

// MONTHLY BAR CHART
export function MonthlyBarChart() {
  const { monthlyData = [] } = useExpenseContext();

  if (!Array.isArray(monthlyData) || monthlyData.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-card p-6 w-full md:w-[720px] max-w-full mx-auto">
        <h3 className="text-lg font-semibold mb-4">Monthly Comparison</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No monthly data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-card p-6 min-w-0 w-full md:w-[720px] max-w-full mx-auto">
      <h3 className="text-lg font-semibold mb-4">Monthly Comparison</h3>

      <div className="h-64 min-h-64 min-w-0 w-full">
        <ResponsiveContainer width="100%" height={256} minWidth={1} minHeight={1}>
          <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(value) => formatCurrency(value).replace(".00", "")}
              tickLine={false}
              axisLine={false}
              width={72}
            />
            <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: "hsl(var(--muted))" }} />
            <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
