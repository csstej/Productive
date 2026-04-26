import type { DailyState } from "../types/task";

const STORAGE_KEY = "task-reward-tracker-state";

export function saveDailyState(state: DailyState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadDailyState(): DailyState | null {
  const rawState = localStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    return null;
  }

  try {
    return JSON.parse(rawState) as DailyState;
  } catch {
    return null;
  }
}

export function clearDailyState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

