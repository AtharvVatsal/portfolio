import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Camera, Film, Award, Download, FileText } from 'lucide-react';
import { RESUME_LINK } from '../../config/links';

const AboutSection = ({ isVisible }) => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = RESUME_LINK;
    link.download = 'Atharv_Vatsal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const identityCards = [
    {
      icon: Code,
      title: 'Engineer',
      description: 'Building intelligent systems with AI/ML, specializing in computer vision and data science.',
      color: 'from-cyan-400 to-blue-500',
      gradient: 'from-cyan-500/20 to-blue-500/20'
    },
    {
      icon: Camera,
      title: 'Photographer',
      description: 'Capturing moments through the lens, from portraits to landscapes and street photography.',
      color: 'from-purple-400 to-pink-500',
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      icon: Film,
      title: 'Editor',
      description: 'Crafting visual stories through video editing, color grading, and motion graphics.',
      color: 'from-orange-400 to-red-500',
      gradient: 'from-orange-500/20 to-red-500/20'
    }
  ];

  return (
    <section className="py-12 sm:py-20 relative" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div 
          className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            What I Do
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">Three passions, infinite possibilities</p>
        </div>

        {/* Identity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
          {identityCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`group relative p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon size={28} className="sm:w-8 sm:h-8 text-white" />
                  </div>
                  
                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Introduction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Profile Image */}
          <div 
            className={`relative group transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] xl:w-[550px] xl:h-[550px] mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-500 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
              <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <img 
                  src="/avPhoto.webp" 
                  alt="Atharv Vatsal"
                  width="400"
                  height="400"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>

          {/* Bio Content */}
          <div className="space-y-6">
            <div 
              className={`transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                About Me
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                I'm a 3rd year B.Tech student in Computer Science & Engineering with specialization in AI/ML at VIT. 
                My passion lies at the intersection of technology and creativity — building intelligent systems while 
                capturing the beauty of the world through my lens.
              </p>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                From developing computer vision applications to editing cinematic videos, I believe in 
                combining analytical thinking with creative expression to build meaningful projects.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Code size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">3+</div>
                    <div className="text-xs text-gray-400">Years Experience</div>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: '500ms' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">10+</div>
                    <div className="text-xs text-gray-400">Projects Built</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-wrap gap-4 pt-4 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <button
                onClick={() => scrollToSection('tech')}
                className="group px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-700 font-medium hover:scale-105 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Code size={18} />
                  Explore My Work
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
              </button>

              <Link
                to="/resume"
                className="group px-6 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-700 hover:scale-105 font-medium"
              >
                <span className="flex items-center gap-2">
                  <FileText size={18} className="text-cyan-400" />
                  View My Resume
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default AboutSection;