import Link from "next/link";
import { Suspense } from "react";
import loginStyles from "./login.module.css";
import LoginForm from "./LoginForm";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function PlatformLoginPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const err = typeof sp.error === "string" ? sp.error : undefined;

  return (
    <div className={loginStyles.wrap}>
      <div className={loginStyles.card}>
        <h1 className={loginStyles.title}>Platform sign-in</h1>
        <p className={loginStyles.text}>Sign in to manage your hosted portfolio and content.</p>
        {err === "config" ? (
          <p className={loginStyles.err}>
            Supabase is not configured: set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code>, then restart the dev server.
          </p>
        ) : null}
        {err && err !== "config" ? (
          <p className={loginStyles.err}>
            {(() => {
              try {
                return decodeURIComponent(err);
              } catch {
                return err;
              }
            })()}
          </p>
        ) : null}
        <Suspense fallback={<p className={loginStyles.text}>Loading form…</p>}>
          <LoginForm />
        </Suspense>
        <Link href="/" className={loginStyles.link}>
          ← Back to portfolio
        </Link>
      </div>
    </div>
  );
}
