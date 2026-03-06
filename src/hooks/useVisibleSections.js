import { useState, useEffect } from 'react';

export const useVisibleSections = (sectionIds = []) => {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -15% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.5]
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set([...prev, sectionId]));
          
          if (entry.intersectionRatio > 0.3) {
            setActiveSection(sectionId);
          }
        } else {
          // Remove when leaving viewport — enables reverse animation
          setVisibleSections((prev) => {
            const next = new Set(prev);
            next.delete(sectionId);
            return next;
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = sectionIds.length > 0 
      ? sectionIds.map(id => document.getElementById(id)).filter(Boolean)
      : document.querySelectorAll('section[id]');
    
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [sectionIds]);

  return { visibleSections, activeSection, setActiveSection };
};

export default useVisibleSections;