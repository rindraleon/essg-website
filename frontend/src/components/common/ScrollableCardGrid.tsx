import { ChevronLeft, ChevronRight } from 'lucide-react';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface ScrollableCardGridProps {
  children: React.ReactNode;
  scrollAmount?: number;
  className?: string;
  ariaLabel?: string;
  controls?: React.ReactNode;
  toolbarStart?: React.ReactNode;
}

const ScrollableCardGrid: React.FC<ScrollableCardGridProps> = ({
  children,
  scrollAmount,
  className = '',
  ariaLabel = 'Liste défilante',
  controls,
  toolbarStart,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);

  const checkScrollPosition = useCallback(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;

    setIsAtStart(scrollLeft <= 2);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 2);
    setIsScrollable(scrollWidth > clientWidth + 2);
  }, []);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    checkScrollPosition();

    const observer = new ResizeObserver(checkScrollPosition);

    observer.observe(element);

    for (const child of Array.from(element.children)) {
      observer.observe(child);
    }

    return () => observer.disconnect();
  }, [children, checkScrollPosition]);

  const scroll = useCallback(
    (direction: 'left' | 'right') => {
      const element = scrollContainerRef.current;
      if (!element) return;

      const firstCard = element.firstElementChild as HTMLElement | null;
      const gap =
        Number.parseFloat(getComputedStyle(element).columnGap || '0') || 0;
      const oneCard = firstCard
        ? firstCard.offsetWidth + gap
        : element.clientWidth;

      const amount =
        scrollAmount ??
        (oneCard >= element.clientWidth * 0.75
          ? oneCard
          : element.clientWidth * 0.85);

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      element.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [scrollAmount],
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scroll('left');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scroll('right');
    }
  };

  const arrowClass =
    'grid place-items-center rounded-full border border-ink-100 bg-white text-ink-700 shadow-card ' +
    'transition-[background-color,border-color,color,opacity] duration-200 ease-out ' +
    'hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed disabled:opacity-0 motion-reduce:transition-none';

  const showToolbar =
    isScrollable || Boolean(controls) || Boolean(toolbarStart);

  return (
    <div className={cn('w-full', className)}>
      {showToolbar && (
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {toolbarStart ? (
            <div className="min-w-0 text-small text-ink-500">
              {toolbarStart}
            </div>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}

          <div className="group flex items-center justify-end gap-2">
            {controls}

            {isScrollable && (
              <>
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={isAtStart}
                  aria-label="Défiler vers la gauche"
                  className={cn(arrowClass, 'hidden size-10 lg:grid')}
                >
                  <ChevronLeft className="size-5" />
                </button>

                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={isAtEnd}
                  aria-label="Défiler vers la droite"
                  className={cn(arrowClass, 'hidden size-10 lg:grid')}
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        {isScrollable && (
          <>
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={isAtStart}
              aria-label="Carte précédente"
              className={cn(
                arrowClass,
                'absolute left-1 top-1/2 z-20 size-11 -translate-y-1/2 lg:hidden',
              )}
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={isAtEnd}
              aria-label="Carte suivante"
              className={cn(
                arrowClass,
                'absolute right-1 top-1/2 z-20 size-11 -translate-y-1/2 lg:hidden',
              )}
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        {isScrollable && !isAtStart && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-10 bg-gradient-to-r from-ink-50 to-transparent lg:block"
          />
        )}

        {isScrollable && !isAtEnd && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-10 bg-gradient-to-l from-ink-50 to-transparent lg:block"
          />
        )}

        <section
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          aria-label={ariaLabel}
          className={cn(
            'flex overflow-x-auto overflow-y-hidden scroll-smooth pb-4 motion-reduce:scroll-auto',
            'snap-x snap-mandatory',
            '[-webkit-overflow-scrolling:touch]',
            'gap-4 sm:gap-5 lg:gap-6',
            'px-4 scroll-px-4 sm:px-0 sm:scroll-px-0',
            'scrollbar-hide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            '[&>*]:shrink-0',
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </section>
      </div>
    </div>
  );
};

export default ScrollableCardGrid;