import { useMemo } from 'react';
import { useExpenseContext } from '../hooks/useExpenseContext.js';
import { MonthlyExpenseGoal } from './MonthlyExpenseGoal.jsx';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount || 0);
}

function StatCard({ label, value }) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export function DashboardCards() {
  const { expenses, categoryBreakdown, monthlyData } = useExpenseContext();

  const stats = useMemo(() => {
    const amounts = expenses.map((expense) => Number(expense.amount) || 0);
    const totalExpense = amounts.reduce((sum, amount) => sum + amount, 0);
    const expenseCount = expenses.length;
    const monthCount = monthlyData.length;
    const averageMonthlyExpense = monthCount ? totalExpense / monthCount : 0;
    const maxExpense = expenseCount ? Math.max(...amounts) : 0;
    const minExpense = expenseCount ? Math.min(...amounts) : 0;
    const now = new Date();

    const thisMonthTotal = expenses.reduce((sum, expense) => {
      const date = new Date(expense.date);
      const isThisMonth =
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

      return isThisMonth ? sum + (Number(expense.amount) || 0) : sum;
    }, 0);

    return {
      totalExpense,
      averageMonthlyExpense,
      maxExpense,
      minExpense,
      thisMonthTotal,
      expenseCount,
    };
  }, [expenses, monthlyData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard label="Total Expenses" value={formatCurrency(stats.totalExpense)} />
      <StatCard label="This Month" value={formatCurrency(stats.thisMonthTotal)} />
      <StatCard label="Average Expense per Month" value={formatCurrency(stats.averageMonthlyExpense)} />
      <StatCard label="Max Expense" value={formatCurrency(stats.maxExpense)} />
      <StatCard label="Min Expense" value={formatCurrency(stats.minExpense)} />
      <StatCard label="Categories" value={categoryBreakdown.length} />
      <StatCard label="Transactions" value={stats.expenseCount} />
      <MonthlyExpenseGoal className="md:col-span-2 lg:col-span-2" allowEditing={false} />
    </div>
  );
}
