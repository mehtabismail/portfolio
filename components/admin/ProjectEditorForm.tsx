"use client";

import type { Project } from "@/data";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initialProject: Project;
  isNew?: boolean;
};

function toCsv(values?: string[]) {
  return values?.join(", ") ?? "";
}

function parseCsv(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export default function ProjectEditorForm({ initialProject, isNew = false }: Props) {
  const router = useRouter();
  const initialData = useMemo(
    () => ({
      ...initialProject,
      categoriesCsv: initialProject.categories.join(", "),
      galleryCsv: toCsv(initialProject.gallery),
    }),
    [initialProject],
  );

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function saveProject() {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const payload: Project = {
        slug: data.slug.trim(),
        title: data.title.trim(),
        titleDisplay: data.titleDisplay.trim(),
        location: data.location.trim(),
        year: data.year.trim(),
        services: data.services.trim(),
        categories: parseCsv(data.categoriesCsv) as Project["categories"],
        thumbnailBg: data.thumbnailBg.trim(),
        thumbnailUrl: data.thumbnailUrl.trim(),
        thumbnailHoverUrl: data.thumbnailHoverUrl?.trim() || undefined,
        heroImageUrl: data.heroImageUrl?.trim() || undefined,
        gallery: parseCsv(data.galleryCsv),
        videoUrl: data.videoUrl?.trim() || undefined,
        role: data.role?.trim() || undefined,
        credits: data.credits?.trim() || undefined,
        liveUrl: data.liveUrl?.trim() || undefined,
        order: Number(data.order),
        isPublished: Boolean(data.isPublished),
        isFeatured: Boolean(data.isFeatured),
      };

      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) {
        throw new Error(json.error || "Failed to save project");
      }
      setMessage("Saved successfully.");
      if (isNew) {
        router.push(`/admin/projects/${payload.slug}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject() {
    if (!confirm("Delete this project? This action cannot be undone.")) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/projects/${encodeURIComponent(data.slug)}`, {
        method: "DELETE",
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !json.ok) {
        throw new Error(json.error || "Failed to delete project");
      }
      router.push("/admin/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
      setLoading(false);
    }
  }

  return (
    <section className="admin-card">
      <h1 className="admin-card__title">
        {isNew ? "Create project" : `Edit project · ${initialProject.slug}`}
      </h1>
      <p className="admin-card__help">
        Slug becomes the URL segment and Firestore document id. Published items appear on the public site; drafts stay hidden.
      </p>

      <div className="admin-field-grid">
        {(
          [
            ["slug", "Slug"],
            ["title", "Title"],
            ["titleDisplay", "Title display"],
            ["location", "Location"],
            ["year", "Year"],
            ["services", "Services"],
            ["thumbnailBg", "Thumbnail background (CSS color)"],
            ["thumbnailUrl", "Thumbnail URL"],
            ["thumbnailHoverUrl", "Thumbnail hover URL"],
            ["heroImageUrl", "Hero image URL"],
            ["videoUrl", "Video URL"],
            ["liveUrl", "Live URL"],
            ["role", "Role"],
            ["credits", "Credits"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="admin-label">
            {label}
            <input
              className="admin-input"
              value={(data[key] as string | undefined) ?? ""}
              onChange={(event) => update(key, event.target.value as (typeof data)[typeof key])}
            />
          </label>
        ))}

        <label className="admin-label">
          Categories (comma-separated: design, development, interaction)
          <input
            className="admin-input"
            value={data.categoriesCsv}
            onChange={(event) => update("categoriesCsv", event.target.value)}
          />
        </label>

        <label className="admin-label">
          Gallery URLs (comma-separated)
          <textarea
            value={data.galleryCsv}
            onChange={(event) => update("galleryCsv", event.target.value)}
            rows={4}
          />
        </label>

        <label className="admin-label">
          Sort order
          <input
            className="admin-input"
            type="number"
            value={data.order}
            onChange={(event) => update("order", Number(event.target.value))}
          />
        </label>

        <label className="admin-check">
          <input type="checkbox" checked={Boolean(data.isPublished)} onChange={(event) => update("isPublished", event.target.checked)} />
          Published (visible on public site)
        </label>

        <label className="admin-check">
          <input type="checkbox" checked={Boolean(data.isFeatured)} onChange={(event) => update("isFeatured", event.target.checked)} />
          Featured (homepage spotlight when any project is featured)
        </label>
      </div>

      <div className="admin-actions">
        <button className="admin-btn admin-btn--primary" type="button" onClick={saveProject} disabled={loading}>
          {loading ? "Saving…" : "Save project"}
        </button>
        {!isNew ? (
          <button className="admin-btn admin-btn--danger" type="button" onClick={deleteProject} disabled={loading}>
            Delete
          </button>
        ) : null}
        {message ? <span className="admin-msg--ok">{message}</span> : null}
        {error ? <span className="admin-msg--err">{error}</span> : null}
      </div>
    </section>
  );
}
