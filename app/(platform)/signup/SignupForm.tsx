"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import forms from "../platform-forms.module.css";
import loginStyles from "../login/login.module.css";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (signErr) throw new Error(signErr.message);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError(
          "If email confirmation is enabled in Supabase, check your inbox and then open Create portfolio.",
        );
        setLoading(false);
        return;
      }
      router.replace("/create?source=email");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)}>
      <div className={forms.field}>
        <label className={forms.label} htmlFor="su-email">
          Email
        </label>
        <input
          id="su-email"
          type="email"
          className={forms.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div className={forms.field}>
        <label className={forms.label} htmlFor="su-password">
          Password
        </label>
        <input
          id="su-password"
          type="password"
          className={forms.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <div className={forms.field}>
        <label className={forms.label} htmlFor="su-password2">
          Confirm password
        </label>
        <input
          id="su-password2"
          type="password"
          className={forms.input}
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      <div className={forms.rowActions}>
        <button type="submit" className={`${forms.btn} ${forms.btnPrimary}`} disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </button>
      </div>
      {error ? <p className={loginStyles.err}>{error}</p> : null}
    </form>
  );
}
