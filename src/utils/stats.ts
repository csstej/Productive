import type { DailyState, DailyStats } from "../types/task";

export function calculateDailyStats(state: DailyState): DailyStats {
  const completedTasks = state.tasks.filter((task) => task.completed);
  const plannedWorkMinutes = state.tasks.reduce(
    (total, task) => total + task.estimatedMinutes,
    0,
  );
  const completedWorkMinutes = completedTasks.reduce(
    (total, task) => total + task.estimatedMinutes,
    0,
  );
  const gamingMinutesEarned = completedTasks.reduce(
    (total, task) => total + task.rewardMinutes,
    0,
  );

  return {
    totalTasks: state.tasks.length,
    completedTasks: completedTasks.length,
    completionPercent:
      state.tasks.length === 0
        ? 0
        : Math.round((completedTasks.length / state.tasks.length) * 100),
    plannedWorkMinutes,
    completedWorkMinutes,
    gamingMinutesEarned,
    gamingMinutesUsed: state.gamingMinutesUsed,
    gamingMinutesRemaining: Math.max(
      gamingMinutesEarned - state.gamingMinutesUsed,
      0,
    ),
  };
}

