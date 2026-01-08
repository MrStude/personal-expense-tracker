import { createContext, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";

export const ExpenseContext = createContext(undefined);

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // CHECK TOKEN BEFORE FETCH
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      fetchExpenses();
    } else {
      setLoading(false);
    }
  }, []);

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
  }

  async function updateExpense(id, updatedData) {
    const updatedExpense = await apiPut(`/expenses/${id}`, updatedData);
    setExpenses((prev) =>
      prev.map((e) => (e._id === updatedExpense._id ? updatedExpense : e))
    );
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
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!map[key]) {
        map[key] = {
          month: date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          amount: 0,
        };
      }
      map[key].amount += e.amount;
    });

    return Object.values(map);
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
        categoryBreakdown,
        monthlyData,
        recentExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}
