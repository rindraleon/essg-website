// src/components/common/StatusBadge.tsx
import React from 'react';
import { Chip } from '@mui/material';

interface StatusConfig {
  label: string;
  color: 'success' | 'warning' | 'default' | 'error' | 'info' | 'primary' | 'secondary';
}

const statusMap: Record<string, StatusConfig> = {
  publie: { label: 'Publié', color: 'success' },
  brouillon: { label: 'Brouillon', color: 'warning' },
  archive: { label: 'Archivé', color: 'default' },
};

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const config = statusMap[status] || { label: status, color: 'default' as const };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      variant="filled"
      sx={{ fontWeight: 500 }}
    />
  );
};

export default StatusBadge;