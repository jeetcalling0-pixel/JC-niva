import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { defaultContent } from "../src/content/default-content.js";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.");
const db = createClient(url, serviceKey);
const legalDocuments = await Promise.all(["privacy", "terms", "disclaimer"].map(async slug => ({
  slug,
  title: slug === "privacy" ? "Privacy Policy" : slug === "terms" ? "Terms & Conditions" : "Disclaimer",
  content: await readFile(new URL(`../src/content/legal/${slug}.txt`, import.meta.url), "utf8")
})));
const { error: contentError } = await db.from("site_settings").upsert({ id: "global", content: defaultContent });
if (contentError) throw contentError;
const { error: legalError } = await db.from("legal_documents").upsert(legalDocuments);
if (legalError) throw legalError;
console.log("JC NIVA content and supplied legal documents seeded.");
