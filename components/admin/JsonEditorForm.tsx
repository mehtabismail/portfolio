"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  endpoint: string;
  initialValue: unknown;
  helpText?: string;
};

export default function JsonEditorForm({ title, endpoint, initialValue, helpText }: Props) {
  const initialJson = useMemo(() => JSON.stringify(initialValue, null, 2), [initialValue]);
  const [value, setValue] = useState(initialJson);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSave() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const parsed = JSON.parse(value);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ payload: parsed }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Save failed");
      }

      setMessage("Saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-card">
      <h1 className="admin-card__title">{title}</h1>
      {helpText ? <p className="admin-card__help">{helpText}</p> : null}
      <textarea
        className="admin-textarea"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        spellCheck={false}
      />
      <div className="admin-actions">
        <button className="admin-btn admin-btn--primary" type="button" onClick={onSave} disabled={loading}>
          {loading ? "Saving…" : "Save changes"}
        </button>
        {message ? <span className="admin-msg--ok">{message}</span> : null}
        {error ? <span className="admin-msg--err">{error}</span> : null}
      </div>
    </section>
  );
}
