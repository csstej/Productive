export const TASK_CATEGORIES = [
  "Business",
  "Creative",
  "Writing",
  "Drawing",
  "Music",
  "Learning",
  "Admin",
  "Health",
  "Other",
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export type Task = {
  id: string;
  title: string;
  category: TaskCategory;
  estimatedMinutes: number;
  rewardMinutes: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
};

export type DailyState = {
  date: string;
  tasks: Task[];
  gamingMinutesUsed: number;
};

export type DailyStats = {
  totalTasks: number;
  completedTasks: number;
  completionPercent: number;
  plannedWorkMinutes: number;
  completedWorkMinutes: number;
  gamingMinutesEarned: number;
  gamingMinutesUsed: number;
  gamingMinutesRemaining: number;
};

