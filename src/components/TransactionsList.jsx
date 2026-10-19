import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { formatCurrency } from '../utils/currencyUtils';
import { Edit, Trash2, PlusCircle, ShoppingBag, Utensils, Truck, Film, Circle } from 'lucide-react';
import { getBudgetPeriod } from '../utils/dateUtils';

export default function TransactionsList({ setIsTransactionFormOpen, onEditTransaction }) {
  const [state, setState] = useBudget();
  const [filter, setFilter] = useState({
    type: 'all', // all, expense, income
    category: 'all',
    search: ''
  });

  const { startDay } = state;
  const { label: periodLabel } = getBudgetPeriod(startDay);

  // Filter transactions
  const filteredTransactions = state.transactions.filter(t => {
    // Type filter
    if (filter.type !== 'all' && t.type !== filter.type) return false;

    // Category filter
    if (filter.category !== 'all' && t.category !== filter.category) return false;

    // Search filter
    if (filter.search &&
        !t.description.toLowerCase().includes(filter.search.toLowerCase()) &&
        !(t.note || '').toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Sort by date descending (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  const handleOpenForm = () => {
    setIsTransactionFormOpen(true);
  };

  const handleEdit = (transaction) => {
    onEditTransaction(transaction);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const getTransactionIcon = (type, category) => {
    if (type === 'income') return 'PlusCircle';

    switch (category) {
      case 'Food': return 'Utensils';
      case 'Transport': return 'Truck';
      case 'Entertainment': return 'Film';
      case 'Shopping': return 'ShoppingBag';
      default: return 'Circle';
    }
  };

  const filterControlClass = "border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Transactions
        </h2>
        <button
          onClick={handleOpenForm}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          <PlusCircle className="h-4 w-4" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
        <select
          value={filter.type}
          onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
          className={filterControlClass}
        >
          <option value="all">All Types</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>

        <select
          value={filter.category}
          onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
          className={filterControlClass}
        >
          <option value="all">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Other Income">Other Income</option>
        </select>

        <input
          type="text"
          value={filter.search}
          onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
          placeholder="Search description or note..."
          className={`${filterControlClass} flex-1 min-w-[12rem]`}
        />

        <button
          onClick={() => setFilter({ type: 'all', category: 'all', search: '' })}
          className="px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-sm"
        >
          Clear
        </button>
      </div>

      {/* Empty State */}
      {sortedTransactions.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60 rounded-xl">
          <p className="text-stone-500 dark:text-stone-400">
            No transactions found. Add your first transaction to get started!
          </p>
        </div>
      )}

      {/* Transactions List */}
      {sortedTransactions.length > 0 && (
      <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60 rounded-xl shadow-sm overflow-hidden divide-y divide-stone-200 dark:divide-stone-700/60">
        {sortedTransactions.map(transaction => (
          <div key={transaction.id} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-700/40 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 md:flex-col">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-emerald-600/10 dark:bg-emerald-500/20 rounded-lg">
                    {getTransactionIcon(transaction.type, transaction.category) === 'PlusCircle' && (
                      <PlusCircle className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                    )}
                    {getTransactionIcon(transaction.type, transaction.category) === 'Utensils' && (
                      <Utensils className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                    )}
                    {getTransactionIcon(transaction.type, transaction.category) === 'Truck' && (
                      <Truck className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                    )}
                    {getTransactionIcon(transaction.type, transaction.category) === 'Film' && (
                      <Film className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                    )}
                    {getTransactionIcon(transaction.type, transaction.category) === 'ShoppingBag' && (
                      <ShoppingBag className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                    )}
                    {getTransactionIcon(transaction.type, transaction.category) === 'Circle' && (
                      <Circle className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-stone-900 dark:text-stone-100 line-clamp-1">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                    {transaction.note && ` • ${transaction.note}`}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-900 dark:text-stone-100'}`}>
                  {transaction.type === 'income'
                    ? `+${formatCurrency(transaction.amount)}`
                    : `-${formatCurrency(transaction.amount)}`}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(transaction)}
                    aria-label={`Edit ${transaction.description}`}
                    className="text-stone-400 dark:text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    aria-label={`Delete ${transaction.description}`}
                    className="text-stone-400 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
