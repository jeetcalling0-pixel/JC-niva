"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [status, setStatus] = useState(""); const router = useRouter();
  async function submit(event) {
    event.preventDefault(); setStatus("Signing in…");
    const db = createBrowserSupabaseClient();
    if (!db) { setStatus("Add your Supabase environment variables before signing in."); return; }
    const form = new FormData(event.currentTarget);
    const { error } = await db.auth.signInWithPassword({ email: form.get("email"), password: form.get("password") });
    if (error) setStatus(error.message); else router.replace("/admin");
  }
  return <main className="login-page"><form className="login-card" onSubmit={submit}><p className="eyebrow">JC NIVA</p><h1>Owner sign in</h1><label>Email<input required name="email" type="email" defaultValue="jeetcalling0@gmail.com" autoComplete="email" /></label><label>Password<input required name="password" type="password" autoComplete="current-password" /></label><button className="button" type="submit">Sign in</button><p className="form-status" aria-live="polite">{status}</p><p className="muted">This is a private owner area. Accounts are created in Supabase; there is no public sign-up.</p></form></main>;
}
