import React, { useEffect } from 'react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import Button from '@mui/material/Button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { CtaSection, EmptyState, PageHero, Breadcrumb } from '../../components';
import { BRAND, SAGE } from '../../constants/colors';
import { usePartenaireBySlug, useScrollToTop } from '../../hooks';
import { useTitle } from '../../hooks/useTitle';
import { getImageUrl } from '../../utils/image.utils';

const FALLBACK_HERO =
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const getTypeIcon = (type: string) => {
  const sx = { fontSize: 24, color: BRAND[600] };
  switch (type) {
    case 'Entreprise':
      return <ApartmentRoundedIcon sx={sx} />;
    case 'Institution':
      return <PublicRoundedIcon sx={sx} />;
    case 'Organisation':
      return <SchoolRoundedIcon sx={sx} />;
    default:
      return <PublicRoundedIcon sx={sx} />;
  }
};

const formatDate = (date?: string): string => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const PartenaireDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { partenaire, loading, error } = usePartenaireBySlug(slug || '');
  const { setTitle } = useTitle();

  useScrollToTop();

  useEffect(() => {
    if (partenaire) {
      setTitle(partenaire.nom);
    }
  }, [partenaire, setTitle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
            <p className="text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>Chargement du partenaire...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !partenaire) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            icon={<HandshakeRoundedIcon sx={{ fontSize: 40, color: SAGE[400] }} />}
            title="Partenaire introuvable"
            description="Le partenaire que vous recherchez n'existe pas ou a été supprimé."
            actionLabel="Retour aux partenaires"
            onAction={() => window.history.back()}
          />

          <div className="mt-8 text-center">
            <Button
              component={RouterLink}
              to="/partenaires"
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                borderRadius: '0.5rem',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: BRAND[600],
                color: BRAND[600],
                '&:hover': {
                  borderColor: BRAND[700],
                  backgroundColor: BRAND[50],
                },
              }}
            >
              Tous les partenaires
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const logoUrl = partenaire.logo ? getImageUrl(partenaire.logo) : '';

  const infoItems = [
    partenaire.secteur && {
      icon: <ApartmentRoundedIcon sx={{ fontSize: 20, color: BRAND[600] }} />,
      label: 'Secteur',
      value: partenaire.secteur,
    },
    partenaire.pays && {
      icon: <PublicRoundedIcon sx={{ fontSize: 20, color: BRAND[600] }} />,
      label: 'Pays',
      value: partenaire.pays,
    },
    partenaire.contact && {
      icon: <MailRoundedIcon sx={{ fontSize: 20, color: BRAND[600] }} />,
      label: 'Contact',
      value: partenaire.contact,
    },
    partenaire.dateDebut && {
      icon: <CalendarTodayRoundedIcon sx={{ fontSize: 20, color: BRAND[600] }} />,
      label: 'Date de début',
      value: formatDate(partenaire.dateDebut),
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  return (
    <div className="min-h-screen bg-neutral-50">
      <PageHero
        image={FALLBACK_HERO}
        imageAlt={partenaire.nom}
        badgeIcon={<HandshakeRoundedIcon />}
        badgeLabel={partenaire.type}
        title={partenaire.nom}
        description={partenaire.description || partenaire.secteur || ''}
        minHeight="50vh"
      />

      {/* Fil d'Ariane */}
      <Breadcrumb items={[{ label: 'Partenaires', to: '/partenaires' }, { label: partenaire.nom }]} />

      {/* Contenu principal */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Colonne latérale */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-neutral-200 bg-white p-6" style={{ boxShadow: '0 4px 20px rgba(95, 99, 105, 0.08)' }}>
              <div className="mb-5 flex items-center justify-center">
                <div
                  className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg border-2 bg-sage-50"
                  style={{ borderColor: SAGE[200] }}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={`Logo ${partenaire.nom}`}
                      className="h-full w-full object-contain p-2"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      {getTypeIcon(partenaire.type)}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-5 flex justify-center">
                <span className="inline-flex items-center rounded-full border border-sage-200 bg-sage-50 px-3.5 py-1 text-xs font-semibold text-sage-700">
                  {partenaire.type}
                </span>
              </div>

              {partenaire.siteWeb && (
                <Button
                  component="a"
                  href={
                    partenaire.siteWeb.startsWith('http')
                      ? partenaire.siteWeb
                      : `https://${partenaire.siteWeb}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  variant="outlined"
                  fullWidth
                  startIcon={<LanguageRoundedIcon />}
                  sx={{
                    borderRadius: '0.5rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: BRAND[600],
                    color: BRAND[600],
                    '&:hover': {
                      borderColor: BRAND[700],
                      backgroundColor: BRAND[50],
                    },
                  }}
                >
                  Visiter le site
                </Button>
              )}
            </div>
          </div>

          {/* Colonne principale */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-neutral-200 bg-white p-6 sm:p-8" style={{ boxShadow: '0 4px 20px rgba(95, 99, 105, 0.08)' }}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <HandshakeRoundedIcon sx={{ color: BRAND[700] }} />
                <span style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>À propos de ce partenaire</span>
              </h2>

              <p className="mb-8 leading-7 text-slate-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {partenaire.description ||
                  `${partenaire.nom} est un partenaire de type « ${partenaire.type} » collaborant avec l'ESSG pour la formation, la recherche et l'innovation en sciences géomatiques.`}
              </p>

              {infoItems.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {infoItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sage-50 ring-1 ring-sage-200">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {item.label}
                        </div>
                        <div className="mt-0.5 break-words text-sm font-semibold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section CTA */}
      <CtaSection
        icon={<HandshakeRoundedIcon sx={{ fontSize: 48, color: SAGE[400] }} />}
        title="Devenir partenaire de l'ESSG"
        description="Rejoignez notre réseau de partenaires prestigieux et contribuez à former les talents de demain en sciences géomatiques."
        primaryLabel="Contactez-nous"
        primaryLink="partenariats@essg.mg"
        primaryIsMailto
        secondaryLabel="Voir tous les partenaires"
        secondaryLink="/partenaires"
      />
    </div>
  );
};

export default PartenaireDetailPage;