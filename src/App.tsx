import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { AuthPanel } from "./components/AuthPanel";
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
import { loadRemoteAppData, saveRemoteAppData } from "./utils/remoteStorage";
import { isSupabaseConfigured, supabase } from "./utils/supabase";

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

function normalizeAppState(
  savedState: DailyState | null,
  savedHistory: DailyHistory[],
): InitialAppState {
  const today = getTodayKey();

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

function getInitialAppState(): InitialAppState {
  return normalizeAppState(loadDailyState(), loadDailyHistory());
}

function getAuthRedirectUrl(): string {
  if (window.location.hostname === "csstej.github.io") {
    return "https://csstej.github.io/Productive/";
  }

  return `${window.location.origin}${import.meta.env.BASE_URL}`;
}

export default function App() {
  const [initialAppState] = useState<InitialAppState>(getInitialAppState);
  const [dailyState, setDailyState] = useState<DailyState>(
    initialAppState.dailyState,
  );
  const [history, setHistory] = useState<DailyHistory[]>(
    initialAppState.history,
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isRemoteReady, setIsRemoteReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState(
    isSupabaseConfigured ? "Not logged in" : "Local only",
  );
  const authRedirectUrl = getAuthRedirectUrl();

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

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const cleanAuthUrl = () => {
      if (window.location.search || window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      setUserId(user?.id ?? null);
      setUserEmail(user?.email ?? null);
      if (user) {
        cleanAuthUrl();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUserId(user?.id ?? null);
      setUserEmail(user?.email ?? null);
      setIsRemoteReady(false);
      setSyncStatus(user ? "Loading account" : "Not logged in");
      if (user) {
        cleanAuthUrl();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setIsRemoteReady(false);
      return;
    }

    let isMounted = true;
    const activeUserId = userId;

    async function loadAccountData() {
      setSyncStatus("Loading account");

      try {
        const remoteData = await loadRemoteAppData(activeUserId);

        if (!isMounted) {
          return;
        }

        if (remoteData) {
          const normalized = normalizeAppState(
            remoteData.dailyState,
            remoteData.history,
          );
          setDailyState(normalized.dailyState);
          setHistory(normalized.history);
          saveDailyState(normalized.dailyState);
          saveDailyHistory(normalized.history);
        } else {
          await saveRemoteAppData(activeUserId, { dailyState, history });
        }

        if (isMounted) {
          setIsRemoteReady(true);
          setSyncStatus("Synced");
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error ? error.message : "Could not load account";
          setSyncStatus(`Sync error: ${message}`);
        }
      }
    }

    loadAccountData();

    return () => {
      isMounted = false;
    };
    // Only run when the account changes; current local state is used for first upload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!userId || !isRemoteReady) {
      return;
    }

    let isMounted = true;
    setSyncStatus("Saving");

    const timeoutId = window.setTimeout(() => {
      saveRemoteAppData(userId, { dailyState, history })
        .then(() => {
          if (isMounted) {
            setSyncStatus("Synced");
          }
        })
        .catch((error) => {
          if (isMounted) {
            const message =
              error instanceof Error ? error.message : "Could not save account";
            setSyncStatus(`Sync error: ${message}`);
          }
        });
    }, 350);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [dailyState, history, isRemoteReady, userId]);

  async function handleSignIn(email: string) {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: authRedirectUrl,
      },
    });

    if (error) {
      throw error;
    }
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUserId(null);
    setUserEmail(null);
    setIsRemoteReady(false);
    setSyncStatus("Not logged in");
  }

  async function handleSyncNow() {
    if (!userId) {
      return;
    }

    setSyncStatus("Saving");

    try {
      await saveRemoteAppData(userId, { dailyState, history });
      setIsRemoteReady(true);
      setSyncStatus("Synced");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save account";
      setSyncStatus(`Sync error: ${message}`);
    }
  }

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
        task.id === id && !task.editedAt
          ? { ...task, ...updates, editedAt: new Date().toISOString() }
          : task,
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

      <AuthPanel
        isConfigured={isSupabaseConfigured}
        userEmail={userEmail}
        redirectUrl={authRedirectUrl}
        syncStatus={syncStatus}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onSyncNow={handleSyncNow}
      />

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
