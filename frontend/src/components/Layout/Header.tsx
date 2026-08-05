import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import EssG from '../../assets/files/images/logo/EssG.png';
import { BRAND } from '../../constants/colors';

const NAVIGATION = [
  { name: 'Accueil', href: '/' },
  { name: 'À propos', href: '/about' },
  { name: 'Formations', href: '/formations' },
  { name: 'Actualités', href: '/actualites' },
  { name: 'Projets', href: '/projets' },
  { name: 'Partenaires', href: '/partenaires' },
] as const;

const OUTLINED_BUTTON_STYLES = {
  borderColor: BRAND[600],
  color: BRAND[600],
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '0.75rem',
  px: 2.5,
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: BRAND[700],
    color: BRAND[700],
    backgroundColor: BRAND[50],
  },
} as const;

const CONTAINED_BUTTON_STYLES = {
  backgroundColor: BRAND[600],
  color: '#ffffff',
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '0.75rem',
  px: 3,
  boxShadow: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: BRAND[700],
    boxShadow: '0 8px 20px -6px rgba(46, 106, 95, 0.45)',
    transform: 'translateY(-1px)',
  },
} as const;

const NAV_LINK_CLASS =
  'relative py-2 text-sm font-medium text-ink-600 transition-colors duration-200 hover:text-brand-700 ' +
  'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-600 ' +
  'after:origin-center after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100';

const MOBILE_NAV_LINK_CLASS =
  'block rounded-xl px-4 py-2.5 text-base font-medium text-ink-700 transition-colors duration-150 hover:bg-brand-50 hover:text-brand-700';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-[4.5rem]">
          <Link to="/" className="flex items-center" aria-label="Retour à l'accueil">
            <img src={EssG} alt="Logo ESSG" className="h-14 w-auto object-contain sm:h-16" />
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-7">
            {NAVIGATION.map((item) => (
              <NavLink key={item.name} to={item.href} className={NAV_LINK_CLASS}>
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Button component={Link} to="/contact" variant="outlined" sx={OUTLINED_BUTTON_STYLES}>
              Contact
            </Button>
            <Button
              component={Link}
              to="/admission"
              variant="contained"
              sx={CONTAINED_BUTTON_STYLES}
            >
              Admission
            </Button>
          </div>

          <IconButton
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{
              display: { lg: 'none' },
              color: BRAND[800],
              border: '1px solid',
              borderColor: BRAND[100],
              backgroundColor: BRAND[50],
              borderRadius: '0.75rem',
              '&:hover': {
                backgroundColor: BRAND[100],
                color: BRAND[900],
              },
            }}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-ink-100 py-4 animate-fade-in">
            <div className="space-y-1.5">
              {NAVIGATION.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={MOBILE_NAV_LINK_CLASS}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="px-0 pt-4 space-y-2.5">
                <Button
                  component={Link}
                  to="/contact"
                  variant="outlined"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                  sx={OUTLINED_BUTTON_STYLES}
                >
                  Contact
                </Button>
                <Button
                  component={Link}
                  to="/admission"
                  variant="contained"
                  fullWidth
                  onClick={() => setMobileMenuOpen(false)}
                  sx={CONTAINED_BUTTON_STYLES}
                >
                  Admission
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
