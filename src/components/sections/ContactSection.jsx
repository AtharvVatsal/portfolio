import React, { useState, useRef, useEffect } from 'react';
import { Github, Linkedin, Instagram, Loader2, Mail, MapPin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { CONTACT_INFO, SOCIAL_LINKS } from '../../config/links';
import { getAnnotation } from '../../data/annotations';
import SectionHeading from '../common/SectionHeading';
import EditorialReveal from '../common/EditorialReveal';
import { GlowBorder } from '../ui/spotlight-card';

const SERVICE = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
const TEMPLATE = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
const PUBLIC = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';

// The archive's closing line (existing copy from data/annotations.js).
const CLOSING = getAnnotation('contact')?.text;

// The last path segment of a profile URL: github.com/AtharvVatsal -> AtharvVatsal.
const handleOf = (url) => url.replace(/\/+$/, '').split('/').pop();

const ContactSection = () => {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') return;
    const t = setTimeout(() => setStatus('idle'), 6000);
    return () => clearTimeout(t);
  }, [status]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const d = new FormData(e.target);
    try {
      if (!SERVICE || !TEMPLATE || !PUBLIC) throw new Error();
      await emailjs.send(SERVICE, TEMPLATE, {
        from_name: d.get('name'), reply_to: d.get('email'), message: d.get('message'),
      }, PUBLIC);
      setStatus('success');
      e.target.reset();
    } catch { setStatus('error'); }
    finally { setSubmitting(false); }
  };

  // Handles are read from the links themselves (config/links.js), so the
  // label shown always matches the profile it opens.
  const socialLinks = [
    { icon: Github, url: SOCIAL_LINKS.github, label: 'GitHub', handle: `@${handleOf(SOCIAL_LINKS.github)}` },
    { icon: Linkedin, url: SOCIAL_LINKS.linkedin, label: 'LinkedIn', handle: handleOf(SOCIAL_LINKS.linkedin) },
    { icon: Instagram, url: SOCIAL_LINKS.instagram, label: 'Instagram', handle: `@${handleOf(SOCIAL_LINKS.instagram)}` },
  ];

  const field = 'w-full min-h-11 border border-ink-faint/70 bg-transparent px-3.5 py-2.5 text-small text-ink-primary placeholder-ink-faint transition-colors duration-200 hover:border-ink-muted focus:border-accent focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&:user-invalid]:border-error';
  const fieldLabel = 'mb-1.5 block font-mono text-meta uppercase text-ink-muted';
  const textLink = 'text-small text-ink-secondary underline decoration-notebook-border-light underline-offset-4 transition-colors duration-200 hover:text-ink-primary hover:decoration-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative pt-12 sm:pt-16 lg:pt-20 overflow-hidden"
    >
      <div className="archive-container relative z-10">
        <div>
          <SectionHeading number="06" id="contact-title" className="mb-8" reveal="fade">Contact</SectionHeading>

          {CLOSING && (
            <EditorialReveal
              mode="heading"
              level="feature"
              delay={120}
              className="max-w-3xl mb-12 sm:mb-16 font-editorial text-[clamp(1.875rem,4.4vw,3.5rem)] leading-[1.08] text-ink-primary"
            >
              {CLOSING}
            </EditorialReveal>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Direct lines */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-start gap-4">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center border border-notebook-border text-accent">
                  <Mail size={13} />
                </span>
                <div className="min-w-0">
                  <p className="meta-label">Email</p>
                  <p className="mt-1">
                    <a href={`mailto:${CONTACT_INFO.email}`} className={`${textLink} break-all text-ink-primary`}>
                      {CONTACT_INFO.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center border border-notebook-border text-accent">
                  <MapPin size={13} />
                </span>
                <div>
                  <p className="meta-label">Location</p>
                  <p className="mt-1 text-small text-ink-muted">{CONTACT_INFO.location}</p>
                </div>
              </div>

              <div>
                <p className="meta-label">Connect</p>
                <div className="mt-3">
                  <ul className="border-t border-notebook-border">
                    {socialLinks.map((s) => (
                      <li key={s.label} className="border-b border-notebook-border">
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex min-h-12 items-center gap-3 py-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
                        >
                          <s.icon size={14} aria-hidden="true" className="shrink-0 text-ink-muted transition-colors duration-200 group-hover:text-accent" />
                          <span className="text-small text-ink-secondary transition-colors duration-200 group-hover:text-ink-primary">{s.label}</span>
                          <span className="font-mono text-meta text-ink-faint">{s.handle}</span>
                          <span aria-hidden="true" className="ml-auto text-ink-faint transition-colors duration-200 group-hover:text-ink-primary">↗</span>
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="relative isolate border border-notebook-border bg-notebook-surface">
                <GlowBorder />
                <div className="relative p-6 sm:p-8">
                  <h3 className="meta-label flex items-center gap-2">
                    <Send size={12} aria-hidden="true" className="text-accent" />
                    Send a message
                  </h3>

                  {/* Announces sending / sent / failed to assistive tech. */}
                  <p className="sr-only" role="status" aria-live="polite">
                    {submitting ? 'Sending message' : status === 'success' ? 'Message sent.' : status === 'error' ? 'Failed to send. Try again or email me directly.' : ''}
                  </p>

                  {/* The form keeps its place (and the card's size) but is unreachable while a result shows. */}
                  <div className={`mt-6 transition-opacity duration-300 ${status === 'idle' ? 'opacity-100' : 'opacity-0'}`} aria-hidden={status !== 'idle' || undefined}>
                    <form ref={formRef} onSubmit={submit} aria-label="Send a message">
                      <fieldset disabled={submitting || status !== 'idle'} className="space-y-4 min-w-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="contact-name" className={fieldLabel}>Name</label>
                            <input id="contact-name" type="text" name="name" required autoComplete="name" className={field} />
                          </div>
                          <div>
                            <label htmlFor="contact-email" className={fieldLabel}>Email</label>
                            <input id="contact-email" type="email" name="email" required autoComplete="email" className={field} />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="contact-message" className={fieldLabel}>Message</label>
                          <textarea id="contact-message" name="message" rows={4} required className={`${field} resize-y`} />
                        </div>
                        <button
                          type="submit"
                          className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-accent px-4 text-small text-ink-primary transition-colors duration-200 hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:w-auto sm:px-6"
                        >
                          {submitting ? <><Loader2 size={13} className="motion-safe:animate-spin" aria-hidden="true" /><span>Sending</span></>
                            : <><span>Send message</span><span aria-hidden="true">→</span></>}
                        </button>
                      </fieldset>
                    </form>
                  </div>

                  {/* Result states render only when current, so their buttons are never focusable while hidden. */}
                  {status !== 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <p className={`meta-label ${status === 'success' ? '!text-success' : '!text-error'}`}>
                        {status === 'success' ? 'Sent' : 'Not sent'}
                      </p>
                      <p className="mt-2 font-editorial text-title text-ink-primary">
                        {status === 'success' ? 'Message sent' : 'Failed to send'}
                      </p>
                      <p className="mt-1 text-small text-ink-muted">
                        {status === 'success' ? "I'll get back to you soon." : 'Try again or email me directly.'}
                      </p>
                      <button type="button" onClick={() => setStatus('idle')} className={`${textLink} mt-5 min-h-11`}>
                        {status === 'success' ? 'Send another' : 'Try again'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="py-5 sm:py-6" />
    </section>
  );
};

export default ContactSection;
