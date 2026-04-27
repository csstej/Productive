import type { DailyHistory } from "../types/task";
import { formatDisplayDate } from "../utils/date";

type HistoryListProps = {
  history: DailyHistory[];
};

export function HistoryList({ history }: HistoryListProps) {
  const chartDays = [...history].reverse().slice(-7);
  const maxMinutes = Math.max(
    1,
    ...chartDays.map((day) =>
      Math.max(day.stats.completedWorkMinutes, day.stats.gamingMinutesEarned),
    ),
  );

  return (
    <section className="panel">
      <h2>History</h2>
      {history.length === 0 ? (
        <p className="history-empty">
          No history yet. Add tasks today, then reset or come back tomorrow to
          see daily progress here.
        </p>
      ) : null}
      {chartDays.length > 0 ? (
        <div className="history-chart" aria-label="Last 7 days progress">
          {chartDays.map((day) => {
            const workHeight = Math.max(
              4,
              Math.round((day.stats.completedWorkMinutes / maxMinutes) * 100),
            );
            const playHeight = Math.max(
              4,
              Math.round((day.stats.gamingMinutesEarned / maxMinutes) * 100),
            );
            const shortDate = new Intl.DateTimeFormat("en-US", {
              month: "numeric",
              day: "numeric",
            }).format(new Date(`${day.date}T00:00:00`));

            return (
              <div className="chart-day" key={day.date}>
                <div className="chart-bars">
                  <span
                    className="chart-bar chart-bar--work"
                    style={{ height: `${workHeight}%` }}
                    title={`${day.stats.completedWorkMinutes} min work`}
                  />
                  <span
                    className="chart-bar chart-bar--play"
                    style={{ height: `${playHeight}%` }}
                    title={`${day.stats.gamingMinutesEarned} min play`}
                  />
                </div>
                <small>{shortDate}</small>
              </div>
            );
          })}
        </div>
      ) : null}
      {chartDays.length > 0 ? (
        <div className="chart-legend" aria-hidden="true">
          <span>
            <i className="legend-dot legend-dot--work" /> Work
          </span>
          <span>
            <i className="legend-dot legend-dot--play" /> Play
          </span>
        </div>
      ) : null}
      <div className="history-list">
        {history.map((day) => (
          <article className="history-item" key={day.date}>
            <div>
              <strong>{formatDisplayDate(day.date)}</strong>
              <p>
                {day.stats.completedTasks}/{day.stats.totalTasks} done -{" "}
                {day.stats.completedWorkMinutes} min work -{" "}
                {day.stats.gamingMinutesEarned} min play
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
