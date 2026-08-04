import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@/components/ui/button';

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
        <Button onClick={onAction} className="rounded-lg">
          {actionIcon || <AddIcon className="h-4 w-4 mr-2" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
