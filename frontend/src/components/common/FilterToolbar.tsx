import React from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { GREEN } from '../../constants/colors';
import type { FilterToolbarProps } from '../../types/common.types';

const INK_NEUTRAL = '#43575b';


const FilterToolbar: React.FC<FilterToolbarProps> = (props: Readonly<FilterToolbarProps>) => {
  const {
    resultText,
    showFilters,
    activeFilterCount = 0,
    hasActiveFilters = false,
    activeFilterChips = [],
    onToggleFilters,
    onResetFilters,
    children,
    searchEnabled = false,
    showSearch = false,
    searchIsActive = false,
    onToggleSearch,
    searchContent,
  } = props;

  // Le panneau n'est visible que si la recherche ou les filtres ont été ouverts par l'utilisateur
  const panelOpen = showSearch || showFilters;

  const iconButtonSx = (active: boolean) => ({
    border: '1px solid',
    borderColor: active ? GREEN[200] : 'divider',
    backgroundColor: active ? GREEN[50] : '#ffffff',
    color: active ? GREEN[700] : INK_NEUTRAL,
    boxShadow: '0 1px 2px rgba(15, 33, 30, 0.06)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: GREEN[50],
      color: GREEN[700],
      borderColor: GREEN[200],
      boxShadow: '0 4px 12px -4px rgba(46, 106, 95, 0.25)',
    },
  });

  return (
    <div className="w-full container mx-auto flex flex-col gap-2 rounded-xl px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ink-500">{resultText}</span>

          {hasActiveFilters && activeFilterChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilterChips.map((chipItem) => (
                <Chip
                  key={chipItem.key}
                  label={chipItem.label}
                  size="small"
                  onDelete={chipItem.onDelete}
                  sx={{
                    backgroundColor: GREEN[50],
                    color: GREEN[800],
                    border: `1px solid ${GREEN[100]}`,
                    '& .MuiChip-deleteIcon': {
                      color: GREEN[600],
                      '&:hover': { color: GREEN[800] },
                    },
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {searchEnabled && onToggleSearch && (
            <Tooltip title={showSearch ? 'Fermer la recherche' : 'Rechercher'}>
              <IconButton
                onClick={onToggleSearch}
                aria-label={showSearch ? 'Fermer la recherche' : 'Rechercher'}
                aria-expanded={showSearch}
                sx={iconButtonSx(showSearch)}
              >
                {showSearch ? (
                  <CloseRoundedIcon />
                ) : (
                  <Badge
                    variant="dot"
                    invisible={!searchIsActive}
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: GREEN[600],
                      },
                    }}
                  >
                    <SearchRoundedIcon />
                  </Badge>
                )}
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title={showFilters ? 'Fermer les filtres' : 'Filtrer'}>
            <IconButton
              onClick={onToggleFilters}
              aria-label={showFilters ? 'Fermer les filtres' : 'Filtrer'}
              aria-expanded={showFilters}
              sx={iconButtonSx(showFilters)}
            >
              {showFilters ? (
                <CloseRoundedIcon />
              ) : (
                <Badge
                  badgeContent={activeFilterCount}
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: GREEN[600],
                      color: '#fff',
                    },
                  }}
                >
                  <FilterListRoundedIcon />
                </Badge>
              )}
            </IconButton>
          </Tooltip>

          {hasActiveFilters && (
            <Button
              variant="text"
              size="small"
              onClick={onResetFilters}
              sx={{
                ml: 0.5,
                textTransform: 'none',
                color: GREEN[600],
                fontWeight: 600,
                borderRadius: '0.5rem',
                '&:hover': {
                  backgroundColor: GREEN[50],
                },
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Panneau de filtres — replié par défaut, ouvert uniquement au clic */}
      <Collapse in={panelOpen}>
        <div className="mt-3 rounded-2xl border border-ink-100 bg-white p-5 shadow-card animate-fade-in">
          {searchEnabled && (
            <Collapse in={showSearch}>
              <div className="mb-4">{searchContent}</div>
            </Collapse>
          )}

          <Collapse in={showFilters}>
            <div>{children}</div>
          </Collapse>
        </div>
      </Collapse>
    </div>
  );
};

export default FilterToolbar;
