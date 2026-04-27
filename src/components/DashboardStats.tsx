import { Gamepad2 } from "lucide-react";
import type { DailyStats } from "../types/task";

type DashboardStatsProps = {
  stats: DailyStats;
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section className="summary" aria-label="Daily progress">
      <div>
        <span>Play earned</span>
        <strong>{stats.gamingMinutesEarned} min</strong>
      </div>
      <Gamepad2 size={24} aria-hidden="true" />
      <p>
        {stats.completedTasks}/{stats.totalTasks} done ·{" "}
        {stats.completedWorkMinutes} min work
      </p>
    </section>
  );
}
