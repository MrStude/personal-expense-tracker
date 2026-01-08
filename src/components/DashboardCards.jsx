import { useExpenseContext } from '../hooks/useExpenseContext.js';

export function DashboardCards() {
  const { expenses } = useExpenseContext();

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categories = [...new Set(expenses.map(expense => expense.category))];
  const recentTransactions = expenses.slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
        <p className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</p>
      </div>
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-sm font-medium text-muted-foreground">This Month</h3>
        <p className="text-2xl font-bold">₹{thisMonthExpenses.toFixed(2)}</p>
      </div>
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
        <p className="text-2xl font-bold">{categories.length}</p>
      </div>
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-sm font-medium text-muted-foreground">Transactions</h3>
        <p className="text-2xl font-bold">{expenses.length}</p>
      </div>
    </div>
  );
}