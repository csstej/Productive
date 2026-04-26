import { Check, Trash2 } from "lucide-react";
import type { Task } from "../types/task";

type TaskCardProps = {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export function TaskCard({
  task,
  onToggleTask,
  onDeleteTask,
}: TaskCardProps) {
  return (
    <article className={`task-card${task.completed ? " is-complete" : ""}`}>
      <label className="task-card__check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
          aria-label={`Mark ${task.title} complete`}
        />
        <span>
          {task.completed ? <Check size={16} aria-hidden="true" /> : null}
        </span>
      </label>

      <div className="task-card__content">
        <div className="task-card__heading">
          <h3>{task.title}</h3>
          <span>{task.category}</span>
        </div>
        <div className="task-card__meta">
          <span>{task.estimatedMinutes}m work</span>
          <span>{task.rewardMinutes}m play</span>
        </div>
      </div>

      <button
        className="icon-button"
        type="button"
        onClick={() => onDeleteTask(task.id)}
        aria-label={`Delete ${task.title}`}
        title="Delete task"
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
    </article>
  );
}

