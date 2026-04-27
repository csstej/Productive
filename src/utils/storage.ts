import type { DailyHistory, DailyState } from "../types/task";
import { calculateDailyStats } from "./stats";

const STORAGE_KEY = "task-reward-tracker-state";
const HISTORY_STORAGE_KEY = "task-reward-tracker-history";

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

export function saveDailyHistory(history: DailyHistory[]): void {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

export function loadDailyHistory(): DailyHistory[] {
  const rawHistory = localStorage.getItem(HISTORY_STORAGE_KEY);

  if (!rawHistory) {
    return [];
  }

  try {
    return JSON.parse(rawHistory) as DailyHistory[];
  } catch {
    return [];
  }
}

export function createDailyHistoryEntry(state: DailyState): DailyHistory {
  return {
    date: state.date,
    tasks: state.tasks,
    stats: calculateDailyStats(state),
    savedAt: new Date().toISOString(),
  };
}

export function upsertDailyHistory(
  history: DailyHistory[],
  state: DailyState,
): DailyHistory[] {
  if (state.tasks.length === 0) {
    return history;
  }

  const nextEntry = createDailyHistoryEntry(state);

  return [
    nextEntry,
    ...history.filter((entry) => entry.date !== state.date),
  ].slice(0, 30);
}
