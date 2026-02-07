import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, ArrowRight, X } from 'lucide-react';
import { skillCategoryCards } from '../../data';

const SkillsSection = ({ isVisible }) => {
  const [expandedCards, setExpandedCards] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [modalCard, setModalCard] = useState(null);

  const toggleSkills = (index, e) => {
    e.stopPropagation();
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleDescription = (index, e) => {
    e.stopPropagation();
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const openModal = (category) => {
    setModalCard(category);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalCard(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section className="py-12 sm:py-20 relative" id="skills">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div 
          className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Skills & Expertise
          </h3>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg mb-2">
            Click on cards to explore more details
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span>Interactive skill cards</span>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {skillCategoryCards.map((category, index) => {
            const CategoryIcon = category.icon;
            const isExpanded = expandedCards[index];
            const isDescExpanded = expandedDescriptions[index];
            const hasMoreSkills = category.skills.length > 5;
            const displayedSkills = isExpanded ? category.skills : category.skills.slice(0, 5);

            return (
              <div
                key={category.title}
                className={`group relative p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer overflow-hidden
                  transition-all duration-700 ease-out hover:scale-[1.03] hover:-translate-y-1
                  ${isVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-20 scale-95'
                  }`}
                style={{ 
                  transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
                  transitionProperty: 'opacity, transform'
                }}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                {/* Glow Effect */}
                <div className={`absolute -inset-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700`}></div>

                {/* Card Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 sm:mb-4 shadow-lg transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-2xl`}>
                    <CategoryIcon size={20} className="sm:w-6 sm:h-6 text-white" />
                  </div>

                  {/* Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className={`text-base sm:text-lg font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent line-clamp-2`}>
                      {category.title}
                    </h4>
                    <Sparkles 
                      size={14} 
                      className="flex-shrink-0 text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:rotate-180" 
                    />
                  </div>

                  {/* Description - Expandable */}
                  <div className="mb-3 sm:mb-4">
                    <p 
                      onClick={(e) => toggleDescription(index, e)}
                      className={`text-gray-400 text-xs sm:text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-500 cursor-pointer hover:text-gray-200 ${
                        isDescExpanded ? '' : 'line-clamp-3'
                      }`}
                    >
                      {category.description}
                    </p>
                    {category.description && category.description.length > 100 && (
                      <button
                        onClick={(e) => toggleDescription(index, e)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 flex items-center gap-1 transition-colors duration-300"
                      >
                        {isDescExpanded ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp size={12} />
                          </>
                        ) : (
                          <>
                            <span>Read more</span>
                            <ChevronDown size={12} />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Skills List - Expandable */}
                  <div className={`space-y-2 mb-3 sm:mb-4 transition-all duration-500 ${isExpanded ? '' : 'min-h-[140px] sm:min-h-[160px]'}`}>
                    {displayedSkills.map((skill, skillIndex) => (
                      <div 
                        key={skill.name}
                        className="group/skill relative"
                        style={{
                          animation: isExpanded && skillIndex >= 5 ? `fadeIn 0.3s ease ${(skillIndex - 5) * 0.05}s forwards` : 'none',
                          opacity: isExpanded && skillIndex >= 5 ? 0 : 1
                        }}
                      >
                        <div className="flex items-center justify-between px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-default">
                          <span className="text-xs sm:text-sm text-gray-400 group-hover/skill:text-gray-200 transition-colors duration-300 font-medium">
                            {skill.name}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Mini Progress Bar */}
                            <div className="w-0 group-hover/skill:w-12 sm:group-hover/skill:w-14 h-1.5 bg-gray-800 rounded-full overflow-hidden transition-all duration-500">
                              <div 
                                className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-700 ease-out`}
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>

                            <span className="text-xs font-mono text-gray-500 group-hover/skill:text-gray-300 min-w-[32px] text-right transition-colors duration-300 font-bold">
                              {skill.level}%
                            </span>
                          </div>
                        </div>

                        {/* Full Width Progress Bar on Hover */}
                        <div className="h-0 group-hover/skill:h-1 overflow-hidden transition-all duration-300 mt-1">
                          <div className="h-1 bg-gray-800/50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-700 ease-out`}
                              style={{ 
                                width: `${skill.level}%`,
                                boxShadow: `0 0 10px currentColor`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Expand/Collapse Button for Skills */}
                    {hasMoreSkills && (
                      <button
                        onClick={(e) => toggleSkills(index, e)}
                        className="w-full px-2 sm:px-2.5 py-2 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-white/5 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 group/expand"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={14} className="group-hover/expand:-translate-y-0.5 transition-transform duration-300" />
                            <span>Show less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown size={14} className="group-hover/expand:translate-y-0.5 transition-transform duration-300" />
                            <span>+{category.skills.length - 5} more skills</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Stats Badge - Now Clickable */}
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <button
                      onClick={() => openModal(category)}
                      className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${category.color} bg-opacity-10 border border-white/20 font-bold text-gray-200 text-xs sm:text-sm text-center transition-all duration-500 hover:scale-105 hover:border-white/40 hover:shadow-lg active:scale-95`}
                    >
                      {category.stats}
                    </button>
                    <ArrowRight 
                      size={14} 
                      className="flex-shrink-0 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500" 
                    />
                  </div>

                  {/* Hover Indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Full Skill Details */}
      {modalCard && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors duration-300"
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${modalCard.color} flex items-center justify-center shadow-lg`}>
                <modalCard.icon size={28} className="text-white" />
              </div>
              <div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${modalCard.color} bg-clip-text text-transparent`}>
                  {modalCard.title}
                </h3>
                <p className="text-gray-400 text-sm">{modalCard.stats}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              {modalCard.description}
            </p>

            {/* All Skills with Progress Bars */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                All Skills ({modalCard.skills.length})
              </h4>
              {modalCard.skills.map((skill, index) => (
                <div key={skill.name} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 font-medium">{skill.name}</span>
                    <span className="text-sm font-mono text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${modalCard.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ 
                        width: `${skill.level}%`,
                        animation: `expandWidth 0.8s ease ${index * 0.1}s forwards`,
                        transform: 'scaleX(0)',
                        transformOrigin: 'left'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button at Bottom */}
            <button
              onClick={closeModal}
              className={`w-full mt-8 px-6 py-3 rounded-xl bg-gradient-to-r ${modalCard.color} font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expandWidth {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
};

export default SkillsSection;