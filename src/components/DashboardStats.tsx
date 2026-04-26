import { CheckCircle2, Gamepad2, ListChecks, Timer } from "lucide-react";
import type { DailyStats } from "../types/task";

type DashboardStatsProps = {
  stats: DailyStats;
};

const cards = [
  {
    key: "completion",
    label: "Complete",
    icon: CheckCircle2,
    getValue: (stats: DailyStats) => `${stats.completionPercent}%`,
    getMeta: (stats: DailyStats) =>
      `${stats.completedTasks} of ${stats.totalTasks} quests`,
  },
  {
    key: "tasks",
    label: "Tasks Done",
    icon: ListChecks,
    getValue: (stats: DailyStats) =>
      `${stats.completedTasks}/${stats.totalTasks}`,
    getMeta: () => "Clear wins logged",
  },
  {
    key: "work",
    label: "Work Finished",
    icon: Timer,
    getValue: (stats: DailyStats) => `${stats.completedWorkMinutes}m`,
    getMeta: (stats: DailyStats) => `${stats.plannedWorkMinutes}m planned`,
  },
  {
    key: "gaming",
    label: "Play Earned",
    icon: Gamepad2,
    getValue: (stats: DailyStats) => `${stats.gamingMinutesEarned}m`,
    getMeta: (stats: DailyStats) => `${stats.gamingMinutesRemaining}m ready`,
  },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section className="stats-grid" aria-label="Daily progress">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article className="stat-card" key={card.key}>
            <div className="stat-card__topline">
              <span>{card.label}</span>
              <Icon size={18} aria-hidden="true" />
            </div>
            <strong>{card.getValue(stats)}</strong>
            <small>{card.getMeta(stats)}</small>
          </article>
        );
      })}
    </section>
  );
}

