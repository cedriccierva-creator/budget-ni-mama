import { useSyncExternalStore, useCallback } from 'react';

const STORAGE_KEY = 'budget-ni-mama:v1';

// Every component called useBudget() and got its own useState copy, so a save
// only updated the modal's instance and unmounting wrote stale state over the
// others'. One module-level store keeps the same [state, setState] shape.
let state = loadState();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save budget data', e);
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate structure
      if (parsed && typeof parsed === 'object') {
        // Ensure required fields exist
        return {
          transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
          monthlyIncomeTarget: typeof parsed.monthlyIncomeTarget === 'number' ? parsed.monthlyIncomeTarget : 0,
          overallBudget: typeof parsed.overallBudget === 'number' ? parsed.overallBudget : 0,
          categoryBudgets: typeof parsed.categoryBudgets === 'object' && parsed.categoryBudgets !== null ? parsed.categoryBudgets : {
            food: 0,
            transport: 0,
            entertainment: 0,
            shopping: 0
          },
          startDay: typeof parsed.startDay === 'number' && parsed.startDay >= 1 && parsed.startDay <= 28 ? parsed.startDay : 1
        };
      }
    }
  } catch (e) {
    // Corrupted data
    console.warn('Failed to parse budget data', e);
  }
  // Default state
  return {
    transactions: [],
    monthlyIncomeTarget: 0,
    overallBudget: 0,
    categoryBudgets: {
      food: 0,
      transport: 0,
      entertainment: 0,
      shopping: 0
    },
    startDay: 1
  };
}

export function useBudget() {
  const setStateCallback = useCallback((updater) => {
    state = typeof updater === 'function' ? updater(state) : updater;
    persist();
    listeners.forEach(listener => listener());
  }, []);

  return [useSyncExternalStore(subscribe, getSnapshot), setStateCallback];
}
