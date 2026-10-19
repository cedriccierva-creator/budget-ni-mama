import { useBudget } from '../hooks/useBudget';
import { formatCurrency } from '../utils/currencyUtils';

export default function BudgetSummary() {
  const [state] = useBudget();
  const { monthlyIncomeTarget, overallBudget, categoryBudgets, transactions } = state;

  // Calculate totals for current period (we'll assume all transactions are current for simplicity)
  // In a real app, we'd filter by period, but for now we'll use all transactions
  const totalIncome = monthlyIncomeTarget; // This is the target, not actual income
  const totalExtraIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalAvailable = totalIncome + totalExtraIncome;
  const remainingBalance = totalAvailable - totalSpent;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Monthly Income Target */}
      <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">Monthly Income Target</h3>
        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
          {formatCurrency(monthlyIncomeTarget)}
        </p>
        <div className="mt-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2.5">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: Math.min(100, (totalExtraIncome / monthlyIncomeTarget) * 100) + '%' }}
          ></div>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Extra income: {formatCurrency(totalExtraIncome)}
        </p>
      </div>

      {/* Total Spent */}
      <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">Total Spent</h3>
        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
          {formatCurrency(totalSpent)}
        </p>
        <div className="mt-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2.5">
          <div
            className="bg-red-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: Math.min(100, (totalSpent / totalAvailable) * 100) + '%' }}
          ></div>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          of {formatCurrency(totalAvailable)} available
        </p>
      </div>

      {/* Remaining Balance */}
      <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">Remaining Balance</h3>
        <p className={`text-2xl font-bold ${remainingBalance >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {formatCurrency(remainingBalance)}
        </p>
      </div>

      {/* Overall Budget */}
      <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">Overall Budget</h3>
        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
          {formatCurrency(overallBudget)}
        </p>
        <div className="mt-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2.5">
          <div
            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: Math.min(100, (totalSpent / overallBudget) * 100) + '%' }}
          ></div>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Spent: {formatCurrency(totalSpent)}
        </p>
      </div>
    </div>
  );
}
