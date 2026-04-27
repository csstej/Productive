import { Gamepad2 } from "lucide-react";
import type { DailyStats } from "../types/task";
import { formatDuration } from "../utils/time";

type DashboardStatsProps = {
  stats: DailyStats;
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section className="summary" aria-label="Daily progress">
      <div>
        <span>Play earned</span>
        <strong>{formatDuration(stats.gamingMinutesEarned)}</strong>
      </div>
      <Gamepad2 size={24} aria-hidden="true" />
      <p>
        {stats.completedTasks}/{stats.totalTasks} done ·{" "}
        {formatDuration(stats.completedWorkMinutes)} work
      </p>
    </section>
  );
}
