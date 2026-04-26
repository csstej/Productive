import type { DailyState } from "../types/task";

export function getTodayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function formatDisplayDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function createEmptyDailyState(date = getTodayKey()): DailyState {
  return {
    date,
    tasks: [],
    gamingMinutesUsed: 0,
  };
}

