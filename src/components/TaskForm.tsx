import { FormEvent, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { Task, TaskCategory } from "../types/task";
import { TASK_CATEGORIES } from "../types/task";

type TaskFormProps = {
  onAddTask: (
    task: Omit<Task, "id" | "completed" | "createdAt" | "completedAt">,
  ) => void;
};

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Sadhana");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [rewardMinutes, setRewardMinutes] = useState(15);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const titleError = wasSubmitted && title.trim().length === 0;
  const workError = wasSubmitted && estimatedMinutes <= 0;
  const rewardError = wasSubmitted && rewardMinutes < 0;
  const isValid = useMemo(
    () => title.trim().length > 0 && estimatedMinutes > 0 && rewardMinutes >= 0,
    [estimatedMinutes, rewardMinutes, title],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWasSubmitted(true);

    if (!isValid) {
      return;
    }

    onAddTask({
      title: title.trim(),
      category,
      estimatedMinutes,
      rewardMinutes,
    });

    setTitle("");
    setEstimatedMinutes(30);
    setRewardMinutes(15);
    setWasSubmitted(false);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row form-row--title">
        <label htmlFor="task-title">Quest title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Write 300 words"
          aria-invalid={titleError}
        />
        {titleError ? <span className="field-error">Add a finish line.</span> : null}
      </div>

      <div className="form-row">
        <label htmlFor="task-category">Category</label>
        <select
          id="task-category"
          value={category}
          onChange={(event) => setCategory(event.target.value as TaskCategory)}
        >
          {TASK_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="work-minutes">Work min</label>
        <input
          id="work-minutes"
          type="number"
          min="1"
          value={estimatedMinutes}
          onChange={(event) => setEstimatedMinutes(Number(event.target.value))}
          aria-invalid={workError}
        />
        {workError ? <span className="field-error">Use at least 1.</span> : null}
      </div>

      <div className="form-row">
        <label htmlFor="reward-minutes">Reward min</label>
        <input
          id="reward-minutes"
          type="number"
          min="0"
          value={rewardMinutes}
          onChange={(event) => setRewardMinutes(Number(event.target.value))}
          aria-invalid={rewardError}
        />
        {rewardError ? <span className="field-error">Use 0 or more.</span> : null}
      </div>

      <button className="button button--primary" type="submit">
        <Plus size={18} aria-hidden="true" />
        Add
      </button>
    </form>
  );
}
