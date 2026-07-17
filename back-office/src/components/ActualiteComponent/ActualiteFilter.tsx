// src/components/actualites/ActualiteFilters.tsx
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Collapse,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestoreIcon from '@mui/icons-material/Restore';
import type { FilterOptions } from '../../types/actualite.types';
import { categories, statuts } from '../../data/mockData';

interface ActualiteFiltersProps {
  filters: FilterOptions;
  onUpdateFilter: (key: keyof FilterOptions, value: string) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  open: boolean;
  onToggle: () => void;
}

const ActualiteFilters: React.FC<ActualiteFiltersProps> = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  activeFilterCount,
  open,
  onToggle,
}) => {
  return (
    <div>
      <Collapse in={open}>
        <Box className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Filtres avancés</span>
            <IconButton size="small" onClick={onToggle}>
              <CloseIcon />
            </IconButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormControl size="small" fullWidth>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={filters.categorie}
                label="Catégorie"
                onChange={(e) => onUpdateFilter('categorie', e.target.value)}
                sx={{ borderRadius: '8px', backgroundColor: 'white' }}
              >
                <MenuItem value="">
                  <em>Toutes</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filters.statut}
                label="Statut"
                onChange={(e) => onUpdateFilter('statut', e.target.value)}
                sx={{ borderRadius: '8px', backgroundColor: 'white' }}
              >
                <MenuItem value="">
                  <em>Tous</em>
                </MenuItem>
                {statuts.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              type="date"
              label="Date début"
              value={filters.dateDebut}
              onChange={(e) => onUpdateFilter('dateDebut', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                },
              }}
            />

            <TextField
              size="small"
              type="date"
              label="Date fin"
              value={filters.dateFin}
              onChange={(e) => onUpdateFilter('dateFin', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                },
              }}
            />
          </div>

          {activeFilterCount > 0 && (
            <div className="mt-3 flex justify-end">
              <Button
                size="small"
                color="error"
                startIcon={<RestoreIcon fontSize="small" />}
                onClick={onResetFilters}
                sx={{ textTransform: 'none', fontSize: 12 }}
              >
                Réinitialiser tout
              </Button>
            </div>
          )}
        </Box>
      </Collapse>
    </div>
  );
};

export default ActualiteFilters;