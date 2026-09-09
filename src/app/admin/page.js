import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata = { robots: { index: false, follow: false }, title: "Owner editor | JC NIVA" };

export default async function AdminPage() {
  const db = await createServerSupabaseClient();
  if (!db) redirect("/admin/login?reason=config");
  const { data: { user } } = await db.auth.getUser();
  if (!user || user.email?.toLowerCase() !== "jeetcalling0@gmail.com") redirect("/admin/login");
  return <AdminDashboard email={user.email} />;
}
