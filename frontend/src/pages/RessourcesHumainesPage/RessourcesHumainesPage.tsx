import React, { useState, useMemo, useEffect, useRef } from 'react';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { SelectChangeEvent } from '@mui/material/Select';

import CtaSection from '../../components/common/CtaSection';
import EmptyState from '../../components/common/EmptyState';
import FilterToolbar from '../../components/common/FilterToolbar';
import PageHero from '../../components/common/PageHero';
import Breadcrumb from '../../components/common/Breadcrumb';


import { GREEN } from '../../constants/colors';
import { ressourceHumaineService } from '../../services';
import { useScrollToTop } from '../../hooks';
import type { RessourceHumaine } from '../../types/ressource-humaine.types';
import { RessourceHumaineCard } from '../../components';

// Fonction pour générer un slug à partir d'une chaîne
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]/g, '-') // Remplacer chaque caractère non alphanumérique par un tiret
    .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul tiret
    .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début et fin
};

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const POSTES = [
  { value: 'all', label: 'Tous les postes' },
  { value: 'Enseignant', label: 'Enseignant' },
  { value: 'Administratif', label: 'Administratif' },
  { value: 'Direction', label: 'Direction' },
  { value: 'Recherche', label: 'Recherche' },
  { value: 'Autre', label: 'Autre' },
];

const RessourcesHumainesPage: React.FC = () => {
  useScrollToTop();

  const [allRessourcesHumaines, setAllRessourcesHumaines] = useState<RessourceHumaine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posteFilter, setPosteFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const loadRessourcesHumaines = async () => {
      try {
        setLoading(true);
        const data = await ressourceHumaineService.findAll(1, 100);

        const transformedRessourcesHumaines: RessourceHumaine[] = data.data.map((rh: RessourceHumaine) => ({
          id: rh.id,
          slug: rh.slug || generateSlug(`${rh.nom} ${rh.prenom}`),
          nom: rh.nom,
          prenom: rh.prenom,
          poste: rh.poste,
          description: rh.description,
          email: rh.email,
          telephone: rh.telephone,
          photo: rh.photo,
          actif: rh.actif,
          ordre: rh.ordre,
          creeLe: rh.creeLe,
          misAJourLe: rh.misAJourLe,
        }));

        setAllRessourcesHumaines(transformedRessourcesHumaines);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des ressources humaines:', err);
        setError('Impossible de charger les membres de l\'équipe');
      } finally {
        setLoading(false);
      }
    };

    loadRessourcesHumaines();
  }, []);

  const hasActiveFilters = posteFilter !== 'all' || searchTerm !== '';
  const activeFilterCount = posteFilter !== 'all' ? 1 : 0;

  const filteredRessourcesHumaines = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return allRessourcesHumaines.filter((rh) => {
      const matchesSearch =
        rh.nom.toLowerCase().includes(search) ||
        rh.prenom.toLowerCase().includes(search) ||
        (rh.poste || '').toLowerCase().includes(search) ||
        (rh.description || '').toLowerCase().includes(search);
      const matchesPoste = posteFilter === 'all' || rh.poste === posteFilter;
      return matchesSearch && matchesPoste;
    });
  }, [allRessourcesHumaines, posteFilter, searchTerm]);

  const resultCount = filteredRessourcesHumaines.length;
  const resultText = `${resultCount} membre${resultCount > 1 ? 's' : ''} trouvé${resultCount > 1 ? 's' : ''}`;

  const handlePosteChange = (event: SelectChangeEvent) => {
    setPosteFilter(event.target.value);
  };

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) setSearchTerm('');
  };

  const handleResetFilters = () => {
    setPosteFilter('all');
    setSearchTerm('');
    setShowSearch(false);
    setShowFilters(false);
  };

  const activeFilterChips = [
    ...(searchTerm
      ? [
          {
            key: 'search',
            label: `Recherche: "${searchTerm}"`,
            onDelete: () => setSearchTerm(''),
          },
        ]
      : []),
    ...(posteFilter !== 'all'
      ? [
          {
            key: 'poste',
            label: `Poste: ${posteFilter}`,
            onDelete: () => setPosteFilter('all'),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Équipe ESSG"
        badgeIcon={<GroupsRoundedIcon />}
        badgeLabel="Notre Équipe"
        title="Ressources Humaines"
        description="Découvrez les hommes et femmes qui font de l'ESSG une institution d'excellence en sciences géomatiques."
        stats={[
          { value: `${allRessourcesHumaines.length}+`, label: 'Membres' },
          { value: '50+', label: 'Années d\'expérience' },
          { value: '15+', label: 'Partenaires internationaux' },
        ]}
      />

      <Breadcrumb items={[{ label: 'Ressources Humaines' }]} />

      <FilterToolbar
        resultText={resultText}
        showFilters={showFilters}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={hasActiveFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        onResetFilters={handleResetFilters}
        activeFilterChips={activeFilterChips}
        searchEnabled
        showSearch={showSearch}
        searchIsActive={searchTerm !== ''}
        onToggleSearch={handleToggleSearch}
        searchContent={
          <TextField
            inputRef={searchInputRef}
            fullWidth
            size="small"
            placeholder="Rechercher un membre par nom, prénom ou poste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: GREEN[600] }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <CloseRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '0.75rem',
                '&.Mui-focused fieldset': {
                  borderColor: GREEN[600],
                },
              },
            }}
          />
        }
      >
        <div className="max-w-xs">
          <FormControl fullWidth size="small">
            <InputLabel id="poste-label" sx={{ '&.Mui-focused': { color: GREEN[600] } }}>
              Poste
            </InputLabel>
            <Select
              labelId="poste-label"
              label="Poste"
              value={posteFilter}
              onChange={handlePosteChange}
              sx={{
                borderRadius: '0.75rem',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: GREEN[600],
                },
              }}
            >
              {POSTES.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </FilterToolbar>

      {loading && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
                  <div className="mb-4 flex justify-center">
                    <Skeleton variant="circular" width={80} height={80} />
                  </div>
                  <Skeleton variant="text" width="70%" className="mx-auto" />
                  <Skeleton variant="text" width="40%" className="mx-auto" />
                  <Skeleton variant="text" width="90%" className="mx-auto mt-4" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {error && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {resultCount === 0 ? (
              <EmptyState
                icon={<GroupsRoundedIcon sx={{ fontSize: 40, color: GREEN[400] }} />}
                title="Aucun membre trouvé"
                description="Essayez de modifier vos critères de filtrage."
                onAction={handleResetFilters}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredRessourcesHumaines.map((rh) => (
                  <RessourceHumaineCard key={rh.slug || rh.id} ressourceHumaine={rh} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <CtaSection
        icon={<GroupsRoundedIcon sx={{ fontSize: 48, color: GREEN[400] }} />}
        title="Rejoignez notre équipe"
        description="L'ESSG recherche des talents passionnés par les sciences géomatiques. Consultez nos offres d'emploi."
        primaryLabel="Nous contacter"
        primaryLink="/contact"
        secondaryLabel="Voir les formations"
        secondaryLink="/formations"
      />
    </div>
  );
};

export default RessourcesHumainesPage;