import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { InsertLinkOutlined } from '@mui/icons-material';

import EssG from '../../assets/files/images/logo/itdc_logo.png';
import type { FooterProps, SocialItem } from '../../types/footer.types';

const SOCIAL_ICONS = {
  web: InsertLinkOutlined,
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
} as const;

const SOCIAL_ICON_DEFAULT = OpenInNewIcon;

const ICON_BUTTON_STYLES = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
} as const;

const DEFAULT_PROPS = {
  companyName: 'ESSG' as const,
  navLinks: [
    { label: 'Accueil', to: '/' },
    { label: 'Formations', to: '/formations' },
    { label: 'Projets', to: '/projets' },
    { label: 'Actualités', to: '/actualites' },
    { label: 'Partenaires', to: '/partenaires' },
    { label: 'Admission', to: '/admission' },
  ],
  contact: {
    email: 'contact@essg.sn',
    phone: '+261 38 18 282 49',
    address: 'ESSG e-atiala Andrainjato Université Fianarantsoa, Madagascar',
  },
  socials: [
    { href: 'https://www.essg.sn', kind: 'web' as const, ariaLabel: 'Site officiel ESSG' },
    {
      href: 'https://www.linkedin.com/company/essg',
      kind: 'linkedin' as const,
      ariaLabel: 'LinkedIn ESSG',
    },
    {
      href: 'https://www.facebook.com/profile.php?id=61588935937597',
      kind: 'facebook' as const,
      ariaLabel: 'Facebook ESSG',
    },
  ],
};

const Footer = ({
  companyName = DEFAULT_PROPS.companyName,
  navLinks = DEFAULT_PROPS.navLinks,
  contact = DEFAULT_PROPS.contact,
  socials = DEFAULT_PROPS.socials,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();

  const SocialIcon = ({ kind }: { kind: SocialItem['kind'] }) => {
    const IconComponent = SOCIAL_ICONS[kind as keyof typeof SOCIAL_ICONS] || SOCIAL_ICON_DEFAULT;
    return <IconComponent fontSize="small" color="primary" />;
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Présentation */}
          <div className="lg:col-span-2">
            <Link to="/" className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
                <img src={EssG} alt="Logo ESSG" className="h-full w-full object-contain" />
              </div>

              <div>
                <p className="text-lg font-bold text-white">{companyName}</p>
                <p className="text-sm text-gray-400">École Supérieure de Sciences Géomatiques</p>
              </div>
            </Link>

            <p className="max-w-md text-sm leading-6 text-gray-400 text-justify">
              L&apos;ESSG est un établissement d&apos;enseignement supérieur spécialisé dans la
              formation, la recherche et l&apos;innovation en sciences géomatiques, cartographie,
              télédétection et systèmes d&apos;information géographique.
            </p>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-400 text-justify">
              Excellence académique, professionnalisation et ouverture vers les technologies
              spatiales et numériques.
            </p>

            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {socials.map((social) => (
                  <IconButton
                    key={`${social.kind}-${social.href}`}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.ariaLabel}
                    sx={ICON_BUTTON_STYLES}
                  >
                    <SocialIcon kind={social.kind} />
                  </IconButton>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Navigation
            </h3>

            <ul className="space-y-1 text-sm text-gray-400">
              {navLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + abonnement */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </h3>

            <ul className="space-y-2 text-sm text-gray-400">
              <li>{contact.address}</li>
              {contact.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className="transition-colors hover:text-white"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li>
                <Link
                  to="/admission"
                  className="text-blue-400 transition-colors hover:text-blue-300"
                >
                  Demande d&apos;information →
                </Link>
              </li>
            </ul>

            {/* <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold text-white">
                Recevoir les actualités ESSG
              </h4>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <label htmlFor="footer-email" className="sr-only">
                  Adresse e-mail
                </label>

                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse e-mail"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Envoi en cours..." : "S’abonner"}
                </button>
              </form>

              {message && (
                <p
                  className={`mt-3 text-sm ${
                    messageType === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </div> */}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 sm:flex-row">
          <p className="text-sm text-gray-400">
            © {currentYear} {companyName}. Tous droits réservés.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link
              to="/mentions-legales"
              className="text-gray-400 transition-colors hover:text-white"
            >
              Mentions légales
            </Link>
            <Link
              to="/politique-confidentialite"
              className="text-gray-400 transition-colors hover:text-white"
            >
              Politique de confidentialité
            </Link>
            {/* <Link
              to="/admin"
              className="text-gray-500 transition-colors hover:text-gray-300"
            >
              Admin
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
