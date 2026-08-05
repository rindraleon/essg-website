import React, { useState, useMemo, useEffect, useRef } from 'react';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
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
import PartenaireCard from '../../components/PartenaireComponents/PartenaireCard';

import { GREEN } from '../../constants/colors';
import { partenaireService } from '../../services';
import { useScrollToTop } from '../../hooks';
import type { PartenairesPageProps, PartenaireItem } from '../../types/partenaire.types';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const TYPES = [
  { value: 'all', label: 'Tous les types' },
  { value: 'Entreprise', label: 'Entreprise' },
  { value: 'Institution', label: 'Institution' },
  { value: 'Organisation', label: 'Organisation' },
  { value: 'Autre', label: 'Autre' },
];

const PartenairesPage: React.FC<PartenairesPageProps> = (props: Readonly<PartenairesPageProps>) => {
  useScrollToTop();

  const {
    pageTitle = 'Nos Partenaires',
    pageSubtitle = 'ESSG — Réseau & Coopération',
    pageDescription = 'Des collaborations prestigieuses au niveau national et international pour une excellence partagée.',
  } = props;

  const [allPartenaires, setAllPartenaires] = useState<PartenaireItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');
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
    const loadPartenaires = async () => {
      try {
        setLoading(true);
        const data = await partenaireService.findAllPaginated(1, 100);

        // Transformer les données du backend vers le format PartenaireItem
        const transformedPartenaires: PartenaireItem[] = data.map((partenaire: PartenaireItem) => ({
          id: partenaire.id,
          nom: partenaire.nom,
          type: partenaire.type,
          secteur: partenaire.secteur,
          description: partenaire.description,
          siteWeb: partenaire.siteWeb,
          logo: partenaire.logo,
          contact: partenaire.contact,
          dateDebut: partenaire.dateDebut,
          creeLe: partenaire.creeLe,
          misAJourLe: partenaire.misAJourLe,
        }));

        setAllPartenaires(transformedPartenaires);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des partenaires:', err);
        setError('Impossible de charger les partenaires');
      } finally {
        setLoading(false);
      }
    };

    loadPartenaires();
  }, []);

  const hasActiveFilters = typeFilter !== 'all' || searchTerm !== '';
  const activeFilterCount = typeFilter !== 'all' ? 1 : 0;

  const filteredPartenaires = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return allPartenaires.filter((partenaire) => {
      const matchesSearch =
        partenaire.nom.toLowerCase().includes(search) ||
        (partenaire.secteur || '').toLowerCase().includes(search) ||
        (partenaire.description || '').toLowerCase().includes(search);
      const matchesType = typeFilter === 'all' || partenaire.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [allPartenaires, typeFilter, searchTerm]);

  const resultCount = filteredPartenaires.length;
  const resultText = `${resultCount} partenaire${resultCount > 1 ? 's' : ''} trouvé${resultCount > 1 ? 's' : ''}`;

  const handleTypeChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) setSearchTerm('');
  };

  const handleResetFilters = () => {
    setTypeFilter('all');
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
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Partenaires ESSG"
        badgeIcon={<HandshakeRoundedIcon />}
        badgeLabel={pageSubtitle}
        title={pageTitle}
        description={pageDescription}
        stats={[
          { value: `${allPartenaires.length}+`, label: 'Partenaires' },
          { value: '30+', label: 'Pays' },
          { value: '100+', label: 'Projets communs' },
        ]}
      />

      <Breadcrumb items={[{ label: 'Partenaires' }]} />

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
            placeholder="Rechercher un partenaire par nom, secteur ou description..."
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
        <div className="max-w-xs">
          <FormControl fullWidth size="small">
            <InputLabel id="type-label" sx={{ '&.Mui-focused': { color: GREEN[600] } }}>
              Type de partenaire
            </InputLabel>
            <Select
              labelId="type-label"
              label="Type de partenaire"
              value={typeFilter}
              onChange={handleTypeChange}
              sx={{
                borderRadius: '0.75rem',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: GREEN[600],
                },
              }}
            >
              {TYPES.map((item) => (
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
                icon={<HandshakeRoundedIcon sx={{ fontSize: 40, color: GREEN[400] }} />}
                title="Aucun partenaire trouvé"
                description="Essayez de modifier vos critères de filtrage."
                onAction={handleResetFilters}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPartenaires.map((partenaire) => (
                  <PartenaireCard key={partenaire.id} partenaire={partenaire} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <CtaSection
        icon={<HandshakeRoundedIcon sx={{ fontSize: 48, color: GREEN[400] }} />}
        title="Devenir partenaire de l'ESSG"
        description="Rejoignez notre réseau de partenaires prestigieux et contribuez à former les talents de demain."
        primaryLabel="Contactez-nous"
        primaryLink="partenariats@essg.mg"
        primaryIsMailto
      />
    </div>
  );
};

export default PartenairesPage;
