"use client";

import { useCallback, useEffect, useState } from "react";
import { normalizeSlug, validateSlugFormat } from "@/lib/platform/slug";
import forms from "../platform-forms.module.css";
import loginStyles from "../login/login.module.css";

/**
 * For users signed in with email/password (no Google identity) who still need a portfolio row.
 */
export default function EmailFinishPortfolioForm() {
  const [displayName, setDisplayName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugCheckLoading, setSlugCheckLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkSlug = useCallback(async (value: string) => {
    const normalized = normalizeSlug(value);
    const fmt = validateSlugFormat(normalized);
    if (fmt) {
      setSlugAvailable(false);
      return;
    }
    setSlugCheckLoading(true);
    try {
      const res = await fetch(`/api/platform/slug-available?slug=${encodeURIComponent(normalized)}`);
      const json = (await res.json()) as { ok?: boolean; available?: boolean };
      setSlugAvailable(res.ok && json.ok ? json.available ?? false : false);
    } catch {
      setSlugAvailable(null);
    } finally {
      setSlugCheckLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!slug.trim()) {
        setSlugAvailable(null);
        return;
      }
      void checkSlug(slug);
    }, 320);
    return () => clearTimeout(t);
  }, [slug, checkSlug]);

  async function onSubmit() {
    setError("");
    setLoading(true);
    try {
      const normalized = normalizeSlug(slug);
      const fmt = validateSlugFormat(normalized);
      if (fmt) throw new Error(fmt);
      if (slugAvailable !== true) throw new Error("Choose an available URL slug.");
      if (!displayName.trim()) throw new Error("Display name is required.");

      const res = await fetch("/api/platform/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          slug: normalized,
          display_name: displayName.trim(),
          role: null,
          template_id: "minimal",
          avatar_url: null,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; slug?: string };
      if (!res.ok || !json.ok || !json.slug) throw new Error(json.error || "Could not create profile");

      window.location.assign(`/u/${json.slug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className={loginStyles.text}>
        You signed in with email. Choose how your name and public URL appear, then we will add demo content like the
        Google flow.
      </p>
      <div className={forms.field}>
        <label className={forms.label} htmlFor="emailDisplayName">
          Display name
        </label>
        <input
          id="emailDisplayName"
          className={forms.input}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoComplete="name"
        />
      </div>
      <div className={forms.field}>
        <label className={forms.label} htmlFor="emailSlug">
          Portfolio URL
        </label>
        <input
          id="emailSlug"
          className={forms.input}
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase())}
          autoComplete="off"
          spellCheck={false}
        />
        <p className={forms.hint}>/u/{normalizeSlug(slug || "your-slug")}</p>
        {slugCheckLoading ? <p className={forms.hint}>Checking availability…</p> : null}
        {!slugCheckLoading && slug.trim() && slugAvailable === true ? (
          <p className={forms.hint} style={{ color: "#86efac" }}>
            Available.
          </p>
        ) : null}
        {!slugCheckLoading && slug.trim() && slugAvailable === false ? (
          <p className={forms.hint} style={{ color: "#fca5a5" }}>
            {validateSlugFormat(normalizeSlug(slug)) ?? "Not available."}
          </p>
        ) : null}
      </div>
      <div className={forms.rowActions}>
        <button
          type="button"
          className={`${forms.btn} ${forms.btnPrimary}`}
          onClick={() => void onSubmit()}
          disabled={loading || !displayName.trim() || slugAvailable !== true}
        >
          {loading ? "Creating…" : "Create portfolio"}
        </button>
      </div>
      {error ? <p className={loginStyles.err}>{error}</p> : null}
    </div>
  );
}
