import type { Task } from "../types/task";
import { TaskCard } from "./TaskCard";

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onUpdateTask: (
    id: string,
    updates: Pick<Task, "title" | "category" | "estimatedMinutes" | "rewardMinutes">,
  ) => void;
  onDeleteTask: (id: string) => void;
};

export function TaskList({
  tasks,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <section className="empty-state" aria-label="No tasks yet">
        <h2>No quests planned yet</h2>
        <p>Add one clear, finishable task to start earning play time.</p>
      </section>
    );
  }

  return (
    <section className="task-list" aria-label="Today tasks">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </section>
  );
}
