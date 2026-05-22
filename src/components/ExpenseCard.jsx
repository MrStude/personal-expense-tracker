import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { CATEGORY_ICONS } from '../types/expense';
import { format } from 'date-fns';

export function ExpenseCard({ expense, onEdit, onDelete }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="group bg-card rounded-xl shadow-card p-4 transition-all duration-200 hover:shadow-card-lg animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-lg">
            {CATEGORY_ICONS[expense.category]}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate">{expense.title}</h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {expense.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(expense.date), 'MMM d, yyyy')}
              </span>
            </div>
            {expense.notes && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{expense.notes}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground whitespace-nowrap">
            {formatCurrency(expense.amount)}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(expense)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(expense._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}