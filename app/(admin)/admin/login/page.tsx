"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });

    setLoading(false);
    if (!response.ok) {
      setError("Login failed. Please check your admin secret.");
      return;
    }

    const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const nextPath = search?.get("next") || "/admin";
    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="admin-login">
      <div className="admin-login__brand">
        <div className="admin-login__logo" aria-hidden>
          P
        </div>
        <h1 className="admin-login__title">Portfolio admin</h1>
        <p className="admin-login__subtitle">Sign in to edit site content, projects, and copy.</p>
      </div>

      <form className="admin-login__card" onSubmit={onSubmit}>
        <label className="admin-login__label" htmlFor="admin-secret">
          Admin secret
          <input
            id="admin-secret"
            className="admin-login__input"
            type="password"
            name="secret"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            placeholder="Enter your secret"
            required
            autoFocus
            autoComplete="current-password"
          />
        </label>

        {error ? <p className="admin-login__error">{error}</p> : null}

        <button className="admin-login__submit" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <p className="admin-login__hint">Use the same value as ADMIN_SECRET in your environment.</p>
      </form>
    </div>
  );
}
