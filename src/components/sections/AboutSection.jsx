import React from 'react';
import EditorialReveal from '../common/EditorialReveal';
import SectionHeading from '../common/SectionHeading';
import ReadingReveal from '../motion/ReadingReveal';
import { GlowBorder } from '../ui/spotlight-card';
import { TextAnimate } from '../ui/text-animate';

const AboutSection = () => {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative pt-16 sm:pt-20 lg:pt-24 overflow-clip"
    >
      <div className="archive-container relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-20">
          {/* Text side */}
          <div className="lg:w-[52%]">
            <SectionHeading number="01" id="about-title" reveal="mask">Curiosity</SectionHeading>

            {/* Pull quote — the heart of the section */}
            <div className="relative mt-8 mb-10">
              <div className="flex gap-4">
                <div className="hidden sm:flex flex-col items-center">
                  <span aria-hidden="true" className="font-editorial text-[5.5rem] sm:text-[7rem] leading-[0.7] select-none"
                    style={{ color: 'rgb(var(--accent-deep) / 0.45)' }}>&ldquo;</span>
                  <div className="flex-1 w-px mt-3" style={{ background: 'linear-gradient(to bottom, rgb(var(--accent) / 0.08), transparent)' }} />
                </div>
                <div className="flex-1">
                  <EditorialReveal mode="lines" className="font-editorial text-[clamp(1.5rem,3.2vw,2.6rem)] text-ink-primary leading-[1.2] relative sm:pt-2">
                    I grew up in Dharamshala,<br />
                    <span className="text-ink-muted">at the edge of the Himalayas.</span>
                  </EditorialReveal>
                  <div className="mt-5 h-px w-12" style={{ background: 'linear-gradient(90deg, rgb(var(--accent) / 0.15), transparent)' }} />
                </div>
              </div>
            </div>

            <div className="space-y-7 text-small sm:text-body-sm text-ink-secondary">
              <div className="flex gap-4 sm:gap-5">
                <span aria-hidden="true" className="font-mono text-meta text-accent shrink-0 pt-1 select-none">01</span>
                <TextAnimate by="text" animation="blurIn">
                  <span className="float-left text-[3.8rem] sm:text-[4.5rem] font-editorial leading-[0.7] mr-3 mt-0.5 text-accent">M</span>
                  ountains teach you to observe. You watch light change, weather shift, landscapes transform. I didn't know it then, but that habit of watching would become the foundation for everything I build.
                </TextAnimate>
              </div>
              <div className="flex gap-4 sm:gap-5">
                <span aria-hidden="true" className="font-mono text-meta text-accent shrink-0 pt-1 select-none">02</span>
                <ReadingReveal className="min-w-0 text-ink-muted" text="Somewhere between photographing a sunset and debugging a neural network, I realized these are the same practice: careful observation followed by deliberate action. Engineering gave me the tools to build what photography taught me to see." />
              </div>
              <div className="flex gap-4 sm:gap-5">
                <span aria-hidden="true" className="font-mono text-meta text-accent shrink-0 pt-1 select-none">03</span>
                <TextAnimate by="line" animation="slideUp">
                  Now I study Computer Science at VIT, specializing in AI/ML. I build systems that learn from the world — computer vision, reinforcement learning, NLP — and I photograph the world those systems try to understand.
                </TextAnimate>
              </div>
            </div>

            {/* Colophon / signature line */}
            <div className="mt-10 pt-5 border-t border-notebook-border flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 border border-notebook-border flex items-center justify-center">
                  <span className="font-editorial text-small text-accent">AV</span>
                </div>
                <div>
                  <span className="block font-editorial text-body text-ink-primary leading-tight">Atharv Vatsal</span>
                  <span className="block font-mono text-meta text-ink-faint">Dharamshala · HP · India</span>
                </div>
              </div>
              <span className="font-mono text-meta text-ink-faint">32.2432°N · 76.3239°E</span>
            </div>
          </div>

          {/* Photo side */}
          {/* Portrait: still. (The 3D tilt and the scroll-ratio slide-in were removed.) */}
          <div className="mt-10 lg:mt-0 lg:w-[48%] shrink-0">
            <div className="relative">
              {/* Outer frame — archival mat */}
              <div className="relative">
                {/* Mat board — wide border */}
                <div className="relative isolate bg-notebook-surface border border-notebook-border p-4 sm:p-5"
                  style={{ boxShadow: '0 4px 24px rgb(0 0 0 / 0.3)' }}>
                  <GlowBorder />

                  {/* Image area */}
                  <div className="relative overflow-hidden">
                    <img
                      src="/avPhoto.webp"
                      width={3000}
                      height={2000}
                      loading="lazy"
                      decoding="async"
                      alt="Atharv Vatsal"
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Vintage corner tabs */}
                  <svg className="absolute top-0 left-0 w-5 h-5 text-notebook-bg z-20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M0 0H14L20 6V20L0 0Z" opacity="0.92" />
                    <path d="M0 0H14L20 6V20L0 0Z" fill="none" stroke="rgb(var(--accent) / 0.05)" strokeWidth="0.5" />
                  </svg>
                  <svg className="absolute top-0 right-0 w-5 h-5 text-notebook-bg z-20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M20 0H6L0 6V20L20 0Z" opacity="0.92" />
                    <path d="M20 0H6L0 6V20L20 0Z" fill="none" stroke="rgb(var(--accent) / 0.05)" strokeWidth="0.5" />
                  </svg>
                  <svg className="absolute bottom-0 left-0 w-5 h-5 text-notebook-bg z-20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M0 20H14L20 14V0L0 20Z" opacity="0.92" />
                    <path d="M0 20H14L20 14V0L0 20Z" fill="none" stroke="rgb(var(--accent) / 0.05)" strokeWidth="0.5" />
                  </svg>
                  <svg className="absolute bottom-0 right-0 w-5 h-5 text-notebook-bg z-20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M20 20H6L0 14V0L20 20Z" opacity="0.92" />
                    <path d="M20 20H6L0 14V0L20 20Z" fill="none" stroke="rgb(var(--accent) / 0.05)" strokeWidth="0.5" />
                  </svg>
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

export default AboutSection;
