import { Sun, Moon, Settings, ArrowLeft, ArrowRight } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';
import { useTheme } from '../hooks/useTheme';
import { getBudgetPeriod } from '../utils/dateUtils';

export default function Header({ isSettingsOpen, setIsSettingsOpen }) {
  const [state] = useBudget();
  const { effective, toggle } = useTheme();
  const { startDay } = state;
  const { label: periodLabel } = getBudgetPeriod(startDay);

  return (
    <header className="flex flex-col items-center px-4 py-6 sm:py-8 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="flex flex-col items-center gap-2">
        <h1 className="rounded-xl bg-[#faf7f2] px-4 py-2 shadow-sm">
          <img
            src="/brand/logo-horizontal-pollinations.jpg"
            alt="Budget ni Mama"
            className="w-64 sm:w-80 max-w-[85vw] h-auto object-contain rounded-lg"
          />
        </h1>
        <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-emerald-200">
          <ArrowLeft className="cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-300" />
          <span className="font-medium">{periodLabel}</span>
          <ArrowRight className="cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-300" />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 text-sm text-stone-500 dark:text-emerald-200 hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={toggle}
            aria-label={effective === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={effective === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center gap-2 p-2 rounded-lg text-stone-500 dark:text-emerald-200 hover:bg-stone-100 dark:hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-300"
          >
            {effective === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
