import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
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
import { useExpenseContext } from '../hooks/useExpenseContext.js';
import { EXPENSE_CATEGORIES } from '../types/expense.js';

export function ExpenseList() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenseContext();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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

  const handleSubmit = async (expenseData) => {
    if (editingExpense) {
      // ✅ FIX 1: use _id (MongoDB)
      await updateExpense(editingExpense._id, expenseData);
    } else {
      await addExpense(expenseData);
    }

    // ✅ FIX 2: close form after submit
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
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

        <Button variant="gradient" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

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
              onDelete={() => deleteExpense(expense._id)}
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
    </div>
  );
}
