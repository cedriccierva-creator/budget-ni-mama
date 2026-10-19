import { Utensils, Truck, Film, ShoppingBag, Circle } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { formatCurrency } from '../utils/currencyUtils';

export default function CategoryBudgetCard({ category }) {
  const [state] = useBudget();
  const { categoryBudgets, transactions } = state;

  const budget = categoryBudgets[category.toLowerCase()] || 0;
  const spent = transactions
    .filter(t => t.type === 'expense' && t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);
  const remaining = budget - spent;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;

  // Map category to icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Food': return Utensils;
      case 'Transport': return Truck;
      case 'Entertainment': return Film;
      case 'Shopping': return ShoppingBag;
      default: return Circle;
    }
  };

  const Icon = getCategoryIcon(category);

  return (
    <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-emerald-600/10 dark:bg-emerald-500/20 rounded-lg">
          <Icon className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-stone-700 dark:text-stone-200">
            {category}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Budget: {formatCurrency(budget)}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium text-stone-700 dark:text-stone-200 mb-1">
          {formatCurrency(spent)} of {formatCurrency(budget)}
        </p>
        <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2.5">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: Math.min(100, percentage) + '%' }}
          ></div>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex justify-between">
          <span>Remaining: {formatCurrency(remaining)}</span>
          <span>{percentage.toFixed(0)}%</span>
        </p>
      </div>
    </div>
  );
}
