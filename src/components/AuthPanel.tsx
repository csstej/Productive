import { FormEvent, useState } from "react";
import { LogIn, LogOut } from "lucide-react";

type AuthPanelProps = {
  isConfigured: boolean;
  userEmail: string | null;
  redirectUrl: string;
  syncStatus: string;
  onSignIn: (email: string) => Promise<void>;
  onSignOut: () => Promise<void>;
  onSyncNow: () => Promise<void>;
};

export function AuthPanel({
  isConfigured,
  userEmail,
  redirectUrl,
  syncStatus,
  onSignIn,
  onSignOut,
  onSyncNow,
}: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!email.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSignIn(email.trim());
      setMessage("Check your email for a login link.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Could not send login link.";
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isConfigured) {
    return (
      <section className="auth-panel">
        <p>Cloud sync is not configured. This browser is using local storage.</p>
      </section>
    );
  }

  if (userEmail) {
    return (
      <section className="auth-panel auth-panel--signed-in">
        <div>
          <strong>{userEmail}</strong>
          <p>{syncStatus}</p>
        </div>
        <button className="button button--secondary" type="button" onClick={onSyncNow}>
          Sync now
        </button>
        <button className="button button--secondary" type="button" onClick={onSignOut}>
          <LogOut size={17} aria-hidden="true" />
          Sign out
        </button>
      </section>
    );
  }

  return (
    <form className="auth-panel auth-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <button className="button button--primary" type="submit" disabled={isSubmitting}>
        <LogIn size={17} aria-hidden="true" />
        {isSubmitting ? "Sending" : "Log in"}
      </button>
      <p>{message || syncStatus}</p>
      <p className="auth-return-url">Returns to {redirectUrl}</p>
    </form>
  );
}
