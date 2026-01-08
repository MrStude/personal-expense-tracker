import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar.jsx";
import { DashboardCards } from "../components/DashboardCards.jsx";
import { CategoryPieChart, MonthlyLineChart } from "../components/Charts.jsx";
import { RecentExpenses } from "../components/RecentExpenses.jsx";
import { useExpenseContext } from "../hooks/useExpenseContext.js";
import { analyzeExpenses } from "../lib/api.js";

export default function Dashboard() {
  const { expenses } = useExpenseContext();
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    async function runAnalysis() {
      if (expenses.length === 0) return;

      try {
        const result = await analyzeExpenses(expenses);
        console.log("Analysis result:", result);
        setAnalysis(result);
      } catch (err) {
        console.error(err.message);
      }
    }

    runAnalysis();
  }, [expenses]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Analytics Summary */}
        {analysis && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Stat label="Total" value={`₹${analysis.totalExpense}`} />
            <Stat label="Average" value={`₹${analysis.averageExpense}`} />
            <Stat label="Max" value={`₹${analysis.maxExpense}`} />
            <Stat label="Min" value={`₹${analysis.minExpense}`} />
            <Stat label="Count" value={analysis.expenseCount} />
          </div>
        )}

        <DashboardCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPieChart />
          <MonthlyLineChart />
        </div>

        <RecentExpenses />
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-card p-4 rounded-xl shadow">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
