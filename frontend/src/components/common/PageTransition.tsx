import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  return (
    <div className={className ? `page-transition ${className}` : 'page-transition'}>{children}</div>
  );
};

export default PageTransition;
