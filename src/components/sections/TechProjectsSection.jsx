import React from 'react';
import { Link } from 'react-router-dom';
import { Code, ExternalLink, ArrowRight, Github } from 'lucide-react';
import { projects } from '../../data';
import { PROJECT_LINKS } from '../../config/links';
import { MouseGlow } from '../common';

const TechProjectsSection = ({ isVisible, mousePosition }) => {
  // Show only top 4 projects on main page
  const displayedProjects = projects.slice(0, 4);

  const handleDemoClick = (e, projectKey) => {
    e.stopPropagation();
    const project = PROJECT_LINKS[projectKey];
    if (project) {
      const url = project.demo || project.github;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleGithubClick = (e, projectKey) => {
    e.stopPropagation();
    const project = PROJECT_LINKS[projectKey];
    if (project?.github) {
      window.open(project.github, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section 
      id="tech" 
      className={`min-h-screen flex items-center justify-center relative overflow-hidden py-12 sm:py-20 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <MouseGlow
          mousePosition={mousePosition}
          size={800}
          blur={100}
          smoothing={0.08}
          gradient="radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-xl animate-pulse-slow">
              <Code size={40} className="sm:w-12 sm:h-12 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Tech Projects
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">Building intelligent solutions with AI & ML</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {displayedProjects.map((project, index) => {
            const Icon = project.icon;
            const projectLinks = PROJECT_LINKS[project.projectKey];
            const hasGithub = projectLinks?.github;
            const hasDemo = projectLinks?.demo || projectLinks?.github;

            return (
              <div
                key={project.id}
                className="group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-[1.02] hover:border-cyan-400/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                
                {/* Ongoing badge */}
                {project.ongoing && (
                  <span className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wide bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 backdrop-blur-sm">
                    Ongoing
                  </span>
                )}
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon size={28} className="sm:w-8 sm:h-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-xl sm:text-2xl font-bold mb-3 bg-gradient-to-r ${project.color} bg-clip-text text-transparent line-clamp-2`}>
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-3 group-hover:text-gray-300 transition-colors duration-500">
                    {project.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.slice(0, 5).map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-400 group-hover:border-cyan-400/30 group-hover:text-gray-300 transition-all duration-500"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 5 && (
                      <span className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-500">
                        +{project.tech.length - 5} more
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* View Project / Demo Button */}
                    {hasDemo && (
                      <button
                        onClick={(e) => handleDemoClick(e, project.projectKey)}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r ${project.color} text-white font-medium text-sm sm:text-base hover:shadow-lg transition-all duration-500 group/btn`}
                      >
                        <span>View Project</span>
                        <ExternalLink size={16} className="sm:w-5 sm:h-5 group-hover/btn:rotate-45 transition-transform duration-500" />
                      </button>
                    )}

                    {/* GitHub Button */}
                    {hasGithub && (
                      <button
                        onClick={(e) => handleGithubClick(e, project.projectKey)}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-medium text-sm sm:text-base transition-all duration-500 group/git"
                      >
                        <Github size={16} className="sm:w-5 sm:h-5" />
                        <span>Source Code</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Projects Button - Links to /projects page */}
        <div className="text-center mt-12">
          <Link 
            to="/projects"
            className="px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-700 hover:scale-105 font-medium group inline-flex items-center gap-2"
          >
            View All Projects
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TechProjectsSection;