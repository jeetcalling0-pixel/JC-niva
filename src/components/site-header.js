"use client";

import Link from "next/link";
import Image from "next/image";
import { useLiveContent } from "@/hooks/use-live-content";

export function SiteHeader() {
  const { brand } = useLiveContent();
  return <header className="site-header"><div className="container nav-wrap">
    <Link href="/" className="wordmark" aria-label={`${brand.name} home`}><span className="wordmark-mark"><Image src="/assets/jc-niva-mark.jpeg" alt="" width={128} height={72} priority /></span><span>{brand.name}<small>{brand.tagline}</small></span></Link>
    <nav aria-label="Primary navigation"><Link href="/">Home</Link><Link href="/testimonials">Testimonials</Link><Link href="/pricing">Pricing</Link></nav>
    <a className="button button-small" href={brand.calendly} target="_blank" rel="noreferrer">Book a call <span aria-hidden="true">↗</span></a>
  </div></header>;
}
