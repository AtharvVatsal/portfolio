import React from 'react';
import { Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { skillCategoryCards } from '../../data';

const SkillsSection = ({ isVisible }) => {
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
            Hover over skills to see proficiency levels
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span>Scroll-triggered animations</span>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {skillCategoryCards.map((category, index) => {
            const CategoryIcon = category.icon;
            
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

                  {/* Description */}
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors duration-500 min-h-[3rem] sm:min-h-[3.5rem]">
                    {category.description}
                  </p>

                  {/* Skills List */}
                  <div className="space-y-2 mb-3 sm:mb-4 min-h-[140px] sm:min-h-[160px]">
                    {category.skills.slice(0, 5).map((skill, skillIndex) => (
                      <div 
                        key={skill.name}
                        className="group/skill relative"
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
                    
                    {category.skills.length > 5 && (
                      <div className="px-2 sm:px-2.5 py-1 text-xs text-gray-500 italic flex items-center gap-1">
                        <ChevronDown size={12} />
                        <span>+{category.skills.length - 5} more skills</span>
                      </div>
                    )}
                  </div>

                  {/* Stats Badge */}
                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <div className={`flex-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${category.color} bg-opacity-10 border border-white/20 font-bold text-gray-200 text-xs sm:text-sm text-center transition-all duration-500 group-hover:scale-105 group-hover:border-white/40 group-hover:shadow-lg`}>
                      {category.stats}
                    </div>
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
    </section>
  );
};

export default SkillsSection;
