"use client";

import { useState } from "react";

type Props = {
  slug: string;
};

export default function PlatformRevalidateButton({ slug }: Props) {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"ok" | "err" | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setMessage("");
    setTone(null);
    const response = await fetch(`/api/platform/revalidate/${encodeURIComponent(slug)}`, {
      method: "POST",
      credentials: "same-origin",
    });
    setLoading(false);
    if (response.ok) {
      setMessage("Public portfolio pages revalidated.");
      setTone("ok");
    } else {
      setMessage("Revalidation failed.");
      setTone("err");
    }
  }

  return (
    <div className="admin-actions">
      <button className="admin-btn admin-btn--ghost" type="button" onClick={run} disabled={loading}>
        {loading ? "Revalidating…" : "Revalidate public cache"}
      </button>
      {message ? <span className={tone === "ok" ? "admin-msg--ok" : "admin-msg--err"}>{message}</span> : null}
    </div>
  );
}
