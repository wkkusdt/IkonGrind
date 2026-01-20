import React from 'react';
import { motion } from 'framer-motion';

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fadeInUp' | 'scaleIn' | 'slideInLeft' | 'slideInRight';
  delay?: number;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = '',
  variant = 'fadeInUp',
  delay = 0,
}) => {
  const variants: any = {
    fadeInUp,
    scaleIn,
    slideInLeft,
    slideInRight,
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants[variant]}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};
