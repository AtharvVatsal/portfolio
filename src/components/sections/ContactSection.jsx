import React, { useState, useRef, useEffect } from 'react';
import { Github, Linkedin, Instagram, Loader2, Mail, MapPin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { CONTACT_INFO, SOCIAL_LINKS } from '../../config/links';
import { useInView } from '../../hooks/useInView';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const SERVICE = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
const TEMPLATE = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
const PUBLIC = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';

const ContactSection = () => {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('idle');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const formRef = useRef(null);
  const cardRef = useRef(null);
  const infoRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [infoTilt, setInfoTilt] = useState({ x: 0, y: 0 });
  const [infoHovered, setInfoHovered] = useState(false);
  const [tiltHovered, setTiltHovered] = useState(false);
  const [inViewRef, inView] = useInView({ threshold: 0.05 });
  const [contentAnimRef, contentAnim] = useScrollAnimation({ rootMargin: '0px 0px -100px 0px' });

  useEffect(() => {
    if (status === 'idle') return;
    const t = setTimeout(() => setStatus('idle'), 6000);
    return () => clearTimeout(t);
  }, [status]);

  const handleSectionMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: y * -8 });
  };

  const handleInfoMouseMove = (e) => {
    if (!infoRef.current) return;
    const rect = infoRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setInfoTilt({ x: x * 5, y: y * -5 });
  };

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

  const socialLinks = [
    { icon: Github, url: SOCIAL_LINKS.github, label: 'GitHub', handle: '@atharvavatsal' },
    { icon: Linkedin, url: SOCIAL_LINKS.linkedin, label: 'LinkedIn', handle: 'atharv-vatsal' },
    { icon: Instagram, url: SOCIAL_LINKS.instagram, label: 'Instagram', handle: '@atharv.vatsal' },
  ];

  return (
    <section
      ref={(node) => { inViewRef.current = node; }}
      onMouseMove={handleSectionMouse}
      id="contact"
      className="relative pt-12 sm:pt-16 lg:pt-20 overflow-hidden"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blueprint/[0.01] to-transparent" />
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: [
          'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '64px 64px, 64px 64px',
      }} />

      {/* Floating geometric elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] right-[10%] w-48 h-48 border border-blueprint/[0.03] rounded-full transition-all duration-1000"
          style={{ transform: `translate(${mousePos.x * 0.008}px, ${mousePos.y * -0.008}px)` }} />
        <div className="absolute top-[20%] right-[15%] w-32 h-32 border border-blueprint/[0.02] rounded-full transition-all duration-1000"
          style={{ transform: `translate(${mousePos.x * -0.012}px, ${mousePos.y * 0.012}px)` }} />
        <div className="absolute bottom-[25%] left-[8%] w-1 h-1 rounded-full bg-blueprint/[0.04]" />
        <div className="absolute top-[40%] left-[5%] w-0.5 h-0.5 rounded-full bg-blueprint/[0.03]" />
        <div className="absolute top-[60%] right-[20%] w-1.5 h-1.5 rounded-full bg-blueprint/[0.02]" />
        <div className="absolute bottom-[40%] left-[15%] w-0.5 h-0.5 rounded-full bg-blueprint/[0.03]" />

        {/* Corner bracket Ã¢â‚¬â€ bottom-left */}
        <div className="absolute bottom-16 left-8 opacity-[0.015]">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="0.75">
            <path d="M24 4H4V24" />
            <path d="M4 14H10M14 4V10" strokeDasharray="1.5 1.5" />
          </svg>
        </div>

        {/* Signal/pulse decoration Ã¢â‚¬â€ top-left */}
        <div className="absolute top-[10%] left-[5%] opacity-[0.012]">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="0.5">
            <path d="M4 20C4 11.1634 11.1634 4 20 4C28.8366 4 36 11.1634 36 20" />
            <path d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20" />
            <path d="M16 20C16 17.7909 17.7909 16 20 16C22.2091 16 24 17.7909 24 20" />
          </svg>
        </div>

        {/* Grid/graticule Ã¢â‚¬â€ center-right */}
        <svg className="absolute top-[55%] right-[3%] opacity-[0.01]" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="0.5">
          <rect x="2" y="2" width="28" height="28" />
          <path d="M2 16H30M16 2V30" />
          <circle cx="16" cy="16" r="4" />
        </svg>
      </div>

      {/* Spotlight */}
      <div className="absolute pointer-events-none transition-all duration-[500ms] ease-out"
        style={{
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)',
          left: mousePos.x - 250, top: mousePos.y - 250,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div ref={contentAnimRef} className="max-w-5xl"
          style={{
            opacity: contentAnim.progress,
            transform: `translateY(${20 * (1 - contentAnim.progress)}px)`,
            transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform, opacity',
          }}
        >
          <span className="font-mono text-[0.85rem] text-ink-faint/70 uppercase tracking-[0.2em] mb-8 block" style={{
            opacity: contentAnim.progress,
            transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>05 / Channel</span>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Contact info Ã¢â‚¬â€ 2 columns */}
            <div
              ref={infoRef}
              onMouseMove={handleInfoMouseMove}
              onMouseEnter={() => setInfoHovered(true)}
              onMouseLeave={() => { setInfoHovered(false); setInfoTilt({ x: 0, y: 0 }); }}
              className="lg:col-span-2 space-y-10"
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                transform: `rotateX(${infoTilt.y}deg) rotateY(${infoTilt.x}deg)`,
                transition: infoHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
              }}
            >
              {/* Email card */}
              <div className="group"
                style={{
                  opacity: contentAnim.progress,
                  transform: `translateY(${24 * (1 - contentAnim.progress)}px) translateZ(15px)`,
                  transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform, opacity',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center border border-blueprint/20 group-hover:border-blueprint/40 transition-colors duration-300" style={{ transform: 'translateZ(5px)' }}>
                    <Mail size={13} className="text-blueprint/60 group-hover:text-blueprint transition-colors duration-300" />
                  </div>
                  <div style={{ transform: 'translateZ(8px)' }}>
                    <p className="font-mono text-[0.85rem] text-ink-faint/60 uppercase tracking-[0.2em] mb-1.5">Email</p>
                    <a href={`mailto:${CONTACT_INFO.email}`}
                      className="font-mono text-[0.85rem] text-ink-primary hover:text-blueprint-light transition-colors duration-300 break-all">
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Location card */}
              <div className="group"
                style={{
                  opacity: Math.max(0, Math.min(1, (contentAnim.progress - 0.08) / 0.92)),
                  transform: `translateY(${24 * (1 - contentAnim.progress)}px) translateZ(20px)`,
                  transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform, opacity',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center border border-blueprint/20 group-hover:border-blueprint/40 transition-colors duration-300" style={{ transform: 'translateZ(5px)' }}>
                    <MapPin size={13} className="text-blueprint/60 group-hover:text-blueprint transition-colors duration-300" />
                  </div>
                  <div style={{ transform: 'translateZ(10px)' }}>
                    <p className="font-mono text-[0.85rem] text-ink-faint/60 uppercase tracking-[0.2em] mb-1.5">Location</p>
                    <p className="font-mono text-[0.85rem] text-ink-muted leading-relaxed">{CONTACT_INFO.location}</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="space-y-3"
                style={{
                  opacity: Math.max(0, Math.min(1, (contentAnim.progress - 0.16) / 0.84)),
                  transform: `translateY(${24 * (1 - contentAnim.progress)}px) translateZ(25px)`,
                  transition: 'transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform, opacity',
                }}
              >
                <p className="font-mono text-[0.85rem] text-ink-faint/60 uppercase tracking-[0.2em] mb-4">Connect</p>
                {socialLinks.map((s, i) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-3 py-2.5 px-3 border border-transparent hover:border-ink-faint/10 transition-all duration-300"
                  >
                    <span className="w-8 h-8 flex items-center justify-center border border-ink-faint/15 group-hover:border-blueprint/30 group-hover:bg-blueprint/[0.03] transition-all duration-300" style={{ transform: 'translateZ(5px)' }}>
                      <s.icon size={12} className="text-ink-muted group-hover:text-blueprint transition-colors duration-300" />
                    </span>
                    <div>
                      <span className="block text-sm text-ink-secondary group-hover:text-ink-primary transition-colors duration-300">{s.label}</span>
                      <span className="block font-mono text-[0.9rem] text-ink-faint/70">{s.handle}</span>
                    </div>
                    <svg className="ml-auto w-3 h-3 text-ink-faint/70 group-hover:text-ink-muted transition-all duration-300 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 3L10 8L5 13" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Form Ã¢â‚¬â€ 3 columns */}
            <div className="lg:col-span-3"
              style={{ perspective: '1200px' }}
            >
              <div
                ref={cardRef}
                onMouseMove={handleCardMouseMove}
                onMouseEnter={() => setTiltHovered(true)}
                onMouseLeave={() => { setTiltHovered(false); setTilt({ x: 0, y: 0 }); }}
                className="relative border border-ink-faint/10 bg-notebook-bg/30 backdrop-blur-sm overflow-hidden"
                style={{
                  opacity: Math.max(0, Math.min(1, (contentAnim.progress - 0.24) / 0.76)),
                  transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                  translate: `0 ${24 * (1 - contentAnim.progress)}px`,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                  transition: `transform ${tiltHovered ? '0.08s ease-out' : '0.5s ease-out'}, translate 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 1s cubic-bezier(0.16, 1, 0.3, 1)`,
                }}
              >
                {/* Form top decoration line */}
                <div className="h-px bg-gradient-to-r from-blueprint/30 via-blueprint/10 to-transparent" />

                <div className="p-6 sm:p-8"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {/* Form header */}
                  <div className="flex items-center gap-2 mb-6">
                    <Send size={12} className="text-blueprint/60" />
                    <span className="font-mono text-[0.9rem] text-ink-faint/60 uppercase tracking-[0.2em]">Send a message</span>
                  </div>

                  <div className={`transition-opacity duration-300 ${status === 'idle' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <form ref={formRef} onSubmit={submit} className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <input type="text" name="name" required disabled={submitting} placeholder="Name"
                          className="w-full px-3.5 py-3 bg-transparent border border-ink-faint/15 text-ink-primary placeholder-ink-faint/40 text-[0.8rem] font-mono focus:outline-none focus:border-blueprint/30 focus:bg-blueprint/[0.02] transition-all duration-300 rounded-lg" />
                        <input type="email" name="email" required disabled={submitting} placeholder="Email"
                          className="w-full px-3.5 py-3 bg-transparent border border-ink-faint/15 text-ink-primary placeholder-ink-faint/40 text-[0.8rem] font-mono focus:outline-none focus:border-blueprint/30 focus:bg-blueprint/[0.02] transition-all duration-300 rounded-lg" />
                      </div>
                      <textarea name="message" rows={3} required disabled={submitting} placeholder="Message"
                        className="w-full px-3.5 py-3 bg-transparent border border-ink-faint/15 text-ink-primary placeholder-ink-faint/40 text-[0.8rem] font-mono focus:outline-none focus:border-blueprint/30 focus:bg-blueprint/[0.02] transition-all duration-300 resize-none rounded-lg" />
                      <button type="submit" disabled={submitting}
                        className="group relative w-full flex items-center justify-center gap-2 px-4 py-3 text-[0.8rem] text-ink-primary bg-blueprint/5 border border-blueprint/20 hover:bg-blueprint/10 hover:border-blueprint/40 transition-all duration-300 font-mono rounded-lg overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blueprint/0 via-blueprint/5 to-blueprint/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        {submitting ? <><Loader2 size={13} className="animate-spin" /><span>Sending</span></>
                          : <><span>Send message</span><Send size={12} className="group-hover:translate-x-0.5 transition-transform" /></>}
                      </button>
                    </form>
                  </div>

                  {/* Success state */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ${
                    status === 'success' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    <div className="w-12 h-12 border border-blueprint/30 flex items-center justify-center mb-4">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blueprint">
                        <path d="M4 10L8 14L16 6" />
                      </svg>
                    </div>
                    <p className="text-[0.9rem] text-ink-primary font-medium mb-1">Message sent</p>
                    <p className="text-[0.9rem] text-ink-muted mb-4">I'll get back to you soon.</p>
                    <button onClick={() => setStatus('idle')}
                      className="font-mono text-[0.9rem] text-ink-faint/60 hover:text-ink-muted underline underline-offset-4 decoration-ink-faint/20 hover:decoration-ink-faint/40 transition-all duration-300">
                      Send another
                    </button>
                  </div>

                  {/* Error state */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ${
                    status === 'error' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    <div className="w-12 h-12 border border-amber/30 flex items-center justify-center mb-4">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-amber">
                        <circle cx="10" cy="10" r="8" />
                        <path d="M10 6V10M10 13.5V13.51" />
                      </svg>
                    </div>
                    <p className="text-[0.9rem] text-ink-primary font-medium mb-1">Failed to send</p>
                    <p className="text-[0.9rem] text-ink-muted mb-4">Try again or email me directly.</p>
                    <button onClick={() => setStatus('idle')}
                      className="font-mono text-[0.9rem] text-ink-faint/60 hover:text-ink-muted underline underline-offset-4 decoration-ink-faint/20 hover:decoration-ink-faint/40 transition-all duration-300">
                      Try again
                    </button>
                  </div>
                </div>

                {/* Bottom decoration line */}
                <div className="h-px bg-gradient-to-r from-transparent via-blueprint/15 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient bridge to next section */}
      <div className={`relative py-5 sm:py-6 transition-all duration-1000 ${
        inView ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, transparent, rgba(99,102,241,0.012))'
        }} />
      </div>
    </section>
  );
};

export default ContactSection;
