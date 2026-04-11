"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { userHasGoogleIdentity } from "@/lib/platform/oauth-profile";
import loginStyles from "../login/login.module.css";
import forms from "../platform-forms.module.css";
import EmailFinishPortfolioForm from "./EmailFinishPortfolioForm";

type Props = {
  hasSession: boolean;
};

function GoogleAutoCreate({ onRetry }: { onRetry: () => void }) {
  const [error, setError] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      setError("");
      try {
        const res = await fetch("/api/platform/create-from-session", {
          method: "POST",
          credentials: "same-origin",
        });
        const json = (await res.json()) as { ok?: boolean; slug?: string; error?: string };
        if (!res.ok || !json.ok || !json.slug) {
          throw new Error(json.error || "Could not create portfolio");
        }
        // Full navigation so Barba / scroll scripts and RSC data initialize like a manual reload.
        window.location.assign(`/u/${json.slug}`);
      } catch (e) {
        ran.current = false;
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    })();
  }, []);

  if (error) {
    return (
      <div>
        <p className={loginStyles.err}>{error}</p>
        <button type="button" className={`${forms.btn} ${forms.btnGhost}`} onClick={() => onRetry()}>
          Try again
        </button>
      </div>
    );
  }

  return <p className={loginStyles.text}>Setting up your portfolio from your Google profile…</p>;
}

export default function CreateWithGoogle({ hasSession }: Props) {
  const searchParams = useSearchParams();
  const sourceEmail = searchParams.get("source") === "email";

  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasUser, setHasUser] = useState(hasSession);
  const [isGoogle, setIsGoogle] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [existingSlug, setExistingSlug] = useState<string | null>(null);
  const [autoKey, setAutoKey] = useState(0);
  const [oauthError, setOauthError] = useState("");

  const refreshSession = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setHasUser(!!user);
    if (user) {
      setIsGoogle(userHasGoogleIdentity(user));
      const { data: row } = await supabase.from("platform_users").select("slug").eq("id", user.id).maybeSingle();
      setHasProfile(!!row?.slug);
      setExistingSlug(row?.slug ?? null);
    } else {
      setIsGoogle(false);
      setHasProfile(false);
      setExistingSlug(null);
    }
    setSessionChecked(true);
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (!sessionChecked || !hasUser || !hasProfile || !existingSlug) return;
    window.location.assign(`/u/${existingSlug}`);
  }, [sessionChecked, hasUser, hasProfile, existingSlug]);

  if (!sessionChecked) {
    return <p className={loginStyles.text}>Loading…</p>;
  }

  if (hasUser && hasProfile) {
    return <p className={loginStyles.text}>Redirecting…</p>;
  }

  if (hasUser && !hasProfile && (sourceEmail || !isGoogle)) {
    return <EmailFinishPortfolioForm />;
  }

  if (hasUser && !hasProfile && isGoogle && !sourceEmail) {
    return (
      <GoogleAutoCreate
        key={autoKey}
        onRetry={() => {
          setAutoKey((k) => k + 1);
        }}
      />
    );
  }

  return (
    <div>
      <p className={loginStyles.text}>
        Continue with Google. We use your name and profile photo from Google, build your portfolio URL from your first
        and last name (for example <code>jane-doe</code>, or <code>jane-doe-2</code> if that URL is already taken), and
        fill your site with demo content you can edit in the dashboard.
      </p>
      {oauthError ? <p className={loginStyles.err}>{oauthError}</p> : null}
      <div className={forms.rowActions} style={{ marginTop: "1.25rem" }}>
        <button
          type="button"
          className={`${forms.btn} ${forms.btnPrimary}`}
          onClick={async () => {
            setOauthError("");
            const supabase = createSupabaseBrowserClient();
            const origin = window.location.origin;
            const { error: oauthErr } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${origin}/api/platform/auth/callback?next=${encodeURIComponent("/create")}`,
              },
            });
            if (oauthErr) setOauthError(oauthErr.message);
          }}
        >
          Continue with Google
        </button>
      </div>
      <p className={loginStyles.text} style={{ marginTop: "1.25rem" }}>
        Prefer email and password?{" "}
        <Link href="/signup" className={loginStyles.link} style={{ marginTop: 0 }}>
          Sign up
        </Link>
        {" · "}
        <Link href="/login?next=/create" className={loginStyles.link} style={{ marginTop: 0 }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
