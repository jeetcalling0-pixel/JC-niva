"use client";

import { useEffect, useState } from "react";
import { defaultContent } from "@/content/default-content";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function useLiveContent() {
  const [content, setContent] = useState(defaultContent);
  useEffect(() => {
    const db = createBrowserSupabaseClient();
    if (!db) return;
    let alive = true;
    db.from("site_settings").select("content").eq("id", "global").maybeSingle()
      .then(({ data }) => { if (alive && data?.content) setContent(data.content); });
    const channel = db.channel(`site-settings-live-${crypto.randomUUID()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings", filter: "id=eq.global" }, payload => {
        if (payload.new?.content) setContent(payload.new.content);
      }).subscribe();
    return () => { alive = false; db.removeChannel(channel); };
  }, []);
  return content;
}

export function useLiveTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    const db = createBrowserSupabaseClient();
    if (!db) return;
    const load = () => db.from("testimonials").select("*").eq("published", true).order("created_at", { ascending: false }).then(({ data }) => setTestimonials(data || []));
    load();
    const channel = db.channel(`testimonials-live-${crypto.randomUUID()}`).on("postgres_changes", { event: "*", schema: "public", table: "testimonials" }, load).subscribe();
    return () => db.removeChannel(channel);
  }, []);
  return testimonials;
}
