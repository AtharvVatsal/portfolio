import React from 'react';
import { Mail, MapPin, Phone, ArrowRight, Github, Linkedin, Instagram } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { CONTACT_INFO, SOCIAL_LINKS } from '../../config/links';

const ContactSection = ({ isVisible, mousePosition }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };
    
    try {
      await emailjs.send(
        'service_pzmc92r',
        'template_1kiswqb',
        {
          from_name: data.name,
          from_email: data.email,
          message: data.message
        },
        'g8-AVTdF_3Eg4Yr8FGl0x'
      );
      alert('Message sent successfully!');
      e.target.reset();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${CONTACT_INFO.email}`;
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${CONTACT_INFO.phone}`;
  };

  const handleSocialClick = (platform) => {
    const url = SOCIAL_LINKS[platform];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section 
      id="contact" 
      className={`min-h-screen flex items-center justify-center relative overflow-hidden py-12 sm:py-20 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] md:w-[750px] md:h-[750px] rounded-full pointer-events-none transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(circle, rgba(34, 211, 238, 0.35) 0%, rgba(168, 85, 247, 0.25) 40%, transparent 70%)`,
            left: `${(mousePosition?.x || 0) - 375}px`,
            top: `${(mousePosition?.y || 0) - 375}px`,
            filter: 'blur(100px)',
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 backdrop-blur-xl animate-pulse-slow">
              <Mail size={40} className="sm:w-12 sm:h-12 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">Have an oppurtunity or a project in mind? Let's talk!</p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Email */}
            <div 
              onClick={handleEmailClick}
              className="group p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Mail size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Email</h3>
                  <p className="text-gray-400 text-sm">{CONTACT_INFO.email}</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div 
              onClick={handlePhoneClick}
              className="group p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Phone</h3>
                  <p className="text-gray-400 text-sm">{CONTACT_INFO.phone}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="group p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-700 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Location</h3>
                  <p className="text-gray-400 text-sm">{CONTACT_INFO.location}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              {[
                { icon: Github, platform: 'github', color: 'from-gray-400 to-gray-600' },
                { icon: Linkedin, platform: 'linkedin', color: 'from-blue-400 to-blue-600' },
                { icon: Instagram, platform: 'instagram', color: 'from-pink-400 to-purple-600' },
              ].map((social) => (
                <button
                  key={social.platform}
                  onClick={() => handleSocialClick(social.platform)}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center hover:scale-110 transition-transform duration-500`}
                >
                  <social.icon size={24} className="text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-6 sm:p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  className="w-full px-4 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all duration-300 resize-none"
                  placeholder="Tell me about your project..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-700 font-medium hover:scale-105 group"
              >
                <span className="flex items-center justify-center gap-2">
                  Send Message
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-500" />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
