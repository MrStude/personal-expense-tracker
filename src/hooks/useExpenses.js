// src/hooks/useExpenses.js
import { useState, useEffect, useMemo } from "react";
import { apiGet, apiPost, apiDelete  } from "../lib/api";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FETCH EXPENSES */
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const data = await apiGet("/expenses");
        setExpenses(data);
      } catch (err) {
        console.error("Fetch expenses failed", err);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, []);

  //ADD EXPENSE
  async function addExpense(expenseData) {
    const newExpense = await apiPost("/expenses", expenseData);
    setExpenses((prev) => [newExpense, ...prev]);
  }

  //UPDATE EXPENSE
  const updateExpense = async (id, data) => {
    const updated = await apiPost(`/expenses/${id}`, data);
    setExpenses((prev) =>
      prev.map((e) => (e._id === id ? updated : e))
    );
  };

  //DELETE EXPENSE
  async function deleteExpense(id) {
    if (!id) {
      console.error("Expense ID missing");
      return;
    }

    await apiDelete(`/expenses/${id}`);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  }
  
  //CATEGORY BREAKDOWN (PIE)
  const categoryBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });

    const total = expenses.reduce((s, e) => s + e.amount, 0);

    return Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
      percentage: total ? (amount / total) * 100 : 0,
    }));
  }, [expenses]);

  // MONTHLY DATA (LINE)
  const monthlyData = useMemo(() => {
    const months = {};

    expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = d.toLocaleString("default", { month: "short" });

      months[key] = (months[key] || 0) + e.amount;
    });

    return Object.entries(months).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [expenses]);

  //RECENT EXPENSES
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [expenses]);

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    categoryBreakdown,
    monthlyData,
    recentExpenses,
  };
}
