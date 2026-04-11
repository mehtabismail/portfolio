"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { PlatformUserRow } from "@/lib/supabase/types";
import ImageUploadField from "./ImageUploadField";

type Props = {
  dashboardSlug: string;
  initial: PlatformUserRow;
};

export default function SettingsForm({ dashboardSlug, initial }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initial.display_name);
  const [slug, setSlug] = useState(initial.slug);
  const [role, setRole] = useState(initial.role ?? "");
  const [location, setLocation] = useState(initial.location ?? "");
  const [bio, setBio] = useState(initial.bio ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial.avatar_url ?? "");
  const [seoTitle, setSeoTitle] = useState(initial.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(initial.seo_description ?? "");
  const [templateId, setTemplateId] = useState(initial.template_id);
  const [isPublished, setIsPublished] = useState(initial.is_published);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugCheckLoading, setSlugCheckLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const checkSlug = useCallback(async (value: string) => {
    setSlugCheckLoading(true);
    try {
      const res = await fetch(`/api/platform/profile/slug-available?slug=${encodeURIComponent(value)}`, {
        credentials: "same-origin",
      });
      const json = (await res.json()) as { ok?: boolean; available?: boolean };
      setSlugAvailable(res.ok && json.ok ? json.available ?? false : false);
    } catch {
      setSlugAvailable(null);
    } finally {
      setSlugCheckLoading(false);
    }
  }, []);

  useEffect(() => {
    const normalized = slug.trim().toLowerCase();
    if (!normalized) {
      setSlugAvailable(null);
      return;
    }
    const t = setTimeout(() => {
      void checkSlug(normalized);
    }, 320);
    return () => clearTimeout(t);
  }, [slug, checkSlug]);

  async function save() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      if (slug.trim().toLowerCase() !== initial.slug) {
        if (slugAvailable !== true) {
          throw new Error("Choose an available portfolio slug.");
        }
      }
      const res = await fetch("/api/platform/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          slug: slug.trim().toLowerCase(),
          display_name: displayName.trim(),
          role: role.trim() || null,
          location: location.trim() || null,
          bio: bio.trim() || null,
          phone: phone.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          seo_title: seoTitle.trim() || null,
          seo_description: seoDescription.trim() || null,
          template_id: templateId,
          is_published: isPublished,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; slug?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Save failed");
      setMessage("Saved.");
      if (json.slug && json.slug !== dashboardSlug) {
        router.push(`/dashboard/${json.slug}/settings`);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-card admin-card--wide">
      <h1 className="admin-card__title">Site settings</h1>
      <p className="admin-card__help">
        Profile, SEO, template, and publishing. Public pages use ISR and update after saves.
      </p>

      <div className="admin-field-grid">
        <label className="admin-label">
          Display name
          <input className="admin-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>

        <div>
          <label className="admin-label">
            Portfolio slug
            <input className="admin-input" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase())} />
          </label>
          <p className="admin-hint">Dashboard and public URLs use this slug.</p>
          {slugCheckLoading ? <p className="admin-hint">Checking…</p> : null}
          {!slugCheckLoading && slug.trim() && slugAvailable === true ? (
            <p className="admin-msg--ok" style={{ marginTop: "6px", display: "block" }}>
              Slug is available.
            </p>
          ) : null}
          {!slugCheckLoading && slug.trim() && slug.trim().toLowerCase() !== initial.slug && slugAvailable === false ? (
            <p className="admin-msg--err" style={{ marginTop: "6px", display: "block" }}>
              Slug is not available.
            </p>
          ) : null}
        </div>

        <label className="admin-label">
          Role
          <input className="admin-input" value={role} onChange={(e) => setRole(e.target.value)} />
        </label>
        <label className="admin-label">
          Location
          <input className="admin-input" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label className="admin-label">
          Bio
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>
        <label className="admin-label">
          Phone
          <input className="admin-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>

        <ImageUploadField
          portfolioSlug={dashboardSlug}
          label="Avatar image URL"
          value={avatarUrl}
          onChange={setAvatarUrl}
          uploadLabel="avatar"
        />

        <label className="admin-label">
          SEO title
          <input className="admin-input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </label>
        <label className="admin-label">
          SEO description
          <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </label>

        <div>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--admin-text)",
            }}
          >
            Template
          </p>
          <label className="admin-check">
            <input type="radio" name="template" checked={templateId === "minimal"} onChange={() => setTemplateId("minimal")} />
            <span>Minimal (only option today)</span>
          </label>
        </div>

        <label className="admin-check">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          <span>
            Publish portfolio publicly at /u/{slug.trim() || dashboardSlug}
          </span>
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
          {loading ? "Saving…" : "Save settings"}
        </button>
      </div>
    </section>
  );
}
