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

export interface UserFilters {
  search: string;
  role: string;
  statut: string;
}

interface UsersFilterProps {
  filters: UserFilters;
  onUpdateFilter: (key: keyof UserFilters, value: string) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
  open: boolean;
  onToggle: () => void;
}

const UsersFilter: React.FC<UsersFilterProps> = ({
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TextField
              size="small"
              label="Recherche"
              placeholder="Nom, prénom, email..."
              value={filters.search}
              onChange={(e) => onUpdateFilter('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 1, color: 'text.secondary' }}>
                    🔍
                  </Box>
                ),
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                },
              }}
            />

            <FormControl size="small" fullWidth>
              <InputLabel>Rôle</InputLabel>
              <Select
                value={filters.role}
                label="Rôle"
                onChange={(e) => onUpdateFilter('role', e.target.value)}
                sx={{ borderRadius: '8px', backgroundColor: 'white' }}
              >
                <MenuItem value="">
                  <em>Tous</em>
                </MenuItem>
                <MenuItem value="admin">Administrateur</MenuItem>
                <MenuItem value="editeur">Éditeur</MenuItem>
                <MenuItem value="lecteur">Lecteur</MenuItem>
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
                <MenuItem value="actif">Actif</MenuItem>
                <MenuItem value="inactif">Inactif</MenuItem>
              </Select>
            </FormControl>
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

export default UsersFilter;