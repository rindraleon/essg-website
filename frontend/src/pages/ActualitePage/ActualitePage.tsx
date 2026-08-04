import React, { useState, useMemo, useRef, useEffect } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import NewspaperRoundedIcon from '@mui/icons-material/NewspaperRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import type { SelectChangeEvent } from '@mui/material/Select';
import { CtaSection, EmptyState, PageHero, ActualiteCard, FilterToolbar } from '../../components';
import { GREEN } from '../../constants/colors';
import { useActualites, useScrollToTop } from '../../hooks';
import type { Actualite } from '../../types/actualite.types';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168d6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const CATEGORIES = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'Événement', label: 'Événement' },
  { value: 'Recherche', label: 'Recherche' },
  { value: 'Partenariat', label: 'Partenariat' },
  { value: 'Vie Étudiante', label: 'Vie Étudiante' },
];

const ActualitesPage: React.FC = () => {
  useScrollToTop();

  const [searchTerm, setSearchTerm] = useState('');
  const [categorieFilter, setCategorieFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Charger TOUTES les actualités (limit élevé)
  const { data, loading, error } = useActualites(1, 100);
  const actualites: Actualite[] = useMemo(() => data?.data ?? [], [data]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Filtrage côté client
  const filteredActualites = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return actualites.filter((actu) => {
      const matchesSearch =
        actu.titre.toLowerCase().includes(search) || actu.resume.toLowerCase().includes(search);
      const matchesCategorie = categorieFilter === 'all' || actu.categorie === categorieFilter;
      return matchesSearch && matchesCategorie;
    });
  }, [actualites, searchTerm, categorieFilter]);

  const resultCount = filteredActualites.length;
  const resultText = `${resultCount} actualité${resultCount > 1 ? 's' : ''}`;

  const handleCategorieChange = (event: SelectChangeEvent) => {
    setCategorieFilter(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategorieFilter('all');
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
    ...(categorieFilter !== 'all'
      ? [
          {
            key: 'categorie',
            label: `Catégorie: ${categorieFilter}`,
            onDelete: () => setCategorieFilter('all'),
          },
        ]
      : []),
  ];

  return (
    <div>
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Actualités ESSG"
        badgeIcon={<NewspaperRoundedIcon />}
        badgeLabel="ESSG — Vie de l'école"
        title="Actualités"
        description="Suivez la vie de l'ESSG : événements, recherche, partenariats et réussites de nos étudiants."
        stats={[
          { value: `${actualites.length}+`, label: 'Articles' },
          { value: '4', label: 'Catégories' },
          { value: 'Hebdo', label: 'Fréquence' },
        ]}
      />

      <FilterToolbar
        resultText={resultText}
        activeFilterChips={activeFilterChips}
        hasActiveFilters={searchTerm !== '' || categorieFilter !== 'all'}
        activeFilterCount={categorieFilter !== 'all' ? 1 : 0}
        showFilters={showFilters}
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
            placeholder="Rechercher une actualité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')} size="small">
                    <CloseRoundedIcon fontSize="small" />
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
        {/* Filtre catégorie */}
        <div className="flex gap-3 flex-wrap">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={categorieFilter}
              label="Catégorie"
              onChange={handleCategorieChange}
              sx={{ borderRadius: '0.75rem' }}
            >
              {CATEGORIES.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </FilterToolbar>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Erreur */}
          {error && (
            <div className="text-center py-10 text-red-500">
              <p>Erreur : {error}</p>
            </div>
          )}

          {/* Skeletons de chargement */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
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
              {filteredActualites.length === 0 ? (
                <EmptyState
                  icon={<NewspaperRoundedIcon />}
                  title="Aucune actualité trouvée"
                  description="Essayez de modifier vos critères de recherche ou de réinitialiser les filtres."
                  onAction={handleResetFilters}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActualites.map((actu) => (
                    <ActualiteCard key={actu.id} actualite={actu} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CtaSection
        icon={<NewspaperRoundedIcon />}
        title="Restez connecté avec l'ESSG"
        description="Abonnez-vous à notre newsletter pour ne rien manquer de l'actualité de l'école."
        primaryLabel="S'abonner"
        primaryLink="/contact"
        secondaryLabel="Voir les formations"
        secondaryLink="/formations"
      />
    </div>
  );
};

export default ActualitesPage;
