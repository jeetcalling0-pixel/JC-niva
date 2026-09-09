"use client";

import Link from "next/link";
import { useLiveContent } from "@/hooks/use-live-content";

export function SiteFooter() {
  const { brand } = useLiveContent();
  return <footer className="site-footer"><div className="container footer-grid">
    <div className="footer-brand"><p className="footer-name">{brand.name}<small>{brand.tagline}</small></p><p className="footer-positioning">{brand.positioning}</p></div>
    <div className="footer-links"><a href={`mailto:${brand.email}`}>{brand.email}</a><a href={brand.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={brand.calendly} target="_blank" rel="noreferrer">Book a call ↗</a></div>
    <div className="legal-links"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/disclaimer">Disclaimer</Link></div>
  </div><div className="container footer-bottom">© {new Date().getFullYear()} {brand.name}. Good design should create direction, not decoration.</div></footer>;
}
