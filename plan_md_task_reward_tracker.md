# Plan.md — Task Reward Tracker App

## 1. Product Summary

Build a simple task-based productivity app where the user completes real-life tasks and earns gaming time as a reward.

The app is designed for someone who wants to redirect the motivation loop they get from video games toward business, creative work, writing, drawing, music, and self-improvement.

The core idea:

> Complete clear, finishable tasks → earn gaming minutes → track progress → slowly build intrinsic motivation.

This should start as a simple, lightweight personal tracker, not a complicated productivity platform.

---

## 2. Core Philosophy

The app should feel like a small personal quest system.

It should not feel like a corporate task manager.

The emotional goal is:

- Make real-life goals feel clear and achievable.
- Give the user a visible sense of progress.
- Use gaming as a structured reward, not an uncontrolled default behavior.
- Eventually help the user rely less on gaming rewards as the work itself becomes satisfying.

Important design principle:

> The app should reduce friction, not create more planning overhead.

---

## 3. MVP Goal

The MVP should let the user:

1. Create tasks for the day.
2. Assign each task a work duration.
3. Assign each task a gaming reward duration.
4. Mark tasks as complete.
5. Automatically calculate total gaming time earned.
6. See daily progress clearly.
7. Reset or start a new day.
8. Persist data locally.

---

## 4. Target User

Primary user:

- A solo builder / creative person.
- Wants to build a business, draw, write stories, make music, and improve skills.
- Gets strong motivation from video games.
- Wants to use that same motivation loop to build real-world momentum.

---

## 5. MVP Features

### 5.1 Daily Task List

User can create tasks such as:

- Validate one business idea.
- Write 300 words.
- Draw for 30 minutes.
- Make one melody loop.
- Read 10 pages.
- Code one small feature.

Each task should include:

- Task title.
- Category.
- Estimated work minutes.
- Gaming reward minutes.
- Completion status.

Suggested default categories:

- Business
- Creative
- Learning
- Admin
- Health
- Other

---

### 5.2 Reward Calculation

When a task is completed, the app adds its reward minutes to the daily earned gaming time.

Example:

| Task | Work Time | Reward |
|---|---:|---:|
| Write 300 words | 30 min | 15 min gaming |
| Make one beat loop | 45 min | 20 min gaming |
| Research 3 startup ideas | 60 min | 30 min gaming |

If all are completed:

Total gaming time earned = 65 minutes.

---

### 5.3 Daily Progress Dashboard

The dashboard should show:

- Total tasks completed.
- Total tasks planned.
- Percentage complete.
- Total work minutes completed.
- Total gaming minutes earned.
- Total gaming minutes used, optional in later MVP.

MVP can start with earned gaming minutes only.

---

### 5.4 Simple Rule Display

The app should show a simple reminder:

> No default gaming. Finish one clear task, then play the minutes you earned. Once earned, enjoy it without guilt.

This keeps the system emotionally clean.

---

### 5.5 Local Persistence

For MVP, use browser localStorage.

Data should persist after refresh.

No backend is needed for the first version.

---

## 6. Suggested User Flow

### Morning / Start of Day

1. User opens the app.
2. User creates 3–5 tasks for the day.
3. Each task has a clear finish line.
4. User assigns reward minutes.

Example:

- Business: Write landing page outline — 45 min work → 20 min gaming.
- Creative: Draw one character pose — 30 min work → 15 min gaming.
- Music: Make one 8-bar melody — 45 min work → 20 min gaming.

### During the Day

1. User completes a task.
2. User marks it complete.
3. App increases gaming minutes earned.
4. User can game for the earned time.
5. User returns for another task.

### End of Day

1. User reviews completed tasks.
2. User sees total work completed.
3. User sees gaming earned.
4. Future version may save daily history and streaks.

---

## 7. Data Model

### Task Object

```ts
type Task = {
  id: string;
  title: string;
  category: TaskCategory;
  estimatedMinutes: number;
  rewardMinutes: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
};
```

### Task Categories

```ts
type TaskCategory =
  | "Business"
  | "Creative"
  | "Writing"
  | "Drawing"
  | "Music"
  | "Learning"
  | "Admin"
  | "Health"
  | "Other";
```

### Daily State

```ts
type DailyState = {
  date: string;
  tasks: Task[];
  gamingMinutesUsed: number;
};
```

### Computed Stats

```ts
type DailyStats = {
  totalTasks: number;
  completedTasks: number;
  completionPercent: number;
  plannedWorkMinutes: number;
  completedWorkMinutes: number;
  gamingMinutesEarned: number;
  gamingMinutesUsed: number;
  gamingMinutesRemaining: number;
};
```

---

## 8. App Screens

### 8.1 Main Dashboard

Main screen should include:

- App title.
- Today’s date.
- Progress cards.
- Task creation form.
- Task list.
- Daily rule/reminder.

Progress cards:

1. Completion percentage.
2. Tasks done.
3. Work minutes completed.
4. Gaming minutes earned.

---

### 8.2 Add Task Form

Fields:

- Task title.
- Category dropdown.
- Work minutes input.
- Reward minutes input.
- Add button.

Validation:

- Title cannot be empty.
- Work minutes must be greater than 0.
- Reward minutes must be 0 or greater.

---

### 8.3 Task List

Each task card should show:

- Completion checkbox.
- Task title.
- Category.
- Work minutes.
- Reward minutes.
- Delete button.

Completed tasks should appear visually different:

- Strikethrough title.
- Muted color.
- Completed icon.

---

### 8.4 Optional Future Screen: History

Not required for MVP, but useful later.

Would show:

- Past days.
- Tasks completed.
- Work minutes completed.
- Gaming minutes earned.
- Streaks.

---

## 9. Reward System Rules

### Rule 1: Gaming Is Earned, Not Default

The user should not start with free gaming time by default.

Gaming time is earned by completing tasks.

---

### Rule 2: Rewards Should Be Fair

The app should not make rewards feel impossible.

Suggested ratios:

| Work Time | Reward Time |
|---:|---:|
| 25 min | 10 min gaming |
| 45 min | 20 min gaming |
| 60 min | 30 min gaming |
| 90 min | 45 min gaming |

The user can customize this.

---

### Rule 3: No Moving the Goalpost

Once the task is completed, the gaming reward is earned.

The app should reinforce guilt-free reward usage.

---

### Rule 4: Tasks Must Be Finishable

Bad tasks:

- Work on business.
- Make music.
- Be productive.

Good tasks:

- Write 3 business pain points.
- Make one 8-bar melody.
- Draw one face sketch.
- Write 300 words.

Future version can include task-quality suggestions.

---

## 10. Technical Stack Recommendation

For Codex implementation, start with:

- React
- TypeScript
- Vite
- Tailwind CSS
- localStorage for persistence

Optional UI libraries:

- shadcn/ui
- lucide-react
- framer-motion

MVP should not require:

- Backend
- Authentication
- Database
- Payments
- Multi-user support

---

## 11. File Structure

Suggested structure:

```txt
src/
  App.tsx
  main.tsx
  components/
    DashboardStats.tsx
    TaskForm.tsx
    TaskList.tsx
    TaskCard.tsx
    DailyRuleCard.tsx
  types/
    task.ts
  utils/
    date.ts
    storage.ts
    stats.ts
  styles/
    index.css
```

---

## 12. Implementation Steps

### Step 1: Project Setup

Create a React + TypeScript app using Vite.

Install:

```bash
npm create vite@latest task-reward-tracker -- --template react-ts
cd task-reward-tracker
npm install
npm install lucide-react framer-motion
```

If using Tailwind:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### Step 2: Define Types

Create `src/types/task.ts`.

Add Task, TaskCategory, DailyState, and DailyStats types.

---

### Step 3: Create Storage Helpers

Create `src/utils/storage.ts`.

Functions:

```ts
saveDailyState(state: DailyState): void
loadDailyState(): DailyState | null
clearDailyState(): void
```

Use localStorage key:

```ts
const STORAGE_KEY = "task-reward-tracker-state";
```

---

### Step 4: Create Stats Helpers

Create `src/utils/stats.ts`.

Function:

```ts
calculateDailyStats(state: DailyState): DailyStats
```

This should calculate:

- total tasks
- completed tasks
- completion percentage
- planned work minutes
- completed work minutes
- gaming minutes earned
- gaming minutes used
- gaming minutes remaining

---

### Step 5: Build Main App State

In `App.tsx`, store:

```ts
const [dailyState, setDailyState] = useState<DailyState>()
```

On initial load:

- Load from localStorage.
- If no state exists, create today’s state.
- If saved date is not today, archive or reset for MVP.

For MVP, resetting on a new day is acceptable.

---

### Step 6: Build Task Form

Component: `TaskForm.tsx`

Props:

```ts
type TaskFormProps = {
  onAddTask: (task: Omit<Task, "id" | "completed" | "createdAt" | "completedAt">) => void;
};
```

Form should collect:

- title
- category
- estimatedMinutes
- rewardMinutes

---

### Step 7: Build Task List and Task Card

Components:

- `TaskList.tsx`
- `TaskCard.tsx`

Required actions:

- Toggle complete.
- Delete task.

When task is marked complete:

- Set `completed: true`.
- Set `completedAt` to current timestamp.

When unchecked:

- Set `completed: false`.
- Remove `completedAt`.

---

### Step 8: Build Dashboard Stats

Component: `DashboardStats.tsx`

Display:

- completion percentage
- tasks completed
- work minutes completed
- gaming minutes earned
- gaming minutes remaining, if gaming used is implemented

---

### Step 9: Add Reset Today

Add a button that clears today’s tasks and creates a fresh daily state.

Confirm before reset in a later version.

MVP can reset immediately.

---

### Step 10: Styling

Design should feel:

- Clean
- Dark mode by default
- Slightly game-like
- Minimal
- Not childish

Suggested style:

- Dark background
- Rounded cards
- Large progress numbers
- Simple icons
- Clear contrast

---

## 13. MVP Acceptance Criteria

The MVP is complete when:

- User can add a task.
- User can choose category.
- User can assign work minutes.
- User can assign reward minutes.
- User can mark task complete.
- Gaming earned updates automatically.
- User can delete task.
- User can reset the day.
- Data persists after page refresh.
- App works without login or backend.

---

## 14. Deployment and Cross-Device Access

### 14.1 Goal

The app should be accessible from any laptop by opening a website URL.

The first version should not require a backend or login.

Recommended MVP deployment path:

```txt
React + TypeScript + Vite → GitHub → Vercel → Public URL
```

Example result:

```txt
https://task-reward-tracker.vercel.app
```

---

### 14.2 MVP Deployment Recommendation

Use Vercel for the first deployment.

Why Vercel:

- Simple GitHub integration.
- Good support for Vite React apps.
- Automatic deployments after every push.
- Free tier is enough for this MVP.
- Produces a shareable URL that can be opened on any laptop.

Netlify is also acceptable, but Vercel is the preferred recommendation.

---

### 14.3 Deployment Steps

After the app is implemented:

1. Create a GitHub repository.
2. Push the app code to GitHub.
3. Create a Vercel account.
4. Import the GitHub repository into Vercel.
5. Use the default Vite build settings:

```txt
Build command: npm run build
Output directory: dist
Install command: npm install
```

6. Deploy the app.
7. Open the generated Vercel URL from any laptop.

---

### 14.4 Important MVP Limitation

For the first version, data is stored in `localStorage`.

This means:

- The app can be opened from any laptop.
- But tasks are saved only in the browser/device where they were created.
- Laptop A and Laptop B will not automatically share the same task data.

This is acceptable for MVP because it keeps the app simple.

---

### 14.5 Future Cross-Device Sync

To sync tasks across laptops, add a backend later.

Recommended future stack:

- Supabase Auth
- Supabase Postgres database
- Row-level security
- User-specific task storage

Alternative:

- Firebase Auth
- Firestore database

Recommended path:

```txt
MVP: Vercel + localStorage
Later: Vercel + Supabase Auth + Supabase Database
```

---

### 14.6 Future Sync Data Model

When cross-device sync is added, each task should belong to a user.

Example database table:

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  category text not null,
  estimated_minutes integer not null,
  reward_minutes integer not null,
  completed boolean default false,
  created_at timestamptz default now(),
  completed_at timestamptz,
  task_date date not null
);
```

The app should still preserve the same core loop:

```txt
Plan quests → Complete quest → Earn play → Repeat
```

---

## 15. Future Improvements

### 14.1 Gaming Time Used

Let user log how much gaming time they actually used.

Stats:

- Earned gaming time.
- Used gaming time.
- Remaining gaming time.

---

### 14.2 Daily History

Save completed days.

Track:

- Tasks completed per day.
- Work minutes per day.
- Gaming earned per day.
- Gaming used per day.

---

### 14.3 Streaks

Track streaks such as:

- Days with at least 1 task completed.
- Days where business task was completed.
- Days where creative task was completed.

---

### 14.4 Levels and XP

Add gamification:

- 1 work minute = 1 XP.
- Business tasks give Business XP.
- Creative tasks give Creative XP.
- Music tasks give Music XP.
- Writing tasks give Writing XP.

Levels can be calculated from XP.

Example:

```ts
level = Math.floor(Math.sqrt(totalXp / 100)) + 1;
```

---

### 14.5 Quest Templates

Add predefined task templates:

Business:

- Write 3 customer pain points.
- Message 1 potential user.
- Create 1 landing page section.

Writing:

- Write 300 words.
- Outline 1 scene.
- Create 1 character idea.

Music:

- Make 1 melody.
- Make 1 drum loop.
- Finish 8 bars.

Drawing:

- Draw 1 pose.
- Sketch 1 face.
- Practice hands for 15 minutes.

---

### 14.6 Weekly Review

Show weekly summary:

- Best day.
- Total work minutes.
- Most completed category.
- Gaming earned.
- Gaming used.

---

### 14.7 Motivation Notes

Allow user to write why a task matters.

Example:

Task: Write landing page outline.

Why it matters:

> This moves my business from idea to real product.

---

### 14.8 Intrinsic Motivation Mode

Eventually, add a mode where some tasks do not give gaming rewards.

Purpose:

Help user transition from extrinsic rewards to intrinsic motivation.

Example:

- Rewarded tasks: early-stage hard tasks.
- Identity tasks: tasks done because they support who the user wants to become.

---

## 16. Important Product Notes

This app should avoid becoming overly complicated.

The user should be able to open it and immediately know:

1. What do I need to do?
2. What do I earn when I do it?
3. How much progress have I made today?

The core loop should remain simple:

```txt
Plan quests → Complete quest → Earn play → Repeat
```

---

## 17. First Version Priority

Build in this exact order:

1. Add task.
2. Complete task.
3. Calculate earned gaming time.
4. Persist locally.
5. Reset day.
6. Add categories.
7. Improve UI.
8. Add history/streaks later.

Do not start with advanced gamification.

The first version should prove that the task → reward loop feels useful in daily life.

---

## 18. Codex Prompt Suggestion

Use this prompt when giving the plan to Codex:

```txt
Implement the app described in plan.md.
Use React, TypeScript, Vite, and Tailwind CSS.
Start with the MVP only.
Use localStorage for persistence.
Prepare the app so it can be deployed as a static Vite React app on Vercel.
Do not add backend, login, database, or advanced gamification yet.
Keep the UI clean, dark, minimal, and slightly game-like.
Follow the acceptance criteria exactly.
```

