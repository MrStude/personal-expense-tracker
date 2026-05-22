import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { ExpenseContext } from "./expenseContext.js";

export function ExpenseProvider({ children }) {
  const { user, isAuthenticated } = useAuthContext();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [isAuthenticated, user?._id]);

  async function fetchExpenses() {
    try {
      setLoading(true);
      const data = await apiGet("/expenses");
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch expenses:", error.message);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }

  async function addExpense(expense) {
    const newExpense = await apiPost("/expenses", expense);
    setExpenses((prev) => [newExpense, ...prev]);
    return newExpense;
  }

  async function updateExpense(id, updatedData) {
    const updatedExpense = await apiPut(`/expenses/${id}`, updatedData);
    setExpenses((prev) =>
      prev.map((e) => (e._id === updatedExpense._id ? updatedExpense : e))
    );
    return updatedExpense;
  }

  async function deleteExpense(id) {
    await apiDelete(`/expenses/${id}`);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  }

  const categoryBreakdown = useMemo(() => {
    if (!expenses.length) return [];
    const totals = {};
    let grandTotal = 0;

    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
      grandTotal += e.amount;
    });

    return Object.entries(totals).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / grandTotal) * 100).toFixed(2),
    }));
  }, [expenses]);

  const monthlyData = useMemo(() => {
    if (!expenses.length) return [];
    const map = {};

    expenses.forEach((e) => {
      const date = new Date(e.date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const key = `${year}-${monthIndex}`;

      if (!map[key]) {
        map[key] = {
          month: date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          sortValue: year * 12 + monthIndex,
          amount: 0,
        };
      }
      map[key].amount += e.amount;
    });

    return Object.values(map).sort((a, b) => a.sortValue - b.sortValue);
  }, [expenses]);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [expenses]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        addExpense,
        updateExpense,
        deleteExpense,
        fetchExpenses,
        categoryBreakdown,
        monthlyData,
        recentExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}
