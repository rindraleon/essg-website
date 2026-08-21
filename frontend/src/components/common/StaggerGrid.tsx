import React from 'react';
import { StaggerReveal } from './RevealOnScroll';

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

const StaggerGrid: React.FC<StaggerGridProps> = ({ children, className = '', stagger = 0.08 }) => (
  <StaggerReveal className={className} step={Math.max(0, stagger * 1000)}>
    {children}
  </StaggerReveal>
);

export default StaggerGrid;
