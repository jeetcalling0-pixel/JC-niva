"use client";

import { useLiveContent } from "@/hooks/use-live-content";

function FeatureText({ text }) {
  const match = text.match(/^(.*?)(\s+)(\*+)$/);
  return match ? <>{match[1]}<sup>{match[3]}</sup></> : text;
}

function RevisionNote({ note }) {
  const match = note.match(/^(\*+)\s*(.*)$/);
  return <p className="revision-note">{match ? <><sup>{match[1]}</sup>{match[2]}</> : note}</p>;
}

export function PricingContent() {
  const c = useLiveContent();

  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="container narrow">
          <p className="eyebrow">Ways to work together</p>
          <h1>Choose clarity over a one-size-fits-all website.</h1>
          <p className="lead">Every coaching business is at a different point. These are starting points for a conversation, not rigid packages.</p>
        </div>
      </section>
      <section className="pricing-section">
        <div className="container pricing-grid">
          {c.pricing.map((plan, index) => {
            const audience = plan.includes.find(item => item.toLowerCase().startsWith("for "));
            const inclusions = plan.includes.filter(item => item !== audience);
            return (
              <article className={"price-card " + (index === 1 ? "featured" : "")} key={plan.title}>
                {index === 1 && <p className="popular-badge">Most popular</p>}
                <div className="price-card-top">
                  <div className="price-card-heading">
                    <span className="price-card-index">0{index + 1}</span>
                    <p className="card-label">{plan.title}</p>
                  </div>
                  <p className="price-description">{plan.description}</p>
                  {audience && <p className="plan-audience">{audience}</p>}
                </div>
                <div className="price-card-investment">
                  <span>{plan.price ? "Investment" : "Scope & pricing"}</span>
                  {plan.price ? <p className="price">{plan.price}</p> : <p className="price-empty">Let&apos;s discuss your project</p>}
                </div>
                <div className="price-card-inclusions">
                  {inclusions.length ? <><p>What&apos;s included</p><ul>{inclusions.map(item => <li key={item}>✓ <FeatureText text={item} /></li>)}</ul></> : <p className="tailored-note">Your scope is shaped around your coaching business and goals.</p>}
                  {plan.revisionNote && <RevisionNote note={plan.revisionNote} />}
                </div>
                <a className="button button-light" href={c.brand.calendly} target="_blank" rel="noreferrer">{plan.cta} <span>↗</span></a>
              </article>
            );
          })}
        </div>
      </section>
      <section className="plain-callout"><div className="container narrow"><p className="eyebrow">Not sure where to begin?</p><h2>Start with a conversation.</h2><p>We can look at what is working, what is unclear and what a useful next step might be.</p><a className="text-link" href={c.brand.calendly} target="_blank" rel="noreferrer">Book a call ↗</a></div></section>
    </main>
  );
}
