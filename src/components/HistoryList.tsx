import type { DailyHistory } from "../types/task";
import { formatDisplayDate } from "../utils/date";
import { formatDuration } from "../utils/time";

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
                    title={`${formatDuration(day.stats.completedWorkMinutes)} work`}
                  />
                  <span
                    className="chart-bar chart-bar--play"
                    style={{ height: `${playHeight}%` }}
                    title={`${formatDuration(day.stats.gamingMinutesEarned)} play`}
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
          <details className="history-item" key={day.date}>
            <summary>
              <div>
                <strong>{formatDisplayDate(day.date)}</strong>
                <p>
                  {day.stats.completedTasks}/{day.stats.totalTasks} done -{" "}
                  {formatDuration(day.stats.completedWorkMinutes)} work -{" "}
                  {formatDuration(day.stats.gamingMinutesEarned)} play
                </p>
              </div>
            </summary>

            <div className="history-detail-list">
              {day.tasks.map((task) => (
                <article
                  className={`history-task${task.completed ? " is-complete" : ""}`}
                  key={task.id}
                >
                  <div>
                    <strong>{task.title}</strong>
                    <p>
                      {task.category} - {task.completed ? "Done" : "Not done"}
                    </p>
                  </div>
                  <p className="history-task__time">
                    {formatDuration(task.estimatedMinutes)} work
                    {task.completed
                      ? ` - ${formatDuration(task.rewardMinutes)} play`
                      : ""}
                  </p>
                </article>
              ))}
            </div>

            {day.tasks.length === 0 ? (
              <p>
                No tasks were saved for this day.
              </p>
            ) : null}
          </details>
        ))}
      </div>
    </section>
  );
}
