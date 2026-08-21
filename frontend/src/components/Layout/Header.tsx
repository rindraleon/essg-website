import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import EssG from '../../assets/files/images/logo/EssG.png';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { playIntro } from '../../animations/presets';
import useHeaderScroll from '../../hooks/useHeaderScroll';
import { useAdmissionsOuvertes } from '../../hooks/useAdmissionsSettings';
import { gsap, registerGsap } from '../../lib/gsap';

const NAVIGATION = [
  { name: 'Accueil', href: '/' },
  { name: 'À propos', href: '/about' },
  { name: 'Formations', href: '/formations' },
  { name: 'Actualités', href: '/actualites' },
  { name: 'Projets', href: '/projets' },
  { name: 'Partenaires', href: '/partenaires' },
] as const;

const NAV_LINK_CLASS =
  'relative py-2 text-small font-medium text-ink-600 transition-colors duration-200 hover:text-brand-700 ' +
  'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-600 ' +
  'after:origin-center after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100';

const MOBILE_NAV_LINK_CLASS =
  'block rounded-xl px-4 py-3 text-body font-medium text-ink-700 transition-[background-color,color,transform] duration-200 ' +
  'hover:translate-x-1 hover:bg-brand-50 hover:text-brand-700 motion-reduce:transition-none motion-reduce:hover:translate-x-0';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const admissionsOuvertes = useAdmissionsOuvertes();
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const scrolled = useHeaderScroll(16);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    registerGsap();
    const ctx = gsap.context(() => {
      playIntro({
        header,
        logo: logoRef.current,
        nav: navRef.current ? Array.from(navRef.current.querySelectorAll('a')) : [],
        actions: actionsRef.current,
      });
    }, header);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    const firstLink = mobileMenuRef.current?.querySelector<HTMLAnchorElement>('a');
    firstLink?.focus();
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300',
        scrolled
          ? 'border-ink-100 bg-white/95 shadow-[0_8px_24px_-18px_rgba(15,33,30,0.45)]'
          : 'border-transparent bg-white/75'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-[4.5rem]">
          <Link ref={logoRef} to="/" className="flex items-center" aria-label="Retour à l'accueil">
            <img
              src={EssG}
              alt="Logo ESSG"
              className={cn(
                'h-14 w-auto origin-left object-contain transition-transform duration-300 ease-out sm:h-16',
                'motion-reduce:transition-none',
                scrolled && 'scale-[0.88]'
              )}
            />
          </Link>

          <div ref={navRef} className="hidden lg:flex lg:items-center lg:gap-7">
            {NAVIGATION.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(NAV_LINK_CLASS, isActive && 'text-brand-700 after:scale-x-100')
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div ref={actionsRef} className="hidden lg:flex lg:items-center lg:gap-3">
            <Link to="/contact" className={cn(buttonVariants({ variant: 'outline' }))}>
              Contact
            </Link>
            {admissionsOuvertes && (
              <Link to="/admission" className={cn(buttonVariants({ variant: 'default' }))}>
                Admission
              </Link>
            )}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-800 transition-[background-color,color,transform] duration-200 hover:bg-brand-100 active:scale-[0.98] lg:hidden motion-reduce:transition-none motion-reduce:active:scale-100"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Voile séparé : le contenu sous le menu reste immobile. */}
      <button
        type="button"
        aria-label="Fermer le menu"
        tabIndex={mobileMenuOpen ? 0 : -1}
        onClick={closeMobileMenu}
        className={cn(
          'fixed inset-0 top-16 z-40 bg-ink-950/30 transition-opacity duration-300 sm:top-[4.5rem] lg:hidden',
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          'motion-reduce:transition-none'
        )}
      />

      {/* Menu mobile : panneau latéral, sans déplacement brutal de la page. */}
      <div
        id="mobile-navigation"
        ref={mobileMenuRef}
        aria-hidden={!mobileMenuOpen}
        className={cn(
          'fixed bottom-0 left-0 top-16 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-y-auto border-r border-ink-100 bg-white px-4 py-5 shadow-elevated transition-[opacity,transform] duration-300 sm:top-[4.5rem] lg:hidden',
          mobileMenuOpen
            ? 'translate-x-0 opacity-100'
            : 'pointer-events-none -translate-x-full opacity-0',
          'motion-reduce:transition-none'
        )}
      >
        <div className="space-y-1.5">
          {NAVIGATION.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              tabIndex={mobileMenuOpen ? 0 : -1}
              className={MOBILE_NAV_LINK_CLASS}
              onClick={closeMobileMenu}
            >
              {item.name}
            </NavLink>
          ))}
          <div className="space-y-2.5 border-t border-ink-100 pt-5">
            <Link
              to="/contact"
              onClick={closeMobileMenu}
              tabIndex={mobileMenuOpen ? 0 : -1}
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
            >
              Contact
            </Link>
            {admissionsOuvertes && (
              <Link
                to="/admission"
                onClick={closeMobileMenu}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
              >
                Admission
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
