import { ShieldCheck } from "lucide-react";

export function DailyRuleCard() {
  return (
    <aside className="rule-card">
      <ShieldCheck size={22} aria-hidden="true" />
      <p>
        No default gaming. Finish one clear task, then play the minutes you
        earned. Once earned, enjoy it without guilt.
      </p>
    </aside>
  );
}

