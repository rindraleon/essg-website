import { ArrowLeft, Briefcase, IdCard, Mail, Phone, User, Users } from 'lucide-react';
import React, { useEffect } from 'react';
import Button from '@/components/compat/button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { CtaSection, EmptyState, PageHero, Breadcrumb } from '../../components';
import { GREEN } from '../../constants/colors';
import { useRessourceHumaineBySlug, useScrollToTop } from '../../hooks';
import { useTitle } from '../../hooks/useTitle';
import { getImageUrl } from '../../utils/image.utils';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const RessourceHumaineDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { ressourceHumaine, loading, error } = useRessourceHumaineBySlug(slug || '');
  const { setTitle } = useTitle();

  useScrollToTop();

  useEffect(() => {
    if (ressourceHumaine) {
      setTitle(`${ressourceHumaine.prenom} ${ressourceHumaine.nom}`);
    }
  }, [ressourceHumaine, setTitle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-600 border-r-transparent"></div>
            <p className="text-ink-500">Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ressourceHumaine) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            icon={<Users />}
            title="Profil introuvable"
            description="Le membre de l'équipe que vous recherchez n'existe pas ou a été supprimé."
            actionLabel="Retour à l'accueil"
            onAction={() => window.history.back()}
          />

          <div className="mt-8 text-center">
            <Button
              component={RouterLink}
              to="/RessourceHumaineDetailPage"
              variant="outlined"
              startIcon={<ArrowLeft className="size-4" />}
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${ressourceHumaine.nom} ${ressourceHumaine.prenom}`;
  const photoUrl = ressourceHumaine.photo ? getImageUrl(ressourceHumaine.photo) : '';

  const infoItems = [
    ressourceHumaine.poste && {
      icon: <Briefcase />,
      label: 'Poste',
      value: ressourceHumaine.poste,
    },
    ressourceHumaine.email && {
      icon: <Mail />,
      label: 'Email',
      value: ressourceHumaine.email,
      href: `mailto:${ressourceHumaine.email}`,
    },
    ressourceHumaine.telephone && {
      icon: <Phone />,
      label: 'Téléphone',
      value: ressourceHumaine.telephone,
      href: `tel:${ressourceHumaine.telephone.replace(/\s+/g, '')}`,
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={photoUrl || FALLBACK_IMAGE}
        imageAlt={fullName}
        badgeIcon={<IdCard className="size-4" />}
        badgeLabel={ressourceHumaine.poste}
        title={fullName}
        description={ressourceHumaine.description || ''}
        minHeight="50vh"
      />

     
      <Breadcrumb items={[{ label: 'Ressources Humaines', to: '/RessourcesHumainesPage' }, { label: fullName }]} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-100">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={fullName}
                    className="h-full w-full object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.style.opacity = '0.4';
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200">
                    <span className="text-6xl font-bold text-brand-600">
                      {ressourceHumaine.nom[0]}
                      {ressourceHumaine.prenom[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="mb-1 text-xl font-bold text-ink-900">{fullName}</h2>
                <p className="text-sm font-semibold" style={{ color: GREEN[600] }}>
                  {ressourceHumaine.poste}
                </p>
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink-900">
                <User />
                Présentation
              </h2>

              <p className="mb-8 leading-7 text-ink-600">
                {ressourceHumaine.description ||
                  `${fullName} occupe le poste de ${ressourceHumaine.poste} à l'ESSG, contribuant à l'excellence académique et à la réussite des étudiants en sciences géomatiques.`}
              </p>

              {infoItems.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {infoItems.map((item) => {
                    const content = (
                      <div className="flex items-start gap-3 rounded-xl border border-ink-100 bg-ink-50/60 p-4 transition-colors hover:bg-brand-50/50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 ring-1 ring-brand-100">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                            {item.label}
                          </div>
                          <div className="mt-0.5 break-words text-sm font-semibold text-ink-900">
                            {item.value}
                          </div>
                        </div>
                      </div>
                    );

                    return item.href ? (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block no-underline"
                        aria-label={`${item.label} : ${item.value}`}
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={item.label}>{content}</div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CtaSection
        icon={<Users />}
        title="Une question pour notre équipe ?"
        description="N'hésitez pas à nous contacter pour toute question sur les formations, les admissions ou la vie de l'école."
        primaryLabel="Nous contacter"
        primaryLink="/contact"
        secondaryLabel="Découvrir les formations"
        secondaryLink="/formations"
      />
    </div>
  );
};

export default RessourceHumaineDetailPage;
