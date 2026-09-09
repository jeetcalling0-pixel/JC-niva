"use client";

import Image from "next/image";
import Link from "next/link";
import { useLiveContent } from "@/hooks/use-live-content";
import { ContactForm } from "@/components/contact-form";

const CallLink = ({ children, className = "button" }) => { const { brand } = useLiveContent(); return <a className={className} href={brand.calendly} target="_blank" rel="noreferrer">{children} <span aria-hidden="true">↗</span></a>; };

export function HomeContent() {
  const c = useLiveContent();
  return <main style={{ "--accent": c.brand.colours?.accent, "--ink": c.brand.colours?.ink, "--canvas": c.brand.colours?.canvas }}>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow">{c.hero.eyebrow}</p><h1>{c.hero.title}</h1><p className="lead">{c.hero.description}</p><div className="hero-actions"><div className="button-row"><CallLink>{c.hero.primaryCta}</CallLink><a className="button button-light hero-linkedin" href={c.brand.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <span aria-hidden="true">↗</span></a></div><p className="hero-cta-note">Let&apos;s talk about the next step for your coaching website.</p></div></div>
      <div className="hero-mark"><Image src="/assets/jc-niva-mark.jpeg" alt="JC NIVA monogram" width={1280} height={720} priority /></div></div></section>
    <section className="audience-section"><div className="container"><p className="eyebrow">Who this is for</p><h2>{c.audience.heading}</h2><div className="audience-grid">{c.audience.paths.map(path => <article className="audience-card" key={path.title}><p className="card-label">{path.title}</p><p>{path.text}</p><CallLink className="text-link">{path.cta}</CallLink></article>)}</div></div></section>
    <section id="approach" className="approach-section"><div className="container"><div className="section-intro"><p className="eyebrow">How I work</p><h2>{c.services.heading}</h2><p>{c.services.intro}</p></div><div className="service-list">{c.services.items.map(item => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>
    <section className="pricing-preview"><div className="container split-callout"><div><p className="eyebrow">Simple next steps</p><h2>Clear scope. A thoughtful website. No pressure.</h2></div><div><p>Every project begins with an honest conversation about where you are now and what the site needs to achieve.</p><Link className="button button-light pricing-preview-button" href="/pricing">View ways to work together <span>→</span></Link></div></div></section>
    <section className="about-section"><div className="container about-grid"><div className="portrait-wrap"><Image src="/assets/jiitendra-chauhan.jpeg" alt="Jiitendra Chauhan" width={897} height={1592} /></div><div><p className="eyebrow">My story</p><h2>{c.about.heading}</h2><h3>{c.about.title}</h3>{c.about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<a href={c.brand.linkedin} target="_blank" rel="noreferrer" className="text-link">Connect on LinkedIn ↗</a></div></div></section>
    <section className="logo-story"><div className="container logo-story-grid"><div className="logo-image"><Image src="/assets/jc-niva-logo.jpeg" alt="JC NIVA Digital Craftsmanship logo" width={1280} height={720} /></div><div><p className="eyebrow">The brand</p><h2>{c.logoStory.heading}</h2><p className="supporting-line">{c.logoStory.support}</p><p>{c.logoStory.intro}</p><div className="ideas">{c.logoStory.ideas.map(idea => <div key={idea.title}><h3>{idea.title}</h3><p>{idea.text}</p></div>)}</div><blockquote>“{c.logoStory.quote}”</blockquote></div></div></section>
    <ContactForm />
  </main>;
}
