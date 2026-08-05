import React, { useState, useMemo, useRef, useEffect } from 'react';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import type { SelectChangeEvent } from '@mui/material/Select';
import {
  CtaSection,
  EmptyState,
  PageHero,
  Breadcrumb,
  FilterToolbar,
  FormationCard,
} from '../../components';
import { GREEN } from '../../constants/colors';
import { useFormations, useScrollToTop } from '../../hooks';
import type { Formation } from '../../types/formations.types';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const NIVEAUX = [
  { value: 'all', label: 'Tous les niveaux' },
  { value: 'Licence', label: 'Licence' },
  { value: 'Master', label: 'Master' },
  { value: 'Doctorat', label: 'Doctorat' },
];

const DOMAINES = [
  { value: 'all', label: 'Tous les domaines' },
  { value: 'Géomatique et Applications', label: 'Géomatique et Applications' },
  { value: 'Géomatique et Management', label: 'Géomatique et Management' },
  {
    value: 'Informatique et Données Spatiales',
    label: 'Informatique et Données Spatiales',
  },
];

const HERO_STATS = [
  {
    value: '6+',
    label: 'Formations',
    icon: <SchoolRoundedIcon sx={{ fontSize: 28, color: GREEN[300] }} />,
  },
  {
    value: '500+',
    label: 'Étudiants',
    icon: <GroupsRoundedIcon sx={{ fontSize: 28, color: GREEN[300] }} />,
  },
  {
    value: '95%',
    label: "Taux d'insertion",
    icon: <TrendingUpRoundedIcon sx={{ fontSize: 28, color: GREEN[300] }} />,
  },
  {
    value: '15+',
    label: 'Partenaires',
    icon: <StarRoundedIcon sx={{ fontSize: 28, color: GREEN[300] }} />,
  },
];

const FormationsPage: React.FC = () => {
  useScrollToTop();

  const [searchTerm, setSearchTerm] = useState('');
  const [niveauFilter, setNiveauFilter] = useState('all');
  const [domaineFilter, setDomaineFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Charger TOUTES les formations (limit élevé)
  const { data, loading, error } = useFormations(1, 100);
  const formations: Formation[] = useMemo(() => data?.data ?? [], [data]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Filtrage côté client
  const filteredFormations = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return formations.filter((formation) => {
      const matchesSearch =
        formation.titre.toLowerCase().includes(search) ||
        formation.description.toLowerCase().includes(search);
      const matchesNiveau = niveauFilter === 'all' || formation.niveau === niveauFilter;
      const matchesDomaine = domaineFilter === 'all' || formation.domaine.includes(domaineFilter);
      return matchesSearch && matchesNiveau && matchesDomaine;
    });
  }, [formations, searchTerm, niveauFilter, domaineFilter]);

  const resultCount = filteredFormations.length;
  const resultText = `${resultCount} formation${resultCount > 1 ? 's' : ''} trouvée${resultCount > 1 ? 's' : ''}`;

  const handleNiveauChange = (event: SelectChangeEvent) => {
    setNiveauFilter(event.target.value);
  };

  const handleDomaineChange = (event: SelectChangeEvent) => {
    setDomaineFilter(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setNiveauFilter('all');
    setDomaineFilter('all');
    setShowSearch(false);
    setShowFilters(false);
  };

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) setSearchTerm('');
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
    ...(niveauFilter !== 'all'
      ? [
          {
            key: 'niveau',
            label: `Niveau: ${niveauFilter}`,
            onDelete: () => setNiveauFilter('all'),
          },
        ]
      : []),
    ...(domaineFilter !== 'all'
      ? [
          {
            key: 'domaine',
            label: `Domaine: ${domaineFilter}`,
            onDelete: () => setDomaineFilter('all'),
          },
        ]
      : []),
  ];

  const hasActiveFilters = searchTerm !== '' || niveauFilter !== 'all' || domaineFilter !== 'all';

  const activeFilterCount = (niveauFilter !== 'all' ? 1 : 0) + (domaineFilter !== 'all' ? 1 : 0);

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Campus ESSG"
        badgeIcon={<AutoStoriesRoundedIcon />}
        badgeLabel="ESSG — École Supérieure de Sciences Géomatiques"
        title="Nos Formations"
        description="Des programmes d'excellence pour maîtriser les technologies géospatiales et bâtir votre carrière dans un secteur en pleine expansion."
        stats={HERO_STATS}
        minHeight="70vh"
      />
      <Breadcrumb items={[{ label: 'Formations' }]} />

      <FilterToolbar
        resultText={resultText}
        showFilters={showFilters}
        activeFilterCount={activeFilterCount}
        hasActiveFilters={hasActiveFilters}
        activeFilterChips={activeFilterChips}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        onResetFilters={handleResetFilters}
        searchEnabled
        showSearch={showSearch}
        searchIsActive={searchTerm !== ''}
        onToggleSearch={handleToggleSearch}
        searchContent={
          <TextField
            inputRef={searchInputRef}
            fullWidth
            size="small"
            placeholder="Rechercher une formation par titre ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
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
        <div className="grid gap-4 md:grid-cols-2">
          <FormControl fullWidth size="small">
            <InputLabel id="niveau-label" sx={{ '&.Mui-focused': { color: GREEN[600] } }}>
              Niveau
            </InputLabel>
            <Select
              labelId="niveau-label"
              label="Niveau"
              value={niveauFilter}
              onChange={handleNiveauChange}
              sx={{
                borderRadius: '0.75rem',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: GREEN[600],
                },
              }}
            >
              {NIVEAUX.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="domaine-label" sx={{ '&.Mui-focused': { color: GREEN[600] } }}>
              Domaine
            </InputLabel>
            <Select
              labelId="domaine-label"
              label="Domaine"
              value={domaineFilter}
              onChange={handleDomaineChange}
              sx={{
                borderRadius: '0.75rem',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: GREEN[600],
                },
              }}
            >
              {DOMAINES.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </FilterToolbar>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Erreur */}
          {error && (
            <div className="text-center py-10 text-red-600">
              <p>Erreur : {error}</p>
            </div>
          )}

          {/* Skeletons de chargement */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-ink-100 shadow-card"
                >
                  <Skeleton variant="rectangular" height={200} />
                  <div className="p-5 space-y-3">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="90%" />
                    <Skeleton variant="text" width="90%" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contenu */}
          {!loading && !error && (
            <>
              {filteredFormations.length === 0 ? (
                <EmptyState
                  icon={<SchoolRoundedIcon sx={{ fontSize: 40, color: GREEN[400] }} />}
                  title="Aucune formation trouvée"
                  description="Essayez de modifier vos critères de recherche ou de réinitialiser les filtres."
                  onAction={handleResetFilters}
                />
              ) : (
                <div className="space-y-6">
                  {filteredFormations.map((formation) => (
                    <FormationCard key={formation.id} formation={formation} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CtaSection
        icon={<SchoolRoundedIcon sx={{ fontSize: 48, color: GREEN[400] }} />}
        title="Vous ne trouvez pas la formation idéale ?"
        description="Contactez-nous pour obtenir des conseils personnalisés sur votre orientation académique et professionnelle."
        primaryLabel="Demander des conseils"
        primaryLink="/contact"
        secondaryLabel="Postuler maintenant"
        secondaryLink="/admission"
      />
    </div>
  );
};

export default FormationsPage;
