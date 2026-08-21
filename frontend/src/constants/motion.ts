
export const HOVER_LIFT =
  'transition-[transform,box-shadow] duration-[--duration-hover] ease-out ' +
  'hover:-translate-y-0.5 ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0';


export const HOVER_CARD =
  'transition-[transform,box-shadow,border-color] duration-[--duration-hover] ease-out ' +
  //'hover:-translate-y-1 hover:scale-[1.01] ' +
  'focus-within:-translate-y-1 focus-within:scale-[1.01] ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100';


export const HOVER_ICON_SLIDE =
  '[&_[data-icon-slide]]:transition-transform [&_[data-icon-slide]]:duration-[--duration-micro] ' +
  '[&_[data-icon-slide]]:ease-out hover:[&_[data-icon-slide]]:translate-x-[3px] ' +
  'motion-reduce:[&_[data-icon-slide]]:transition-none';


export const HOVER_IMAGE_ZOOM =
  'transition-transform duration-[620ms] ease-out group-hover:scale-[1.03] ' +
  'group-focus-within:scale-[1.04] ' +
  'motion-reduce:transition-none motion-reduce:group-hover:scale-100';

export const HOVER_IMAGE_ZOOM_SLOW =
  'transition-transform duration-[900ms] ease-out group-hover:scale-[1.025] ' +
  'motion-reduce:transition-none motion-reduce:group-hover:scale-100';

export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ' +
  'focus-visible:ring-offset-2';
