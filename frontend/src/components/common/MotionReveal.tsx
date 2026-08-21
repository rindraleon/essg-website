import React from 'react';
import RevealOnScroll, { type RevealVariant } from './RevealOnScroll';

export type RevealDirection = 'up' | 'left' | 'right' | 'scale' | 'fade' | 'blur';

interface MotionRevealProps {
  children: React.ReactNode;
  variant?: RevealDirection;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

const VARIANT_MAP: Record<RevealDirection, RevealVariant> = {
  up: 'fade-up',
  left: 'fade-left',
  right: 'fade-right',
  scale: 'scale-in',
  fade: 'fade',
  blur: 'blur-in',
};


const MotionReveal: React.FC<MotionRevealProps> = ({
  children,
  variant = 'up',
  delay = 0,
  className,
  as = 'div',
}) => (
  <RevealOnScroll
    as={as}
    variant={VARIANT_MAP[variant]}
    delay={Math.max(0, delay * 1000)}
    className={className}
  >
    {children}
  </RevealOnScroll>
);

export default MotionReveal;
