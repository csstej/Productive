import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { DailyRuleCard } from "./components/DailyRuleCard";
import { DashboardStats } from "./components/DashboardStats";
import { HistoryList } from "./components/HistoryList";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import type { DailyHistory, DailyState, Task } from "./types/task";
import { createEmptyDailyState, formatDisplayDate, getTodayKey } from "./utils/date";
import {
  loadDailyHistory,
  loadDailyState,
  saveDailyHistory,
  saveDailyState,
  upsertDailyHistory,
} from "./utils/storage";
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

type InitialAppState = {
  dailyState: DailyState;
  history: DailyHistory[];
};

function getInitialAppState(): InitialAppState {
  const today = getTodayKey();
  const savedState = loadDailyState();
  const savedHistory = loadDailyHistory();

  if (!savedState || savedState.date !== today) {
    const history =
      savedState && savedState.date !== today
        ? upsertDailyHistory(savedHistory, savedState)
        : savedHistory;

    saveDailyHistory(history);

    return {
      dailyState: createEmptyDailyState(today),
      history,
    };
  }

  return {
    dailyState: savedState,
    history: savedHistory,
  };
}

export default function App() {
  const [initialAppState] = useState<InitialAppState>(getInitialAppState);
  const [dailyState, setDailyState] = useState<DailyState>(
    initialAppState.dailyState,
  );
  const [history, setHistory] = useState<DailyHistory[]>(
    initialAppState.history,
  );

  const stats = useMemo(
    () => calculateDailyStats(dailyState),
    [dailyState],
  );

  useEffect(() => {
    saveDailyState(dailyState);
  }, [dailyState]);

  useEffect(() => {
    setHistory((currentHistory) => {
      const nextHistory = upsertDailyHistory(currentHistory, dailyState);
      saveDailyHistory(nextHistory);
      return nextHistory;
    });
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

  function handleUpdateTask(
    id: string,
    updates: Pick<Task, "title" | "category" | "estimatedMinutes" | "rewardMinutes">,
  ) {
    setDailyState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task,
      ),
    }));
  }

  function handleResetDay() {
    const nextHistory = upsertDailyHistory(history, dailyState);
    setHistory(nextHistory);
    saveDailyHistory(nextHistory);
    setDailyState(createEmptyDailyState(getTodayKey()));
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>Productive</h1>
          <p>{formatDisplayDate(dailyState.date)}</p>
        </div>
        <button
          className="button button--secondary"
          type="button"
          onClick={handleResetDay}
        >
          <RotateCcw size={17} aria-hidden="true" />
          Reset
        </button>
      </header>

      <DashboardStats stats={stats} />

      <section className="panel">
        <h2>Add task</h2>
        <TaskForm onAddTask={handleAddTask} />
      </section>

      <section className="panel">
        <h2>Today</h2>
        <TaskList
          tasks={dailyState.tasks}
          onToggleTask={handleToggleTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      </section>

      <HistoryList history={history} />

      <DailyRuleCard />
    </main>
  );
}
