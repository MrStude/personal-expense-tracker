import { useState } from 'react';
import { Bell, Plus, Search, Filter, X } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select.jsx';
import { ExpenseCard } from './ExpenseCard.jsx';
import { ExpenseForm } from './ExpenseForm.jsx';
import { MonthlyExpenseGoal } from './MonthlyExpenseGoal.jsx';
import { useExpenseContext } from '../hooks/useExpenseContext.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import { toast } from '../hooks/use-toast.js';
import { EXPENSE_CATEGORIES } from '../types/expense.js';
import {
  getSavedMonthlyGoal,
  getThisMonthTotal,
  isThisMonth,
  notifyExpenseGoalThresholds,
} from '../lib/expenseGoalAlerts.js';

export function ExpenseList() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenseContext();
  const { user } = useAuthContext();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expenseWarning, setExpenseWarning] = useState(null);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || expense.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };


  const showExpenseWarningIfNeeded = async (savedExpense, previousExpense = null) => {
    const monthlyGoal = getSavedMonthlyGoal(user);

    if (!monthlyGoal || !isThisMonth(savedExpense.date)) return;

    const previousTotal = getThisMonthTotal(expenses);
    const oldAmount = previousExpense && isThisMonth(previousExpense.date) ? Number(previousExpense.amount) || 0 : 0;
    const newAmount = Number(savedExpense.amount) || 0;
    const nextTotal = previousTotal - oldAmount + newAmount;

    await notifyExpenseGoalThresholds({
      user,
      previousTotal: Math.max(previousTotal - oldAmount, 0),
      nextTotal,
      monthlyGoal,
      toast,
      onAlert: setExpenseWarning,
    });
  };

  const handleSubmit = async (expenseData) => {
    if (editingExpense) {
      const updatedExpense = await updateExpense(editingExpense._id, expenseData);
      toast({
        title: 'Expense Updated',
        description: 'The expense was updated successfully.',
      });
      await showExpenseWarningIfNeeded(updatedExpense || expenseData, editingExpense);
    } else {
      const newExpense = await addExpense(expenseData);
      toast({
        title: 'Expense Added',
        description: 'A new expense was added successfully.',
      });
      await showExpenseWarningIfNeeded(newExpense || expenseData);
    }
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  // Add a handler for delete with toast
  const handleDelete = async (id) => {
    await deleteExpense(id);
    toast({
      title: 'Expense Deleted',
      description: 'The expense was deleted successfully.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Expenses</h2>
          <p className="text-muted-foreground">
            {filteredExpenses.length} expense
            {filteredExpenses.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
          <Button variant="gradient" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      <MonthlyExpenseGoal />

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-secondary/50 rounded-xl">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-muted-foreground mb-2 block">
                Category
              </label>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Expense Cards */}
      <div className="space-y-3">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onEdit={handleEdit}
              onDelete={() => handleDelete(expense._id)}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-card rounded-xl">
            <p className="text-muted-foreground">No expenses found</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
        />
      )}

      {expenseWarning && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-destructive/10 p-2 text-destructive">
                  <Bell className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{expenseWarning.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{expenseWarning.description}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close expense warning"
                onClick={() => setExpenseWarning(null)}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
