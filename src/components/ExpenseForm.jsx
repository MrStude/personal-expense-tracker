import { useState, useEffect } from "react";
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

export function ExpenseForm({ expense, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || "",
        amount: expense.amount?.toString() || "",
        category: expense.category || "",
        date: expense.date ? expense.date.split("T")[0] : "",
        notes: expense.notes || "",
      });
    }
  }, [expense]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      title: formData.title,
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes,
    });

    onClose(); // ✅ CLOSE FORM AFTER ADD
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {expense ? "Edit Expense" : "Add Expense"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              required
            />
          </div>

          {/* Category */}
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
          </div>

          {/* Date */}
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <Label>Notes (optional)</Label>
            <Input
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {expense ? "Update Expense" : "Add Expense"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
