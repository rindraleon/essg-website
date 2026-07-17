// src/components/common/PageHeader.tsx
import React from 'react';
import { Button } from '@mui/material';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={actionIcon || <Plus className="h-4 w-4" />}
          onClick={onAction}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.2,
          }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;