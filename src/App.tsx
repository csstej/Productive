import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Sword } from "lucide-react";
import { DailyRuleCard } from "./components/DailyRuleCard";
import { DashboardStats } from "./components/DashboardStats";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import type { DailyState, Task } from "./types/task";
import { createEmptyDailyState, formatDisplayDate, getTodayKey } from "./utils/date";
import { loadDailyState, saveDailyState } from "./utils/storage";
import { calculateDailyStats } from "./utils/stats";

function createTask(
  input: Omit<Task, "id" | "completed" | "createdAt" | "completedAt">,
): Task {
  return {
    ...input,
    id: crypto.randomUUID(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

function getInitialDailyState(): DailyState {
  const today = getTodayKey();
  const savedState = loadDailyState();

  if (!savedState || savedState.date !== today) {
    return createEmptyDailyState(today);
  }

  return savedState;
}

export default function App() {
  const [dailyState, setDailyState] =
    useState<DailyState>(getInitialDailyState);

  const stats = useMemo(
    () => calculateDailyStats(dailyState),
    [dailyState],
  );

  useEffect(() => {
    saveDailyState(dailyState);
  }, [dailyState]);

  function handleAddTask(
    taskInput: Omit<Task, "id" | "completed" | "createdAt" | "completedAt">,
  ) {
    setDailyState((current) => ({
      ...current,
      tasks: [createTask(taskInput), ...current.tasks],
    }));
  }

  function handleToggleTask(id: string) {
    setDailyState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => {
        if (task.id !== id) {
          return task;
        }

        const completed = !task.completed;

        return {
          ...task,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
        };
      }),
    }));
  }

  function handleDeleteTask(id: string) {
    setDailyState((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== id),
    }));
  }

  function handleResetDay() {
    setDailyState(createEmptyDailyState(getTodayKey()));
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Personal quest log</p>
          <h1>Task Reward Tracker</h1>
          <p className="hero-panel__date">{formatDisplayDate(dailyState.date)}</p>
        </div>
        <button
          className="button button--secondary"
          type="button"
          onClick={handleResetDay}
        >
          <RotateCcw size={17} aria-hidden="true" />
          Reset today
        </button>
      </section>

      <DashboardStats stats={stats} />

      <section className="workspace-grid">
        <div className="panel">
          <div className="section-heading">
            <Sword size={20} aria-hidden="true" />
            <div>
              <p className="eyebrow">Plan the next win</p>
              <h2>Add a quest</h2>
            </div>
          </div>
          <TaskForm onAddTask={handleAddTask} />
          <DailyRuleCard />
        </div>

        <div className="panel panel--tasks">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Today</p>
              <h2>Quest list</h2>
            </div>
          </div>
          <TaskList
            tasks={dailyState.tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </section>
    </main>
  );
}

