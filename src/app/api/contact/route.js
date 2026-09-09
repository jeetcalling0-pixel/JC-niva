import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const body = await request.json();
    if (body.company) return Response.json({ ok: true });
    if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim() || !body.consent) return Response.json({ error: "Please complete the required fields." }, { status: 400 });
    const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !publicKey) return Response.json({ error: "The enquiry form is being connected. Please use the email link below." }, { status: 503 });
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, publicKey);
    const { error } = await db.from("enquiries").insert({ name: body.name.trim(), email: body.email.trim(), country: body.country?.trim() || null, website: body.website?.trim() || null, message: body.message.trim() });
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: "Unable to send this enquiry right now. Please email scale.ai@zohomail.in." }, { status: 500 });
  }
}
