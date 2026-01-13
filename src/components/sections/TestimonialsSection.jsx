import React from 'react';
import { testimonials } from '../../data';

const TestimonialsSection = () => {
  return (
    <section className="py-12 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            What People Say
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">Testimonials from amazing clients</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Avatar and Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-500">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              
              {/* Content */}
              <p className="text-gray-300 italic leading-relaxed text-sm sm:text-base">
                "{testimonial.content}"
              </p>
              
              {/* Rating */}
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
