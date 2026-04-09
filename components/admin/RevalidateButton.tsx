"use client";

import { useState } from "react";

export default function RevalidateButton() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"ok" | "err" | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setMessage("");
    setTone(null);
    const response = await fetch("/api/admin/revalidate", { method: "POST" });
    setLoading(false);
    if (response.ok) {
      setMessage("Public pages revalidated.");
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
