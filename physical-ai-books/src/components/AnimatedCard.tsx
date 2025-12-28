import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const AnimatedCard = ({ children, className = '', animationType = 'fadeInUp' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const animationClasses = {
    fadeInUp: 'animate-fadeInUp',
    slideInLeft: 'animate-slideInLeft',
    slideInRight: 'animate-slideInRight',
    zoomIn: 'animate-zoomIn',
  };

  const animationClass = animationClasses[animationType] || animationClasses.fadeInUp;

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        inView ? animationClass : 'opacity-0 translate-y-10'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;