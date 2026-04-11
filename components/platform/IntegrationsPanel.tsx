"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { IntegrationRow } from "@/lib/supabase/types";

type Props = {
  dashboardSlug: string;
  initial: IntegrationRow[];
};

function usernameFor(integrations: IntegrationRow[], provider: IntegrationRow["provider"]): string {
  return integrations.find((i) => i.provider === provider)?.username ?? "";
}

export default function IntegrationsPanel({ dashboardSlug, initial }: Props) {
  const router = useRouter();
  const [mediumUser, setMediumUser] = useState(() => usernameFor(initial, "medium"));
  const [devtoUser, setDevtoUser] = useState(() => usernameFor(initial, "devto"));

  useEffect(() => {
    setMediumUser(usernameFor(initial, "medium"));
    setDevtoUser(usernameFor(initial, "devto"));
  }, [initial]);
  const [mediumMsg, setMediumMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [devtoMsg, setDevtoMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [mediumBusy, setMediumBusy] = useState(false);
  const [devtoBusy, setDevtoBusy] = useState(false);

  async function syncMedium() {
    setMediumBusy(true);
    setMediumMsg(null);
    try {
      const res = await fetch("/api/platform/integrations/medium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username: mediumUser.trim() }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; imported?: number; totalFromFeed?: number };
      if (!res.ok || !json.ok) throw new Error(json.error || "Sync failed");
      setMediumMsg({
        tone: "ok",
        text: `Imported ${json.imported ?? 0} of ${json.totalFromFeed ?? 0} posts from the feed.`,
      });
      router.refresh();
    } catch (e) {
      setMediumMsg({ tone: "err", text: e instanceof Error ? e.message : "Sync failed." });
    } finally {
      setMediumBusy(false);
    }
  }

  async function syncDevto() {
    setDevtoBusy(true);
    setDevtoMsg(null);
    try {
      const res = await fetch("/api/platform/integrations/devto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username: devtoUser.trim() }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; imported?: number; totalFromFeed?: number };
      if (!res.ok || !json.ok) throw new Error(json.error || "Sync failed");
      setDevtoMsg({
        tone: "ok",
        text: `Imported ${json.imported ?? 0} of ${json.totalFromFeed ?? 0} articles from Dev.to.`,
      });
      router.refresh();
    } catch (e) {
      setDevtoMsg({ tone: "err", text: e instanceof Error ? e.message : "Sync failed." });
    } finally {
      setDevtoBusy(false);
    }
  }

  const mediumMeta = initial.find((i) => i.provider === "medium");
  const devtoMeta = initial.find((i) => i.provider === "devto");

  return (
    <>
      <h1 className="admin-page-title">Integrations</h1>
      <p className="admin-page-lead">
        Pull posts from Medium or Dev.to into your portfolio blog at <strong>/u/{dashboardSlug}/blogs</strong>. Sync
        updates titles and excerpts; view counts on existing posts are preserved.
      </p>

      <section className="admin-card admin-card--wide" style={{ marginBottom: "20px" }}>
        <h2 className="admin-card__title">Medium</h2>
        <p className="admin-card__help">
          Public RSS feed at <code>medium.com/feed/@username</code>. Enter your Medium username (without{" "}
          <code>@</code> is fine).
        </p>
        <div className="admin-field-grid">
          <label className="admin-label">
            Username
            <input
              className="admin-input"
              value={mediumUser}
              onChange={(e) => setMediumUser(e.target.value)}
              placeholder="jane-doe"
              autoComplete="off"
            />
          </label>
        </div>
        {mediumMeta?.last_synced_at ? (
          <p className="admin-hint">Last synced: {new Date(mediumMeta.last_synced_at).toLocaleString()}</p>
        ) : null}
        {mediumMsg ? (
          <p className={mediumMsg.tone === "ok" ? "admin-msg--ok" : "admin-msg--err"} style={{ marginTop: "12px" }}>
            {mediumMsg.text}
          </p>
        ) : null}
        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn--primary" disabled={mediumBusy} onClick={() => void syncMedium()}>
            {mediumBusy ? "Syncing…" : "Sync from Medium"}
          </button>
        </div>
      </section>

      <section className="admin-card admin-card--wide">
        <h2 className="admin-card__title">Dev.to</h2>
        <p className="admin-card__help">
          Uses the public Dev.to API (<code>dev.to/api/articles?username=…</code>). Body is stored as Markdown for
          on-site preview; canonical link is kept.
        </p>
        <div className="admin-field-grid">
          <label className="admin-label">
            Username
            <input
              className="admin-input"
              value={devtoUser}
              onChange={(e) => setDevtoUser(e.target.value.toLowerCase())}
              placeholder="janedoe"
              autoComplete="off"
            />
          </label>
        </div>
        {devtoMeta?.last_synced_at ? (
          <p className="admin-hint">Last synced: {new Date(devtoMeta.last_synced_at).toLocaleString()}</p>
        ) : null}
        {devtoMsg ? (
          <p className={devtoMsg.tone === "ok" ? "admin-msg--ok" : "admin-msg--err"} style={{ marginTop: "12px" }}>
            {devtoMsg.text}
          </p>
        ) : null}
        <div className="admin-actions">
          <button type="button" className="admin-btn admin-btn--primary" disabled={devtoBusy} onClick={() => void syncDevto()}>
            {devtoBusy ? "Syncing…" : "Sync from Dev.to"}
          </button>
        </div>
      </section>
    </>
  );
}
