import { Check, Pencil, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Task, TaskCategory } from "../types/task";
import { TASK_CATEGORIES } from "../types/task";
import { formatDuration } from "../utils/time";

type TaskCardProps = {
  task: Task;
  onToggleTask: (id: string) => void;
  onUpdateTask: (
    id: string,
    updates: Pick<Task, "title" | "category" | "estimatedMinutes" | "rewardMinutes">,
  ) => void;
  onDeleteTask: (id: string) => void;
};

export function TaskCard({
  task,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState<TaskCategory>(task.category);
  const [estimatedMinutes, setEstimatedMinutes] = useState(task.estimatedMinutes);
  const [rewardMinutes, setRewardMinutes] = useState(task.rewardMinutes);

  function resetDraft() {
    setTitle(task.title);
    setCategory(task.category);
    setEstimatedMinutes(task.estimatedMinutes);
    setRewardMinutes(task.rewardMinutes);
  }

  function handleCancel() {
    resetDraft();
    setIsEditing(false);
  }

  function handleSave() {
    const cleanTitle = title.trim();

    if (!cleanTitle || estimatedMinutes <= 0 || rewardMinutes < 0) {
      return;
    }

    onUpdateTask(task.id, {
      title: cleanTitle,
      category,
      estimatedMinutes,
      rewardMinutes,
    });
    setTitle(cleanTitle);
    setIsEditing(false);
  }

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
        {isEditing ? (
          <div className="task-edit-form">
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-label="Task title"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as TaskCategory)}
              aria-label="Task category"
            >
              {TASK_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={estimatedMinutes}
              onChange={(event) => setEstimatedMinutes(Number(event.target.value))}
              aria-label="Work minutes"
            />
            <input
              type="number"
              min="0"
              value={rewardMinutes}
              onChange={(event) => setRewardMinutes(Number(event.target.value))}
              aria-label="Reward minutes"
            />
          </div>
        ) : (
          <>
            <div className="task-card__heading">
              <h3>{task.title}</h3>
              <span>{task.category}</span>
            </div>
            <div className="task-card__meta">
              <span>{formatDuration(task.estimatedMinutes)} work</span>
              <span>{formatDuration(task.rewardMinutes)} play</span>
            </div>
          </>
        )}
      </div>

      <div className="task-card__actions">
        {isEditing ? (
          <>
            <button
              className="icon-button"
              type="button"
              onClick={handleSave}
              aria-label={`Save ${task.title}`}
              title="Save task"
            >
              <Save size={18} aria-hidden="true" />
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={handleCancel}
              aria-label={`Cancel editing ${task.title}`}
              title="Cancel edit"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <button
              className="icon-button"
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit ${task.title}`}
              title="Edit task"
            >
              <Pencil size={18} aria-hidden="true" />
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={() => onDeleteTask(task.id)}
              aria-label={`Delete ${task.title}`}
              title="Delete task"
            >
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </article>
  );
}
