import { useSyncExternalStore } from 'react';

const THEME_KEY = 'budget-ni-mama-theme';
const VALID = ['system', 'light', 'dark'];

function loadPreference() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (VALID.includes(saved)) return saved;
  } catch {
    // private mode etc. — fall through to default
  }
  return 'system';
}

function resolveEffective(preference) {
  if (preference === 'light') return 'light';
  if (preference === 'dark') return 'dark';
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function applyToDocument(effective) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', effective === 'dark');
  root.dataset.theme = effective;
  root.style.colorScheme = effective;
}

// Single shared snapshot so Header + Settings never diverge.
let snapshot = {
  preference: loadPreference(),
  effective: resolveEffective(loadPreference()),
};
const listeners = new Set();
let mediaWatching = false;

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  // Follow OS changes while preference is system.
  if (!mediaWatching && typeof window !== 'undefined' && window.matchMedia) {
    mediaWatching = true;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (snapshot.preference !== 'system') return;
      const effective = mq.matches ? 'dark' : 'light';
      if (effective !== snapshot.effective) {
        snapshot = { ...snapshot, effective };
        applyToDocument(effective);
        emit();
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
  return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;

export function setThemePreference(next) {
  if (!VALID.includes(next)) return;
  snapshot = { preference: next, effective: resolveEffective(next) };
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // storage unavailable — theme still applies for this session
  }
  applyToDocument(snapshot.effective);
  emit();
}

// Header toggle flips the effective appearance; preference stays the truth.
export function toggleEffectiveTheme() {
  setThemePreference(snapshot.effective === 'dark' ? 'light' : 'dark');
}

export function useTheme() {
  const snap = useSyncExternalStore(subscribe, getSnapshot);
  return {
    preference: snap.preference,
    effective: snap.effective,
    setTheme: setThemePreference,
    toggle: toggleEffectiveTheme,
  };
}

// Applied once at module load so first paint already matches.
applyToDocument(snapshot.effective);
