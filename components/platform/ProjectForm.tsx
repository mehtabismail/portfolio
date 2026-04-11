"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import slugify from "slugify";
import type { ProjectRow } from "@/lib/supabase/types";
import ImageUploadField from "./ImageUploadField";

function toCsv(arr: string[]) {
  return arr.join(", ");
}

function parseCsv(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseLines(s: string) {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

type Props = {
  dashboardSlug: string;
  mode: "new" | "edit";
  initial: ProjectRow | null;
};

export default function ProjectForm({ dashboardSlug, mode, initial }: Props) {
  const router = useRouter();
  const base = `/dashboard/${dashboardSlug}`;

  const defaults = useMemo(() => {
    if (initial) {
      return {
        slug: initial.slug,
        title: initial.title,
        title_display: initial.title_display ?? "",
        description: initial.description ?? "",
        services: initial.services ?? "",
        tech_stack: toCsv(initial.tech_stack ?? []),
        categories: toCsv(initial.categories ?? []),
        thumbnail_url: initial.thumbnail_url ?? "",
        thumbnail_bg: initial.thumbnail_bg ?? "#F1F1F1",
        hero_image_url: initial.hero_image_url ?? "",
        gallery: (initial.gallery ?? []).join("\n"),
        live_url: initial.live_url ?? "",
        year: initial.year ?? "",
        role: initial.role ?? "",
        credits: initial.credits ?? "",
        is_published: initial.is_published,
        is_featured: initial.is_featured,
        display_order: initial.display_order,
      };
    }
    return {
      slug: "",
      title: "",
      title_display: "",
      description: "",
      services: "",
      tech_stack: "",
      categories: "",
      thumbnail_url: "",
      thumbnail_bg: "#F1F1F1",
      hero_image_url: "",
      gallery: "",
      live_url: "",
      year: "",
      role: "",
      credits: "",
      is_published: false,
      is_featured: false,
      display_order: 0,
    };
  }, [initial]);

  const [data, setData] = useState(defaults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function set<K extends keyof typeof data>(key: K, value: (typeof data)[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function onTitleBlur() {
    if (mode === "new" && !data.slug.trim() && data.title.trim()) {
      set("slug", slugify(data.title, { lower: true, strict: true, trim: true }));
    }
  }

  function buildPayload() {
    return {
      slug: data.slug.trim().toLowerCase(),
      title: data.title.trim(),
      title_display: data.title_display.trim() || null,
      description: data.description.trim() || null,
      services: data.services.trim() || null,
      tech_stack: parseCsv(data.tech_stack),
      categories: parseCsv(data.categories),
      thumbnail_url: data.thumbnail_url.trim() || null,
      thumbnail_bg: data.thumbnail_bg.trim() || null,
      hero_image_url: data.hero_image_url.trim() || null,
      gallery: parseLines(data.gallery),
      live_url: data.live_url.trim() || null,
      year: data.year.trim() || null,
      role: data.role.trim() || null,
      credits: data.credits.trim() || null,
      is_published: data.is_published,
      is_featured: data.is_featured,
      display_order: Number(data.display_order) || 0,
    };
  }

  async function save() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const payload = buildPayload();
      if (mode === "new") {
        const res = await fetch("/api/platform/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string; slug?: string };
        if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
        router.push(`${base}/projects/${json.slug}`);
        router.refresh();
      } else {
        const res = await fetch(`/api/platform/projects/${encodeURIComponent(initial!.slug)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as { ok?: boolean; error?: string; slug?: string };
        if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
        setMessage("Saved.");
        if (json.slug && json.slug !== initial!.slug) {
          router.push(`${base}/projects/${json.slug}`);
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
    if (!confirm("Delete this project permanently?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/platform/projects/${encodeURIComponent(initial.slug)}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Delete failed");
      router.push(`${base}/projects`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-card admin-card--wide">
      <h1 className="admin-card__title">{mode === "new" ? "New project" : `Edit · ${initial?.slug}`}</h1>
      <p className="admin-card__help">
        Published projects appear on your public site when your portfolio is published. Images upload to Cloudinary under
        your portfolio folder.
      </p>

      <div className="admin-field-grid">
        <label className="admin-label">
          Title
          <input
            className="admin-input"
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
            onBlur={onTitleBlur}
          />
        </label>
        <div>
          <label className="admin-label">
            URL slug
            <input className="admin-input" value={data.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} />
          </label>
          <p className="admin-hint">
            Public URL: /u/{dashboardSlug}/work/{data.slug || "…"}
          </p>
        </div>
        <label className="admin-label">
          Display title (optional)
          <input className="admin-input" value={data.title_display} onChange={(e) => set("title_display", e.target.value)} />
        </label>
        <label className="admin-label">
          Description
          <textarea value={data.description} onChange={(e) => set("description", e.target.value)} />
        </label>
        <label className="admin-label">
          Services
          <input className="admin-input" value={data.services} onChange={(e) => set("services", e.target.value)} />
        </label>
        <label className="admin-label">
          Tech stack (comma-separated)
          <input className="admin-input" value={data.tech_stack} onChange={(e) => set("tech_stack", e.target.value)} />
        </label>
        <label className="admin-label">
          Categories (comma-separated)
          <input className="admin-input" value={data.categories} onChange={(e) => set("categories", e.target.value)} />
        </label>
        <label className="admin-label">
          Year
          <input className="admin-input" value={data.year} onChange={(e) => set("year", e.target.value)} />
        </label>
        <label className="admin-label">
          Role (case study)
          <input className="admin-input" value={data.role} onChange={(e) => set("role", e.target.value)} />
        </label>
        <label className="admin-label">
          Credits
          <input className="admin-input" value={data.credits} onChange={(e) => set("credits", e.target.value)} />
        </label>
        <label className="admin-label">
          Live URL
          <input className="admin-input" value={data.live_url} onChange={(e) => set("live_url", e.target.value)} />
        </label>
        <label className="admin-label">
          Thumbnail background (hex)
          <input className="admin-input" value={data.thumbnail_bg} onChange={(e) => set("thumbnail_bg", e.target.value)} />
        </label>

        <ImageUploadField
          portfolioSlug={dashboardSlug}
          label="Thumbnail image URL"
          value={data.thumbnail_url}
          onChange={(url) => set("thumbnail_url", url)}
          uploadLabel={`project-${data.slug || "new"}-thumb`}
        />
        <ImageUploadField
          portfolioSlug={dashboardSlug}
          label="Hero image URL"
          value={data.hero_image_url}
          onChange={(url) => set("hero_image_url", url)}
          uploadLabel={`project-${data.slug || "new"}-hero`}
        />

        <label className="admin-label">
          Gallery image URLs (one per line)
          <textarea value={data.gallery} onChange={(e) => set("gallery", e.target.value)} />
        </label>

        <label className="admin-label">
          Sort order
          <input
            type="number"
            className="admin-input"
            value={data.display_order}
            onChange={(e) => set("display_order", Math.round(Number(e.target.value)) || 0)}
          />
        </label>

        <label className="admin-check">
          <input type="checkbox" checked={data.is_published} onChange={(e) => set("is_published", e.target.checked)} />
          <span>Published on public site</span>
        </label>
        <label className="admin-check">
          <input type="checkbox" checked={data.is_featured} onChange={(e) => set("is_featured", e.target.checked)} />
          <span>Featured</span>
        </label>
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
          {loading ? "Saving…" : "Save project"}
        </button>
        <Link href={`${base}/projects`} className="admin-btn admin-btn--ghost">
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
