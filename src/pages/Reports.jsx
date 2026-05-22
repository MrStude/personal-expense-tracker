import { useState, useMemo } from 'react';
import { Navbar } from "../components/Navbar.jsx";
import { FiltersBar } from "../components/FiltersBar.jsx";
import { ExpenseCard } from "../components/ExpenseCard.jsx";
import { ExpenseForm } from "../components/ExpenseForm.jsx";
import { useExpenseContext } from '../hooks/useExpenseContext.js';
import {
  CategoryPieChart,
  MonthlyBarChart,
  MonthlyLineChart,
} from '../components/Charts.jsx';

export default function Reports() {
  const { expenses, updateExpense, deleteExpense } = useExpenseContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [editingExpense, setEditingExpense] = useState(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      const expenseDate = new Date(expense.date);
      const matchesDateFrom = !dateFrom || expenseDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || expenseDate <= new Date(dateTo);
      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [expenses, searchTerm, categoryFilter, dateFrom, dateTo]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleSubmit = (expenseData) => {
    if (editingExpense) {
      updateExpense(editingExpense._id || editingExpense.id, expenseData);
    }
    setEditingExpense(undefined);
    setIsFormOpen(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 py-6 space-y-6">
        {/* Page Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Filter and export your expense data
          </p>
        </div>

        {/* Filters */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <FiltersBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CategoryPieChart />
          <MonthlyLineChart />
          <div className="lg:col-span-2">
            <MonthlyBarChart />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card rounded-xl shadow-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Filtered Results</h3>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(totalFiltered)}</p>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Showing {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
          </p>

          {/* Filtered Expense List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <ExpenseCard
                  key={expense._id || expense.id}
                  expense={expense}
                  onEdit={handleEdit}
                  onDelete={deleteExpense}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No expenses match your filters
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Form Modal */}
      {isFormOpen && editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingExpense(undefined);
          }}
        />
      )}
    </div>
  );
}
