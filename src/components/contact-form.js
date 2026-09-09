"use client";

import { useState } from "react";
import { useLiveContent } from "@/hooks/use-live-content";

export function ContactForm() {
  const { contact } = useLiveContent();
  const [status, setStatus] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");
  async function submit(event) {
    event.preventDefault();
    setStatus("Sending…");
    setSubmittedMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    const result = await response.json();
    if (response.ok) {
      const submitted = String(form.get("message") || "").trim();
      event.currentTarget.reset();
      setSubmittedMessage(submitted);
      setStatus("Message submitted. We will get back to you soon.");
    }
    else setStatus(result.error || "Something went wrong. Please email instead.");
  }
  return <section id="contact" className="contact-section"><div className="container contact-grid">
    <div><p className="eyebrow">Start a conversation</p><h2>{contact.heading}</h2><p>{contact.text}</p></div>
    <form className="contact-form" onSubmit={submit}>
      <label>Name<input required name="name" autoComplete="name" /></label>
      <label>Email<input required name="email" type="email" autoComplete="email" /></label>
      <label>Where are you based? <span className="muted">(optional)</span><input name="country" autoComplete="country-name" /></label>
      <label>Current website <span className="muted">(optional)</span><input name="website" type="url" placeholder="https://" /></label>
      <label>Tell me a little about your business<textarea required name="message" rows="5" /></label>
      <input className="honeypot" name="company" tabIndex="-1" autoComplete="off" aria-hidden="true" />
      <label className="consent"><input required name="consent" type="checkbox" /> <span>I agree that JC NIVA can use this information to respond to my enquiry.</span></label>
      <button className="button" type="submit">{contact.formCta} <span aria-hidden="true">↗</span></button>
      <p className="form-status" aria-live="polite">{status}</p>
      {submittedMessage && <div className="submitted-enquiry" role="status"><strong>Your submitted message</strong><span>{submittedMessage}</span></div>}
    </form>
  </div></section>;
}
