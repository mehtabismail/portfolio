"use client";

import { useRef, useState } from "react";

type Props = {
  portfolioSlug: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  uploadLabel: string;
};

export default function ImageUploadField({ portfolioSlug, label, value, onChange, uploadLabel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr("");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("portfolioSlug", portfolioSlug);
      fd.set("label", uploadLabel);
      const res = await fetch("/api/platform/media/upload", {
        method: "POST",
        body: fd,
        credentials: "same-origin",
      });
      const json = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !json.ok || !json.url) {
        throw new Error(json.error || "Upload failed");
      }
      onChange(json.url);
    } catch (er) {
      setErr(er instanceof Error ? er.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="admin-label">
        {label}
        <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={(e) => void onFile(e)}
      />
      <div className="admin-actions" style={{ marginTop: "8px" }}>
        <button
          type="button"
          className="admin-btn admin-btn--ghost"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : "Upload image"}
        </button>
      </div>
      {err ? (
        <p className="admin-msg--err" style={{ marginTop: "8px" }}>
          {err}
        </p>
      ) : null}
    </div>
  );
}
