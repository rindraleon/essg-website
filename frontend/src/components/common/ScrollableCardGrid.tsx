import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ScrollableCardGridProps {
  children: React.ReactNode;
  scrollAmount?: number;
  className?: string;
}

const ScrollableCardGrid: React.FC<ScrollableCardGridProps> = ({
  children,
  scrollAmount,
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    setIsAtStart(scrollLeft <= 2);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 2);
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const amount = scrollAmount || scrollContainerRef.current.clientWidth * 0.9;

    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2 flex justify-end gap-2">
        <button
          onClick={() => scroll('left')}
          disabled={isAtStart}
          className="hidden lg:flex items-center justify-center rounded-full border border-ink-100 bg-white p-2 text-ink-700 shadow-card transition-all duration-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink-100 disabled:hover:bg-white disabled:hover:text-ink-700"
          aria-label="Défiler vers la gauche"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={() => scroll('right')}
          disabled={isAtEnd}
          className="hidden lg:flex items-center justify-center rounded-full border border-ink-100 bg-white p-2 text-ink-700 shadow-card transition-all duration-200 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-ink-100 disabled:hover:bg-white disabled:hover:text-ink-700"
          aria-label="Défiler vers la droite"
        >
          <ChevronRight />
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={checkScrollPosition}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollableCardGrid;
