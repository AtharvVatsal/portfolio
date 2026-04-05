import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowRight, Github, Linkedin, Instagram, Loader2, FileText, Check, RotateCcw } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { CONTACT_INFO, SOCIAL_LINKS } from '../../config/links';
import { MouseGlow } from '../common';

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';

const ContactSection = ({ isVisible, mousePosition }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [senderName, setSenderName] = useState('');
  const formRef = useRef(null);

  // Auto-reset form after success/error
  useEffect(() => {
    if (formStatus === 'idle') return;
    const timer = setTimeout(() => setFormStatus('idle'), 6000);
    return () => clearTimeout(timer);
  }, [formStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };
    
    try {
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error('Email service not configured. Please contact directly.');
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { 
          from_name: data.name, 
          reply_to: data.email,
          message: data.message 
        },
        EMAILJS_PUBLIC_KEY
      );

      setSenderName(data.name);
      setFormStatus('success');
      e.target.reset();
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
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
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section 
      id="contact" 
      className={`flex items-center justify-center relative overflow-hidden py-16 sm:py-20 lg:py-28 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <MouseGlow
          mousePosition={mousePosition}
          size={750}
          blur={100}
          smoothing={0.08}
          gradient="radial-gradient(circle, rgba(34, 211, 238, 0.35) 0%, rgba(168, 85, 247, 0.25) 40%, transparent 70%)"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 backdrop-blur-xl animate-pulse-slow">
              <Mail size={32} className="sm:w-10 sm:h-10 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-md mx-auto">Have an opportunity or a project in mind? Let's talk!</p>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-400 hover:text-white hover:border-cyan-400/30 hover:bg-white/10 transition-all duration-300"
          >
            <FileText size={14} className="text-cyan-400" />
            View my resume first?
          </Link>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Email */}
            <div 
              onClick={handleEmailClick}
              className="group p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 sm:hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                  <Mail size={20} className="sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-sm sm:text-base mb-0.5">Email</h3>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">{CONTACT_INFO.email}</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div 
              onClick={handlePhoneClick}
              className="group p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 sm:hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                  <Phone size={20} className="sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm sm:text-base mb-0.5">Phone</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{CONTACT_INFO.phone}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="group p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 sm:hover:scale-[1.03] active:scale-[0.98]">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                  <MapPin size={20} className="sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base mb-0.5">Location</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{CONTACT_INFO.location}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4 justify-center lg:justify-start">
              {[
                { icon: Github, platform: 'github', color: 'from-gray-400 to-gray-600' },
                { icon: Linkedin, platform: 'linkedin', color: 'from-blue-400 to-blue-600' },
                { icon: Instagram, platform: 'instagram', color: 'from-pink-400 to-purple-600' },
              ].map((social) => (
                <button
                  key={social.platform}
                  onClick={() => handleSocialClick(social.platform)}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300`}
                >
                  <social.icon size={20} className="sm:w-6 sm:h-6 text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Contact Form — morphs into success/error card */}
          <div className="relative p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 overflow-hidden"
            style={{ minHeight: '380px' }}
          >
            {/* Success State */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 transition-all duration-700 ease-out ${
                formStatus === 'success'
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              {/* Animated check circle */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-400/30 flex items-center justify-center">
                  <div className={`transition-all duration-500 delay-300 ${formStatus === 'success' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    <Check size={36} className="text-emerald-400" strokeWidth={3} />
                  </div>
                </div>
                {/* Pulse rings */}
                <div className={`absolute inset-0 rounded-full border-2 border-emerald-400/20 transition-all duration-1000 ${formStatus === 'success' ? 'scale-150 opacity-0' : 'scale-100 opacity-0'}`}></div>
                <div className={`absolute inset-0 rounded-full border-2 border-emerald-400/10 transition-all duration-1000 delay-200 ${formStatus === 'success' ? 'scale-[2] opacity-0' : 'scale-100 opacity-0'}`}></div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-gray-400 text-sm sm:text-base text-center max-w-xs mb-6">
                Thanks {senderName || 'there'}! I'll get back to you soon.
              </p>
              <button
                onClick={() => setFormStatus('idle')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <RotateCcw size={14} />
                Send another
              </button>
            </div>

            {/* Error State */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 transition-all duration-700 ease-out ${
                formStatus === 'error'
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-400/30 flex items-center justify-center mb-6">
                <span className={`text-3xl transition-all duration-500 delay-300 ${formStatus === 'error' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                  ✕
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Couldn't Send</h3>
              <p className="text-gray-400 text-sm sm:text-base text-center max-w-xs mb-6">
                Something went wrong. Try again or email me directly.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFormStatus('idle')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <RotateCcw size={14} />
                  Try again
                </button>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium transition-all duration-300 hover:shadow-lg"
                >
                  <Mail size={14} />
                  Email directly
                </a>
              </div>
            </div>

            {/* Form (default state) */}
            <div
              className={`transition-all duration-500 ease-out ${
                formStatus === 'idle'
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Message</label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 font-medium text-sm sm:text-base sm:hover:scale-[1.03] active:scale-[0.98] group disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight size={18} className="sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-500" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;