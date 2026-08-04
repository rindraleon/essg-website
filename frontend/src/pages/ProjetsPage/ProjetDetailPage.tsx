import React, { useEffect } from 'react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { CtaSection, EmptyState, PageHero, MapEmbed } from '../../components';
import { GREEN } from '../../constants/colors';
import { useProjetById } from '../../hooks/useProjets';
import { useScrollToTop } from '../../hooks';
import { useTitle } from '../../hooks/useTitle';
import { getImageUrl } from '../../utils/image.utils';

const getProjetImage = (image: string | undefined, slug: string): string => {
  if (image) {
    return getImageUrl(image);
  }
  // Images par défaut selon le slug
  const defaultImages: Record<string, string> = {
    international: '1453732638553-7c9b5c6c5c0a',
    'service-public': '1586773867938-d2e2e7e7e7e7',
    recherche: '1532094348800-1c5e8e7e7e7e7',
    innovation: '1518770660439-4636190af475',
  };

  const hash = defaultImages[slug] || '1451187580459-43490279c0fa';
  return `https://images.unsplash.com/photo-${hash}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920`;
};

const ProjetDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { projet, loading, error } = useProjetById(slug || '');
  const { setTitle } = useTitle();

  useScrollToTop();

  useEffect(() => {
    if (projet) {
      setTitle(projet.titre);
    }
  }, [projet, setTitle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="text-gray-500">Chargement du projet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !projet) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            icon={<RocketLaunchRoundedIcon sx={{ fontSize: 40, color: GREEN[400] }} />}
            title="Projet introuvable"
            description="Le projet que vous recherchez n'existe pas ou a été supprimé."
            actionLabel="Retour aux projets"
            onAction={() => window.history.back()}
          />

          <div className="mt-8 text-center">
            <Button
              component={RouterLink}
              to="/projets"
              variant="outlined"
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                borderRadius: '0.75rem',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: GREEN[600],
                color: GREEN[600],
                '&:hover': {
                  borderColor: GREEN[700],
                  backgroundColor: GREEN[50],
                },
              }}
            >
              Tous les projets
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getProjetImage(projet.image, projet.id);
  const isFinished =
    projet.statut.toLowerCase() === 'terminé' || projet.statut.toLowerCase() === 'terminee';

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        image={imageUrl}
        imageAlt={projet.titre}
        badgeIcon={<RocketLaunchRoundedIcon />}
        badgeLabel={projet.type}
        title={projet.titre}
        description={projet.description}
        minHeight="50vh"
      />

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Button
            component={RouterLink}
            to="/"
            variant="text"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              color: 'gray.600',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: GREEN[50],
                color: GREEN[600],
              },
            }}
          >
            Accueil
          </Button>

          <span className="text-gray-400">›</span>

          <Button
            component={RouterLink}
            to="/projets"
            variant="text"
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              color: 'gray.600',
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: GREEN[50],
                color: GREEN[600],
              },
            }}
          >
            Projets
          </Button>

          <span className="text-gray-400">›</span>

          <span className="truncate text-sm font-medium text-gray-900">{projet.titre}</span>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* En-tête avec badges et titre */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
              {projet.type}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              <CalendarTodayRoundedIcon sx={{ fontSize: 14 }} />
              {projet.annee}
            </span>

            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
              style={{
                backgroundColor: isFinished ? '#059669' : '#f59e0b',
              }}
            >
              <FlagRoundedIcon sx={{ fontSize: 14 }} />
              {projet.statut}
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{projet.titre}</h1>
          <p className="mt-2 text-base text-gray-600">{projet.description}</p>
        </div>

        {/* Grille principale : sidebar gauche + contenu droit */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Colonne gauche - Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Carte Informations clés */}
            <Card
              sx={{
                borderRadius: '1rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              }}
            >
              <CardContent className="p-6">
                <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Informations clés
                </h3>

                <div className="space-y-5">
                  {/* Statut */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: isFinished ? '#d1fae5' : '#fef3c7',
                      }}
                    >
                      <FlagRoundedIcon
                        sx={{
                          color: isFinished ? '#059669' : '#d97706',
                          fontSize: 20,
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Statut</div>
                      <span
                        className="mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-semibold uppercase"
                        style={{
                          color: isFinished ? '#059669' : '#d97706',
                          backgroundColor: isFinished ? '#d1fae5' : '#fef3c7',
                        }}
                      >
                        {projet.statut}
                      </span>
                    </div>
                  </div>

                  {/* Année */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100">
                      <CalendarTodayRoundedIcon sx={{ color: GREEN[600], fontSize: 20 }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500">Année de livraison</div>
                      <div className="mt-0.5 text-base font-semibold text-gray-900">
                        {projet.annee}
                      </div>
                    </div>
                  </div>

                  {/* Localisation */}
                  {projet.location && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
                        <LocationOnRoundedIcon sx={{ color: '#2563eb', fontSize: 20 }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">Localisation</div>
                        <div className="mt-0.5 text-base font-semibold text-gray-900">
                          {projet.location.ville}, {projet.location.pays}
                        </div>
                        {projet.location.adresse && (
                          <div className="mt-0.5 text-sm text-gray-500">
                            {projet.location.adresse}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Budget (optionnel) */}
                  {projet.budget && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100">
                        <AttachMoneyRoundedIcon sx={{ color: GREEN[600], fontSize: 20 }} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500">Budget</div>
                        <div className="mt-0.5 text-base font-semibold text-gray-900">
                          {projet.budget}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Carte Partenaires */}
            {projet.partenaires && projet.partenaires.length > 0 && (
              <Card
                sx={{
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                }}
              >
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full" style={{ backgroundColor: GREEN[600] }} />
                    <h3 className="text-lg font-semibold text-gray-900">Partenaires</h3>
                  </div>

                  <div className="space-y-3">
                    {projet.partenaires.map((partenaire: string, index: number) => {
                      // Support des partenaires en string ou objet {nom, type}
                      const nom = partenaire;

                      return (
                        <div
                          key={nom + index}
                          className="flex items-center gap-3 rounded-xl bg-blue-50/50 p-3"
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                            <SchoolRoundedIcon sx={{ color: GREEN[600], fontSize: 20 }} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">{nom}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Colonne droite - Contenu principal */}
          <div className="space-y-6 lg:col-span-2">
            {projet.location && (
              <Card
                sx={{
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                      <MapRoundedIcon sx={{ color: GREEN[600], fontSize: 20 }} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Localisation du projet</h3>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm">
                    <MapEmbed
                      lat={projet.location.lat}
                      lng={projet.location.lng}
                      label={`${projet.location.ville}, ${projet.location.pays}`}
                      adresse={projet.location.adresse}
                      zoom="city"
                    />

                    {/* Étiquette overlay en bas */}
                    <div className="flex items-center justify-center gap-2 border-t border-gray-200 bg-white px-4 py-3 text-center">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: GREEN[600] }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {projet.location.adresse ||
                          `${projet.location.ville}, ${projet.location.pays}`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Objectifs (si présents) */}
            {projet.objectifs && projet.objectifs.length > 0 && (
              <Card
                sx={{
                  borderRadius: '1rem',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full" style={{ backgroundColor: GREEN[600] }} />
                    <h3 className="text-lg font-semibold text-gray-900">Objectifs du projet</h3>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {projet.objectifs.map((objectif: string, index: number) => (
                      <div
                        key={objectif + index}
                        className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <span
                          className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: GREEN[600] }}
                        />
                        <span className="text-sm leading-6 text-gray-700">{objectif}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bouton retour */}
            <Button
              component={RouterLink}
              to="/projets"
              variant="outlined"
              fullWidth
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                borderRadius: '0.75rem',
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                borderColor: GREEN[600],
                color: GREEN[600],
                '&:hover': {
                  borderColor: GREEN[700],
                  backgroundColor: GREEN[50],
                },
              }}
            >
              Tous les projets
            </Button>
          </div>
        </div>
      </div>

      <CtaSection
        icon={<RocketLaunchRoundedIcon sx={{ fontSize: 48, color: GREEN[400] }} />}
        title="Vous avez un projet de recherche ?"
        description="Collaborez avec l'ESSG pour vos projets de recherche, d'innovation ou de développement en sciences géomatiques."
        primaryLabel="Nous contacter"
        primaryLink="/contact"
        secondaryLabel="Voir nos formations"
        secondaryLink="/formations"
      />
    </div>
  );
};

export default ProjetDetailPage;
