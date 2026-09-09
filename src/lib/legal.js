import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const legalMeta = {
  privacy: { title: "Privacy Policy", filename: "privacy.txt" },
  terms: { title: "Terms & Conditions", filename: "terms.txt" },
  disclaimer: { title: "Disclaimer", filename: "disclaimer.txt" }
};

export async function getLegalDocument(slug) {
  const item = legalMeta[slug];
  if (!item) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const db = createClient(url, key);
    const { data } = await db.from("legal_documents").select("title, content").eq("slug", slug).maybeSingle();
    if (data?.content) return data;
  }
  const filepath = path.join(process.cwd(), "src", "content", "legal", item.filename);
  return { title: item.title, content: await readFile(filepath, "utf8") };
}
