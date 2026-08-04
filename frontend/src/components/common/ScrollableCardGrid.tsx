import React, { useEffect, useRef, useState } from 'react';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

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
      <div className="mb-4 flex justify-end gap-2">
        <button
          onClick={() => scroll('left')}
          disabled={isAtStart}
          className="hidden lg:flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Défiler vers la gauche"
        >
          <KeyboardArrowLeftRoundedIcon sx={{ fontSize: 28 }} />
        </button>

        <button
          onClick={() => scroll('right')}
          disabled={isAtEnd}
          className="hidden lg:flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Défiler vers la droite"
        >
          <KeyboardArrowRightRoundedIcon sx={{ fontSize: 28 }} />
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
