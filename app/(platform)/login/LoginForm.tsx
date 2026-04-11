"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import loginStyles from "./login.module.css";
import forms from "../platform-forms.module.css";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function afterAuthRedirect(supabase: ReturnType<typeof createSupabaseBrowserClient>) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    const { data: row } = await supabase.from("platform_users").select("slug").eq("id", user.id).maybeSingle();
    if (row?.slug) {
      if (nextParam.startsWith("/create")) {
        router.replace(nextParam);
      } else {
        router.replace(`/dashboard/${row.slug}`);
      }
    } else {
      router.replace("/create");
    }
    router.refresh();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signErr) throw new Error(signErr.message);
      await afterAuthRedirect(supabase);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setError("");
    const supabase = createSupabaseBrowserClient();
    const origin = window.location.origin;
    const next =
      nextParam && nextParam.startsWith("/") ? nextParam : `/create`;
    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/api/platform/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (oauthErr) setError(oauthErr.message);
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)}>
      <div className={forms.field}>
        <label className={forms.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={forms.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <div className={forms.field}>
        <label className={forms.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={forms.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      <div className={forms.rowActions}>
        <button type="submit" className={`${forms.btn} ${forms.btnPrimary}`} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <button
          type="button"
          className={`${forms.btn} ${forms.btnGhost}`}
          onClick={() => void signInWithGoogle()}
          disabled={loading}
        >
          Continue with Google
        </button>
      </div>
      <p className={loginStyles.text} style={{ marginTop: "1.25rem" }}>
        New here?{" "}
        <Link href="/create" className={loginStyles.link} style={{ marginTop: 0 }}>
          Create your portfolio
        </Link>
      </p>
    </form>
  );
}
