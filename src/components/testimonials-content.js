"use client";

import { useLiveContent, useLiveTestimonials } from "@/hooks/use-live-content";

export function TestimonialsContent() {
  const c = useLiveContent();
  const testimonials = useLiveTestimonials();
  return <main className="page-main"><section className="page-hero"><div className="container narrow"><p className="eyebrow">Client words</p><h1>Trust is earned in the work.</h1><p className="lead">A selection of genuine client feedback will live here as it is received and approved.</p></div></section>
    <section className="testimonials-section"><div className="container">{testimonials.length ? <div className="testimonial-grid">{testimonials.map(item => <figure className="testimonial" key={item.id}><blockquote>“{item.quote}”</blockquote><figcaption><strong>{item.name}</strong>{item.role && <span>{item.role}{item.company ? `, ${item.company}` : ""}</span>}</figcaption></figure>)}</div> : <div className="empty-state"><span className="empty-mark">JC</span><h2>Client stories are being gathered thoughtfully.</h2><p>This space is reserved for real feedback, in its proper context. Until then, there are no borrowed logos, made-up quotes or inflated claims.</p><a className="button button-light" href={c.brand.calendly} target="_blank" rel="noreferrer">Book a call <span>↗</span></a></div>}</div></section>
  </main>;
}
