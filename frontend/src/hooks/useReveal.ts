import useGsapReveal from './useGsapReveal';

export default function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const start =
    options?.rootMargin && typeof options.rootMargin === 'string' ? 'top 88%' : 'top 88%';
  return useGsapReveal<T>({ start });
}
