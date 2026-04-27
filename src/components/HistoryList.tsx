import type { DailyHistory } from "../types/task";
import { formatDisplayDate } from "../utils/date";

type HistoryListProps = {
  history: DailyHistory[];
};

export function HistoryList({ history }: HistoryListProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <section className="panel">
      <h2>History</h2>
      <div className="history-list">
        {history.map((day) => (
          <article className="history-item" key={day.date}>
            <div>
              <strong>{formatDisplayDate(day.date)}</strong>
              <p>
                {day.stats.completedTasks}/{day.stats.totalTasks} done ·{" "}
                {day.stats.completedWorkMinutes} min work ·{" "}
                {day.stats.gamingMinutesEarned} min play
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
