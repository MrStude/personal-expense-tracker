import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { useExpenseContext } from '../hooks/useExpenseContext.js';
import { CATEGORY_ICONS } from '../types/expense';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export function RecentExpenses() {
  const { recentExpenses } = useExpenseContext();

  if (!Array.isArray(recentExpenses) || recentExpenses.length === 0) {
  return (
    <div className="text-muted-foreground text-center py-6">
      No recent expenses
    </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Expenses</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/expenses">
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      {recentExpenses.length > 0 ? (
        <div className="space-y-3">
          {recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-sm">
                  {CATEGORY_ICONS[expense.category]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{expense.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(expense.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No recent expenses
        </div>
      )}
    </div>
  );
}