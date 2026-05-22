import { Navbar } from "../components/Navbar.jsx";
import { DashboardCards } from "../components/DashboardCards.jsx";
import {
  CategoryPieChart,
  MonthlyBarChart,
  MonthlyLineChart,
} from "../components/Charts.jsx";
import { RecentExpenses } from "../components/RecentExpenses.jsx";
import { AIInsights } from "../components/AIInsights.jsx";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Add enough top padding to clear the fixed navbar (h-16 = 64px) */}
      <main className="container pt-24 py-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardCards />
        <AIInsights />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPieChart />
          <MonthlyLineChart />
          <div className="lg:col-span-2">
            <MonthlyBarChart />
          </div>
        </div>
        <RecentExpenses />
      </main>
    </div>
  );
}
