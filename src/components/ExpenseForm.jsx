import { useEffect, useState } from "react";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select.jsx";
import { EXPENSE_CATEGORIES } from "../types/expense.js";
import { useExpenseContext } from "../hooks/useExpenseContext.js";
import { analyzeExpenses } from "../lib/api.js";

function getInitialFormData(expense) {
  return {
    title: expense?.title || "",
    amount: expense?.amount?.toString() || "",
    category: expense?.category || "",
    date: expense?.date ? expense.date.split("T")[0] : "",
    notes: expense?.notes || "",
  };
}

export function ExpenseForm({ expense, onSubmit, onClose }) {
  const { expenses } = useExpenseContext();
  const [formData, setFormData] = useState(() => getInitialFormData(expense));
  const [categoryPrediction, setCategoryPrediction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (expense || !expenses.length || (!formData.title.trim() && !formData.amount)) {
      return undefined;
    }

    let isCurrent = true;
    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await analyzeExpenses(expenses, {
          title: formData.title,
          amount: formData.amount,
          notes: formData.notes,
        });

        if (isCurrent) {
          setCategoryPrediction(result.classifier?.category ? result.classifier : null);
        }
      } catch {
        if (isCurrent) {
          setCategoryPrediction(null);
        }
      }
    }, 350);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeoutId);
    };
  }, [expense, expenses, formData.amount, formData.notes, formData.title]);

  const visibleCategoryPrediction =
    expense || !expenses.length || (!formData.title.trim() && !formData.amount)
      ? null
      : categoryPrediction;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.notes,
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {expense ? "Edit Expense" : "Add Expense"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {visibleCategoryPrediction && visibleCategoryPrediction.category !== formData.category && (
              <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border bg-secondary/40 px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  AI predicts {visibleCategoryPrediction.category} with {visibleCategoryPrediction.confidence}% confidence
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange("category", visibleCategoryPrediction.category)}
                >
                  Use
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Notes (optional)</Label>
            <Input
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : expense ? "Update Expense" : "Add Expense"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
