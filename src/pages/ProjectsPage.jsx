import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { projects } from '../data';
import { PROJECT_LINKS, SOCIAL_LINKS } from '../config/links';
import { SEO, DocumentHeader } from '../components/common';
import { FailedAttempt } from '../components/common/MarginNote';
import { pageHeaders } from '../data/archiveMeta';
import PageHeader from '../components/layout/PageHeader';

const ProjectsPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const header = pageHeaders.projects;
  const statusColors = {
    active: 'text-green-500',
    ongoing: 'text-green-500',
    completed: 'text-ink-faint',
    archived: 'text-ink-faint/70',
  };

  return (
    <div className="min-h-screen bg-notebook-bg text-ink-primary binder-margin">
      <SEO
        title="Projects"
        description="Case files from Atharv Vatsal's archive â€” ML systems, computer vision pipelines, and engineering experiments."
        url="/projects"
        keywords={['projects', 'YOLOv8', 'U-Net', 'machine learning projects', 'computer vision', 'NLP']}
      />

      <PageHeader title="Case Files" />

      {/* Page title */}
      <section className="py-12 sm:py-16 border-b border-notebook-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <DocumentHeader
              type={header.type}
              docRef={header.ref}
              classification={header.classification}
              note={header.note}
            />
            <h1 className="font-editorial text-[2.5rem] sm:text-[3.5rem] text-ink-primary mt-6">
              Case Files
            </h1>
              <div className="flex items-center gap-3 mt-3">
              <span className="font-mono text-meta text-ink-muted">
                {projects.length} entries
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects list â€” full case files */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 margin-line">
          <div className="space-y-6">
            {projects.map((project, index) => {
              const projectLinks = PROJECT_LINKS[project.projectKey];
              const hasGithub = projectLinks?.github;
              const hasDemo = projectLinks?.demo;

              return (
                <div
                  key={project.id}
                  className={`doc-card group doc-frame border border-notebook-border hover:border-notebook-border-light rounded-xl transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <div className="p-5 sm:p-6 lg:p-8">
                    {/* Case file header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                      <div>
                        <span className="font-mono text-meta text-ink-muted uppercase tracking-wider">
                          {project.caseNumber}
                        </span>
                        <div className="font-mono text-meta text-ink-faint/70 mt-0.5 uppercase tracking-wider">
                          {project.classification}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-meta uppercase tracking-wider ${statusColors[project.status] || 'text-ink-muted'}`}>
                          {project.status}
                        </span>
                        {project.revision && (
                          <>
                            <span className="text-ink-faint/70">|</span>
                            <span className="font-mono text-meta text-ink-muted uppercase tracking-wider">
                              v{project.revision}
                            </span>
                          </>
                        )}
                        {project.period && (
                          <>
                            <span className="text-ink-faint/70">Â·</span>
                            <span className="font-mono text-meta text-ink-muted uppercase tracking-wider">
                              {project.period}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-semibold text-ink-primary mb-1 group-hover:text-blueprint-light transition-colors duration-300">
                      {project.title}
                    </h3>
                    {project.subtitle && (
                      <p className="font-mono text-meta text-ink-muted tracking-wide mb-4">
                        {project.subtitle}
                      </p>
                    )}

                    {/* Problem + Approach */}
                    <div className="space-y-3 mb-5">
                      {project.problem && (
                        <div>
                          <span className="font-mono text-meta text-ink-muted uppercase tracking-wider">Problem</span>
                          <p className="text-body-sm text-ink-secondary mt-1">
                            {project.problem}
                          </p>
                        </div>
                      )}
                      {project.approach && (
                        <div>
                          <span className="font-mono text-meta text-ink-muted uppercase tracking-wider">Approach</span>
                          <p className="text-body-sm text-ink-secondary mt-1">
                            {project.approach}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Lessons */}
                      {project.lessons && project.lessons.length > 0 && (
                      <div className="mb-5">
                        <span className="font-mono text-meta text-ink-muted uppercase tracking-wider">Lessons</span>
                        <ul className="mt-2 space-y-1">
                          {project.lessons.map((lesson, i) => (
                            <li key={i} className="flex items-start gap-2 text-meta text-ink-muted">
                              <span className="text-blueprint/60 mt-1 shrink-0">Â·</span>
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* First attempt failed â€” evidence of iteration */}
                    {project.firstAttemptFailed && (
                      <FailedAttempt text={project.firstAttemptFailed} />
                    )}

                    {/* Revision note â€” evidence of evolution */}
                    {project.revisionNote && (
                      <div className="font-mono text-meta text-blueprint/70 mb-4">
                        <span className="text-blueprint/50 mr-1.5">REV:</span>
                        {project.revisionNote}
                      </div>
                    )}

                    {/* Engineering artifacts */}
                    {project.pipelineSteps && (
                      <div className="mb-4">
                        <div className="font-mono text-meta text-ink-muted uppercase tracking-wider mb-2">Pipeline</div>
                        {project.pipelineSteps.map((step, i) => (
                          <div key={i} className="font-mono text-meta text-ink-muted leading-relaxed">
                            <span className="text-blueprint/50 mr-1.5">{i + 1}.</span>
                            {step}
                          </div>
                        ))}
                      </div>
                    )}

                    {project.metrics && project.metrics.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-4">
                        {project.metrics.map((metric) => (
                          <div key={metric.label} className="border border-notebook-border/50 px-2.5 py-1.5">
                            <div className="font-mono text-body-sm text-ink-primary">{metric.value}</div>
                            <div className="font-mono text-meta text-ink-muted">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {project.terminalSnippet && (
                      <div className="mb-4 bg-notebook-bg/50 border border-notebook-border/30 p-3 overflow-x-auto">
                        <pre className="font-mono text-meta text-ink-muted leading-relaxed whitespace-pre-wrap">
                          {project.terminalSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Annotation */}
                    {project.annotation && (
                      <div className="font-mono text-meta text-ink-muted mb-4 italic">
                        <span className="text-blueprint/50 mr-1.5">{'// '}</span>
                        {project.annotation}
                      </div>
                    )}

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-meta px-2 py-0.5 border border-notebook-border text-ink-muted tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-3 border-t border-notebook-border/50">
                      {hasDemo && (
                        <a
                          href={projectLinks.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-meta text-ink-primary border border-notebook-border hover:border-blueprint/20 transition-all duration-300"
                        >
                          <ExternalLink size={12} />
                          <span>Live Demo</span>
                        </a>
                      )}
                      {hasGithub && (
                        <a
                          href={projectLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-meta text-ink-muted hover:text-ink-primary transition-all duration-300"
                        >
                          <Github size={12} />
                          <span>Source Code</span>
                        </a>
                      )}
                      {!hasDemo && !hasGithub && (
                        <span className="font-mono text-meta text-ink-muted">
                          Private / Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GitHub CTA */}
      <section className="py-12 sm:py-16 border-t border-notebook-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="border border-notebook-border p-8 sm:p-10 group hover:border-notebook-border-light transition-all duration-300">
            <p className="font-mono text-meta text-ink-muted mb-4 tracking-[0.2em] uppercase">
              Additional Experiments
            </p>
            <p className="text-body-sm text-ink-secondary mb-6 max-w-md mx-auto">
              More projects, contributions, and experiments on GitHub.
            </p>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-body-sm text-ink-primary border border-notebook-border hover:border-blueprint/20 transition-all duration-300"
            >
              <Github size={14} />
              <span>View GitHub</span>
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
