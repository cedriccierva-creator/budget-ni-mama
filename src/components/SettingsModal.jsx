import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { useTheme } from '../hooks/useTheme';
import { Save, X } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }) {
  const [state, setState] = useBudget();
  const { preference, setTheme } = useTheme();
  const [form, setForm] = useState({
    monthlyIncomeTarget: state.monthlyIncomeTarget.toString(),
    overallBudget: state.overallBudget.toString(),
    food: state.categoryBudgets.food.toString(),
    transport: state.categoryBudgets.transport.toString(),
    entertainment: state.categoryBudgets.entertainment.toString(),
    shopping: state.categoryBudgets.shopping.toString(),
    startDay: state.startDay.toString()
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validate
    const monthlyIncomeTarget = parseFloat(form.monthlyIncomeTarget);
    const overallBudget = parseFloat(form.overallBudget);
    const food = parseFloat(form.food);
    const transport = parseFloat(form.transport);
    const entertainment = parseFloat(form.entertainment);
    const shopping = parseFloat(form.shopping);
    const startDay = parseInt(form.startDay, 10);

    if (isNaN(monthlyIncomeTarget) || monthlyIncomeTarget < 0) {
      setError('Monthly income target must be a valid non-negative number');
      setSubmitting(false);
      return;
    }
    if (isNaN(overallBudget) || overallBudget < 0) {
      setError('Overall budget must be a valid non-negative number');
      setSubmitting(false);
      return;
    }
    if (isNaN(food) || food < 0) {
      setError('Food budget must be a valid non-negative number');
      setSubmitting(false);
      return;
    }
    if (isNaN(transport) || transport < 0) {
      setError('Transport budget must be a valid non-negative number');
      setSubmitting(false);
      return;
    }
    if (isNaN(entertainment) || entertainment < 0) {
      setError('Entertainment budget must be a valid non-negative number');
      setSubmitting(false);
      return;
    }
    if (isNaN(shopping) || shopping < 0) {
      setError('Shopping budget must be a valid non-negative number');
      setSubmitting(false);
      return;
    }
    if (isNaN(startDay) || startDay < 1 || startDay > 28 || !Number.isInteger(startDay)) {
      setError('Start day must be an integer between 1 and 28');
      setSubmitting(false);
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        monthlyIncomeTarget,
        overallBudget,
        categoryBudgets: {
          food,
          transport,
          entertainment,
          shopping
        },
        startDay
      }));

      onClose();
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const appearanceOptions = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-5 pb-5 border-b border-stone-200 dark:border-stone-800">
          <span className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Appearance
          </span>
          <div role="radiogroup" aria-label="Appearance" className="grid grid-cols-3 gap-2">
            {appearanceOptions.map((opt) => {
              const selected = preference === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setTheme(opt.value)}
                  className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                    selected
                      ? 'border-emerald-600 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300'
                      : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
            System follows your device setting.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monthly Income Target (PHP)
            </label>
            <input
              type="number"
              name="monthlyIncomeTarget"
              value={form.monthlyIncomeTarget}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="0.00"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Overall Monthly Budget (PHP)
            </label>
            <input
              type="number"
              name="overallBudget"
              value={form.overallBudget}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="0.00"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Food Budget (PHP)
            </label>
            <input
              type="number"
              name="food"
              value={form.food}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="0.00"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transport Budget (PHP)
            </label>
            <input
              type="number"
              name="transport"
              value={form.transport}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="0.00"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Entertainment Budget (PHP)
            </label>
            <input
              type="number"
              name="entertainment"
              value={form.entertainment}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="0.00"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Shopping Budget (PHP)
            </label>
            <input
              type="number"
              name="shopping"
              value={form.shopping}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="0.00"
              required
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monthly Budget Start Day (1-28)
            </label>
            <input
              type="number"
              name="startDay"
              value={form.startDay}
              onChange={handleChange}
              min="1"
              max="28"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100"
              placeholder="1"
              required
              disabled={submitting}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
