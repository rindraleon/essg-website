import React from 'react';
import { cn } from '@/lib/utils';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const AnimatedHeroContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cn('hero-content-stagger', className)}
    style={{ '--hero-ease': EASE } as React.CSSProperties}
  >
    {React.Children.map(children, (child, index) => (
      <div
        key={index}
        className="hero-content-stagger__item"
        style={{ animationDelay: `${150 + index * 110}ms` }}
      >
        {child}
      </div>
    ))}
  </div>
);

/** Élément individuel du héros (badge, titre, description, CTA). */
export const AnimatedHeroItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('hero-content-stagger__item', className)}>{children}</div>
);

export const AnimatedHeroBackground: React.FC<{
  children: React.ReactNode;
  gradient?: string;
  className?: string;
}> = ({ children, gradient, className }) => (
  <div className={cn('absolute inset-0 overflow-hidden', className)}>
    <div className="hero-background-content absolute inset-0">{children}</div>
    {gradient && (
      <div
        aria-hidden="true"
        className="hero-background-gradient absolute inset-0"
        style={{ background: gradient }}
      />
    )}
  </div>
);

export default AnimatedHeroContainer;
