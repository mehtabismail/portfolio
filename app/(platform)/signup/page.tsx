import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedPlatformUser } from "@/lib/supabase/queries/users";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import loginStyles from "../login/login.module.css";
import SignupForm from "./SignupForm";

export default async function PlatformSignupPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const profile = await getAuthenticatedPlatformUser(supabase);
    if (profile) redirect(`/dashboard/${profile.slug}`);
    redirect("/create");
  }

  return (
    <div className={loginStyles.wrap}>
      <div className={loginStyles.card}>
        <h1 className={loginStyles.title}>Create account</h1>
        <p className={loginStyles.text}>
          Sign up with email, then you will set your public portfolio URL on the next step.
        </p>
        <SignupForm />
        <Link href="/login" className={loginStyles.link}>
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
