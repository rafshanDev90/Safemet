import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}

/* Scroll-reveal wrapper: fades content in with a gentle upward slide when it
 * enters the viewport. Respects the user's reduced-motion preference.
 * Delay is a fraction of a second, used to stagger grouped elements.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  y = 24,
  once = true,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};