import React, { useState, useMemo, useEffect, useRef } from 'react';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { SelectChangeEvent } from '@mui/material/Select';
import CtaSection from '../../components/common/CtaSection';
import EmptyState from '../../components/common/EmptyState';
import FilterToolbar from '../../components/common/FilterToolbar';
import PageHero from '../../components/common/PageHero';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProjetCard from '../../components/ProjetComponents/ProjetCard';
import { GREEN } from '../../constants/colors';
import { projetService } from '../../services';
import { useScrollToTop } from '../../hooks';
import type { ProjetsPageProps, ProjetItem } from '../../types/projets.types';
import { generateSlug } from '../../utils/slug.utils';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const TYPES = [
  { value: 'all', label: 'Tous les types' },
  { value: 'International', label: 'International' },
  { value: 'Service Public', label: 'Service Public' },
  { value: 'Recherche', label: 'Recherche' },
  { value: 'Innovation', label: 'Innovation' },
];

const STATUTS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'En cours', label: 'En cours' },
  { value: 'Terminé', label: 'Terminé' },
];

const ProjetsPage: React.FC<ProjetsPageProps> = (props: Readonly<ProjetsPageProps>) => {
  useScrollToTop();

  const {
    pageTitle = 'Nos Projets',
    pageSubtitle = 'ESSG — Innovation & Recherche',
    pageDescription = "L'ESSG s'engage dans des projets innovants au service du développement durable et de la recherche.",
  } = props;

  const [allProjets, setAllProjets] = useState<ProjetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statutFilter, setStatutFilter] = useState('all');
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
    const loadProjets = async () => {
      try {
        setLoading(true);
        const data = await projetService.findAll();
        setAllProjets(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des projets:', err);
        setError('Impossible de charger les projets');
      } finally {
        setLoading(false);
      }
    };

    loadProjets();
  }, []);

  const hasActiveFilters = typeFilter !== 'all' || statutFilter !== 'all' || searchTerm !== '';
  const activeFilterCount = (typeFilter !== 'all' ? 1 : 0) + (statutFilter !== 'all' ? 1 : 0);

  const filteredProjets = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return allProjets.filter((projet) => {
      const matchesSearch =
        projet.titre.toLowerCase().includes(search) ||
        (projet.description || '').toLowerCase().includes(search);
      const matchesType = typeFilter === 'all' || projet.type === typeFilter;
      const matchesStatut = statutFilter === 'all' || projet.statut === statutFilter;
      return matchesSearch && matchesType && matchesStatut;
    });
  }, [allProjets, typeFilter, statutFilter, searchTerm]);

  const resultCount = filteredProjets.length;
  const resultText = `${resultCount} projet${resultCount > 1 ? 's' : ''}`;

  const handleTypeChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };

  const handleStatutChange = (event: SelectChangeEvent) => {
    setStatutFilter(event.target.value);
  };

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) setSearchTerm('');
  };

  const handleResetFilters = () => {
    setTypeFilter('all');
    setStatutFilter('all');
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
    ...(typeFilter !== 'all'
      ? [
          {
            key: 'type',
            label: `Type: ${typeFilter}`,
            onDelete: () => setTypeFilter('all'),
          },
        ]
      : []),
    ...(statutFilter !== 'all'
      ? [
          {
            key: 'statut',
            label: `Statut: ${statutFilter}`,
            onDelete: () => setStatutFilter('all'),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Projets ESSG"
        badgeIcon={<RocketLaunchRoundedIcon />}
        badgeLabel={pageSubtitle}
        title={pageTitle}
        description={pageDescription}
        stats={[
          { value: `${allProjets.length}+`, label: 'Projets' },
          { value: '10+', label: 'Pays' },
          { value: '50+', label: 'Partenaires' },
        ]}
      />

      <Breadcrumb items={[{ label: 'Projets' }]} />

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
            placeholder="Rechercher un projet par titre ou description..."
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
        <div className="grid gap-4 sm:grid-cols-2">
          <FormControl fullWidth size="small">
            <InputLabel id="type-label" sx={{ '&.Mui-focused': { color: GREEN[800] } }}>
              Type de projet
            </InputLabel>
            <Select
              labelId="type-label"
              label="Type de projet"
              value={typeFilter}
              onChange={handleTypeChange}
              sx={{
                borderRadius: '0.75rem',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: GREEN[600] },
              }}
            >
              {TYPES.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="statut-label" sx={{ '&.Mui-focused': { color: GREEN[600] } }}>
              Statut
            </InputLabel>
            <Select
              labelId="statut-label"
              label="Statut"
              value={statutFilter}
              onChange={handleStatutChange}
              sx={{
                borderRadius: '0.75rem',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: GREEN[600] },
              }}
            >
              {STATUTS.map((item) => (
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
            <div className="grid gap-8 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
                >
                  <Skeleton variant="rectangular" height={200} />
                  <div className="space-y-3 p-5">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                  </div>
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
                icon={<RocketLaunchRoundedIcon sx={{ fontSize: 40, color: GREEN[400] }} />}
                title="Aucun projet trouvé"
                description="Essayez de modifier vos critères de filtrage."
                onAction={handleResetFilters}
              />
            ) : (
              <div className="grid gap-8 md:grid-cols-3">
                {filteredProjets.map((projet) => (
                  <ProjetCard 
                    key={projet.id} 
                    projet={{
                      ...projet,
                      slug: projet.slug || generateSlug(projet.titre)
                    }} 
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <CtaSection
        icon={<SchoolRoundedIcon sx={{ fontSize: 48, color: GREEN[400] }} />}
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

export default ProjetsPage;
