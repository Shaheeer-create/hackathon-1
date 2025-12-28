import React, { useEffect, useRef } from 'react';

const AnimatedComponent = ({ children, animationClass = 'fade-in', triggerOnLoad = true }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!triggerOnLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [animationClass, triggerOnLoad]);

  return (
    <div 
      ref={elementRef} 
      className={`opacity-0 ${!triggerOnLoad ? animationClass : ''}`}
    >
      {children}
    </div>
  );
};

export default AnimatedComponent;