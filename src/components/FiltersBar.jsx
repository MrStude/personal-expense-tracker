import { useState } from 'react';
import { Download, Calendar, Search, X } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select.jsx';
import { EXPENSE_CATEGORIES } from '../types/expense';
import { useExpenseContext } from '../hooks/useExpenseContext.js';
import { toast } from '../hooks/use-toast';

export function FiltersBar({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}) {
  const { expenses } = useExpenseContext();
  const [isExporting, setIsExporting] = useState(false);

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || dateFrom || dateTo;

  const exportToCSV = () => {
    setIsExporting(true);
    
    // Filter expenses based on current filters
    const filteredExpenses = expenses.filter((expense) => {
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      const expenseDate = new Date(expense.date);
      const matchesDateFrom = !dateFrom || expenseDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || expenseDate <= new Date(dateTo);
      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
    });

    // Create CSV content
    const headers = ['Date', 'Title', 'Category', 'Amount', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...filteredExpenses.map((e) =>
        [e.date, `"${e.title}"`, e.category, e.amount, `"${e.notes || ''}"`].join(',')
      ),
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
    toast({
      title: 'Export successful',
      description: `${filteredExpenses.length} expenses exported to CSV`,
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filters & Reports</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Categories</SelectItem>
              {EXPENSE_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">From Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">To Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={exportToCSV}
          disabled={isExporting}
          className="w-full sm:w-auto"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export to CSV'}
        </Button>
      </div>
    </div>
  );
}