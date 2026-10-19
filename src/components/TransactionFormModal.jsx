import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { Save, X, CheckCircle } from 'lucide-react';

// Simple ID generator to avoid external dependency
const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

export default function TransactionFormModal({ isOpen, onClose, transactionToEdit = null }) {
  const [state, setState] = useBudget();
  const isEditing = transactionToEdit !== null;
  // Modal mounts fresh on each open (conditional render in App), so seeding
  // form state from the prop initializer is safe for both modes.
  const [form, setForm] = useState(() => isEditing ? {
    amount: transactionToEdit.amount.toString(),
    type: transactionToEdit.type,
    date: transactionToEdit.date,
    category: transactionToEdit.category,
    description: transactionToEdit.description,
    note: transactionToEdit.note || ''
  } : {
    amount: '',
    type: 'expense', // expense or income
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    note: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = {
    expense: ['Food', 'Transport', 'Entertainment', 'Shopping'],
    income: ['Other Income'] // extra income category
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      // Keep category valid when switching type (expense <-> income).
      if (name === 'type' && !categories[value].includes(prev.category)) {
        next.category = '';
      }
      return next;
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validate
    if (!form.amount || parseFloat(form.amount) <= 0) {
      setError('Please enter a valid positive amount');
      setSubmitting(false);
      return;
    }
    if (!form.description.trim()) {
      setError('Description is required');
      setSubmitting(false);
      return;
    }
    if (!form.category) {
      setError('Please select a category');
      setSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        const updatedTransaction = {
          ...transactionToEdit,
          amount: parseFloat(form.amount),
          type: form.type,
          date: form.date,
          category: form.category,
          description: form.description.trim(),
          note: form.note.trim() || undefined
        };

        setState(prev => ({
          ...prev,
          transactions: prev.transactions.map(t =>
            t.id === transactionToEdit.id ? updatedTransaction : t
          )
        }));
      } else {
        const newTransaction = {
          id: generateId(),
          amount: parseFloat(form.amount),
          type: form.type,
          date: form.date,
          category: form.category,
          description: form.description.trim(),
          note: form.note.trim() || undefined
        };

        setState(prev => ({
          ...prev,
          transactions: [newTransaction, ...prev.transactions]
        }));
      }

      // Reset form
      setForm({
        amount: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: '',
        note: ''
      });
      onClose();
    } catch (err) {
      setError('Failed to save transaction');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = "w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  const labelClass = "block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {isEditing ? 'Edit Transaction' : (form.type === 'expense' ? 'Add Expense' : 'Add Extra Income')}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>
              Amount (PHP)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className={fieldClass}
              placeholder="0.00"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className={labelClass}>
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={form.type === 'expense'}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 accent-emerald-600"
                  disabled={submitting}
                />
                Expense
              </label>
              <label className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={form.type === 'income'}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 accent-emerald-600"
                  disabled={submitting}
                />
                Extra Income
              </label>
            </div>
          </div>
          <div>
            <label className={labelClass}>
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={fieldClass}
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className={labelClass}>
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={fieldClass}
              required
              disabled={submitting}
            >
              <option value="">Select a category</option>
              {categories[form.type].map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>
              Description / Merchant
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={fieldClass}
              placeholder="e.g., Grocery store, Salary"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className={labelClass}>
              Note (optional)
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className={fieldClass}
              placeholder="Any additional details"
              disabled={submitting}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !form.amount || !form.description || !form.category}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {submitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Save Transaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
