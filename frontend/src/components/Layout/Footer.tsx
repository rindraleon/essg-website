import { Link } from 'react-router-dom';
import { ExternalLink, Facebook, Globe, Linkedin } from 'lucide-react';
import EssG from '../../assets/files/images/logo/itdc_logo.png';
import type { FooterProps, SocialItem } from '../../types/footer.types';

const SOCIAL_ICONS = {
  web: Globe,
  linkedin: Linkedin,
  facebook: Facebook,
} as const;

const DEFAULT_PROPS = {
  companyName: 'ESSG' as const,
  navLinks: [
    { label: 'Accueil', to: '/' },
    { label: 'À propos', to: '/about' },
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
    const IconComponent = SOCIAL_ICONS[kind as keyof typeof SOCIAL_ICONS] || ExternalLink;
    return <IconComponent className="size-4" />;
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-brand-950 text-ink-200">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(closest-side, #98c070, transparent)' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="mb-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/95 p-1.5 shadow-lg ring-1 ring-white/20">
                <img src={EssG} alt="Logo ESSG" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{companyName}</p>
                <p className="text-sm text-ink-300">École Supérieure de Sciences Géomatiques</p>
              </div>
            </Link>

            <p className="max-w-md text-sm leading-7 text-ink-300 text-justify">
              L&apos;ESSG est un établissement d&apos;enseignement supérieur spécialisé dans la
              formation, la recherche et l&apos;innovation en sciences géomatiques, cartographie,
              télédétection et systèmes d&apos;information géographique.
            </p>

            <p className="mt-3 max-w-md text-sm leading-7 text-ink-300 text-justify">
              Excellence académique, professionnalisation et ouverture vers les technologies
              spatiales et numériques.
            </p>

            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                {socials.map((social) => (
                  <a
                    key={`${social.kind}-${social.href}`}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.ariaLabel}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-white/8 bg-white/6 text-white/85 transition-all duration-200 hover:-translate-y-0.5 hover:bg-sage-400/18 hover:text-white"
                  >
                    <SocialIcon kind={social.kind} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-sage-300">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {navLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-1.5 text-ink-300 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-sage-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-sage-300">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-ink-300">
              <li className="leading-6">{contact.address}</li>
              {contact.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone.replaceAll(/\s+/g, '')}`}
                    className="transition-colors duration-200 hover:text-white"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${contact.email}`} className="transition-colors duration-200 hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li>
                <Link
                  to="/admission"
                  className="inline-flex items-center gap-1 font-medium text-sage-400 transition-colors duration-200 hover:text-sage-300"
                >
                  Demande d&apos;information →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row">
          <p className="text-sm text-ink-300">
            © {currentYear} {companyName}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <Link to="/mentions-legales" className="text-ink-300 transition-colors duration-200 hover:text-white">
              Mentions légales
            </Link>
            <Link
              to="/politique-confidentialite"
              className="text-ink-300 transition-colors duration-200 hover:text-white"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
