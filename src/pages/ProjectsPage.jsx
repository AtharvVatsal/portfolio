import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Code, 
  ExternalLink, 
  Github, 
  Home,
  Sparkles,
  Rocket,
  FileText
} from 'lucide-react';
import { projects } from '../data';
import { PROJECT_LINKS, SOCIAL_LINKS } from '../config/links';
import { useTheme } from '../context/ThemeContext';
import { SEO } from '../components/common';

const ProjectsPage = () => {
  const { currentTheme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} text-white`}>
      <SEO
        title="Projects"
        description="Technical projects by Atharv Vatsal — from autonomous driving perception with YOLOv8 & U-Net to predictive policing and NLP-powered report processing."
        url="/projects"
        keywords={['projects', 'YOLOv8', 'U-Net', 'machine learning projects', 'computer vision', 'NLP']}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Portfolio</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Code size={20} className="text-cyan-400" />
            <span className="font-medium">Projects</span>
            <span className="text-gray-500 text-sm">({projects.length})</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div 
            className={`transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-xl">
                <Rocket size={40} className="text-cyan-400" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              All Projects
            </h1>
            
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
              A collection of my technical projects — from machine learning systems 
              and computer vision pipelines to data analytics and NLP tools.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {projects.map((project, index) => {
              const Icon = project.icon;
              const projectLinks = PROJECT_LINKS[project.projectKey];
              const hasGithub = projectLinks?.github;
              const hasDemo = projectLinks?.demo;

              return (
                <div
                  key={project.id}
                  className={`group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-[1.02] hover:border-cyan-400/50 overflow-hidden ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                  
                  {/* Ongoing badge */}
                  {project.ongoing && (
                    <span className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wide bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 backdrop-blur-sm">
                      Ongoing
                    </span>
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon size={28} className="sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className={`text-xl sm:text-2xl font-bold mb-1 bg-gradient-to-r ${project.color} bg-clip-text text-transparent`}>
                          {project.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm sm:text-base mb-5 group-hover:text-gray-300 transition-colors duration-500 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-400 group-hover:border-cyan-400/30 group-hover:text-gray-300 transition-all duration-500"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                      {hasDemo && (
                        <a
                          href={projectLinks.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${project.color} text-white font-medium text-sm hover:shadow-lg transition-all duration-500 group/btn`}
                        >
                          <ExternalLink size={16} className="group-hover/btn:rotate-45 transition-transform duration-500" />
                          <span>Live Demo</span>
                        </a>
                      )}

                      {hasGithub && (
                        <a
                          href={projectLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-medium text-sm transition-all duration-500 group/git"
                        >
                          <Github size={16} />
                          <span>View Code</span>
                        </a>
                      )}

                      {!hasDemo && !hasGithub && (
                        <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-sm">
                          <Code size={16} />
                          <span>Private / Coming Soon</span>
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

      {/* Check My GitHub CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="p-8 sm:p-12 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-all duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <Github size={48} className="mx-auto mb-6 text-gray-400 group-hover:text-white group-hover:scale-110 transition-all duration-500" />
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Want to see more?
              </h2>
              
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Check out my GitHub for more projects, contributions, and experiments 
                across machine learning, computer vision, and web development.
              </p>
              
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:scale-105 font-semibold text-lg group/ghbtn"
              >
                <Github size={22} />
                <span>Check My GitHub</span>
                <ExternalLink size={18} className="group-hover/ghbtn:rotate-45 transition-transform duration-500" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-white/5">
        <Sparkles size={24} className="inline-block text-cyan-400/40 animate-pulse mb-4" />
        <p className="text-gray-600 text-sm mb-4">More projects in the pipeline...</p>
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors text-sm"
          >
            <Home size={16} />
            Portfolio
          </Link>
          <span className="text-gray-700">·</span>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors text-sm"
          >
            <FileText size={16} />
            Resume
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default ProjectsPage;