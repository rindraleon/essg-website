import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestoreIcon from '@mui/icons-material/Restore';
import type { FormationFilterOptions } from '../../types/formation.types';

interface FormationFiltersProps {
  filters: FormationFilterOptions;
  onUpdateFilter: (key: keyof FormationFilterOptions, value: string) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  open: boolean;
  onToggle: () => void;
}

const niveaux = [
  { value: 'Licence', label: 'Licence' },
  { value: 'Master', label: 'Master' },
  { value: 'Doctorat', label: 'Doctorat' },
];

const domaines = [
  'Informatique',
  'Gestion',
  'Droit',
  'Médecine',
  'Ingénierie',
  'Sciences',
  'Lettres',
  'Économie',
];

const FormationFilters: React.FC<FormationFiltersProps> = ({
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormControl size="small" fullWidth>
              <InputLabel>Niveau</InputLabel>
              <Select
                value={filters.niveau}
                label="Niveau"
                onChange={(e) => onUpdateFilter('niveau', e.target.value)}
                sx={{ borderRadius: '8px', backgroundColor: 'white' }}
              >
                <MenuItem value="">
                  <em>Tous</em>
                </MenuItem>
                {niveaux.map((niv) => (
                  <MenuItem key={niv.value} value={niv.value}>
                    {niv.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Domaine</InputLabel>
              <Select
                value={filters.domaine}
                label="Domaine"
                onChange={(e) => onUpdateFilter('domaine', e.target.value)}
                sx={{ borderRadius: '8px', backgroundColor: 'white' }}
              >
                <MenuItem value="">
                  <em>Tous</em>
                </MenuItem>
                {domaines.map((dom) => (
                  <MenuItem key={dom} value={dom}>
                    {dom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>En vedette</InputLabel>
              <Select
                value={filters.enVedette}
                label="En vedette"
                onChange={(e) => onUpdateFilter('enVedette', e.target.value)}
                sx={{ borderRadius: '8px', backgroundColor: 'white' }}
              >
                <MenuItem value="">
                  <em>Toutes</em>
                </MenuItem>
                <MenuItem value="true">Oui</MenuItem>
                <MenuItem value="false">Non</MenuItem>
              </Select>
            </FormControl>
          </div>

          {activeFilterCount > 0 && (
            <div className="mt-3 flex justify-end">
              <Button
                size="small"
                color="error"
                onClick={onResetFilters}
                startIcon={<RestoreIcon fontSize="small" />}
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

export default FormationFilters;