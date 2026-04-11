import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getAuthenticatedPlatformUser } from "@/lib/supabase/queries/users";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CreateWithGoogle from "./CreateWithGoogle";
import loginStyles from "../login/login.module.css";

export default async function CreatePortfolioPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = await getAuthenticatedPlatformUser(supabase);
    if (profile) {
      redirect(`/u/${profile.slug}`);
    }
  }

  return (
    <div className={loginStyles.wrap}>
      <div className={loginStyles.card} style={{ maxWidth: "32rem" }}>
        <h1 className={loginStyles.title}>Create your portfolio</h1>
        <Suspense fallback={<p className={loginStyles.text}>Loading…</p>}>
          <CreateWithGoogle hasSession={!!user} />
        </Suspense>
      </div>
    </div>
  );
}
