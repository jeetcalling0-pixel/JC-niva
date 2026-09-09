"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultContent } from "@/content/default-content";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const blankTestimonial = { name: "", role: "", company: "", quote: "", published: false };

export function AdminDashboard({ email }) {
  const [rawContent, setRawContent] = useState(JSON.stringify(defaultContent, null, 2));
  const [testimonials, setTestimonials] = useState([]); const [legal, setLegal] = useState([]); const [enquiries, setEnquiries] = useState([]); const [enquiryPage, setEnquiryPage] = useState(0); const [enquiryPageSize, setEnquiryPageSize] = useState(20); const [hasMoreEnquiries, setHasMoreEnquiries] = useState(false); const [enquiriesLoading, setEnquiriesLoading] = useState(false); const [status, setStatus] = useState("Loading editor…"); const [uploadUrl, setUploadUrl] = useState(""); const router = useRouter();
  const db = createBrowserSupabaseClient();
  async function loadEnquiries(page = 0, limit = enquiryPageSize) {
    if (!db) return;
    setEnquiriesLoading(true);
    const first = page * limit;
    const { data, error } = await db.from("enquiries").select("id, name, email, country, website, message, created_at").order("created_at", { ascending: false }).range(first, first + limit);
    if (error) {
      setStatus(error.message);
    } else {
      setEnquiries((data || []).slice(0, limit));
      setHasMoreEnquiries((data || []).length > limit);
      setEnquiryPage(page);
      setEnquiryPageSize(limit);
    }
    setEnquiriesLoading(false);
  }
  const load = async () => {
    if (!db) return;
    const [settings, quotes, docs] = await Promise.all([
      db.from("site_settings").select("content").eq("id", "global").maybeSingle(),
      db.from("testimonials").select("*").order("created_at", { ascending: false }),
      db.from("legal_documents").select("*").order("slug")
    ]);
    if (settings.data?.content) setRawContent(JSON.stringify(settings.data.content, null, 2));
    setTestimonials(quotes.data || []);
    setLegal(docs.data || []);
    await loadEnquiries(0, enquiryPageSize);
    setStatus("");
  };
  useEffect(() => { load(); }, []);
  async function saveContent() { try { const content = JSON.parse(rawContent); setStatus("Saving public content…"); const { error } = await db.from("site_settings").upsert({ id: "global", content, updated_by: email }); if (error) throw error; setStatus("Saved. Public pages update immediately."); } catch (error) { setStatus(error instanceof SyntaxError ? "Content must be valid JSON." : error.message); } }
  const updateQuote = (index, field, value) => setTestimonials(items => items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  async function saveQuote(item) { setStatus("Saving testimonial…"); const payload = { name: item.name, role: item.role || null, company: item.company || null, quote: item.quote, published: item.published }; const result = item.id ? await db.from("testimonials").update(payload).eq("id", item.id) : await db.from("testimonials").insert(payload); if (result.error) setStatus(result.error.message); else { setStatus("Testimonial saved."); load(); } }
  async function deleteQuote(id) { if (!id || !confirm("Delete this testimonial?")) return; const { error } = await db.from("testimonials").delete().eq("id", id); setStatus(error?.message || "Testimonial deleted."); if (!error) load(); }
  async function saveLegal(item) { setStatus("Saving legal page…"); const { error } = await db.from("legal_documents").upsert({ slug: item.slug, title: item.title, content: item.content }); setStatus(error?.message || "Legal page saved."); }
  async function upload(event) { const file = event.target.files?.[0]; if (!file) return; setStatus("Uploading media…"); const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`; const { error } = await db.storage.from("media").upload(path, file, { upsert: false }); if (error) return setStatus(error.message); const { data } = db.storage.from("media").getPublicUrl(path); setUploadUrl(data.publicUrl); setStatus("Uploaded. Copy the URL into the content editor where needed."); }
  async function signOut() { await db.auth.signOut(); router.replace("/admin/login"); }
  return <main className="admin-page"><div className="admin-top"><div><p className="eyebrow">Private owner editor</p><h1>JC NIVA content</h1><p className="muted">Signed in as {email}</p></div><button className="text-button" onClick={signOut}>Sign out</button></div><p className="admin-status" aria-live="polite">{status}</p>
    <section className="admin-panel"><h2>Public site content</h2><p>Every editable brand, copy, CTA, SEO, colour and pricing field lives in this structured content record. Leave a pricing <code>price</code> value blank to hide it publicly.</p><textarea className="json-editor" value={rawContent} onChange={e => setRawContent(e.target.value)} spellCheck="false" /><button className="button" onClick={saveContent}>Save all public content</button></section>
    <section className="admin-panel"><h2>Testimonials</h2><button className="button button-light" onClick={() => setTestimonials(items => [blankTestimonial, ...items])}>Add testimonial</button><div className="admin-list">{testimonials.map((item, index) => <article className="testimonial-editor" key={item.id || `new-${index}`}><div className="form-columns"><label>Name<input value={item.name} onChange={e => updateQuote(index, "name", e.target.value)} /></label><label>Role<input value={item.role || ""} onChange={e => updateQuote(index, "role", e.target.value)} /></label><label>Company<input value={item.company || ""} onChange={e => updateQuote(index, "company", e.target.value)} /></label></div><label>Quote<textarea rows="4" value={item.quote} onChange={e => updateQuote(index, "quote", e.target.value)} /></label><label className="consent"><input type="checkbox" checked={item.published} onChange={e => updateQuote(index, "published", e.target.checked)} /><span>Publish this testimonial</span></label><div className="button-row"><button className="button button-small" onClick={() => saveQuote(item)}>Save</button>{item.id && <button className="text-button danger" onClick={() => deleteQuote(item.id)}>Delete</button>}</div></article>)}</div></section>
    <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Enquiries</h2><p>Newest submissions first. Only the selected batch is requested from Supabase.</p></div><button className="button button-small button-light" onClick={() => loadEnquiries(0, enquiryPageSize)} disabled={enquiriesLoading}>Refresh</button></div><div className="enquiry-controls"><label>Load <select value={enquiryPageSize} onChange={event => loadEnquiries(0, Number(event.target.value))} disabled={enquiriesLoading}><option value="20">20 per page</option><option value="50">50 per page (bulk)</option><option value="100">100 per page (bulk)</option></select></label><span>Page {enquiryPage + 1}</span><div className="enquiry-pagination"><button className="text-button" onClick={() => loadEnquiries(enquiryPage - 1, enquiryPageSize)} disabled={enquiriesLoading || enquiryPage === 0}>Previous</button><button className="text-button" onClick={() => loadEnquiries(enquiryPage + 1, enquiryPageSize)} disabled={enquiriesLoading || !hasMoreEnquiries}>Next</button></div></div>{enquiriesLoading ? <p className="muted">Loading enquiries…</p> : enquiries.length ? <div className="enquiry-list">{enquiries.map(item => <article className="enquiry-card" key={item.id}><div className="enquiry-meta"><strong>{item.name}</strong><span>{new Date(item.created_at).toLocaleString()}</span></div><a href={"mailto:" + item.email}>{item.email}</a>{item.country && <span>{item.country}</span>}{item.website && <a href={item.website} target="_blank" rel="noreferrer">{item.website} ↗</a>}<p>{item.message}</p></article>)}</div> : <p className="muted">No enquiries have been submitted yet.</p>}</section>
    <section className="admin-panel"><h2>Legal pages</h2><p>Edit only after reviewing the legal wording for your live services and region.</p>{legal.map((item, index) => <article className="legal-editor" key={item.slug}><label>Page title<input value={item.title} onChange={e => setLegal(items => items.map((doc, i) => i === index ? { ...doc, title: e.target.value } : doc))} /></label><label>Page content<textarea rows="12" value={item.content} onChange={e => setLegal(items => items.map((doc, i) => i === index ? { ...doc, content: e.target.value } : doc))} /></label><button className="button button-small" onClick={() => saveLegal(item)}>Save {item.slug}</button></article>)}</section>
    <section className="admin-panel"><h2>Media upload</h2><p>Upload an image to the private admin-managed public media library, then use the generated URL in the content record.</p><input type="file" accept="image/*" onChange={upload} />{uploadUrl && <p className="upload-url">{uploadUrl}</p>}</section>
  </main>;
}
