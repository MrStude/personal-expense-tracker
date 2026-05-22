import { useContext } from 'react';
import { ExpenseContext } from '../contexts/expenseContext.js';

export function useExpenseContext() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
}
