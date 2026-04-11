"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { BlogRow } from "@/lib/supabase/types";
import ImageUploadField from "./ImageUploadField";

const MarkdownPreview = dynamic(() => import("./BlogMarkdown"), { ssr: false });

type Props = {
  dashboardSlug: string;
  mode: "new" | "edit";
  initial: BlogRow | null;
};

function tagsToString(tags: string[] | undefined): string {
  return (tags ?? []).join(", ");
}

function parseTagsCsv(s: string): string[] {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 24);
}

export default function BlogEditorForm({ dashboardSlug, mode, initial }: Props) {
  const router = useRouter();
  const base = `/dashboard/${dashboardSlug}`;

  const defaults = useMemo(() => {
    if (initial) {
      return {
        slug: initial.slug,
        title: initial.title,
        content: initial.content ?? "",
        cover_image_url: initial.cover_image_url ?? "",
        tags: tagsToString(initial.tags),
        status: initial.status,
      };
    }
    return {
      slug: "",
      title: "",
      content: "",
      cover_image_url: "",
      tags: "",
      status: "draft" as BlogRow["status"],
    };
  }, [initial]);

  const [slug, setSlug] = useState(defaults.slug);
  const [title, setTitle] = useState(defaults.title);
  const [content, setContent] = useState(defaults.content);
  const [coverUrl, setCoverUrl] = useState(defaults.cover_image_url);
  const [tags, setTags] = useState(defaults.tags);
  const [status, setStatus] = useState<BlogRow["status"]>(defaults.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function save() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        content,
        cover_image_url: coverUrl.trim() || null,
        tags: parseTagsCsv(tags),
        status,
      };
      if (mode === "new") {
        const res = await fetch("/api/platform/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string; slug?: string };
        if (!res.ok || !json.ok || !json.slug) throw new Error(json.error || "Save failed");
        router.push(`${base}/blogs/${json.slug}`);
        router.refresh();
      } else {
        const res = await fetch(`/api/platform/blogs/${encodeURIComponent(initial!.slug)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string; slug?: string };
        if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
        setMessage("Saved.");
        if (json.slug && json.slug !== initial!.slug) {
          router.push(`${base}/blogs/${json.slug}`);
        } else {
          router.refresh();
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (mode !== "edit" || !initial) return;
    if (!confirm("Delete this post permanently?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/platform/blogs/${encodeURIComponent(initial.slug)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Delete failed");
      router.push(`${base}/blogs`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-card admin-card--wide">
      <h1 className="admin-card__title">{mode === "new" ? "New blog post" : `Edit · ${initial?.slug}`}</h1>
      <p className="admin-card__help">
        Write in Markdown. Preview updates as you type. Published posts appear on your public site when your portfolio
        is published.
      </p>

      <div className="admin-field-grid">
        <label className="admin-label">
          Title
          <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="admin-label">
          URL slug
          <input className="admin-input" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} />
        </label>
        <p className="admin-hint">Public URL: /u/{dashboardSlug}/blogs/{slug.trim() || "…"}</p>
        <label className="admin-label">
          Status
          <select
            className="admin-input"
            value={status}
            onChange={(e) => setStatus(e.target.value as BlogRow["status"])}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="admin-label">
          Tags (comma-separated)
          <input className="admin-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, css" />
        </label>
        <ImageUploadField
          portfolioSlug={dashboardSlug}
          label="Cover image URL (optional)"
          value={coverUrl}
          onChange={setCoverUrl}
          uploadLabel={`blog-${slug.trim() || "new"}-cover`}
        />
      </div>

      <div className="admin-blog-editor-split">
        <label className="admin-label">
          Markdown
          <textarea value={content} onChange={(e) => setContent(e.target.value)} spellCheck={false} />
        </label>
        <div>
          <p style={{ margin: "0 0 8px", fontSize: "0.8rem", fontWeight: 600, color: "var(--admin-text)" }}>Preview</p>
          <div
            className="admin-card"
            style={{ minHeight: "200px", maxHeight: "520px", overflow: "auto", padding: "16px" }}
          >
            {content.trim() ? (
              <MarkdownPreview markdown={content} variant="light" />
            ) : (
              <p className="admin-card__help" style={{ margin: 0 }}>
                Nothing to preview yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <p className="admin-msg--err" style={{ marginTop: "16px" }}>
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="admin-msg--ok" style={{ marginTop: "16px" }}>
          {message}
        </p>
      ) : null}

      <div className="admin-actions">
        <button type="button" className="admin-btn admin-btn--primary" disabled={loading} onClick={() => void save()}>
          {loading ? "Saving…" : "Save post"}
        </button>
        <Link href={`${base}/blogs`} className="admin-btn admin-btn--ghost">
          Cancel
        </Link>
        {mode === "edit" ? (
          <button type="button" className="admin-btn admin-btn--danger" disabled={loading} onClick={() => void remove()}>
            Delete
          </button>
        ) : null}
      </div>
    </section>
  );
}
